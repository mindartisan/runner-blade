"use client"

import { useState } from "react"
import Link from "next/link"
import * as Icons from "lucide-react"
import ThemeToggle from "@/components/ThemeToggle"
import TreadmillInputForm from "./TreadmillInputForm"
import TreadmillResult from "./TreadmillResult"
import type { TreadmillResult as TreadmillResultType } from "@/types"

/**
 * 汉森跑步机配速计算器主容器组件
 * 计算跑步机不同坡度对应的等效配速
 */
export default function TreadmillCalculator() {
  const [result, setResult] = useState<TreadmillResultType | null>(null)

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-background)" }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 头部导航 */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/tools/hansons/hansons-calculator"
            className="flex items-center gap-2 transition-colors duration-200"
            style={{ color: "var(--color-text-secondary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-secondary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-secondary)")}
          >
            <Icons.ArrowLeft className="w-5 h-5" />
            返回仪表板
          </Link>

          <h1 className="text-xl md:text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
            跑步机配速计算器
          </h1>

          <ThemeToggle />
        </div>

        {/* 主内容区：左右布局 (4:8) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左侧输入表单 */}
          <div className="lg:col-span-4">
            <TreadmillInputForm onCalculate={setResult} />
          </div>

          {/* 右侧结果展示 */}
          <div className="lg:col-span-8">
            <TreadmillResult result={result} />
          </div>
        </div>
      </div>
    </div>
  )
}
