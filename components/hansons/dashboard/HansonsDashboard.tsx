"use client"

import Link from "next/link"
import * as Icons from "lucide-react"
import ThemeToggle from "@/components/ThemeToggle"

const calculatorCards = [
  {
    id: "race-equivalency",
    name: "比赛等效计算器",
    description: "根据比赛成绩计算训练配速和等效成绩",
    icon: "Timer",
    slug: "race-equivalency",
    color: "#00D4FF",
    href: "/tools/hansons/race-equivalency"
  },
  {
    id: "race-equivalency-reverse",
    name: "反向计算器",
    description: "根据目标成绩推算当前需要达到的水平",
    icon: "ArrowLeft",
    slug: "race-equivalency-reverse",
    color: "#FF6B00",
    href: "/tools/hansons/race-equivalency-reverse"
  },
  {
    id: "improvement",
    name: "提升计算器",
    description: "根据当前成绩预测不同提升幅度后的目标时间",
    icon: "TrendingUp",
    slug: "improvement",
    color: "#00FFD4",
    href: "/tools/hansons/improvement"
  },
  {
    id: "treadmill",
    name: "跑步机计算器",
    description: "速度与坡度配速转换",
    icon: "Activity",
    slug: "treadmill",
    color: "#A78BFA",
    href: "/tools/hansons/treadmill"
  },
]

/**
 * 汉森训练体系介绍页面
 * 展示汉森训练方法简介和工具入口
 */
export default function HansonsDashboard() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 transition-colors duration-200"
            style={{ color: 'var(--color-text-secondary)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-secondary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
          >
            <Icons.ArrowLeft className="w-5 h-5" />
            返回首页
          </Link>

          <h1 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            汉森训练体系
          </h1>

          <ThemeToggle />
        </div>

        {/* 汉森训练体系简介 */}
        <div className="card mb-8">
          <div className="flex items-start gap-4">
            <div
              className="p-3 rounded-xl flex-shrink-0"
              style={{ backgroundColor: 'rgba(167, 139, 250, 0.15)' }}
            >
              <Icons.BookOpen className="w-6 h-6" style={{ color: '#A78BFA' }} />
            </div>
            <div>
              <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                关于汉森训练法
              </h2>
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                汉森训练法（Hansons Method）由 Kevin 和 Keith Hanson 兄弟创立，
                是汉森-布鲁克斯长跑项目的核心训练体系。该方法强调{" "}
                <strong style={{ color: 'var(--color-primary)' }}>累积性疲劳</strong> 的概念，
                通过科学的训练配速和周期化安排，帮助跑者在比赛日达到最佳状态。
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                以下工具基于汉森训练体系开发，可帮助你制定科学的训练计划。
              </p>
            </div>
          </div>
        </div>

        {/* 工具卡片网格 */}
        <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
          <div className="w-1 h-5 rounded-full" style={{ backgroundColor: '#A78BFA' }} />
          训练工具
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          {calculatorCards.map((card) => {
            const IconComponent = Icons[card.icon as keyof typeof Icons] as React.ComponentType<{ className?: string; style?: React.CSSProperties }>

            return (
              <Link
                key={card.id}
                href={card.href}
                className="card group relative overflow-hidden cursor-pointer opacity-100 hover:shadow-card-hover transition-all duration-300"
                style={{ minHeight: '140px', textDecoration: 'none' }}
              >
                {/* 左侧彩色装饰条 */}
                <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: card.color }} />

                <div className="flex items-center gap-5 h-full py-5">
                  {/* 图标 */}
                  <div className="p-4 rounded-xl flex-shrink-0" style={{ backgroundColor: card.color + '20' }}>
                    {IconComponent && <IconComponent className="w-7 h-7" style={{ color: card.color }} />}
                  </div>

                  {/* 内容 */}
                  <div className="flex-1">
                    <h3 className="text-base font-bold mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
                      {card.name}
                    </h3>
                    <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                      {card.description}
                    </p>
                    <p className="text-xs flex items-center gap-1" style={{ color: card.color }}>
                      <span>立即使用</span>
                      <Icons.ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* 底部资源链接 */}
        <div className="mt-8 text-center">
          <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            数据来源：
            <a
              href="https://lukehumphreyrunning.com/hmmcalculator/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline ml-1"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Luke Humphrey Running
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
