"use client"

import { useState } from "react"
import Link from "next/link"
import * as Icons from "lucide-react"
import ThemeToggle from "@/components/ThemeToggle"
import ReverseInputForm from "./ReverseInputForm"
import ReversePaceTabs from "./ReversePaceTabs"
import type { HansonsRaceResult } from "@/types"

/**
 * 汉森反向计算器主容器组件
 * 根据目标成绩推算当前需要达到的训练配速水平
 */
export default function HansonsReverseCalculator() {
  const [result, setResult] = useState<HansonsRaceResult | null>(null)

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
            汉森反向计算器
          </h1>

          <ThemeToggle />
        </div>

        {/* 主内容区：左右布局 (4:8) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左侧输入表单 */}
          <div className="lg:col-span-4">
            <ReverseInputForm onCalculate={setResult} />
          </div>

          {/* 右侧结果展示 */}
          <div className="lg:col-span-8">
            <ReversePaceTabs result={result} />
          </div>
        </div>
      </div>
    </div>
  )
}
