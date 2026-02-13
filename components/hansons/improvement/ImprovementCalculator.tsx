"use client"

import { useState } from "react"
import Link from "next/link"
import * as Icons from "lucide-react"
import ThemeToggle from "@/components/ThemeToggle"
import ImprovementInputForm from "./ImprovementInputForm"
import ImprovementResult from "./ImprovementResult"
import type { ImprovementResult as ImprovementResultType } from "@/types"

/**
 * 汉森提升计算器主容器组件
 * 根据当前比赛成绩计算不同百分比提升后的预期成绩
 */
export default function ImprovementCalculator() {
  const [result, setResult] = useState<ImprovementResultType | null>(null)

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-background)" }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 头部导航 */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 transition-colors duration-200"
            style={{ color: "var(--color-text-secondary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-secondary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-secondary)")}
          >
            <Icons.ArrowLeft className="w-5 h-5" />
            返回首页
          </Link>

          <h1 className="text-xl md:text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
            汉森提升计算器
          </h1>

          <ThemeToggle />
        </div>

        {/* 主内容区：左右布局 (4:8) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左侧输入表单 */}
          <div className="lg:col-span-4">
            <ImprovementInputForm onCalculate={setResult} />
          </div>

          {/* 右侧结果展示 */}
          <div className="lg:col-span-8">
            <ImprovementResult result={result} />
          </div>
        </div>
      </div>
    </div>
  )
}
