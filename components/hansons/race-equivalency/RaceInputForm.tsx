"use client"

import { useState } from "react"
import type { HansonsRaceResult } from "@/types"

// 预设距离选项
const RACE_DISTANCE_OPTIONS = [
  { label: "马拉松", value: "42194.99" },
  { label: "半程马拉松", value: "21097.49" },
  { label: "10英里", value: "16090.34" },
  { label: "20公里", value: "20000" },
  { label: "15公里", value: "15000" },
  { label: "12公里", value: "12000" },
  { label: "10公里", value: "10000" },
  { label: "8公里", value: "8000" },
  { label: "5公里", value: "5000" },
  { label: "3公里", value: "3000" },
  { label: "1英里", value: "1609.34" },
]

export default function RaceInputForm({
  onCalculate
}: {
  onCalculate: (result: HansonsRaceResult) => void
}) {
  const [selectedDistance, setSelectedDistance] = useState<string>("")
  const [customDistance, setCustomDistance] = useState<string>("")
  const [distanceUnit, setDistanceUnit] = useState<'meters' | 'kilometers' | 'miles'>('kilometers')
  const [hours, setHours] = useState<string>("")
  const [minutes, setMinutes] = useState<string>("")
  const [seconds, setSeconds] = useState<string>("")

  // 天气调整状态（可选）
  const [showWeather, setShowWeather] = useState(false)
  const [temperature, setTemperature] = useState<string>("")
  const [humidity, setHumidity] = useState<string>("")
  const [windSpeed, setWindSpeed] = useState<string>("")
  const [weatherUnit, setWeatherUnit] = useState<'imperial' | 'metric'>('imperial')

  // 加载和错误状态
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("")

  const handleCalculate = async () => {
    setIsLoading(true)
    setErrorMessage("")

    const requestBody: any = {
      C3: hours.padStart(2, '0'),
      D3: minutes.padStart(2, '0'),
      E3: seconds.padStart(2, '0'),
      G11: weatherUnit,
    }

    // 处理距离
    if (selectedDistance && selectedDistance !== 'custom') {
      requestBody.race_type = selectedDistance
    } else if (customDistance && distanceUnit) {
      const unitMultipliers: Record<typeof distanceUnit, string> = {
        meters: '1',
        kilometers: '1000',
        miles: '1609.34',
      }
      requestBody.F3 = customDistance
      requestBody.race_units = unitMultipliers[distanceUnit]
    } else {
      setIsLoading(false)
      return
    }

    // 处理天气参数
    if (showWeather) {
      if (temperature) requestBody.G8 = temperature
      if (humidity) requestBody.G9 = humidity
      if (windSpeed) requestBody.G10 = windSpeed
    }

    try {
      const response = await fetch('/api/hansons/race-equivalency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrorMessage(data.message || '服务暂不可用，请稍后重试')
        return
      }

      onCalculate(data)
    } catch (error) {
      setErrorMessage('网络请求失败，请检查连接后重试')
      console.error('计算错误:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isCustomDistance = selectedDistance === 'custom'

  return (
    <div className="card">
      <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
        <div className="w-1 h-5 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
        输入比赛成绩
      </h3>

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
            className="select-skeuo w-full"
            value={selectedDistance}
            onChange={(e) => {
              const value = e.target.value
              setSelectedDistance(value)
              if (value !== 'custom') {
                setCustomDistance("")
              }
            }}
          >
            <option value="">请选择距离</option>
            {RACE_DISTANCE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value} style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>
                {opt.label}
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
                onChange={(e) => setCustomDistance(e.target.value)}
                placeholder="输入距离数值"
                className="input-skeuo-center flex-1 font-mono text-base"
              />
              <select
                className="select-skeuo min-w-[80px]"
                value={distanceUnit}
                onChange={(e) => setDistanceUnit(e.target.value as any)}
              >
                <option value="meters" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>米</option>
                <option value="kilometers" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>公里</option>
                <option value="miles" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>英里</option>
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
                className="input-skeuo-center w-full font-mono text-base"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="00"
                min="0"
                max="23"
              />
              <span className="text-xs text-center block mt-1.5" style={{ color: 'var(--color-text-tertiary)' }}>小时</span>
            </div>
            <div className="flex-1">
              <input
                type="number"
                className="input-skeuo-center w-full font-mono text-base"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                placeholder="00"
                min="0"
                max="59"
              />
              <span className="text-xs text-center block mt-1.5" style={{ color: 'var(--color-text-tertiary)' }}>分钟</span>
            </div>
            <div className="flex-1">
              <input
                type="number"
                className="input-skeuo-center w-full font-mono text-base"
                value={seconds}
                onChange={(e) => setSeconds(e.target.value)}
                placeholder="00"
                min="0"
                max="59"
              />
              <span className="text-xs text-center block mt-1.5" style={{ color: 'var(--color-text-tertiary)' }}>秒</span>
            </div>
          </div>
        </div>

        {/* 天气调整（可选） */}
        <div>
          <button
            className="text-xs text-text-secondary hover:text-brand-primary transition-colors mb-3 flex items-center gap-2"
            onClick={() => setShowWeather(!showWeather)}
          >
            <span className="transform transition-transform duration-200">
              {showWeather ? '▼' : '▶'}
            </span>
            环境调整（可选）
          </button>

          {showWeather && (
            <div className="animate-in fade-in slide-in-from-top-2 p-4 bg-theme-secondary rounded-lg border border-border space-y-4">
              <p className="text-xs text-text-tertiary">
                填写环境因素以调整训练配速（基于汉森训练体系）。留空则忽略。
              </p>

              <div className="grid grid-cols-[80px_1fr_50px] gap-3 items-center">
                <label className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>温度</label>
                <input
                  type="number"
                  className="input-skeuo w-full"
                  placeholder="0"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                />
                <span className="text-sm text-text-secondary">
                  {weatherUnit === 'imperial' ? '°F' : '°C'}
                </span>
              </div>

              <div className="grid grid-cols-[80px_1fr_50px] gap-3 items-center">
                <label className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>湿度</label>
                <input
                  type="number"
                  className="input-skeuo w-full"
                  placeholder="0"
                  value={humidity}
                  onChange={(e) => setHumidity(e.target.value)}
                  min="0"
                  max="100"
                />
                <span className="text-sm text-text-secondary">%</span>
              </div>

              <div className="grid grid-cols-[80px_1fr_50px] gap-3 items-center">
                <label className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>风速</label>
                <input
                  type="number"
                  className="input-skeuo w-full"
                  placeholder="0"
                  value={windSpeed}
                  onChange={(e) => setWindSpeed(e.target.value)}
                  min="0"
                />
                <span className="text-sm text-text-secondary">
                  {weatherUnit === 'imperial' ? 'mph' : 'km/h'}
                </span>
              </div>

              <div>
                <label className="text-sm font-medium text-text-secondary">单位</label>
                <select
                  className="select-skeuo w-full mt-1"
                  value={weatherUnit}
                  onChange={(e) => setWeatherUnit(e.target.value as any)}
                >
                  <option value="imperial" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>英制 (°F, mph)</option>
                  <option value="metric" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)' }}>公制 (°C, km/h)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* 计算按钮 */}
        <button
          className="btn-primary w-full"
          onClick={handleCalculate}
          disabled={isLoading}
        >
          {isLoading ? '计算中...' : '计算配速'}
        </button>
      </div>
    </div>
  )
}
