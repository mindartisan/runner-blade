"use client"

import { useState } from "react"
import * as Icons from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Calculator } from "lucide-react"
import Header from "@/components/Header"
import RaceInputForm from "./RaceInputForm"
import RaceInfoResult from "./RaceInfoResult"
import TrainingPacesResult from "./TrainingPacesResult"
import EquivalentPerformancesResult from "./EquivalentPerformancesResult"
import type { HansonsRaceResult } from "@/types"

type ResultTab = 'race-info' | 'training' | 'equivalent'

export default function HansonsRaceCalculator() {
  const [result, setResult] = useState<HansonsRaceResult | null>(null)
  const [activeTab, setActiveTab] = useState<ResultTab>('race-info')

  const tabs = [
    { id: 'race-info' as const, label: '比赛信息', icon: 'Info' },
    { id: 'training' as const, label: '训练配速', icon: 'Target' },
    { id: 'equivalent' as const, label: '等效成绩', icon: 'Trophy' },
  ]

  return (
    <div className="min-h-screen bg-theme-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* 标题区 */}
        <div className="mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-text-primary">
            汉森比赛等效计算器
          </h1>
          <p className="text-sm text-text-secondary mt-2">
            根据比赛成绩计算训练配速和等效成绩，基于汉森训练体系
          </p>
        </div>

        {/* 主内容区：左右布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左侧：输入区 */}
          <div className="lg:col-span-4">
            <RaceInputForm onCalculate={setResult} />
          </div>

          {/* 右侧：结果区（标签页） */}
          <div className="lg:col-span-8">
            {result ? (
              <div className="space-y-6">
                {/* 标签页导航 */}
                <div className="flex gap-2 border-b border-border">
                  {tabs.map(tab => {
                    const IconComponent = Icons[tab.icon as keyof typeof Icons] as LucideIcon
                    const isActive = activeTab === tab.id
                    return (
                      <button
                        key={tab.id}
                        className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
                          isActive
                            ? 'border-brand-primary text-brand-primary'
                            : 'border-transparent text-text-secondary hover:text-text-primary'
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <IconComponent size={18} />
                        <span className="text-sm font-medium">{tab.label}</span>
                      </button>
                    )
                  })}
                </div>

                {/* 标签页内容 */}
                <div className="animate-in fade-in">
                  {activeTab === 'race-info' && <RaceInfoResult raceInfo={result.raceInfo} />}
                  {activeTab === 'training' && <TrainingPacesResult trainingPaces={result.trainingPaces} />}
                  {activeTab === 'equivalent' && <EquivalentPerformancesResult performances={result.equivalentPerformances} />}
                </div>
              </div>
            ) : (
              <div className="card flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <Calculator className="mx-auto mb-4 text-text-tertiary" size={48} />
                  <p className="text-text-tertiary">请输入比赛成绩以查看结果</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
