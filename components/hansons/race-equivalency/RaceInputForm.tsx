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
  const [hours, setHours] = useState<string>("00")
  const [minutes, setMinutes] = useState<string>("00")
  const [seconds, setSeconds] = useState<string>("00")

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

  return (
    <div className="card">
      <h2 className="text-base font-bold mb-6">输入比赛成绩</h2>

      {/* 距离选择 */}
      <div className="mb-6">
        <label className="block text-xs font-semibold mb-2">距离</label>
        <select
          className="input-skeuo w-full"
          value={selectedDistance}
          onChange={(e) => {
            const value = e.target.value
            setSelectedDistance(value)
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
        <label className="block text-xs font-semibold mb-2">完赛时间</label>
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
            <div className="text-[10px] text-center text-text-tertiary mt-1">小时</div>
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
            <div className="text-[10px] text-center text-text-tertiary mt-1">分钟</div>
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
            <div className="text-[10px] text-center text-text-tertiary mt-1">秒</div>
          </div>
        </div>
      </div>

      {/* 天气调整（可选） */}
      <div className="mb-6">
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
        disabled={isLoading}
      >
        {isLoading ? '计算中...' : '计算配速'}
      </button>

      {/* 错误提示 */}
      {errorMessage && (
        <div className="mt-3 p-3 rounded-lg text-sm bg-red-500/20 text-red-200 border border-red-500/30">
          <div className="flex items-start gap-2">
            <span className="font-medium">❌</span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}
    </div>
  )
}
