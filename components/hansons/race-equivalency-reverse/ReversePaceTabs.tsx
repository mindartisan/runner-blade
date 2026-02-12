"use client"

import type { HansonsRaceResult } from "@/types"

interface ReversePaceTabsProps {
  result: HansonsRaceResult | null
}

/**
 * 反向计算器结果展示组件
 * 只显示比赛信息
 */
export default function ReversePaceTabs({ result }: ReversePaceTabsProps) {
  // 无结果时显示占位
  if (!result) {
    return (
      <div className="card min-h-[400px] flex items-center justify-center">
        <p className="text-text-secondary text-center">
          请输入目标成绩并点击"计算配速"按钮
        </p>
      </div>
    )
  }

  const { raceInfo } = result

  const infoItems = [
    { label: "距离", value: raceInfo.distance },
    { label: "目标时间", value: raceInfo.time, highlight: true },
    { label: "配速/英里", value: raceInfo.pacePerMile },
    { label: "配速/公里", value: raceInfo.pacePerKm },
  ]

  return (
    <div className="card">
      <div className="mb-4">
        <h3 className="text-base font-bold" style={{ color: "var(--color-text-primary)" }}>
          目标成绩信息
        </h3>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b" style={{ borderColor: "var(--color-border)" }}>
            <th className="text-left py-3 px-3 font-medium" style={{ color: "var(--color-text-secondary)" }}>
              项目
            </th>
            <th className="text-right py-3 px-3 font-medium" style={{ color: "var(--color-text-secondary)" }}>
              数值
            </th>
          </tr>
        </thead>
        <tbody>
          {infoItems.map((item, index) => (
            <tr
              key={index}
              className="border-b transition-colors hover:bg-theme-secondary/20"
              style={{ borderColor: "var(--color-border-light)" }}
            >
              <td className="py-3 px-3" style={{ color: "var(--color-text-primary)" }}>
                {item.label}
              </td>
              <td className={`text-right py-3 px-3 font-mono ${item.highlight ? "text-brand-primary font-bold text-lg" : ""}`} style={{ color: item.highlight ? "var(--color-primary)" : "var(--color-text-primary)" }}>
                {item.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
