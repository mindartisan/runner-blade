/**
 * 汉森提升计算器核心逻辑
 * 根据当前比赛成绩计算不同百分比提升后的预期成绩
 */

import type {ImprovementEntry, ImprovementPercentage, ImprovementResult} from "@/types"

// 提升百分比常量
export const IMPROVEMENT_PERCENTAGES: readonly ImprovementPercentage[] = [1, 2, 3, 4, 5, 7, 10] as const

/**
 * 计算提升后的成绩
 * @param originalSeconds 原始时间（秒）
 * @param percentage 提升百分比
 * @returns 提升后的时间（秒）
 */
export function calculateImprovedTime(
  originalSeconds: number,
  percentage: ImprovementPercentage
): number {
  return originalSeconds * (1 - percentage / 100)
}

/**
 * 格式化时间为 H:MM:SS 或 MM:SS 格式
 * @param seconds 时间（秒）
 * @returns 格式化的时间字符串
 */
export function formatImprovementTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

/**
 * 计算所有提升百分比的结果
 * @param hours 小时
 * @param minutes 分钟
 * @param seconds 秒
 * @returns 提升计算结果
 */
export function calculateImprovement(
  hours: number,
  minutes: number,
  seconds: number
): ImprovementResult {
  // 计算原始时间（秒）
  const originalTimeSeconds = hours * 3600 + minutes * 60 + seconds

  // 如果时间为 0，返回错误
  if (originalTimeSeconds <= 0) {
    throw new Error("请输入有效的时间")
  }

  // 计算所有提升百分比
  const improvements: ImprovementEntry[] = IMPROVEMENT_PERCENTAGES.map(percentage => {
    const improvedTimeSeconds = calculateImprovedTime(originalTimeSeconds, percentage)
    const timeSavedSeconds = originalTimeSeconds - improvedTimeSeconds

    return {
      percentage,
      improvedTimeSeconds,
      improvedTimeFormatted: formatImprovementTime(improvedTimeSeconds),
      timeSavedSeconds,
      timeSavedFormatted: formatImprovementTime(timeSavedSeconds),
    }
  })

  return {
    originalTimeSeconds,
    originalTimeFormatted: formatImprovementTime(originalTimeSeconds),
    improvements,
  }
}

/**
 * 获取百分比对应的颜色（用于可视化）
 * @param percentage 提升百分比
 * @returns 颜色值（十六进制）
 */
export function getPercentageColor(percentage: ImprovementPercentage): string {
  const colors: Record<ImprovementPercentage, string> = {
    1: '#00FFD4',   // 霓虹青
    2: '#00D4FF',   // 霓虹蓝
    3: '#4CAF50',   // 绿色
    4: '#FFC107',   // 黄色
    5: '#FF9800',   // 橙色
    7: '#FF6B00',   // 霓虹橙
    10: '#FF5252',  // 红色
  }
  return colors[percentage]
}
