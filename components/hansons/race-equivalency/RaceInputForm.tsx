"use client"

import { useState } from "react"
import { calculateHansonsRacePaces } from "@/lib/hansons-race-calculator"
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
  const [hours, setHours] = useState<string>("00")
  const [minutes, setMinutes] = useState<string>("00")
  const [seconds, setSeconds] = useState<string>("00")

  // 天气调整状态（可选）
  const [showWeather, setShowWeather] = useState(false)
  const [temperature, setTemperature] = useState<string>("")
  const [humidity, setHumidity] = useState<string>("")
  const [windSpeed, setWindSpeed] = useState<string>("")
  const [weatherUnit, setWeatherUnit] = useState<'imperial' | 'metric'>('imperial')

  const handleCalculate = () => {
    // 计算距离
    let distanceMeters: number
    if (selectedDistance && selectedDistance !== 'custom') {
      distanceMeters = parseFloat(selectedDistance)
    } else if (customDistance && distanceUnit) {
      const unitMultipliers = { meters: 1, kilometers: 1000, miles: 1609.344 }
      distanceMeters = parseFloat(customDistance) * unitMultipliers[distanceUnit]
    } else {
      return // 无效输入
    }

    // 计算时间（秒）
    const timeSeconds =
      parseInt(hours || "0") * 3600 +
      parseInt(minutes || "0") * 60 +
      parseInt(seconds || "0")

    if (timeSeconds === 0) {
      return
    }

    // 构建天气参数（如果提供）
    const weather = (showWeather && temperature && humidity && windSpeed) ? {
      temperature: parseFloat(temperature),
      temperatureUnit: weatherUnit,
      humidity: parseFloat(humidity),
      windSpeed: parseFloat(windSpeed),
      windUnit: weatherUnit
    } : undefined

    // 调用计算函数
    try {
      const result = calculateHansonsRacePaces(distanceMeters, timeSeconds, weather)
      onCalculate(result)
    } catch (error) {
      console.error("计算错误:", error)
    }
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-6">输入比赛成绩</h2>

      {/* 距离选择 */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">距离</label>
        <select
          className="input-skeuo w-full"
          value={selectedDistance}
          onChange={(e) => {
            const value = e.target.value
            setSelectedDistance(value)
            // 如果不是自定义距离，清空自定义输入
            if (value !== 'custom') {
              setCustomDistance("")
            }
          }}
        >
          <option value="">选择比赛距离</option>
          {RACE_DISTANCE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
          <option value="custom">自定义距离</option>
        </select>

        {/* 只有选择"自定义距离"时才显示 */}
        {selectedDistance === 'custom' && (
          <div className="animate-in fade-in slide-in-from-top-2 mt-3 flex gap-2">
            <input
              type="number"
              className="input-skeuo flex-1"
              placeholder="输入距离数值"
              value={customDistance}
              onChange={(e) => setCustomDistance(e.target.value)}
            />
            <select
              className="select-skeuo"
              value={distanceUnit}
              onChange={(e) => setDistanceUnit(e.target.value as any)}
            >
              <option value="meters">米</option>
              <option value="kilometers">公里</option>
              <option value="miles">英里</option>
            </select>
          </div>
        )}
      </div>

      {/* 时间输入 */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">完赛时间</label>
        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <input
              type="number"
              className="input-skeuo-center w-full"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              min="0"
              max="23"
            />
            <div className="text-xs text-center text-text-tertiary mt-1">小时</div>
          </div>
          <span className="text-text-primary">:</span>
          <div className="flex-1">
            <input
              type="number"
              className="input-skeuo-center w-full"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              min="0"
              max="59"
            />
            <div className="text-xs text-center text-text-tertiary mt-1">分钟</div>
          </div>
          <span className="text-text-primary">:</span>
          <div className="flex-1">
            <input
              type="number"
              className="input-skeuo-center w-full"
              value={seconds}
              onChange={(e) => setSeconds(e.target.value)}
              min="0"
              max="59"
            />
            <div className="text-xs text-center text-text-tertiary mt-1">秒</div>
          </div>
        </div>
      </div>

      {/* 天气调整（可选） */}
      <div className="mb-6">
        <button
          className="text-sm text-text-secondary hover:text-brand-primary transition-colors mb-3 flex items-center gap-2"
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
              <label className="text-sm font-medium">温度</label>
              <input
                type="number"
                className="input-skeuo"
                placeholder="0"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
              />
              <span className="text-sm text-text-secondary">
                {weatherUnit === 'imperial' ? '°F' : '°C'}
              </span>
            </div>

            <div className="grid grid-cols-[80px_1fr_50px] gap-3 items-center">
              <label className="text-sm font-medium">湿度</label>
              <input
                type="number"
                className="input-skeuo"
                placeholder="0"
                value={humidity}
                onChange={(e) => setHumidity(e.target.value)}
                min="0"
                max="100"
              />
              <span className="text-sm text-text-secondary">%</span>
            </div>

            <div className="grid grid-cols-[80px_1fr_50px] gap-3 items-center">
              <label className="text-sm font-medium">风速</label>
              <input
                type="number"
                className="input-skeuo"
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
                <option value="imperial">英制 (°F, mph)</option>
                <option value="metric">公制 (°C, km/h)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 计算按钮 */}
      <button
        className="btn-primary w-full"
        onClick={handleCalculate}
      >
        计算配速
      </button>
    </div>
  )
}
