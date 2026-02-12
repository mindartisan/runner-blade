/**
 * 主题配置
 * 确保白天和夜间主题下所有文字都清晰可读
 */

export type ThemeMode = 'light' | 'dark' | 'auto'

// 实际的主题配置类型（不含 auto）
export type ActualThemeMode = 'light' | 'dark'

export interface ThemeConfig {
  name: string
  colors: {
    // 背景色
    background: string
    backgroundSecondary: string
    surface: string

    // 文字色
    textPrimary: string
    textSecondary: string
    textTertiary: string

    // 主题色
    primary: string
    secondary: string
    accent: string

    // 边框
    border: string
    borderLight: string
  }
  shadows: {
    card: string
    cardHover: string
    button: string
  }
}

export const themes: Record<ActualThemeMode, ThemeConfig> = {
  // 白天主题 - 清晰易读
  light: {
    name: '白天模式',
    colors: {
      background: '#F8FAFC',      // slate-50
      backgroundSecondary: '#F1F5F9', // slate-100
      surface: '#FFFFFF',         // white

      textPrimary: '#1E293B',     // slate-800 - 深色文字
      textSecondary: '#475569',   // slate-600 - 中等对比度
      textTertiary: '#94A3B8',    // slate-400 - 辅助文字

      primary: '#0EA5E9',         // sky-500 - 天蓝色
      secondary: '#F97316',       // orange-500 - 橙色
      accent: '#06B6D4',          // cyan-500 - 青色

      border: '#E2E8F0',          // slate-200
      borderLight: '#F1F5F9',     // slate-100
    },
    shadows: {
      card: '0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)',
      cardHover: '0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06)',
      button: '0 4px 12px rgba(14, 165, 233, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
    },
  },

  // 夜间主题 - 不刺眼
  dark: {
    name: '夜间模式',
    colors: {
      background: '#0A1628',      // 深空蓝
      backgroundSecondary: '#0D1F35', // 稍浅的背景
      surface: '#122542',         // 卡片表面

      textPrimary: '#FFFFFF',     // 纯白
      textSecondary: '#94A3B8',   // slate-400 - 高对比度
      textTertiary: '#64748B',    // slate-500 - 辅助文字

      primary: '#00D4FF',         // 霓虹蓝
      secondary: '#FF6B00',       // 霓虹橙
      accent: '#00FFD4',          // 霓虹青

      border: 'rgba(255, 255, 255, 0.15)',
      borderLight: 'rgba(255, 255, 255, 0.08)',
    },
    shadows: {
      card: '0 4px 16px rgba(0, 0, 0, 0.4), 0 1px 4px rgba(0, 0, 0, 0.3)',
      cardHover: '0 8px 32px rgba(0, 212, 255, 0.15), 0 2px 8px rgba(0, 0, 0, 0.4)',
      button: '0 4px 12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
    },
  },
}

// 日出日落时间缓存
let sunriseSunsetCache: { sunrise: Date; sunset: Date; date: string } | null = null

// 获取用户位置的日出日落时间
async function getSunriseSunset(): Promise<{ sunrise: Date; sunset: Date } | null> {
  try {
    // 获取用户位置
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'))
        return
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 10000,
        maximumAge: 3600000, // 缓存 1 小时
      })
    })

    const { latitude, longitude } = position.coords

    // 检查缓存（同一天的数据可以使用缓存）
    const today = new Date().toDateString()
    if (sunriseSunsetCache && sunriseSunsetCache.date === today) {
      return sunriseSunsetCache
    }

    // 调用日出日落 API (sunrise-sunset.org)
    const response = await fetch(
      `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`
    )
    const data = await response.json()

    if (data.status === 'OK') {
      const sunrise = new Date(data.results.sunrise)
      const sunset = new Date(data.results.sunset)

      // 缓存结果
      sunriseSunsetCache = { sunrise, sunset, date: today }
      return { sunrise, sunset }
    }
  } catch (error) {
    console.warn('Failed to get sunrise/sunset time, falling back to default time:', error)
  }

  // 失败时回退到默认时间 6:00-18:00
  return null
}

// 根据日出日落时间获取实际的主题模式（异步）
export async function getThemeByTimeAsync(): Promise<ActualThemeMode> {
  const now = new Date()

  // 尝试获取日出日落时间
  const sunTimes = await getSunriseSunset()

  if (sunTimes) {
    // 使用实际的日出日落时间
    return now >= sunTimes.sunrise && now < sunTimes.sunset ? 'light' : 'dark'
  }

  // 回退到默认时间（6:00-18:00 为白天）
  const hour = now.getHours()
  return hour >= 6 && hour < 18 ? 'light' : 'dark'
}

// 根据时间获取实际的主题模式（同步版本，用于初始化）
export function getThemeByTime(): ActualThemeMode {
  const hour = new Date().getHours()
  // 默认 6:00-18:00 为白天模式，实际会通过异步更新
  return hour >= 6 && hour < 18 ? 'light' : 'dark'
}

// 获取当前主题（处理 auto 模式）
export function getTheme(mode: ThemeMode): ThemeConfig {
  if (mode === 'auto') {
    return themes[getThemeByTime()]
  }
  return themes[mode]
}

// 应用主题到 CSS 变量
export function applyTheme(theme: ThemeConfig) {
  const root = document.documentElement

  root.style.setProperty('--color-background', theme.colors.background)
  root.style.setProperty('--color-background-secondary', theme.colors.backgroundSecondary)
  root.style.setProperty('--color-surface', theme.colors.surface)
  root.style.setProperty('--color-text-primary', theme.colors.textPrimary)
  root.style.setProperty('--color-text-secondary', theme.colors.textSecondary)
  root.style.setProperty('--color-text-tertiary', theme.colors.textTertiary)
  root.style.setProperty('--color-primary', theme.colors.primary)
  root.style.setProperty('--color-secondary', theme.colors.secondary)
  root.style.setProperty('--color-accent', theme.colors.accent)
  root.style.setProperty('--color-border', theme.colors.border)
  root.style.setProperty('--color-border-light', theme.colors.borderLight)
  root.style.setProperty('--shadow-card', theme.shadows.card)
  root.style.setProperty('--shadow-card-hover', theme.shadows.cardHover)
  root.style.setProperty('--shadow-button', theme.shadows.button)
}
