"use client"

import { useState } from "react"
import type { TreadmillResult, TreadmillInputMode } from "@/types"

interface TreadmillInputFormProps {
  onCalculate: (result: TreadmillResult) => void
}

/**
 * 跑步机计算器输入表单组件
 * 支持两种模式：MPH（速度）和 Pace（配速）
 */
export default function TreadmillInputForm({ onCalculate }: TreadmillInputFormProps) {
  // 模式切换
  const [mode, setMode] = useState<TreadmillInputMode>('mph')

  // MPH 模式输入
  const [mphValue, setMphValue] = useState<string>("")

  // Pace 模式输入
  const [paceMinutes, setPaceMinutes] = useState<string>("")
  const [paceSeconds, setPaceSeconds] = useState<string>("")

  // 加载和错误状态
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("")

  /**
   * 处理计算按钮点击
   */
  const handleCalculate = async () => {
    setIsLoading(true)
    setErrorMessage("")

    // 验证输入
    let value: string

    if (mode === 'mph') {
      if (!mphValue || parseFloat(mphValue) <= 0) {
        setErrorMessage('请输入有效的 MPH 值')
        setIsLoading(false)
        return
      }
      value = mphValue
    } else {
      if (!paceMinutes && !paceSeconds) {
        setErrorMessage('请输入配速时间')
        setIsLoading(false)
        return
      }
      // 格式化为 HH:MM:SS（API 要求格式）
      const mins = parseInt(paceMinutes || '0')
      const secs = parseInt(paceSeconds || '0')
      if (mins === 0 && secs === 0) {
        setErrorMessage('配速时间不能为 0')
        setIsLoading(false)
        return
      }
      value = `00:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const requestBody = { mode, value }

    try {
      const response = await fetch('/api/hansons/treadmill', {
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

  /**
   * 切换模式时清空输入
   */
  const handleModeChange = (newMode: TreadmillInputMode) => {
    setMode(newMode)
    setErrorMessage("")
    setMphValue("")
    setPaceMinutes("")
    setPaceSeconds("")
  }

  return (
    <div className="card">
      {/* 标题 */}
      <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: "var(--color-text-primary)" }}>
        <div className="w-1 h-5 rounded-full" style={{ backgroundColor: "#A78BFA" }} />
        输入参数
      </h3>

      <div className="space-y-4">
        {/* 错误提示 */}
        {errorMessage && (
          <div
            className="p-3 rounded-lg text-sm text-center animate-in fade-in slide-in-from-top-2"
            style={{
              backgroundColor: "rgba(255, 107, 0, 0.15)",
              color: "#FF6B00",
              border: "1px solid rgba(255, 107, 0, 0.3)"
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* 输入模式切换 */}
        <div className="flex gap-2">
          <button
            onClick={() => handleModeChange('mph')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === 'mph' ? 'shadow-lg' : ''
            }`}
            style={{
              backgroundColor: mode === 'mph'
                ? "rgba(167, 139, 250, 0.2)"
                : "transparent",
              border: "1px solid " + (mode === 'mph'
                ? "rgba(167, 139, 250, 0.5)"
                : "var(--color-border)"),
              color: mode === 'mph'
                ? "#A78BFA"
                : "var(--color-text-secondary)"
            }}
          >
            <span className="block">速度模式</span>
            <span className="text-xs opacity-70">MPH 英里/小时</span>
          </button>
          <button
            onClick={() => handleModeChange('pace')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === 'pace' ? 'shadow-lg' : ''
            }`}
            style={{
              backgroundColor: mode === 'pace'
                ? "rgba(167, 139, 250, 0.2)"
                : "transparent",
              border: "1px solid " + (mode === 'pace'
                ? "rgba(167, 139, 250, 0.5)"
                : "var(--color-border)"),
              color: mode === 'pace'
                ? "#A78BFA"
                : "var(--color-text-secondary)"
            }}
          >
            <span className="block">配速模式</span>
            <span className="text-xs opacity-70">目标配速/英里</span>
          </button>
        </div>

        {/* MPH 输入 */}
        {mode === 'mph' && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200">
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--color-text-primary)" }}>
              跑步机速度
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                step="0.1"
                min="0"
                value={mphValue}
                onChange={(e) => setMphValue(e.target.value)}
                placeholder="如 10"
                className="input-skeuo-center flex-1 font-mono text-base"
              />
              <span className="text-sm flex-shrink-0" style={{ color: "var(--color-text-secondary)" }}>
                MPH
              </span>
            </div>
            <p className="text-xs mt-2" style={{ color: "var(--color-text-tertiary)" }}>
              输入跑步机显示的速度值（英里/小时）
            </p>
          </div>
        )}

        {/* Pace 输入 */}
        {mode === 'pace' && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200">
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--color-text-primary)" }}>
              目标配速（每英里）
            </label>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <input
                  type="number"
                  className="input-skeuo-center w-full font-mono text-base"
                  value={paceMinutes}
                  onChange={(e) => setPaceMinutes(e.target.value.replace(/\D/g, "").slice(0, 2))}
                  placeholder="06"
                  min="0"
                  max="59"
                />
                <span className="text-xs text-center block mt-1.5" style={{ color: "var(--color-text-tertiary)" }}>
                  分钟
                </span>
              </div>
              <span className="text-xl pb-2" style={{ color: "var(--color-text-tertiary)" }}>：</span>
              <div className="flex-1">
                <input
                  type="number"
                  className="input-skeuo-center w-full font-mono text-base"
                  value={paceSeconds}
                  onChange={(e) => setPaceSeconds(e.target.value.replace(/\D/g, "").slice(0, 2))}
                  placeholder="00"
                  min="0"
                  max="59"
                />
                <span className="text-xs text-center block mt-1.5" style={{ color: "var(--color-text-tertiary)" }}>
                  秒
                </span>
              </div>
              <span className="text-sm pb-3" style={{ color: "var(--color-text-secondary)" }}>
                /英里
              </span>
            </div>
            <p className="text-xs mt-2" style={{ color: "var(--color-text-tertiary)" }}>
              输入你希望保持的目标配速
            </p>
          </div>
        )}

        {/* 计算按钮 */}
        <button
          className="btn-primary w-full"
          onClick={handleCalculate}
          disabled={isLoading}
        >
          {isLoading ? '计算中...' : '计算等效配速'}
        </button>
      </div>
    </div>
  )
}
