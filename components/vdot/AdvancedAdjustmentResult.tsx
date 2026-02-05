"use client"

import { AdvancedAdjustment, AdvancedDisplayMode } from "@/types"
import { formatTime, formatPace } from "@/lib/vdot-calculator"

interface AdvancedAdjustmentResultProps {
  adjustment: AdvancedAdjustment
  calculatedDistance: number
  advancedMode: 'temperature' | 'altitude' | 'off'
  displayMode?: AdvancedDisplayMode
  onReverseMode?: () => void
}

export default function AdvancedAdjustmentResult({
  adjustment,
  calculatedDistance,
  advancedMode,
  displayMode = 'effect',
  onReverseMode
}: AdvancedAdjustmentResultProps) {
  // 当高级选项关闭时不显示
  if (advancedMode === 'off') {
    return null
  }

  // 获取显示模式（优先使用 adjustment 中的模式，否则使用 props）
  const currentMode: AdvancedDisplayMode = adjustment.displayMode || displayMode

  // 根据模式获取标题标签
  const getTitleLabel = () => {
    const typeLabel = adjustment.temperature !== undefined ? "温度" : "海拔"
    return currentMode === 'effect' ? `${typeLabel}影响` : `${typeLabel}转换`
  }

  // 获取条件值显示
  const getConditionLabel = () => {
    if (adjustment.temperature !== undefined) {
      return `${adjustment.temperature}°${adjustment.temperatureUnit === 0 ? 'F' : 'C'}`
    }
    if (adjustment.altitude !== undefined) {
      return `${adjustment.altitude}${adjustment.altitudeUnit === 0 ? 'ft' : 'm'}`
    }
    return ''
  }

  // 获取模式标识
  const getModeBadge = () => {
    return currentMode === 'effect' ? '预期' : '推算'
  }

  // 获取配速差异显示
  const getPaceDiffDisplay = () => {
    const diffSeconds = Math.abs(adjustment.paceDiff)
    const sign = currentMode === 'effect' ? '+' : '-'
    const minutes = Math.floor(diffSeconds / 60)
    const seconds = Math.round(diffSeconds % 60)

    if (minutes > 0) {
      return `${sign}${minutes}:${seconds.toString().padStart(2, '0')}`
    }
    return `${sign}${seconds}`
  }

  // 根据显示模式获取要展示的值
  const getDisplayValues = () => {
    if (currentMode === 'effect') {
      // Effect 模式：显示预期（变慢）的结果
      return {
        label: '预期时间',
        time: adjustment.slowerTime,
        paceLabel: '预期配速',
        vdot: adjustment.slowerVdot,
        vdotColor: '#FF6B00',  // 霓虹橙（变慢）
        arrowDirection: '→'
      }
    } else {
      // Conversion 模式：显示推算（变快）的结果
      return {
        label: '推算时间',
        time: adjustment.fasterTime,
        paceLabel: '推算配速',
        vdot: adjustment.fasterVdot,
        vdotColor: '#00D4FF',  // 霓虹蓝（变快）
        arrowDirection: '←'
      }
    }
  }

  const displayValues = getDisplayValues()
  const displayPacePerKm = displayValues.time / (calculatedDistance / 1000)

  // 获取模式标识颜色
  const getModeBadgeColor = () => {
    return currentMode === 'effect'
      ? { bg: 'rgba(0, 212, 255, 0.15)', color: '#00D4FF' }  // 霓虹蓝
      : { bg: 'rgba(0, 255, 212, 0.15)', color: '#00FFD4' }  // 霓虹青
  }

  const modeBadgeColor = getModeBadgeColor()

  return (
    <div
      className="card mt-4 p-4 transition-all duration-300"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.1) 0%, rgba(0, 212, 255, 0.1) 100%)',
        border: '1px solid rgba(255, 107, 0, 0.3)',
      }}
    >
      <div className="space-y-3">
        {/* 标题行：类型标签 + 条件值 + 模式标识 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
              {getTitleLabel()}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{
              backgroundColor: 'rgba(255, 107, 0, 0.2)',
              color: '#FF6B00'
            }}>
              {getConditionLabel()}
            </span>
          </div>

          {/* 模式标识徽章 */}
          <span className="text-xs px-2 py-1 rounded" style={{
            backgroundColor: modeBadgeColor.bg,
            color: modeBadgeColor.color
          }}>
            {getModeBadge()}
          </span>
        </div>

        {/* 主要结果：时间 + 配速 */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span style={{ color: 'var(--color-text-tertiary)' }}>{displayValues.label}： </span>
            <span className="font-mono font-semibold" style={{ color: 'var(--color-primary)' }}>
              {formatTime(displayValues.time)}
            </span>
          </div>
          <div>
            <span style={{ color: 'var(--color-text-tertiary)' }}>{displayValues.paceLabel}： </span>
            <span className="font-mono" style={{ color: 'var(--color-primary)' }}>
              {formatPace(displayPacePerKm, "km")} ({getPaceDiffDisplay()}/km)
            </span>
          </div>
        </div>

        {/* VDOT 变化 */}
        <div className="flex items-center gap-3 text-xs pt-2 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <span style={{ color: 'var(--color-text-tertiary)' }}>
            VDOT: <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{adjustment.originalVdot.toFixed(1)}</span>
          </span>
          <span style={{ color: 'var(--color-text-tertiary)' }}>{displayValues.arrowDirection}</span>
          <span style={{ color: 'var(--color-text-tertiary)' }}>
            <span className="font-semibold" style={{ color: displayValues.vdotColor }}>
              {displayValues.vdot.toFixed(1)}
            </span>
          </span>
          <span className="ml-auto" style={{ color: displayValues.vdotColor }}>
            配速差异: {adjustment.paceDiff.toFixed(0)} 秒/公里
          </span>
        </div>

        {/* 反转按钮 */}
        {onReverseMode && (
          <button
            onClick={onReverseMode}
            className="w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(255, 107, 0, 0.1) 100%)',
              border: '1px solid rgba(255, 107, 0, 0.3)',
              color: 'var(--color-text-primary)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 107, 0, 0.3)'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            <span>切换模式</span>
            <span className="text-xs opacity-70">
              ({currentMode === 'effect' ? '影响 → 转换' : '转换 → 影响'})
            </span>
          </button>
        )}
      </div>
    </div>
  )
}
