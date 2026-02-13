"use client"

import Link from "next/link"
import * as Icons from "lucide-react"
import ThemeToggle from "@/components/ThemeToggle"
import TrainingIntensityCard, { type TrainingIntensity } from "./TrainingIntensityCard"

// 7 种训练强度定义（基于 V.O2 Training Definitions - Dr. Jack Daniels）
const trainingIntensities: TrainingIntensity[] = [
  {
    id: "easy",
    name: "轻松跑",
    englishName: "Easy Pace",
    shortCode: "E",
    color: "#28a745",
    description: `轻松跑是因为当前体能状态或地形天气条件而以非常慢的配速进行的跑步。把轻松跑理解为「可以交谈」的强度，意味着你可以在整个跑步过程中与朋友进行正常对话。轻松跑能很好地强化心肌，并改善跑步肌纤维为工作中的肌肉提供能量的能力。

相对于 100% 的最大努力，轻松跑在 60-80% 努力范围内（有些日子或新手跑者低于 60% 也可以）。轻松跑包括热身、恢复跑、轻松日跑步和长跑。长跑不要超过周跑量的 25-30% 或 150 分钟（取较小值）。`,
    videoId: "veAQ73OJdwY",
  },
  {
    id: "marathon",
    name: "马拉松配速",
    englishName: "Marathon Pace",
    shortCode: "M",
    color: "#007bff",
    description: `马拉松跑是等于你在即将到来的马拉松比赛中预期保持的跑步速度的强度。最好等到训练计划进行到后期，确保你已经准备好进行真正的马拉松跑。记住，跑步速度可能因地形和天气变化而与工作负荷有所不同。马拉松配速通常在约 75-85% 努力程度。马拉松跑的最大持续时间是周跑量的 20% 或 18 英里（取较小值）。`,
    videoId: "EO1hQ_kplgo",
  },
  {
    id: "threshold",
    name: "乳酸阈值",
    englishName: "Threshold Pace",
    shortCode: "T",
    color: "#ffc107",
    description: `阈值跑是进行稳态跑或巡航间歇（通常是重复 1 英里 T 配速努力，工作段落之间有短暂休息）的强度。适当强度约 83-88% 努力，是在理想比赛条件下可以跑约 1 小时的强度。记住，阈值跑的速度可能在丘陵地形或风条件下变化，过度努力并不比以真实配速进行更好。阈值跑的目的是提高耐力（身体清除血乳酸的能力）。一般来说，20 分钟稳定的阈值跑足够，或一次训练总共约 10% 的周跑量（高跑量跑者可以更多）。`,
    videoId: "dxJVtPT6rHo",
  },
  {
    id: "interval",
    name: "间歇跑",
    englishName: "Interval Pace",
    shortCode: "I",
    color: "#fd7e14",
    description: `间歇跑涉及交替的艰苦和轻松工作段落。I 训练改善有氧能力，所以强度应该是「艰苦」的，但不应超过与 VO₂max 相关的工作负荷。VO₂max 对应需要约 10-12 分钟努力的跑速。每个工作段持续 1-5 分钟，主动恢复时间等于或略短于前面的工作段（例如 3 分钟间歇、2 分钟休息）。间歇训练同时挑战和改善中心因素（氧气输送）和周围因素（输送氧气的利用），为运动肌肉提供能量。一次间歇训练的总跑量不应超过周跑量的 8% 或 10K（取较小值）。`,
    videoId: "7dQEwJhHWXk",
  },
  {
    id: "repetition",
    name: "重复跑",
    englishName: "Rep Pace",
    shortCode: "R",
    color: "#dc3545",
    description: `重复跑涉及重复相对短（最多 2 分钟）的工作段，配速约为 1500 米或 1 英里比赛速度，每个工作段后有充分恢复的感觉。重复训练的主要目的是提高速度和跑步经济性，因此肌肉需要充分恢复才能以经济的方式跑步。一次训练中，重复配速的跑量限制在周跑量的 5% 或 5 英里（取较小值）。`,
    videoId: "BGQKlSU4HQM",
  },
  {
    id: "fastRep",
    name: "快速重复",
    englishName: "Fast Reps Pace",
    shortCode: "F",
    color: "#6f42c1",
    description: `快速重复跑是重复训练的更快版本，主要适合经常参加 800 米比赛的跑者——包括专注于 400 米和 800 米比赛的运动员，以及主要参加 800 米和 1500 米/英里距离的选手。FR 跑的速度等于当前 800 米比赛的速度，但不超过未来预期的 800 米比赛速度。FR 跑的好处是在更快速度下提高经济性，同时对身体的无氧功能施加压力。FR 配速应该比通常的重复配速每 200 米快约 3 秒，每次 FR 不超过 60 秒（精英 800 米跑者可达 90 秒）。每次 FR 后需要充分恢复。一次训练中 FR 跑的总量不超过周跑量的 2%、7 分钟或 3000 米（取较小值）。`,
    videoId: null,
  },
  {
    id: "strides",
    name: "加速跑",
    englishName: "Strides",
    shortCode: "ST",
    color: "#fd7e14",
    description: `Strides 是每次持续约 20 秒的跑步，以接近重复配速跑步的主观感觉进行。每次之间至少休息 60 秒，或足够时间感觉轻盈、快速和放松。Strides 不是冲刺，而是旨在帮助提高经济性和辅助恢复过程。

Strides 通常与高质量训练或比赛前的热身相关联。每次限制在约 15-20 秒并在每次更快跑步后充分恢复。也可以在轻松跑的中间或结束时添加一组 Strides，以及在马拉松、间歇和阈值训练后的冷身期间添加。实际上，在阈值训练结束后添加一些完整的重复跑是好的，但至少添加一些 Strides。`,
    videoId: null,
  },
]

// 工具入口卡片
const toolCards = [
  {
    id: "vdot",
    name: "VDOT 计算器",
    description: "根据比赛成绩计算 VDOT 分数和训练配速",
    icon: "Calculator",
    color: "#00D4FF",
    href: "/tools/jack-daniels/vdot",
  },
]

/**
 * 杰克·丹尼尔斯训练体系介绍页面
 * 展示 VDOT 系统简介、训练强度定义和工具入口
 */
export default function DanielsDashboard() {
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
            杰克·丹尼尔斯训练体系
          </h1>

          <ThemeToggle />
        </div>

        {/* 简介卡片 */}
        <div className="card mb-8">
          <div className="flex items-start gap-4">
            <div
              className="p-3 rounded-xl flex-shrink-0"
              style={{ backgroundColor: 'rgba(0, 212, 255, 0.15)' }}
            >
              <Icons.BookOpen className="w-6 h-6" style={{ color: '#00D4FF' }} />
            </div>
            <div>
              <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                关于 Jack Daniels 训练法
              </h2>
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                Jack Daniels 博士是著名的运动生理学家和跑步教练，其著作{" "}
                <strong style={{ color: 'var(--color-primary)' }}>《Daniels&apos; Running Formula》</strong>{" "}
                被公认为跑步训练的权威指南。
                <strong style={{ color: 'var(--color-primary)' }}> VDOT（V̇O₂max）</strong>{" "}
                系统是他最著名的贡献之一，通过科学的 VO₂max 计算方法，帮助跑者确定精确的训练配速区间。
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                我们经常讨论不同的跑步速度或强度，了解不同强度对身体造成的压力程度以及如何提高表现是非常有必要的。以下是 V.O2 应用程序中内置的不同跑步强度及其设计目的。
              </p>
            </div>
          </div>
        </div>

        {/* 训练强度定义区 */}
        <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
          <div className="w-1 h-5 rounded-full" style={{ backgroundColor: '#00D4FF' }} />
          训练强度定义
        </h3>

        <div className="flex flex-col gap-4 mb-8">
          {trainingIntensities.map((training) => (
            <TrainingIntensityCard key={training.id} training={training} />
          ))}
        </div>

        {/* 工具入口区 */}
        <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
          <div className="w-1 h-5 rounded-full" style={{ backgroundColor: '#00D4FF' }} />
          训练工具
        </h3>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {toolCards.map((card) => {
            const IconComponent = Icons[card.icon as keyof typeof Icons] as React.ComponentType<{
              className?: string
              style?: React.CSSProperties
            }>

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
        <div className="text-center">
          <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            内容来源：
            <a
              href="https://vdoto2.com/learn-more/training-definitions"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline ml-1"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              V.O2 Training Definitions
            </a>
            {" "}| 原作者：{" "}
            <a
              href="https://news.vdoto2.com/coach-dr-jack-daniels/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Dr. Jack Daniels
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
