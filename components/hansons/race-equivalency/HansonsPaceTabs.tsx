"use client"

import { useState } from "react"
import { HansonsRaceResult } from "@/types"
import { TRAINING_TYPE_CONFIG } from "@/types"

interface HansonsPaceTabsProps {
  result: HansonsRaceResult | null
}

type TabType = "race-info" | "training" | "equivalent"

export default function HansonsPaceTabs({ result }: HansonsPaceTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("training")

  if (!result) {
    return (
      <div className="card flex items-center justify-center min-h-[200px]">
        <p style={{ color: 'var(--color-text-tertiary)' }} className="text-xs">
          请先计算以查看配速数据
        </p>
      </div>
    )
  }

  const tabs = [
    { id: "race-info" as TabType, label: "比赛信息" },
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
            className="flex-1 py-3 px-4 text-xs font-medium transition-all duration-200 relative"
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
        {activeTab === "race-info" && <RaceInfoContent result={result} />}
        {activeTab === "training" && <TrainingPacesContent result={result} />}
        {activeTab === "equivalent" && <EquivalentPerformancesContent result={result} />}
      </div>
    </div>
  )
}

// 比赛信息内容
function RaceInfoContent({ result }: { result: HansonsRaceResult }) {
  const raceInfo = result.raceInfo

  const infoItems = [
    { label: "距离", value: raceInfo.distance },
    { label: "完赛时间", value: raceInfo.time, highlight: true },
    { label: "配速/英里", value: raceInfo.pacePerMile },
    { label: "配速/公里", value: raceInfo.pacePerKm },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
            <th className="text-left py-2 px-3 font-medium text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              项目
            </th>
            <th className="text-right py-2 px-3 font-medium text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              数值
            </th>
          </tr>
        </thead>
        <tbody>
          {infoItems.map((item, index) => (
            <tr
              key={index}
              className="border-b transition-colors hover:bg-theme-secondary/20"
              style={{ borderColor: 'var(--color-border-light)' }}
            >
              <td className="py-2 px-3 text-xs" style={{ color: 'var(--color-text-primary)' }}>
                {item.label}
              </td>
              <td
                className={`py-2 px-3 text-right font-mono font-semibold text-xs ${
                  item.highlight ? 'text-brand-primary' : ''
                }`}
                style={{ color: item.highlight ? 'var(--color-primary)' : 'var(--color-text-primary)' }}
              >
                {item.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// 训练配速内容
function TrainingPacesContent({ result }: { result: HansonsRaceResult }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
            <th className="text-left py-2 px-2 font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              类型
            </th>
            <th className="text-right py-2 px-2 font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              配速/英里
            </th>
            <th className="text-right py-2 px-2 font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              配速/公里
            </th>
          </tr>
        </thead>
        <tbody>
          {result.trainingPaces.map((pace) => {
            const config = TRAINING_TYPE_CONFIG[pace.type]
            return (
              <tr
                key={pace.type}
                className="border-b transition-colors hover:bg-theme-secondary/20"
                style={{ borderColor: 'var(--color-border-light)' }}
              >
                <td className="py-2 px-2 font-medium" style={{ color: config.color }}>
                  {config.name}
                </td>
                <td className="py-2 px-2 text-right font-mono text-xs" style={{ color: 'var(--color-text-primary)' }}>
                  {pace.pacePerMile}
                </td>
                <td className="py-2 px-2 text-right font-mono text-xs" style={{ color: 'var(--color-text-primary)' }}>
                  {pace.pacePerKm}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// 等效成绩内容
function EquivalentPerformancesContent({ result }: { result: HansonsRaceResult }) {
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
          {result.equivalentPerformances.map((perf) => (
            <tr
              key={perf.distance}
              className="border-b transition-colors hover:bg-theme-secondary/20"
              style={{ borderColor: 'var(--color-border-light)' }}
            >
              <td className="py-2 px-3 text-xs" style={{ color: 'var(--color-text-primary)' }}>
                {perf.distance}
              </td>
              <td className="py-2 px-3 text-right font-mono font-semibold text-xs" style={{ color: 'var(--color-primary)' }}>
                {perf.time}
              </td>
              <td className="py-2 px-3 text-right font-mono text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                {perf.pacePerMile}
              </td>
              <td className="py-2 px-3 text-right font-mono text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                {perf.pacePerKm}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
