// VDOT 计算器类型定义

export interface PaceRange {
  slow: number
  fast: number
  unit: string  // 'km' 或 'mi'
}

export interface TrainingPaces {
  easy: PaceRange
  marathon: PaceRange
  interval: PaceRange
  threshold: PaceRange
  rep: PaceRange
  fastRep: PaceRange
}

export interface EquivalentPerformance {
  distance: string
  distanceMeters: number
  time: number
  pacePerKm: number
  pacePerMile: number
}

export interface VDOTResult {
  vdot: number
  trainingPaces: TrainingPaces
  equivalentPerformances: EquivalentPerformance[]
  racePaceBreakdown?: RacePaceBreakdown  // 用户输入距离的配速细分
}

// 用户输入距离的配速细分
export interface RacePaceBreakdown {
  distance: string        // 距离标签（如 "Marathon"）
  distanceMeters: number  // 距离（米）
  totalTime: number       // 完赛时间（秒）
  pacePerKm: number       // 每公里配速（秒/公里）
  pacePerMile: number     // 每英里配速（秒/英里）
  pace800m: number        // 800m 配速（秒/800m）
  pace400m: number        // 400m 配速（秒/400m）
}

// 高级调整显示模式
export type AdvancedDisplayMode = 'effect' | 'conversion'

// 高级调整（温度/海拔影响）
export interface AdvancedAdjustment {
  originalVdot: number
  slowerVdot: number
  fasterVdot: number
  slowerTime: number  // 秒
  fasterTime: number  // 秒
  effectTime: number  // 影响值（分钟，但变量名用 Seconds 保留历史一致性）
  paceDiff: number  // 配速差异（秒/公里）
  temperature?: number
  temperatureUnit?: number  // 0: °F, 1: °C
  altitude?: number
  altitudeUnit?: number  // 0: ft, 1: m
  displayMode?: AdvancedDisplayMode  // 显示模式：'effect'（影响）或 'conversion'（转换）
}

export type DistanceUnit = 'm' | 'km' | 'mi'

// 工具数据类型
export interface ToolCategory {
  id: string
  name: string
}

export interface Tool {
  id: string
  name: string
  description: string
  icon: string
  category: string
  slug: string
}

// VDOT 计算错误类型
export interface VDOTCalculationError {
  type: 'invalid_distance' | 'invalid_time' | 'vdot_too_low' | 'vdot_too_high'
  message: string
  details?: {
    distance?: number
    time?: number
    calculatedVdot?: number
  }
}
