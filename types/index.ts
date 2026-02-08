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

// ========== 汉森计算器类型定义 ==========

// 汉森训练类型（10种）
export type HansonsTrainingType =
  | 'easy'          // 轻松跑
  | 'moderate'      // 中等跑
  | 'longRuns'      // 长距离跑
  | 'speed'         // 速度训练
  | 'vo2max'        // VO₂max训练
  | 'threshold'     // 乳酸阈值
  | 'strength'      // 力量训练
  | 'halfMarTempo'  // 半马节奏跑
  | 'marathonTempo' // 马拉松节奏跑
  | 'strides'       // 加速跑

// 训练配速（部分为范围，部分为单一配速）
export interface HansonsTrainingPace {
  type: HansonsTrainingType
  name: string
  nameEn: string
  pacePerMile: string  // 格式: "MM:SS" 或 "MM:SS - MM:SS"
  pacePerKm: string
  isRange: boolean  // true表示范围，false表示单一配速
}

// 比赛信息
export interface HansonsRaceInfo {
  distance: string      // 距离标签（如 "Marathon", "10k"）
  time: string          // 完赛时间（格式 "H:MM:SS"）
  pacePerMile: string   // 每英里配速
  pacePerKm: string     // 每公里配速
}

// 等效成绩
export interface HansonsEquivalentPerformance {
  distance: string      // 距离标签
  distanceMeters: number // 距离（米）
  time: string          // 预测时间
  pacePerMile: string   // 每英里配速
  pacePerKm: string     // 每公里配速
}

// 环境调整参数
export interface HansonsWeatherAdjustment {
  temperature: number   // 温度
  temperatureUnit: 'imperial' | 'metric'  // imperial=°F, metric=°C
  humidity: number      // 湿度百分比
  windSpeed: number     // 风速
  windUnit: 'imperial' | 'metric'  // imperial=mph, metric=km/h
}

// 计算结果
export interface HansonsRaceResult {
  raceInfo: HansonsRaceInfo
  trainingPaces: HansonsTrainingPace[]
  equivalentPerformances: HansonsEquivalentPerformance[]
  weatherAdjusted?: boolean  // 是否应用了天气调整
}
