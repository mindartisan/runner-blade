"use client"

// VDOT 概述信息数据
const vdotInfoItems = [
  {
    id: "what",
    title: "VDOT 是什么",
    shortCode: "VDOT",
    color: "#28a745", // 绿色
    content: "VDOT（V̇O₂max）是衡量有氧能力的指标，由著名跑步教练 Jack Daniels 开发。它可以根据你的比赛成绩预测其他距离的表现，并计算科学的训练配速。",
  },
  {
    id: "science",
    title: "科学原理",
    shortCode: "Science",
    color: "#007bff", // 蓝色
    content: "基于 Jack Daniels 训练体系，通过你的比赛成绩计算 VO₂max，并根据运动生理学原理推导出各强度训练配速。该方法已被全球跑者验证超过 40 年。",
  },
  {
    id: "improve",
    title: "提升方法",
    shortCode: "Tips",
    color: "#ffc107", // 黄色
    content: "VDOT 旨在帮助跑步者以正确且高效的方式进行训练，从而在减少所需努力的同时获得最大的训练效果。这些高质量的训练计划有助于保证训练过程的健康、科学且有效，同时还能有效防止过度训练的情况发生。",
  },
]

export default function VDOTOverview() {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
        <div className="w-1 h-5 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
        VDOT 概述
      </h3>

      {vdotInfoItems.map((info) => (
        <div
          key={info.id}
          className="card relative overflow-hidden"
          style={{
            borderLeft: `3px solid ${info.color}`,
          }}
        >
          <div className="p-4">
            {/* 标题行 */}
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                {info.title}
              </h4>
              <span
                className="text-xs font-medium px-2 py-1 rounded"
                style={{
                  backgroundColor: `${info.color}20`,
                  color: info.color,
                }}
              >
                {info.shortCode}
              </span>
            </div>

            {/* 内容 */}
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              {info.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
