"use client"

import { useState } from "react"
import Link from "next/link"
import ThemeToggle from "@/components/ThemeToggle"
import RaceInputForm from "./RaceInputForm"
import HansonsPaceTabs from "./HansonsPaceTabs"
import type { HansonsRaceResult } from "@/types"

export default function HansonsRaceCalculator() {
  const [result, setResult] = useState<HansonsRaceResult | null>(null)

  return (
    <div className="min-h-screen bg-theme-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 返回按钮和标题 */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 transition-colors duration-200"
            style={{ color: 'var(--color-text-secondary)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-secondary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </Link>
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            汉森比赛等效计算器
          </h1>
          <ThemeToggle />
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
      </div>
    </div>
  )
}
