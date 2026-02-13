"use client"

import type { TreadmillResult as TreadmillResultType } from "@/types"

interface TreadmillResultProps {
  result: TreadmillResultType | null
}

/**
 * 跑步机计算器结果展示组件
 * 显示不同坡度对应的等效配速表格
 */
export default function TreadmillResult({ result }: TreadmillResultProps) {
  // 无结果时显示占位
  if (!result) {
    return (
      <div className="card flex items-center justify-center min-h-[400px]">
        <p className="text-text-secondary text-center">
          请输入参数并点击"计算等效配速"按钮
        </p>
      </div>
    )
  }

  const { mode, inputDisplay, gradePaces } = result

  return (
    <div className="card">
      {/* 输入信息 */}
      <div className="p-4 border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex items-center gap-2 mb-2">
          <div
            className="px-2 py-1 rounded text-xs font-medium"
            style={{
              backgroundColor: mode === 'mph' ? "rgba(0, 212, 255, 0.15)" : "rgba(167, 139, 250, 0.15)",
              color: mode === 'mph' ? "#00D4FF" : "#A78BFA"
            }}
          >
            {mode === 'mph' ? '速度模式' : '配速模式'}
          </div>
          <span className="text-sm font-mono" style={{ color: "var(--color-text-primary)" }}>
            输入值: {inputDisplay}
          </span>
        </div>
        <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
          以下为不同坡度（0-10%）对应的等效配速
        </p>
      </div>

      {/* 配速表格 */}
      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--color-border)" }}>
                <th
                  className="text-left py-3 px-3 font-medium text-xs"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  坡度
                </th>
                <th
                  className="text-right py-3 px-3 font-medium text-xs"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  配速/英里
                </th>
                <th
                  className="text-right py-3 px-3 font-medium text-xs"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  配速/公里
                </th>
              </tr>
            </thead>
            <tbody>
              {gradePaces.map((gp, index) => {
                // 高亮关键行：0%, 5%, 10%
                const isHighlight = gp.grade === 0 || gp.grade === 5 || gp.grade === 10

                return (
                  <tr
                    key={index}
                    className="border-b transition-colors hover:bg-theme-secondary/20"
                    style={{ borderColor: "var(--color-border-light)" }}
                  >
                    {/* 坡度 */}
                    <td
                      className="py-3 px-3 font-medium text-xs"
                      style={{
                        color: isHighlight ? "#A78BFA" : "var(--color-text-primary)"
                      }}
                    >
                      {gp.gradeFormatted}
                    </td>
                    {/* 配速/英里 */}
                    <td
                      className="py-3 px-3 text-right font-mono text-xs"
                      style={{
                        color: isHighlight ? "var(--color-primary)" : "var(--color-text-primary)"
                      }}
                    >
                      {gp.pacePerMile}
                    </td>
                    {/* 配速/公里 */}
                    <td
                      className="py-3 px-3 text-right font-mono text-xs"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {gp.pacePerKm}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 说明 */}
      <div
        className="p-4 border-t"
        style={{ borderColor: "var(--color-border)" }}
      >
        <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-tertiary)" }}>
          <span style={{ color: "var(--color-text-secondary)" }}>💡 提示：</span>
          坡度越高，等效配速越快。0% 坡度时的配速与平地跑步最接近。
          建议在跑步机上使用 1-2% 坡度来模拟户外跑步的空气阻力。
        </p>
        <p className="text-xs mt-2 leading-relaxed" style={{ color: "var(--color-text-tertiary)" }}>
          <span style={{ color: "var(--color-text-secondary)" }}>📊 科学依据：</span>
          基于 CTM Davies (1980-1) 的数据，每 1% 坡度增加约相当于额外 2.6 ml/kg/min 的耗氧量。
        </p>
      </div>
    </div>
  )
}
