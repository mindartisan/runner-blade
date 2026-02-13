"use client"

import { useState } from "react"
import { ChevronDown, Play } from "lucide-react"

export interface TrainingIntensity {
  id: string
  name: string
  englishName: string
  shortCode: string
  color: string
  description: string
  videoId: string | null
}

interface TrainingIntensityCardProps {
  training: TrainingIntensity
}

/**
 * 训练强度卡片组件
 * 可展开/收起的折叠卡片，支持 YouTube 视频嵌入
 */
export default function TrainingIntensityCard({ training }: TrainingIntensityCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      className="card relative overflow-hidden transition-all duration-300"
      style={{
        borderLeft: `3px solid ${training.color}`,
      }}
    >
      {/* 标题栏 - 可点击展开/收起 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full py-2.5 px-3 text-left flex items-center justify-between"
        style={{ cursor: 'pointer' }}
      >
        <div className="flex items-center gap-3">
          {/* 短码徽章 */}
          <span
            className="text-xs font-bold px-2 py-0.5 rounded min-w-[28px] text-center"
            style={{
              backgroundColor: `${training.color}20`,
              color: training.color,
            }}
          >
            {training.shortCode}
          </span>
          <div>
            <h4 className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>
              {training.name}
            </h4>
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              {training.englishName}
            </p>
          </div>
        </div>

        {/* 展开箭头 */}
        <ChevronDown
          className="w-4 h-4 transition-transform duration-300"
          style={{
            color: 'var(--color-text-tertiary)',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {/* 展开内容 */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* 描述内容 */}
          <p
            className="text-sm leading-relaxed whitespace-pre-line"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {training.description}
          </p>

          {/* 视频区域 */}
          {training.videoId ? (
            <div className="relative rounded-lg overflow-hidden" style={{ paddingTop: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${training.videoId}`}
                title={`${training.name} - Jack Daniels Training`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div
              className="flex items-center justify-center py-8 rounded-lg"
              style={{ backgroundColor: 'var(--color-background-secondary)' }}
            >
              <div className="text-center">
                <Play
                  className="w-8 h-8 mx-auto mb-2 opacity-30"
                  style={{ color: 'var(--color-text-tertiary)' }}
                />
                <p
                  className="text-xs"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  暂无视频
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
