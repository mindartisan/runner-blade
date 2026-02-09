"use client"

import { useState } from "react"
import { Calculator } from "lucide-react"
import Header from "@/components/Header"
import RaceInputForm from "./RaceInputForm"
import HansonsPaceTabs from "./HansonsPaceTabs"
import type { HansonsRaceResult } from "@/types"

export default function HansonsRaceCalculator() {
  const [result, setResult] = useState<HansonsRaceResult | null>(null)

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

          {/* 右侧：结果区 */}
          <div className="lg:col-span-8">
            <HansonsPaceTabs result={result} />
          </div>
        </div>
      </main>
    </div>
  )
}
