"use client"

import { useTheme } from '@/contexts/ThemeContext'
import { Sun, Moon, SunMoon } from 'lucide-react'

export default function ThemeToggle() {
  const { mode, actualMode, toggleTheme } = useTheme()

  // 获取当前模式的显示信息
  const getModeInfo = () => {
    switch (mode) {
      case 'auto':
        return {
          icon: <SunMoon className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />,
          label: '自动模式',
          background: 'radial-gradient(circle, rgba(0,255,212,0.15) 0%, transparent 70%)',
          indicator: 'var(--color-accent)',
          ariaLabel: `切换到白天模式（当前：${actualMode === 'dark' ? '夜间' : '白天'}）`
        }
      case 'light':
        return {
          icon: <Sun className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />,
          label: '白天模式',
          background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)',
          indicator: 'var(--color-primary)',
          ariaLabel: '切换到夜间模式'
        }
      case 'dark':
        return {
          icon: <Moon className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />,
          label: '夜间模式',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          indicator: 'var(--color-secondary)',
          ariaLabel: '切换到自动模式'
        }
    }
  }

  const modeInfo = getModeInfo()

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-xl border transition-all duration-300 hover:scale-105"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
      aria-label={modeInfo.ariaLabel}
      title={modeInfo.label}
    >
      {/* 背景光晕 */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{ background: modeInfo.background }}
      />

      {/* 图标容器 */}
      <div className="relative z-10 flex items-center justify-center">
        {modeInfo.icon}
      </div>

      {/* 激活指示器 */}
      <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full transition-all duration-300"
        style={{ backgroundColor: modeInfo.indicator }}
      />
    </button>
  )
}
