"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { ThemeMode, ThemeConfig, ActualThemeMode, getTheme, applyTheme, getThemeByTime, getThemeByTimeAsync } from '@/lib/theme'

interface ThemeContextType {
  mode: ThemeMode
  actualMode: ActualThemeMode  // 实际应用的主题（auto 模式下根据时间决定）
  theme: ThemeConfig
  setMode: (mode: ThemeMode) => void
  toggleTheme: () => void
  isLoadingSunTime: boolean  // 是否正在加载日出日落时间
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // 从 localStorage 读取主题，默认为夜间模式
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') as ThemeMode
      return saved && (saved === 'light' || saved === 'dark' || saved === 'auto') ? saved : 'dark'
    }
    return 'dark'
  })

  // 计算实际应用的主题模式
  const getActualMode = (): ActualThemeMode => {
    if (mode === 'auto') {
      return getThemeByTime()
    }
    return mode
  }

  const [actualMode, setActualMode] = useState<ActualThemeMode>(getActualMode())
  const [isLoadingSunTime, setIsLoadingSunTime] = useState(false)
  const theme = getTheme(mode)
  const [hasLoadedSunTime, setHasLoadedSunTime] = useState(false)

  // 设置主题
  const setMode = (newMode: ThemeMode) => {
    const previousMode = mode
    setModeState(newMode)
    localStorage.setItem('theme', newMode)

    // 立即更新实际模式
    if (newMode === 'auto') {
      setActualMode(getThemeByTime())
      // 仅当用户主动切换到 auto 模式时，才请求位置权限
      if (previousMode !== 'auto' && !hasLoadedSunTime) {
        loadSunTime()
        setHasLoadedSunTime(true)
      }
    } else {
      setActualMode(newMode)
    }
  }

  // 加载日出日落时间并更新主题
  const loadSunTime = async () => {
    setIsLoadingSunTime(true)
    try {
      const preciseMode = await getThemeByTimeAsync()
      setActualMode(preciseMode)
    } finally {
      setIsLoadingSunTime(false)
    }
  }

  // 切换主题（auto -> light -> dark -> auto）
  const toggleTheme = () => {
    const modes: ThemeMode[] = ['auto', 'light', 'dark']
    const currentIndex = modes.indexOf(mode)
    const nextMode = modes[(currentIndex + 1) % modes.length]
    setMode(nextMode)
  }

  // 应用主题到 DOM
  useEffect(() => {
    applyTheme(theme)

    // 设置 body 的 data-theme 属性，用于 CSS 选择器
    document.body.dataset.theme = actualMode
  }, [theme, actualMode])

  // 初始化时，不自动请求位置权限（仅使用默认时间规则）
  // 只有用户主动切换到 auto 模式时才请求权限
  useEffect(() => {
    // 移除自动加载逻辑，由用户主动切换时触发
  }, [])

  // 监听时间变化，在 auto 模式下更新主题
  useEffect(() => {
    if (mode !== 'auto') return

    // 每分钟检查一次时间
    const interval = setInterval(async () => {
      const preciseMode = await getThemeByTimeAsync()
      if (preciseMode !== actualMode) {
        setActualMode(preciseMode)
      }
    }, 60000) // 60秒

    return () => clearInterval(interval)
  }, [mode, actualMode])

  return (
    <ThemeContext.Provider value={{ mode, actualMode, theme, setMode, toggleTheme, isLoadingSunTime }}>
      {children}
    </ThemeContext.Provider>
  )
}

// 使用主题的 hook
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
