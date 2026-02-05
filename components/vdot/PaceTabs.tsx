"use client"

import { useState } from "react"
import { VDOTResult } from "@/types"
import { formatTime, formatTimeWithDecimal } from "@/lib/vdot-calculator"

interface PaceTabsProps {
  result: VDOTResult | null
}

type TabType = "race" | "training" | "equivalent"

// 训练类型配置（与训练定义保持一致）
const trainingTypes = [
  { key: "easy", label: "轻松跑", shortCode: "轻松跑(E)", color: "#28a745" },
  { key: "marathon", label: "马拉松配速", shortCode: "马拉松(M)", color: "#007bff" },
  { key: "threshold", label: "乳酸阈值", shortCode: "乳酸阈值(T)", color: "#ffc107" },
  { key: "interval", label: "间歇跑", shortCode: "间歇跑(I)", color: "#fd7e14" },
  { key: "rep", label: "重复跑", shortCode: "重复跑(R)", color: "#dc3545" },
  { key: "fastRep", label: "快速重复", shortCode: "快速重复(FR)", color: "#6f42c1" },
]

// 距离分组配置（包含该组应该显示的训练类型）
const distanceGroups = {
  long: {
    distances: [
      { label: "1Mi", meters: 1609.344 },
      { label: "1K", meters: 1000 },
    ],
    // 长距离只显示这 5 个训练类型
    trainingTypes: ["easy", "marathon", "threshold", "interval", "rep"],
  },
  medium: {
    distances: [
      { label: "1200m", meters: 1200 },
      { label: "800m", meters: 800 },
      { label: "600m", meters: 600 },
    ],
    // 中距离只显示这 3 个训练类型
    trainingTypes: ["threshold", "interval", "rep"],
  },
  short: {
    distances: [
      { label: "400m", meters: 400 },
      { label: "300m", meters: 300 },
      { label: "200m", meters: 200 },
    ],
    // 短距离只显示这 3 个训练类型
    trainingTypes: ["interval", "rep", "fastRep"],
  },
}

// 计算特定距离的完成时间（秒/公里作为输入，返回完成指定距离的时间）
function calculateDistancePace(secondsPerKm: number, distanceMeters: number): string {
  // secondsPerKm 是完成 1 公里所需的时间（秒）
  // 需要计算完成指定距离需要的时间
  const timeForDistance = (secondsPerKm * distanceMeters) / 1000
  const minutes = Math.floor(timeForDistance / 60)
  const seconds = Math.round(timeForDistance - minutes * 60)  // 避免浮点数模运算精度问题
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export default function PaceTabs({ result }: PaceTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("training")

  if (!result) {
    return (
      <div className="card flex items-center justify-center min-h-[200px]">
        <p style={{ color: 'var(--color-text-tertiary)' }}>
          请先计算 VDOT 以查看配速数据
        </p>
      </div>
    )
  }

  const tabs = [
    { id: "race" as TabType, label: "比赛配速" },
    { id: "training" as TabType, label: "训练配速" },
    { id: "equivalent" as TabType, label: "等效成绩" },
  ]

  return (
    <div className="card">
      {/* 标签栏 */}
      <div className="flex border-b" style={{ borderColor: 'var(--color-border)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 relative"
            style={{
              color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              backgroundColor: activeTab === tab.id ? 'var(--color-surface)' : 'transparent',
            }}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: 'var(--color-primary)' }}
              />
            )}
          </button>
        ))}
      </div>

      {/* 内容区 */}
      <div className="p-4">
        {activeTab === "race" && <RacePacesContent result={result} />}
        {activeTab === "training" && <TrainingPacesContent result={result} />}
        {activeTab === "equivalent" && <EquivalentPerformancesContent result={result} />}
      </div>
    </div>
  )
}

// 比赛配速内容 - 显示用户输入距离的配速细分
function RacePacesContent({ result }: { result: VDOTResult }) {
  const breakdown = result.racePaceBreakdown

  if (!breakdown) {
    return (
      <div className="flex items-center justify-center min-h-[100px]">
        <p style={{ color: 'var(--color-text-tertiary)' }}>
          请输入距离和时间以查看配速细分
        </p>
      </div>
    )
  }

  // 配速细分数据：严格按照参考项目的两列格式
  const paceItems = [
    { distance: breakdown.distance, time: formatTimeWithDecimal(breakdown.totalTime) },
    { distance: "1Mi", time: formatTimeWithDecimal(breakdown.pacePerMile) },
    { distance: "1K", time: formatTimeWithDecimal(breakdown.pacePerKm) },
    { distance: "800M", time: formatTimeWithDecimal(breakdown.pace800m) },
    { distance: "400M", time: formatTimeWithDecimal(breakdown.pace400m) },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
            <th className="text-left py-2 px-3 font-medium text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              距离
            </th>
            <th className="text-right py-2 px-3 font-medium text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              配速
            </th>
          </tr>
        </thead>
        <tbody>
          {paceItems.map((item, index) => (
            <tr
              key={index}
              className="border-b transition-colors hover:bg-theme-secondary/20"
              style={{ borderColor: 'var(--color-border-light)' }}
            >
              <td className="py-2 px-3 text-xs" style={{ color: 'var(--color-text-primary)' }}>
                {item.distance}
              </td>
              <td className="py-2 px-3 text-right font-mono font-semibold text-xs" style={{ color: 'var(--color-primary)' }}>
                {item.time}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// 训练配速内容（分为长、中、短距离）
function TrainingPacesContent({ result }: { result: VDOTResult }) {
  const paces = result.trainingPaces

  return (
    <div className="space-y-4">
      {Object.entries(distanceGroups).map(([groupKey, groupConfig]) => {
        const { distances, trainingTypes: groupTrainingTypes } = groupConfig as {
          distances: typeof distanceGroups.long.distances
          trainingTypes: string[]
        }

        return (
          <div key={groupKey}>
            <h5 className="text-xs font-semibold mb-2" style={{ color: 'var(--color-text-tertiary)' }}>
              {groupKey === "long" ? "长距离配速" : groupKey === "medium" ? "中距离配速" : "短距离配速"}
            </h5>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <th className="text-left py-2 px-2 font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                      类型
                    </th>
                    {distances.map((d) => (
                      <th key={d.label} className="text-center py-2 px-2 font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                        {d.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {groupTrainingTypes.map((typeKey) => {
                    const typeConfig = trainingTypes.find(t => t.key === typeKey)
                    if (!typeConfig) return null

                    const pace = paces[typeKey as keyof typeof paces]
                    if (!pace) return null

                    // 判断是否显示范围（Easy 显示范围，其他显示单个值）
                    // Marathon, Threshold, Interval, Rep 使用 fast 值（或 slow，它们相同）
                    const showRange = typeKey === "easy"

                    return (
                      <tr
                        key={typeKey}
                        className="border-b transition-colors hover:bg-theme-secondary/20"
                        style={{ borderColor: 'var(--color-border-light)' }}
                      >
                        <td className="py-2 px-2 font-medium" style={{ color: typeConfig.color }}>
                          {typeConfig.shortCode}
                        </td>
                        {distances.map((distance) => {
                          if (showRange) {
                            // Easy: 显示 slow - fast 范围
                            const slowTime = calculateDistancePace(pace.slow, distance.meters)
                            const fastTime = calculateDistancePace(pace.fast, distance.meters)
                            return (
                              <td key={distance.label} className="py-2 px-2 text-center font-mono" style={{ color: 'var(--color-text-primary)' }}>
                                {slowTime} ~ {fastTime}
                              </td>
                            )
                          } else {
                            // 其他类型: 显示单个值（使用 fast 值）
                            const time = calculateDistancePace(pace.fast, distance.meters)
                            return (
                              <td key={distance.label} className="py-2 px-2 text-center font-mono" style={{ color: 'var(--color-text-primary)' }}>
                                {time}
                              </td>
                            )
                          }
                        })}
                      </tr>
                    )
                })}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// 等效成绩内容
function EquivalentPerformancesContent({ result }: { result: VDOTResult }) {
  // 格式化配速（不带单位后缀）
  const formatPaceNoUnit = (secondsPerKm: number): string => {
    const minutes = Math.floor(secondsPerKm / 60)
    const secs = Math.floor(secondsPerKm % 60)
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
            <th className="text-left py-2 px-3 font-medium text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              距离
            </th>
            <th className="text-right py-2 px-3 font-medium text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              完赛时间
            </th>
            <th className="text-right py-2 px-3 font-medium text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              配速/英里
            </th>
            <th className="text-right py-2 px-3 font-medium text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              配速/公里
            </th>
          </tr>
        </thead>
        <tbody>
          {result.equivalentPerformances.map((perf, index) => (
            <tr
              key={perf.distance}
              className="border-b transition-colors hover:bg-theme-secondary/20"
              style={{ borderColor: 'var(--color-border-light)' }}
            >
              <td className="py-2 px-3 text-xs" style={{ color: 'var(--color-text-primary)' }}>
                {perf.distance}
              </td>
              <td className="py-2 px-3 text-right font-mono font-semibold text-xs" style={{ color: 'var(--color-primary)' }}>
                {formatTime(perf.time)}
              </td>
              <td className="py-2 px-3 text-right font-mono text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                {formatPaceNoUnit(perf.pacePerMile)}
              </td>
              <td className="py-2 px-3 text-right font-mono text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                {formatPaceNoUnit(perf.pacePerKm)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
