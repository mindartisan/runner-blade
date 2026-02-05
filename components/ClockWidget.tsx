"use client"

import { useEffect, useState } from "react"

export default function ClockWidget() {
  const [time, setTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString("zh-CN", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-64 h-64">
      {/* 外层边框 */}
      <div className="absolute inset-0 rounded-full shadow-card" style={{ background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-background-secondary) 100%)' }}>
        {/* 内层表面 */}
        <div className="absolute inset-2 rounded-full" style={{ background: 'var(--color-background)', boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.2)' }}>
          {/* 数字显示屏区域 */}
          <div className="absolute inset-4 rounded-full flex items-center justify-center" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            {/* 刻度装饰 */}
            <div className="absolute inset-0">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-sm"
                  style={{
                    width: '2px',
                    height: '6px',
                    backgroundColor: 'var(--color-text-tertiary)',
                    top: '8px',
                    left: '50%',
                    transformOrigin: '50% 120px',
                    transform: `rotate(${i * 30}deg) translateX(-50%)`,
                  }}
                />
              ))}
            </div>

            {/* 时间显示 */}
            <div className="text-center">
              <div className="relative inline-block">
                {/* 数字发光效果 */}
                <div className="absolute inset-0 blur-lg -z-10" style={{ backgroundColor: 'var(--color-primary)', opacity: 0.15 }} />
                <span className="text-4xl md:text-5xl font-bold font-mono tracking-wider relative z-10" style={{ color: 'var(--color-primary)' }}>
                  {time}
                </span>
              </div>
              {/* 秒表标签 */}
              <div className="mt-2 flex items-center justify-center gap-1">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-secondary)' }} />
                <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>
                  RunnerBlade
                </span>
              </div>
            </div>

            {/* 玻璃反光效果 */}
            <div className="absolute inset-0 rounded-full pointer-events-none"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
