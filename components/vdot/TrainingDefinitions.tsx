"use client"

// 训练类型定义数据（基于 Jack Daniels Running Formula）
const trainingTypes = [
  {
    id: "easy",
    name: "轻松跑",
    englishName: "Easy Pace",
    shortCode: "E",
    variety: "轻松跑包括热身、放松跑、恢复跑、训练内的恢复跑以及一般长跑",
    intensity: "通常来说，轻松跑是一种舒适、可以交谈的配速。这肯定会根据你当天的感觉、所面对的天气和地形而有所不同。与指定配速相比，你可能在某天每英里慢 20 秒或快 20 秒。强度通常在 VO₂max 的 59-74% 或 HRmax 的 65-79% 范围内",
    purpose: "以轻松配速跑步能促进建立稳固基础的生理效益，从而可以进行更高强度的训练。心肌得到强化，正在锻炼的肌肉获得增加的血液供应，并提高其处理通过心血管系统输送的氧气的能力",
    sampleWorkout: "30-45 分钟 E",
    color: "#28a745",
  },
  {
    id: "marathon",
    name: "马拉松配速",
    englishName: "Marathon Pace",
    shortCode: "M",
    variety: "稳定跑或长重复跑",
    intensity: "强度通常在 VO₂max 的 75-84% 或 HRmax 的 80-90% 范围内",
    purpose: "用于为马拉松训练的人体验比赛配速条件，或者简单地作为初学者在长跑日轻松跑的替代方案",
    sampleWorkout: "10 分钟 E，60-90 分钟 M",
    color: "#007bff",
  },
  {
    id: "interval",
    name: "间歇跑",
    englishName: "Interval Pace",
    shortCode: "I",
    variety: "VO₂max 间歇跑",
    intensity: "间歇跑是\"艰苦\"的，但绝不是全速跑。间歇跑的配速类似于你在严肃比赛中能保持大约 10-12 分钟的配速。如果每次跑步持续 3 到 5 分钟（800 米和 1000 米的训练段很常见），慢跑恢复的持续时间最好与跑步时长相似（不一定相等）。如果训练要求\"艰苦\"跑，那么凭感觉保守地想象 5 公里比赛配速作为每次跑步的强度。强度通常在 VO₂max 的 97-100% 或 HRmax 的 98-100% 范围内",
    purpose: "给你的有氧能力（VO₂max）施加压力。在正确的间歇强度下，大约需要两分钟才能调整到以 VO₂max 运作，因此\"间歇\"的理想持续时间是每次 3-5 分钟，以确保在期望强度下的适当时间。不超过 5 分钟的原因是防止过多的无氧参与，这可能导致血液乳酸浓度过高并破坏训练的目的",
    sampleWorkout: "6 × 2 分钟 I（1 分钟慢跑），5 × 3 分钟 I（2 分钟慢跑），4 × 4 分钟 I（3 分钟慢跑）",
    color: "#fd7e14",
  },
  {
    id: "threshold",
    name: "乳酸阈值",
    englishName: "Threshold Pace",
    shortCode: "T",
    variety: "稳定、长距离或节奏跑，或间歇跑（也称为巡航间歇）",
    intensity: "阈值配速是舒适艰苦的跑步，可以进行稳定的 3-4 英里（或 5 到 6 公里）或重复的 5 到 15 分钟跑步，每次跑步之间休息 1 到 3 分钟。强度通常在 VO₂max 的 83-88% 或 HRmax 的 88-92% 范围内",
    purpose: "提高耐力",
    sampleWorkout: "3 × 1 英里 T（1 分钟）或 20 分钟 T",
    color: "#ffc107",
  },
  {
    id: "repetition",
    name: "重复跑",
    englishName: "Rep Pace",
    shortCode: "R",
    variety: "配速重复跑和加速跑",
    intensity: "重复跑是快速的，但不一定\"艰苦\"，因为训练段相对较短，并且随后有相对较长的恢复时间。恢复时间应该足够长，以至于每次跑步感觉不比前一次更困难，因为重复跑的目的是提高速度和经济性，如果你不能以放松的姿势跑步，你就无法变得更快（或更经济）。如果 400 米重复跑之间需要 3 分钟恢复，那么这就是所需要的。减少个人训练段之间的休息时间并不会带来更好的训练，事实上它可能会使训练更差，因为短暂的休息可能会增加压力并导致经济性下降。将重复跑想象为类似于当前的 1500 米或英里比赛配速",
    purpose: "提高你的速度和经济性",
    sampleWorkout: "8 × 200m R（200m 慢跑）或 4 × 400m R（400m 慢跑）",
    color: "#dc3545",
  },
  {
    id: "fastRep",
    name: "快速重复",
    englishName: "Fast Reps Pace",
    shortCode: "F",
    variety: "800 米比赛配速重复跑",
    intensity: "最好想象你在 800 米比赛中投入的努力，但不要快于与你最近 800 米时间相关的配速。最好在跑道上进行快速重复跑，因为可以仔细监控速度。大多数快速重复跑将是 200 米、300 米或 400 米，对于精英跑者来说可能长达 600 米。不要让个人训练段持续时间超过 90 秒，并且快速重复跑之间的恢复时间应该是轻松慢跑，直到你感觉完全恢复",
    purpose: "提高速度，给无氧能力施加压力，并学习 800 米比赛配速的感觉",
    sampleWorkout: "600m R（5 分钟慢跑），2 × 400m F（4 分钟慢跑），600m F（5 分钟慢跑），2 × 300m F（3 分钟慢跑），4 × 200m R（200m 慢跑）",
    color: "#6f42c1",
  },
]

export default function TrainingDefinitions() {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
        <div className="w-1 h-5 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
        训练类型定义
      </h3>

      {trainingTypes.map((type) => (
        <div
          key={type.id}
          className="card relative overflow-hidden"
          style={{
            borderLeft: `3px solid ${type.color}`,
          }}
        >
          <div className="p-4">
            {/* 标题行 */}
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                {type.name} ({type.shortCode})
              </h4>
              <span
                className="text-xs font-medium px-2 py-1 rounded"
                style={{
                  backgroundColor: `${type.color}20`,
                  color: type.color,
                }}
              >
                {type.englishName}
              </span>
            </div>

            {/* 详细信息 */}
            <div className="space-y-2">
              {/* Variety（训练变化） */}
              {type.variety && (
                <div className="flex items-start gap-2">
                  <span className="text-xs font-semibold min-w-[60px]" style={{ color: 'var(--color-text-tertiary)' }}>
                    变化
                  </span>
                  <span className="text-xs flex-1" style={{ color: 'var(--color-text-secondary)' }}>
                    {type.variety}
                  </span>
                </div>
              )}

              {/* Intensity（强度） */}
              {type.intensity && (
                <div className="flex items-start gap-2">
                  <span className="text-xs font-semibold min-w-[60px]" style={{ color: 'var(--color-text-tertiary)' }}>
                    强度
                  </span>
                  <span className="text-xs flex-1" style={{ color: 'var(--color-text-secondary)' }}>
                    {type.intensity}
                  </span>
                </div>
              )}

              {/* Purpose（训练目的） */}
              <div className="flex items-start gap-2">
                <span className="text-xs font-semibold min-w-[60px]" style={{ color: 'var(--color-text-tertiary)' }}>
                  目的
                </span>
                <span className="text-xs flex-1" style={{ color: 'var(--color-text-secondary)' }}>
                  {type.purpose}
                </span>
              </div>

              {/* Sample Workout（训练示例） */}
              <div className="flex items-start gap-2">
                <span className="text-xs font-semibold min-w-[60px]" style={{ color: 'var(--color-text-tertiary)' }}>
                  示例
                </span>
                <span
                  className="text-xs flex-1 font-mono"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {type.sampleWorkout}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
