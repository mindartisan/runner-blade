"use client"

import { useState } from "react"
import type { HansonsRaceResult } from "@/types"

interface ReverseInputFormProps {
  onCalculate: (result: HansonsRaceResult) => void
}

/**
 * 反向计算器预设距离选项
 * 使用与正向计算器相同的距离值格式（米数）
 */
const REVERSE_RACE_OPTIONS = [
  { label: "马拉松", value: "42194.99" },
  { label: "半程马拉松", value: "21097.49" },
  { label: "10 英里", value: "16090.34" },
  { label: "30 公里", value: "30000" },
  { label: "25 公里", value: "25000" },
  { label: "20 公里", value: "20000" },
  { label: "15 公里", value: "15000" },
  { label: "12 公里", value: "12000" },
  { label: "10 公里", value: "10000" },
  { label: "8 公里", value: "8000" },
  { label: "5 公里", value: "5000" },
  { label: "3 公里", value: "3000" },
  { label: "1 英里", value: "1609.34" },
]

/**
 * 反向计算器输入表单组件
 * 参考比赛等效计算器的简洁风格
 */
export default function ReverseInputForm({ onCalculate }: ReverseInputFormProps) {
  // 距离输入状态
  const [selectedDistance, setSelectedDistance] = useState<string>("")
  const [customDistance, setCustomDistance] = useState<string>("")
  const [distanceUnit, setDistanceUnit] = useState<"meters" | "kilometers" | "miles">("kilometers")

  // 时间输入状态
  const [hours, setHours] = useState<string>("")
  const [minutes, setMinutes] = useState<string>("")
  const [seconds, setSeconds] = useState<string>("")

  // 环境调整状态
  const [showWeather, setShowWeather] = useState(false)
  const [temperature, setTemperature] = useState<string>("")
  const [humidity, setHumidity] = useState<string>("")
  const [windSpeed, setWindSpeed] = useState<string>("")
  const [weatherUnit, setWeatherUnit] = useState<"imperial" | "metric">("imperial")

  // 加载和错误状态
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("")

  /**
   * 判断是否选择了自定义距离
   */
  const isCustomDistance = selectedDistance === "custom"

  /**
   * 处理计算按钮点击
   */
  const handleCalculate = async () => {
    // 验证必填字段
    if (!selectedDistance) {
      setErrorMessage("请选择比赛距离")
      return
    }

    if (isCustomDistance && !customDistance) {
      setErrorMessage("请输入自定义距离")
      return
    }

    if (!hours && !minutes && !seconds) {
      setErrorMessage("请输入完赛时间")
      return
    }

    setErrorMessage("")
    setIsLoading(true)

    try {
      // 构建请求体
      const requestBody: Record<string, string | number> = {
        C3: (hours || "00").padStart(2, "0"),
        D3: (minutes || "00").padStart(2, "0"),
        E3: (seconds || "00").padStart(2, "0"),
        G11: weatherUnit,
      }

      // 距离处理
      if (selectedDistance !== "custom") {
        requestBody.race_type = selectedDistance
      } else if (customDistance && distanceUnit) {
        const unitMultipliers: Record<typeof distanceUnit, string> = {
          meters: "1",
          kilometers: "1000",
          miles: "1609.34",
        }
        requestBody.F3 = customDistance
        requestBody.race_units = unitMultipliers[distanceUnit]
      }

      // 环境参数
      if (showWeather) {
        if (temperature) requestBody.G8 = temperature
        if (humidity) requestBody.G9 = humidity
        if (windSpeed) requestBody.G10 = windSpeed
      }

      // 调用 API
      const response = await fetch("/api/hansons/race-equivalency-reverse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        setErrorMessage("计算失败，请稍后重试")
        setIsLoading(false)
        return
      }

      const result: HansonsRaceResult = await response.json()

      if ("error" in result && typeof result.error === "string") {
        setErrorMessage(result.error || "计算失败")
        setIsLoading(false)
        return
      }

      onCalculate(result)
    } catch (error) {
      console.error("计算错误:", error)
      setErrorMessage("网络错误，请检查连接")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card">
      {/* 标题：与比赛等效计算器一致的简洁风格 */}
      <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: "var(--color-text-primary)" }}>
        <div className="w-1 h-5 rounded-full" style={{ backgroundColor: 'var(--color-secondary)' }} />
        输入目标成绩
      </h3>

      {/* 距离选择 */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2" style={{ color: "var(--color-text-primary)" }}>
          比赛距离
        </label>

        <select
          className="select-skeuo w-full"
          value={selectedDistance}
          onChange={(e) => {
            const value = e.target.value
            setSelectedDistance(value)
            if (value !== "custom") {
              setCustomDistance("")
            }
          }}
        >
          <option value="">请选择距离</option>
          {REVERSE_RACE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
          <option value="custom">自定义距离</option>
        </select>
      </div>

      {/* 自定义距离输入 */}
      {isCustomDistance && (
        <div className="animate-in fade-in slide-in-from-top-2">
          <div className="flex items-stretch gap-4">
            <input
              type="number"
              className="input-skeuo-center flex-1 min-w-0 text-sm sm:text-base"
              placeholder="输入数值"
              value={customDistance}
              onChange={(e) => setCustomDistance(e.target.value)}
            />

            <select
              className="select-skeuo"
              value={distanceUnit}
              onChange={(e) => setDistanceUnit(e.target.value as typeof distanceUnit)}
            >
              <option value="meters">米</option>
              <option value="kilometers">公里</option>
              <option value="miles">英里</option>
            </select>
          </div>
        </div>
      )}

      {/* 时间输入 - 一行布局 */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2" style={{ color: "var(--color-text-primary)" }}>
          完赛时间
        </label>

        {/* 一行布局：时、分、秒 */}
        <div className="flex items-center gap-2">
          {/* 小時 */}
          <div className="flex-1 min-w-0">
            <input
              type="number"
              inputMode="numeric"
              className="input-skeuo-center w-full text-sm sm:text-base"
              placeholder="00"
              value={hours}
              onChange={(e) => setHours(e.target.value.replace(/\D/g, "").slice(0, 2))}
              maxLength={2}
            />
          </div>

          {/* 分隔符 */}
          <span className="text-lg flex-shrink-0" style={{ color: "var(--color-text-tertiary)", padding: "0 4px" }}>：</span>

          {/* 分钟 */}
          <div className="flex-1 min-w-0">
            <input
              type="number"
              inputMode="numeric"
              className="input-skeuo-center w-full text-sm sm:text-base"
              placeholder="00"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value.replace(/\D/g, "").slice(0, 2))}
              maxLength={2}
            />
          </div>

          {/* 冒号 */}
          <span className="text-lg flex-shrink-0" style={{ color: "var(--color-text-tertiary)", padding: "0 4px" }}>：</span>

          {/* 秒 */}
          <div className="flex-1 min-w-0">
            <input
              type="number"
              inputMode="numeric"
              className="input-skeuo-center w-full text-sm sm:text-base"
              placeholder="00"
              value={seconds}
              onChange={(e) => setSeconds(e.target.value.replace(/\D/g, "").slice(0, 2))}
              maxLength={2}
            />
          </div>
        </div>
      </div>

      {/* 环境调整折叠面板 */}
      <div className="mb-4">
        <button
          className="text-xs text-text-secondary hover:text-brand-primary transition-colors duration-200 mb-3 flex items-center gap-2"
          style={{ color: "var(--color-text-secondary)" }}
          onClick={() => setShowWeather(!showWeather)}
        >
          <span className="font-medium">环境调整（可选）</span>
          <span className={`transform transition-transform duration-200 ${showWeather ? "rotate-90" : ""}`} style={{ display: "inline-block" }}>
            ▼
          </span>
        </button>

        {showWeather && (
          <div className="animate-in fade-in slide-in-from-top-2 p-4 bg-theme-secondary rounded-lg border">
            <p className="text-xs text-text-tertiary mb-4">
              填写环境因素以调整训练配速（基于汉森训练体系）。留空则忽略。
            </p>

            {/* 使用 grid 布局：每个输入框独立 */}
            <div className="grid grid-cols-[80px_1fr_50px] gap-3 items-center">
              {/* 温度 */}
              <div className="flex flex-col">
                <label className="text-sm font-medium whitespace-nowrap" style={{ color: "var(--color-text-primary)" }}>
                  温度
                </label>
                <input
                  type="number"
                  className="input-skeuo w-full"
                  placeholder="0"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                />
                <span className="text-sm text-text-secondary">
                  {weatherUnit === "imperial" ? "°F" : "°C"}
                </span>
              </div>

              {/* 湿度 */}
              <div className="flex flex-col">
                <label className="text-sm font-medium whitespace-nowrap" style={{ color: "var(--color-text-primary)" }}>
                  湿度
                </label>
                <input
                  type="number"
                  className="input-skeuo w-full"
                  placeholder="0"
                  value={humidity}
                  onChange={(e) => setHumidity(e.target.value)}
                />
                <span className="text-sm text-text-secondary">%</span>
              </div>

              {/* 风速 */}
              <div className="flex flex-col">
                <label className="text-sm font-medium whitespace-nowrap" style={{ color: "var(--color-text-primary)" }}>
                  风速
                </label>
                <input
                  type="number"
                  className="input-skeuo w-full"
                  placeholder="0"
                  value={windSpeed}
                  onChange={(e) => setWindSpeed(e.target.value)}
                />
                <span className="text-sm text-text-secondary">
                  {weatherUnit === "imperial" ? "mph" : "km/h"}
                </span>
              </div>

              {/* 单位切换 */}
              <div className="flex flex-col mt-1">
                <label className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                  单位
                </label>
                <select
                  className="select-skeuo w-full"
                  value={weatherUnit}
                  onChange={(e) => setWeatherUnit(e.target.value as typeof weatherUnit)}
                >
                  <option value="imperial">英制</option>
                  <option value="metric">公制</option>
                </select>
              </div>
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
        {isLoading ? "计算中..." : "计算配速"}
      </button>

      {/* 错误提示 */}
      {errorMessage && (
        <div className="mt-4 p-3 rounded-lg animate-in fade-in slide-in-from-top-2" style={{
          backgroundColor: "rgba(255, 107, 0, 0.15)",
          color: "#FF6B00",
        }}>
          <p className="text-sm font-medium text-center">{errorMessage}</p>
        </div>
      )}
    </div>
  )
}
