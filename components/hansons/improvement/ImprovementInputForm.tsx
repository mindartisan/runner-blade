"use client"

import { useState } from "react"
import { calculateImprovement } from "@/lib/improvement-calculator"
import type { ImprovementResult } from "@/types"

interface ImprovementInputFormProps {
  onCalculate: (result: ImprovementResult) => void
}

/**
 * 提升计算器输入表单组件
 * 简洁设计，只有时间输入（时:分:秒）
 */
export default function ImprovementInputForm({ onCalculate }: ImprovementInputFormProps) {
  // 时间输入状态
  const [hours, setHours] = useState<string>("")
  const [minutes, setMinutes] = useState<string>("")
  const [seconds, setSeconds] = useState<string>("")

  // 加载和错误状态
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("")

  /**
   * 处理计算按钮点击
   */
  const handleCalculate = () => {
    // 验证必填字段
    if (!hours && !minutes && !seconds) {
      setErrorMessage("请输入当前成绩")
      return
    }

    const h = parseInt(hours || "0", 10)
    const m = parseInt(minutes || "0", 10)
    const s = parseInt(seconds || "0", 10)

    // 验证数值范围
    if (h < 0 || m < 0 || s < 0 || m > 59 || s > 59) {
      setErrorMessage("请输入有效的时间（分钟 0-59，秒 0-59）")
      return
    }

    setErrorMessage("")
    setIsLoading(true)

    try {
      // 纯前端计算，无需 API 调用
      const result = calculateImprovement(h, m, s)
      onCalculate(result)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "计算失败，请检查输入")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card">
      {/* 标题 */}
      <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: "var(--color-text-primary)" }}>
        <div className="w-1 h-5 rounded-full" style={{ backgroundColor: 'var(--color-accent)' }} />
        输入当前成绩
      </h3>

      {/* 时间输入 - 一行布局 */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>
          完赛时间
        </label>

        <div className="flex items-center gap-2">
          {/* 小时 */}
          <div className="flex-1 min-w-0">
            <input
              type="number"
              inputMode="numeric"
              className="input-skeuo-center w-full text-sm sm:text-base"
              placeholder="00"
              value={hours}
              onChange={(e) => setHours(e.target.value.replace(/\D/g, "").slice(0, 2))}
              maxLength={2}
              min={0}
              max={99}
            />
            <span className="text-xs text-center block mt-1" style={{ color: "var(--color-text-tertiary)" }}>
              小时
            </span>
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
              min={0}
              max={59}
            />
            <span className="text-xs text-center block mt-1" style={{ color: "var(--color-text-tertiary)" }}>
              分钟
            </span>
          </div>

          {/* 分隔符 */}
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
              min={0}
              max={59}
            />
            <span className="text-xs text-center block mt-1" style={{ color: "var(--color-text-tertiary)" }}>
              秒
            </span>
          </div>
        </div>
      </div>

      {/* 计算按钮 */}
      <button
        className="btn-primary w-full"
        onClick={handleCalculate}
        disabled={isLoading}
      >
        {isLoading ? "计算中..." : "计算提升"}
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
