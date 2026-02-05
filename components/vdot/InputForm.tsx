"use client"

import { useState, useEffect, useRef } from "react"
import { RACE_DISTANCES, calculateAdvancedAdjustment, getDistanceFromTimeAndPace } from "@/lib/vdot-calculator"
import { AdvancedAdjustment, AdvancedDisplayMode } from "@/types"

interface CalculatedPace {
  km: { minutes: number; seconds: number }
  mi: { minutes: number; seconds: number }
}

interface InputFormProps {
  onCalculate: (
    distance: number,
    time: number,
    advancedAdjustment?: AdvancedAdjustment | null,
    paceUnit?: "km" | "mi",
    advancedMode?: 'temperature' | 'altitude' | 'off'
  ) => void
  calculatedPace?: CalculatedPace | null
  currentPaceUnit?: "km" | "mi"
  onPaceUnitChange?: (unit: "km" | "mi") => void
  advancedMode?: 'temperature' | 'altitude' | 'off'
  onAdvancedModeChange?: (mode: 'temperature' | 'altitude' | 'off') => void
  advancedDisplayMode?: AdvancedDisplayMode
  onAdvancedDisplayModeChange?: (mode: AdvancedDisplayMode) => void
  onReset?: () => void
}

export default function InputForm({
  onCalculate,
  calculatedPace,
  currentPaceUnit = "km",
  onPaceUnitChange,
  advancedMode: controlledAdvancedMode,
  onAdvancedModeChange,
  advancedDisplayMode = 'effect',
  onAdvancedDisplayModeChange,
  onReset
}: InputFormProps) {
  // 距离输入
  const [selectedDistance, setSelectedDistance] = useState<string>("")
  const [customDistance, setCustomDistance] = useState("")
  const [customUnit, setCustomUnit] = useState<"km" | "mi" | "m">("km")

  // 时间输入
  const [hours, setHours] = useState("")
  const [minutes, setMinutes] = useState("")
  const [seconds, setSeconds] = useState("")

  // 配速输入
  const [paceMinutes, setPaceMinutes] = useState("")
  const [paceSeconds, setPaceSeconds] = useState("")
  const [paceUnit, setPaceUnit] = useState<"km" | "mi">("km")

  // 跟踪上一次的 calculatedPace，用于判断是否是自动回填
  const lastCalculatedPaceRef = useRef<typeof calculatedPace>(null)
  // 跟踪是否正在自动选择距离（避免触发清空输入的 useEffect）
  const isAutoSelectingDistanceRef = useRef(false)
  // 存储计算出的距离值（公里和英里）
  const calculatedDistanceKmRef = useRef<number | null>(null)
  const calculatedDistanceMiRef = useRef<number | null>(null)

  // 同步本地 paceUnit 与父组件传入的 currentPaceUnit
  useEffect(() => {
    if (calculatedPace) {
      // 只有在计算出配速后才同步，避免覆盖用户手动选择
      setPaceUnit(currentPaceUnit)
    }
  }, [currentPaceUnit, calculatedPace])

  // 当 calculatedPace 或 currentPaceUnit 变化时，回填到配速输入框
  useEffect(() => {
    if (calculatedPace) {
      const pace = currentPaceUnit === "km" ? calculatedPace.km : calculatedPace.mi
      setPaceMinutes(pace.minutes.toString())
      setPaceSeconds(pace.seconds.toString())
      setPaceUnit(currentPaceUnit)
      lastCalculatedPaceRef.current = calculatedPace
    } else {
      lastCalculatedPaceRef.current = null
    }
  }, [calculatedPace, currentPaceUnit])

  // 当配速单位切换时，转换配速数值
  useEffect(() => {
    const currentPaceMinutes = parseInt(paceMinutes) || 0
    const currentPaceSec = parseInt(paceSeconds) || 0
    const totalPaceSeconds = currentPaceMinutes * 60 + currentPaceSec

    // 只在有配速值且不是刚被 calculatedPace 设置的情况下才转换
    if (totalPaceSeconds > 0 && lastCalculatedPaceRef.current === null) {
      // 从当前单位转换到新单位
      const convertedPaceSeconds = paceUnit === "mi"
        ? totalPaceSeconds * 1.609344  // 公里→英里
        : totalPaceSeconds / 1.609344  // 英里→公里

      const newPaceMinutes = Math.floor(convertedPaceSeconds / 60)
      const newPaceSeconds = Math.round(convertedPaceSeconds % 60)

      setPaceMinutes(newPaceMinutes.toString())
      setPaceSeconds(newPaceSeconds.toString())
    }
  }, [paceUnit])

  // 当配速单位切换时，如果距离是从时间+配速计算出来的，同步距离单位并转换显示值
  useEffect(() => {
    // 只在自定义距离模式且有存储的计算距离时才转换
    if (selectedDistance === "custom" && calculatedDistanceKmRef.current !== null) {
      // 只有当距离单位不是米时才同步配速单位（米是独立的单位）
      if (customUnit !== "m") {
        setCustomUnit(paceUnit)
      }
    }
  }, [paceUnit])

  // 当自定义距离单位切换时，如果距离是从时间+配速计算出来的，自动转换显示值
  useEffect(() => {
    // 只在自定义距离模式且有存储的计算距离时才转换
    if (selectedDistance === "custom" && calculatedDistanceKmRef.current !== null) {
      const distanceKm = calculatedDistanceKmRef.current! / 1000
      const distanceMi = calculatedDistanceMiRef.current! / 1609.344
      let newDistance: string
      if (customUnit === "m") {
        newDistance = (calculatedDistanceKmRef.current!).toFixed(0)
      } else if (customUnit === "mi") {
        newDistance = distanceMi.toFixed(2)
      } else {
        newDistance = distanceKm.toFixed(2)
      }
      setCustomDistance(newDistance)
    }
  }, [customUnit])

  // 当切换比赛距离时，保留输入，只清除错误提示和重置自动选择标志
  useEffect(() => {
    // 重置自动选择标志（用于时间+配速→距离模式）
    if (isAutoSelectingDistanceRef.current) {
      isAutoSelectingDistanceRef.current = false
    }
    // 清除错误提示
    setErrorMessage("")
  }, [selectedDistance])

  // 高级选项
  const [showAdvanced, setShowAdvanced] = useState(false)
  // 使用父组件控制的 advancedMode，如果没有提供则使用默认值 'off'
  const currentAdvancedMode = controlledAdvancedMode ?? 'off'
  const handleAdvancedModeChange = (mode: 'temperature' | 'altitude' | 'off') => {
    if (onAdvancedModeChange) {
      onAdvancedModeChange(mode)
    }
  }
  const [temperature, setTemperature] = useState("")
  const [temperatureUnit, setTemperatureUnit] = useState<0 | 1>(0)  // 0: °F, 1: °C
  const [altitude, setAltitude] = useState("")
  const [altitudeUnit, setAltitudeUnit] = useState<0 | 1>(0)  // 0: ft, 1: m

  // 错误提示
  const [errorMessage, setErrorMessage] = useState("")

  // 智能输入处理：当用户手动修改配速时，清除自动回填标记
  const handlePaceMinutesChange = (value: string) => {
    setPaceMinutes(value)
    // 清除自动回填标记，表示用户正在手动输入配速
    if (lastCalculatedPaceRef.current !== null) {
      lastCalculatedPaceRef.current = null
    }
  }

  const handlePaceSecondsChange = (value: string) => {
    setPaceSeconds(value)
    // 清除自动回填标记
    if (lastCalculatedPaceRef.current !== null) {
      lastCalculatedPaceRef.current = null
    }
  }

  // 智能输入处理：当用户手动修改时间时，如果配速是自动回填的，则清除配速
  const handleTimeChange = (field: "hours" | "minutes" | "seconds", value: string) => {
    if (field === "hours") setHours(value)
    if (field === "minutes") setMinutes(value)
    if (field === "seconds") setSeconds(value)

    // 如果配速是自动回填的，清除配速输入
    if (lastCalculatedPaceRef.current !== null) {
      setPaceMinutes("")
      setPaceSeconds("")
      lastCalculatedPaceRef.current = null
    }
  }

  // 智能输入处理：当用户手动修改自定义距离时，清除存储的计算距离
  const handleCustomDistanceChange = (value: string) => {
    setCustomDistance(value)
    // 清除存储的计算距离，表示用户正在手动输入
    calculatedDistanceKmRef.current = null
    calculatedDistanceMiRef.current = null
  }

  const handleCalculate = () => {
    // 清除之前的错误
    setErrorMessage("")

    // 1. 获取距离（米）
    let distanceMeters: number | undefined
    if (selectedDistance === "custom") {
      // 自定义距离
      const distValue = parseFloat(customDistance)
      if (!isNaN(distValue) && distValue > 0) {
        distanceMeters = customUnit === "km" ? distValue * 1000 : customUnit === "mi" ? distValue * 1609.344 : distValue
      }
    } else if (selectedDistance !== "") {
      // 预设距离
      distanceMeters = Number(selectedDistance)
    }

    // 2. 获取时间（秒）
    const h = parseInt(hours) || 0
    const m = parseInt(minutes) || 0
    const s = parseInt(seconds) || 0
    const timeSeconds = h * 3600 + m * 60 + s

    // 3. 获取配速（秒/公里）
    const pMin = parseInt(paceMinutes) || 0
    const pSec = parseInt(paceSeconds) || 0
    const totalPaceSeconds = pMin * 60 + pSec
    // 转换为秒/公里
    const pacePerKm = paceUnit === "mi" ? totalPaceSeconds / 0.621371 : totalPaceSeconds

    // 4. 确定计算模式：需要 3 个参数中的 2 个
    const hasDistance = distanceMeters !== undefined && distanceMeters > 0
    const hasTime = timeSeconds > 0
    const hasPace = totalPaceSeconds > 0
    // 只有在用户手动输入配速（不是系统回填）时才用配速计算时间
    const userEnteredPace = lastCalculatedPaceRef.current === null && hasPace

    let calculatedDistance = distanceMeters
    let calculatedTime = timeSeconds
    let shouldAutoSelectDistance = false

    // 模式 1: 时间 + 配速 → 距离（自动选择或设置为自定义距离）
    if (!hasDistance && hasTime && hasPace && userEnteredPace) {
      // 同时计算公里和英里距离
      const distanceKm = getDistanceFromTimeAndPace(timeSeconds, pacePerKm, "km")
      const distanceMi = getDistanceFromTimeAndPace(timeSeconds, pacePerKm, "mi")
      calculatedDistance = distanceKm
      calculatedDistanceKmRef.current = distanceKm
      calculatedDistanceMiRef.current = distanceMi
      shouldAutoSelectDistance = true
    } else {
      // 清除之前存储的计算距离
      calculatedDistanceKmRef.current = null
      calculatedDistanceMiRef.current = null
    }

    // 验证输入：必须有距离和时间
    if (!calculatedDistance) {
      setErrorMessage("请选择比赛距离或输入时间和配速")
      return
    }
    if (!hasTime && !hasPace) {
      setErrorMessage("请输入完赛时间或配速")
      return
    }
    if (hasTime && hasPace && hasDistance && userEnteredPace) {
      // 用户同时输入了距离、时间和配速，优先使用距离和配速计算时间
      calculatedTime = (distanceMeters! / 1000) * pacePerKm
    } else if (!hasTime && hasPace && hasDistance) {
      // 模式 2: 距离 + 配速 → 时间
      calculatedTime = (distanceMeters! / 1000) * pacePerKm
    }

    // 如果计算出了距离，自动选择完全匹配的比赛距离
    if (shouldAutoSelectDistance && calculatedDistance) {
      // 查找完全匹配的比赛距离（误差在 1 米以内才匹配）
      const closestDistance = RACE_DISTANCES.find(race => {
        return Math.abs(race.value - calculatedDistance!) < 1
      })

      // 设置自动选择标志，避免触发清空输入的 useEffect
      isAutoSelectingDistanceRef.current = true

      if (closestDistance) {
        setSelectedDistance(closestDistance.value.toString())
        // 匹配到预设距离时，清除存储的计算距离
        calculatedDistanceKmRef.current = null
        calculatedDistanceMiRef.current = null
      } else {
        // 设置为自定义距离，根据当前配速单位显示对应值
        const distanceKm = calculatedDistanceKmRef.current! / 1000
        const distanceMi = calculatedDistanceMiRef.current! / 1609.344
        // 使用配速单位来确定显示哪个距离值
        const displayDistance = paceUnit === "mi" ? distanceMi.toFixed(2) : distanceKm.toFixed(2)
        const displayUnit = paceUnit === "mi" ? "mi" : "km"
        setCustomDistance(displayDistance)
        setCustomUnit(displayUnit)
        setSelectedDistance("custom")
      }
    }

    // 如果计算出了时间（且与用户输入不同），回填到时间输入框
    // 只在距离+配速→时间模式，或者用户同时输入了三个值时回填
    const needsTimeFillBack = (hasDistance && hasPace && !hasTime) ||
                              (hasDistance && hasPace && hasTime && userEnteredPace)

    if (needsTimeFillBack && calculatedTime && calculatedTime !== timeSeconds) {
      const h = Math.floor(calculatedTime / 3600)
      const m = Math.floor((calculatedTime % 3600) / 60)
      const s = Math.round(calculatedTime % 60)
      setHours(h > 0 ? h.toString() : "")
      setMinutes(m.toString())
      setSeconds(s.toString())
    }

    // 5. 处理高级调整
    let advancedAdjustment: AdvancedAdjustment | null = null
    if (currentAdvancedMode !== 'off' && calculatedDistance && calculatedTime) {
      const tempValue = currentAdvancedMode === 'temperature' ? parseFloat(temperature) : undefined
      const altValue = currentAdvancedMode === 'altitude' ? parseFloat(altitude) : undefined

      if ((tempValue !== undefined && !isNaN(tempValue)) || (altValue !== undefined && !isNaN(altValue))) {
        advancedAdjustment = calculateAdvancedAdjustment(
          calculatedDistance,
          calculatedTime,
          tempValue,
          temperatureUnit,
          altValue,
          altitudeUnit,
          advancedDisplayMode  // 传递显示模式
        )
      }
    }

    // 始终传递当前选择的配速单位给父组件（用于回填显示）
    // 如果用户输入了配速值，用该配速计算时间；否则仅用距离和时间计算 VDOT
    onCalculate(calculatedDistance!, calculatedTime, advancedAdjustment, paceUnit, currentAdvancedMode)
  }

  const handleReset = () => {
    setSelectedDistance("")
    setCustomDistance("")
    setHours("")
    setMinutes("")
    setSeconds("")
    setPaceMinutes("")
    setPaceSeconds("")
    setTemperature("")
    setAltitude("")
    handleAdvancedModeChange('off')
    setShowAdvanced(false)
    setErrorMessage("")
    // 清除存储的计算距离
    calculatedDistanceKmRef.current = null
    calculatedDistanceMiRef.current = null

    // 通知父组件清空计算结果
    onReset?.()
  }

  const isCustomDistance = selectedDistance === "custom"

  return (
    <div className="space-y-3">
      {/* 标题 */}
      <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
        <div className="w-1 h-5 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
        VDOT 计算
      </h3>

      {/* 表单内容 */}
      <div className="card relative overflow-hidden" style={{ borderLeft: '3px solid var(--color-secondary)' }}>
        <div className="p-4 space-y-4">
        {/* 错误提示 */}
        {errorMessage && (
          <div className="p-3 rounded-lg text-sm text-center animate-in fade-in slide-in-from-top-2" style={{
            backgroundColor: 'rgba(255, 107, 0, 0.15)',
            color: '#FF6B00',
            border: '1px solid rgba(255, 107, 0, 0.3)'
          }}>
            {errorMessage}
          </div>
        )}

        {/* 距离选择 */}
        <div className="grid grid-cols-[80px_1fr] items-center gap-4">
          <label className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            比赛距离
          </label>
          <select
            value={selectedDistance}
            onChange={(e) => setSelectedDistance(e.target.value)}
            className="select-skeuo w-full"
          >
            <option value="">请选择距离</option>
            {RACE_DISTANCES.map((race) => (
              <option key={race.value} value={race.value.toString()} style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>
                {race.label}
              </option>
            ))}
            <option value="custom" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>自定义距离</option>
          </select>
        </div>

        {/* 自定义距离 */}
        {isCustomDistance && (
          <div className="grid grid-cols-[80px_1fr] items-center gap-4 animate-in fade-in slide-in-from-top-2">
            <label className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              自定义距离
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={customDistance}
                onChange={(e) => handleCustomDistanceChange(e.target.value)}
                placeholder="输入距离"
                className="input-skeuo-center flex-1 font-mono text-base"
              />
              <select
                value={customUnit}
                onChange={(e) => setCustomUnit(e.target.value as "km" | "mi" | "m")}
                className="select-skeuo min-w-[80px] h-[50px]"
              >
                <option value="km" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>公里</option>
                <option value="mi" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>英里</option>
                <option value="m" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>米</option>
              </select>
            </div>
          </div>
        )}

        {/* 时间输入 */}
        <div className="grid grid-cols-[80px_1fr] items-center gap-4">
          <label className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            完赛时间
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="number"
                value={hours}
                onChange={(e) => handleTimeChange("hours", e.target.value)}
                placeholder="00"
                min="0"
                className="input-skeuo-center w-full font-mono text-base"
              />
              <span className="text-xs text-center block mt-1.5" style={{ color: 'var(--color-text-tertiary)' }}>小时</span>
            </div>
            <div className="flex-1">
              <input
                type="number"
                value={minutes}
                onChange={(e) => handleTimeChange("minutes", e.target.value)}
                placeholder="00"
                min="0"
                max="59"
                className="input-skeuo-center w-full font-mono text-base"
              />
              <span className="text-xs text-center block mt-1.5" style={{ color: 'var(--color-text-tertiary)' }}>分钟</span>
            </div>
            <div className="flex-1">
              <input
                type="number"
                value={seconds}
                onChange={(e) => handleTimeChange("seconds", e.target.value)}
                placeholder="00"
                min="0"
                max="59"
                className="input-skeuo-center w-full font-mono text-base"
              />
              <span className="text-xs text-center block mt-1.5" style={{ color: 'var(--color-text-tertiary)' }}>秒</span>
            </div>
          </div>
        </div>

        {/* 配速输入（可选） */}
        <div className="grid grid-cols-[80px_1fr] items-center gap-4">
          <label className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            配速 <span className="text-xs font-normal" style={{ color: 'var(--color-text-tertiary)' }}>（可选）</span>
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="number"
                value={paceMinutes}
                onChange={(e) => handlePaceMinutesChange(e.target.value)}
                placeholder="00"
                min="0"
                className="input-skeuo-center w-full font-mono text-base"
              />
              <span className="text-xs text-center block mt-1.5" style={{ color: 'var(--color-text-tertiary)' }}>分</span>
            </div>
            <div className="flex-1">
              <input
                type="number"
                value={paceSeconds}
                onChange={(e) => handlePaceSecondsChange(e.target.value)}
                placeholder="00"
                min="0"
                max="59"
                className="input-skeuo-center w-full font-mono text-base"
              />
              <span className="text-xs text-center block mt-1.5" style={{ color: 'var(--color-text-tertiary)' }}>秒</span>
            </div>
            <select
              value={paceUnit}
              onChange={(e) => {
                const newUnit = e.target.value as "km" | "mi"
                setPaceUnit(newUnit)
                onPaceUnitChange?.(newUnit)
              }}
              className="select-skeuo min-w-[80px] h-[50px]"
            >
              <option value="km" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>每公里</option>
              <option value="mi" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>每英里</option>
            </select>
          </div>
        </div>

        {/* 高级选项分隔按钮 */}
        <div className="pt-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs font-medium flex items-center justify-start gap-1 transition-colors"
            style={{ color: 'var(--color-text-secondary)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
          >
            <span>{showAdvanced ? '▼' : '▶'}</span>
            <span>高级选项</span>
          </button>
        </div>

        {/* 高级选项折叠区域 */}
        {showAdvanced && (
          <div className="animate-in fade-in slide-in-from-top-2 pt-4 border-t" style={{ borderColor: 'var(--color-border-light)' }}>
            {/* 模式选择单选按钮 */}
            <div className="flex flex-wrap gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="advanced-mode"
                  value="temperature"
                  checked={currentAdvancedMode === 'temperature'}
                  onChange={() => handleAdvancedModeChange('temperature')}
                  className="w-4 h-4 accent-current"
                  style={{ accentColor: 'var(--color-primary)' }}
                />
                <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>温度调整</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="advanced-mode"
                  value="altitude"
                  checked={currentAdvancedMode === 'altitude'}
                  onChange={() => handleAdvancedModeChange('altitude')}
                  className="w-4 h-4"
                  style={{ accentColor: 'var(--color-primary)' }}
                />
                <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>海拔调整</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="advanced-mode"
                  value="off"
                  checked={currentAdvancedMode === 'off'}
                  onChange={() => handleAdvancedModeChange('off')}
                  className="w-4 h-4"
                  style={{ accentColor: 'var(--color-primary)' }}
                />
                <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>关闭</span>
              </label>
            </div>

            {/* 温度输入 */}
            {currentAdvancedMode === 'temperature' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="grid grid-cols-[80px_1fr] items-center gap-4">
                  <label className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    温度
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                      placeholder="输入温度"
                      className="input-skeuo-center flex-1 font-mono text-base"
                    />
                    <select
                      value={temperatureUnit}
                      onChange={(e) => setTemperatureUnit(Number(e.target.value) as 0 | 1)}
                      className="select-skeuo w-[80px] h-[50px]"
                    >
                      <option value={0} style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>°F</option>
                      <option value={1} style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>°C</option>
                    </select>
                  </div>
                </div>

                {/* 显示模式选择 */}
                {onAdvancedDisplayModeChange && (
                  <div className="p-3 rounded-lg" style={{
                    backgroundColor: 'rgba(0, 212, 255, 0.05)',
                    border: '1px solid rgba(0, 212, 255, 0.2)'
                  }}>
                    <div className="text-xs mb-2" style={{ color: 'var(--color-text-secondary)' }}>计算模式</div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onAdvancedDisplayModeChange('effect')}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          advancedDisplayMode === 'effect' ? 'shadow-lg' : ''
                        }`}
                        style={{
                          backgroundColor: advancedDisplayMode === 'effect'
                            ? 'rgba(0, 212, 255, 0.2)'
                            : 'transparent',
                          border: '1px solid ' + (advancedDisplayMode === 'effect'
                            ? 'rgba(0, 212, 255, 0.5)'
                            : 'var(--color-border)'),
                          color: advancedDisplayMode === 'effect'
                            ? '#00D4FF'
                            : 'var(--color-text-secondary)'
                        }}
                      >
                        <span className="block">影响模式</span>
                        <span className="text-xs opacity-70">正常 → 恶劣</span>
                      </button>
                      <button
                        onClick={() => onAdvancedDisplayModeChange('conversion')}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          advancedDisplayMode === 'conversion' ? 'shadow-lg' : ''
                        }`}
                        style={{
                          backgroundColor: advancedDisplayMode === 'conversion'
                            ? 'rgba(0, 255, 212, 0.2)'
                            : 'transparent',
                          border: '1px solid ' + (advancedDisplayMode === 'conversion'
                            ? 'rgba(0, 255, 212, 0.5)'
                            : 'var(--color-border)'),
                          color: advancedDisplayMode === 'conversion'
                            ? '#00FFD4'
                            : 'var(--color-text-secondary)'
                        }}
                      >
                        <span className="block">转换模式</span>
                        <span className="text-xs opacity-70">恶劣 → 正常</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 海拔输入 */}
            {currentAdvancedMode === 'altitude' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="grid grid-cols-[80px_1fr] items-center gap-4">
                  <label className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    海拔
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={altitude}
                      onChange={(e) => setAltitude(e.target.value)}
                      placeholder="输入海拔"
                      className="input-skeuo-center flex-1 font-mono text-base"
                    />
                    <select
                      value={altitudeUnit}
                      onChange={(e) => setAltitudeUnit(Number(e.target.value) as 0 | 1)}
                      className="select-skeuo w-[80px] h-[50px]"
                    >
                      <option value={0} style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>ft</option>
                      <option value={1} style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>m</option>
                    </select>
                  </div>
                </div>

                {/* 显示模式选择 */}
                {onAdvancedDisplayModeChange && (
                  <div className="p-3 rounded-lg" style={{
                    backgroundColor: 'rgba(0, 212, 255, 0.05)',
                    border: '1px solid rgba(0, 212, 255, 0.2)'
                  }}>
                    <div className="text-xs mb-2" style={{ color: 'var(--color-text-secondary)' }}>计算模式</div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onAdvancedDisplayModeChange('effect')}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          advancedDisplayMode === 'effect' ? 'shadow-lg' : ''
                        }`}
                        style={{
                          backgroundColor: advancedDisplayMode === 'effect'
                            ? 'rgba(0, 212, 255, 0.2)'
                            : 'transparent',
                          border: '1px solid ' + (advancedDisplayMode === 'effect'
                            ? 'rgba(0, 212, 255, 0.5)'
                            : 'var(--color-border)'),
                          color: advancedDisplayMode === 'effect'
                            ? '#00D4FF'
                            : 'var(--color-text-secondary)'
                        }}
                      >
                        <span className="block">影响模式</span>
                        <span className="text-xs opacity-70">正常 → 恶劣</span>
                      </button>
                      <button
                        onClick={() => onAdvancedDisplayModeChange('conversion')}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          advancedDisplayMode === 'conversion' ? 'shadow-lg' : ''
                        }`}
                        style={{
                          backgroundColor: advancedDisplayMode === 'conversion'
                            ? 'rgba(0, 255, 212, 0.2)'
                            : 'transparent',
                          border: '1px solid ' + (advancedDisplayMode === 'conversion'
                            ? 'rgba(0, 255, 212, 0.5)'
                            : 'var(--color-border)'),
                          color: advancedDisplayMode === 'conversion'
                            ? '#00FFD4'
                            : 'var(--color-text-secondary)'
                        }}
                      >
                        <span className="block">转换模式</span>
                        <span className="text-xs opacity-70">恶劣 → 正常</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 按钮 */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleCalculate}
            className="flex-1 btn-primary relative overflow-hidden"
          >
            <span className="relative z-10">计算 VDOT</span>
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 rounded-xl transition-all duration-200 shadow-button hover:scale-[1.02] active:scale-[0.98] font-medium"
            style={{ color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
          >
            重置
          </button>
        </div>
      </div>
    </div>
  </div>
)
}
