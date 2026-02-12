"use client"

import { getPercentageColor } from "@/lib/improvement-calculator"
import type { ImprovementResult } from "@/types"

interface ImprovementResultProps {
  result: ImprovementResult | null
}

/**
 * 提升计算器结果展示组件
 * 显示原始时间和 7 种提升百分比的结果
 */
export default function ImprovementResult({ result }: ImprovementResultProps) {
  // 无结果时显示占位
  if (!result) {
    return (
      <div className="card min-h-[400px] flex items-center justify-center">
        <p className="text-text-secondary text-center">
          请输入当前成绩并点击"计算提升"按钮
        </p>
      </div>
    )
  }

  const { originalTimeFormatted, improvements } = result

  return (
    <div className="card">
      <div className="mb-6">
        <h3 className="text-base font-bold" style={{ color: "var(--color-text-primary)" }}>
          提升预测
        </h3>
      </div>

      {/* 原始时间卡片 */}
      <div className="mb-6 p-4 rounded-xl" style={{
        background: "linear-gradient(135deg, rgba(0, 212, 255, 0.15) 0%, rgba(255, 107, 0, 0.15) 100%)",
        border: "1px solid rgba(0, 212, 255, 0.3)",
      }}>
        <div className="text-xs font-medium mb-1" style={{ color: "var(--color-text-secondary)" }}>
          当前成绩
        </div>
        <div className="text-3xl font-mono font-bold" style={{ color: "var(--color-primary)" }}>
          {originalTimeFormatted}
        </div>
      </div>

      {/* 提升表格 */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--color-border)" }}>
              <th className="text-left py-3 px-3 font-medium" style={{ color: "var(--color-text-secondary)" }}>
                提升幅度
              </th>
              <th className="text-right py-3 px-3 font-medium" style={{ color: "var(--color-text-secondary)" }}>
                目标时间
              </th>
              <th className="text-right py-3 px-3 font-medium" style={{ color: "var(--color-text-secondary)" }}>
                节省时间
              </th>
            </tr>
          </thead>
          <tbody>
            {improvements.map((entry) => (
              <tr
                key={entry.percentage}
                className="border-b transition-colors hover:bg-theme-secondary/20"
                style={{ borderColor: "var(--color-border-light)" }}
              >
                {/* 百分比徽章 */}
                <td className="py-3 px-3">
                  <span
                    className="inline-flex items-center justify-center px-3 py-1 rounded-md text-xs font-semibold"
                    style={{
                      backgroundColor: getPercentageColor(entry.percentage),
                      color: "#0A1628",
                    }}
                  >
                    {entry.percentage}%
                  </span>
                </td>

                {/* 目标时间 */}
                <td className="py-3 px-3 text-right font-mono text-base" style={{ color: "var(--color-primary)" }}>
                  {entry.improvedTimeFormatted}
                </td>

                {/* 节省时间 */}
                <td className="py-3 px-3 text-right font-mono" style={{ color: "var(--color-text-secondary)" }}>
                  -{entry.timeSavedFormatted}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 说明文字 */}
      <div className="mt-4 p-3 rounded-lg" style={{
        backgroundColor: "var(--color-background-secondary)",
        border: "1px solid var(--color-border-light)",
      }}>
        <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-tertiary)" }}>
          <span style={{ color: "var(--color-text-secondary)" }}>💡 提示：</span>
          高水平跑者通常以 2-4% 的提升为目标，而新手跑者在训练初期可能会有更高的提升幅度。
          建议设定合理的目标，循序渐进地提升成绩。
        </p>
      </div>
    </div>
  )
}
