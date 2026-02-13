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
    disabled: false,
    href: "/tools/hansons/race-equivalency"
  },
  {
    id: "race-equivalency-reverse",
    name: "反向计算器",
    description: "根据目标成绩推算当前需要达到的水平",
    icon: "ArrowLeft",
    slug: "race-equivalency-reverse",
    color: "#FF6B00",
    disabled: false,
    href: "/tools/hansons/race-equivalency-reverse"
  },
  {
    id: "improvement",
    name: "提升计算器",
    description: "根据当前成绩预测不同提升幅度后的目标时间",
    icon: "TrendingUp",
    slug: "improvement",
    color: "#00FFD4",
    disabled: false,
    href: "/tools/hansons/improvement"
  },
  {
    id: "treadmill",
    name: "跑步机计算器",
    description: "速度与坡度配速转换",
    icon: "Activity",
    slug: "treadmill",
    color: "#A78BFA",
    disabled: false,
    href: "/tools/hansons/treadmill"
  },
]

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
            汉森计算器集合
          </h1>

          <ThemeToggle />
        </div>

        {/* 2×2 网格卡片 */}
        <div className="grid md:grid-cols-2 gap-6">
          {calculatorCards.map((card) => {
            const IconComponent = Icons[card.icon as keyof typeof Icons] as React.ComponentType<{ className?: string; style?: React.CSSProperties }>

            if (card.disabled) {
              return (
                <div
                  key={card.id}
                  className="card group relative overflow-hidden opacity-60"
                  style={{ cursor: 'not-allowed', minHeight: '160px' }}
                >
                  {/* 左侧彩色装饰条 */}
                  <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: card.color }} />

                  <div className="flex items-center gap-5 h-full py-6">
                    {/* 图标 */}
                    <div className="p-4 rounded-xl flex-shrink-0" style={{ backgroundColor: card.color + '20' }}>
                      {IconComponent && <IconComponent className="w-8 h-8" style={{ color: card.color }} />}
                    </div>

                    {/* 内容 */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                        {card.name}
                      </h3>
                      <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                        {card.description}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                        即将推出...
                      </p>
                    </div>

                    {/* 右侧占位 */}
                    <div className="w-6" />
                  </div>
                </div>
              )
            }

            return (
              <Link
                key={card.id}
                href={card.href!}
                className="card group relative overflow-hidden cursor-pointer opacity-100 hover:shadow-card-hover transition-all duration-300"
                style={{ minHeight: '160px', textDecoration: 'none' }}
              >
                {/* 左侧彩色装饰条 */}
                <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: card.color }} />

                <div className="flex items-center gap-5 h-full py-6">
                  {/* 图标 */}
                  <div className="p-4 rounded-xl flex-shrink-0" style={{ backgroundColor: card.color + '20' }}>
                    {IconComponent && <IconComponent className="w-8 h-8" style={{ color: card.color }} />}
                  </div>

                  {/* 内容 */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                      {card.name}
                    </h3>
                    <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                      {card.description}
                    </p>
                    <p className="text-xs flex items-center gap-1" style={{ color: card.color }}>
                      <span>立即使用</span>
                      <Icons.ArrowRight className="w-3 h-3" />
                    </p>
                  </div>

                  {/* 右侧占位 */}
                  <div className="w-6" />
                </div>
              </Link>
            )
          })}
        </div>

        {/* 底部说明 */}
        <div className="mt-8 text-center card">
          <p style={{ color: 'var(--color-text-secondary)' }}>
            汉森计算器集合正在不断完善中，更多功能即将推出...
          </p>
        </div>
      </div>
    </div>
  )
}
