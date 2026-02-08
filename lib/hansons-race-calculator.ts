/**
 * 汉森比赛等效计算器核心逻辑
 * 基于 Hansons Marathon Method 训练体系
 * 参考 PHP 源码实现
 */

import type {
  HansonsRaceResult,
  HansonsTrainingPace,
  HansonsRaceInfo,
  HansonsEquivalentPerformance,
  HansonsWeatherAdjustment,
  HansonsTrainingType
} from "@/types"

// ========== 常量定义 ==========

// 等效距离列表（19个）
const EQUIVALENT_DISTANCES: Array<{ label: string; meters: number }> = [
  { label: "1英里", meters: 1609.344 },
  { label: "3公里", meters: 3000 },
  { label: "2英里", meters: 3218.688 },
  { label: "4公里", meters: 4000 },
  { label: "3英里", meters: 4828.032 },
  { label: "5公里", meters: 5000 },
  { label: "6公里", meters: 6000 },
  { label: "4英里", meters: 6437.376 },
  { label: "8公里", meters: 8000 },
  { label: "5英里", meters: 8046.72 },
  { label: "10公里", meters: 10000 },
  { label: "12公里", meters: 12000 },
  { label: "15公里", meters: 15000 },
  { label: "10英里", meters: 16093.44 },
  { label: "20公里", meters: 20000 },
  { label: "半程马拉松", meters: 21097.5 },
  { label: "25公里", meters: 25000 },
  { label: "30公里", meters: 30000 },
  { label: "马拉松", meters: 42195 },
]

// 预设距离标签
const DISTANCE_LABELS: Record<number, string> = {
  1609.344: "1英里",
  3000: "3公里",
  5000: "5公里",
  8000: "8公里",
  10000: "10公里",
  12000: "12公里",
  15000: "15公里",
  16090.34: "10英里",
  20000: "20公里",
  21097.49: "半程马拉松",
  42194.99: "马拉松",
}

// 训练类型配置（颜色和名称）
export const TRAINING_TYPE_CONFIG: Record<HansonsTrainingType, { name: string; nameEn: string; color: string }> = {
  easy: { name: '轻松跑', nameEn: 'Easy', color: '#28a745' },
  moderate: { name: '中等跑', nameEn: 'Moderate', color: '#007bff' },
  longRuns: { name: '长距离跑', nameEn: 'Long Runs', color: '#00D4FF' },
  speed: { name: '速度训练', nameEn: 'Speed Workouts', color: '#fd7e14' },
  vo2max: { name: 'VO₂max训练', nameEn: 'VO₂max Workouts', color: '#dc3545' },
  threshold: { name: '乳酸阈值', nameEn: 'Lactate Threshold', color: '#ffc107' },
  strength: { name: '力量训练', nameEn: 'Strength Workouts', color: '#6f42c1' },
  halfMarTempo: { name: '半马节奏跑', nameEn: 'Half Mar Tempos', color: '#00FFD4' },
  marathonTempo: { name: '马拉松节奏跑', nameEn: 'Marathon Tempos', color: '#FF6B00' },
  strides: { name: '加速跑', nameEn: 'Strides', color: '#A78BFA' },
}

// ========== 工具函数 ==========

/**
 * 格式化时间（秒 -> H:MM:SS）
 */
function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = Math.floor(totalSeconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }
}

/**
 * 格式化配速（秒/公里 -> MM:SS）
 */
function formatPace(secondsPerKm: number): string {
  const minutes = Math.floor(secondsPerKm / 60)
  const seconds = Math.floor(secondsPerKm % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

/**
 * 格式化配速范围
 */
function formatPaceRange(minSeconds: number, maxSeconds: number): string {
  const min = formatPace(minSeconds)
  const max = formatPace(maxSeconds)
  return `${min} - ${max}`
}

/**
 * 秒/公里 转 秒/英里
 */
function secondsPerKmToSecondsPerMile(secondsPerKm: number): number {
  return secondsPerKm * 1.609344
}

/**
 * 秒/英里 转 秒/公里
 */
function secondsPerMileToSecondsPerKm(secondsPerMile: number): number {
  return secondsPerMile / 1.609344
}

/**
 * 获取距离标签
 */
function getDistanceLabel(meters: number): string {
  // 先查找精确匹配
  if (DISTANCE_LABELS[meters]) {
    return DISTANCE_LABELS[meters]
  }

  // 查找近似匹配
  for (const [key, label] of Object.entries(DISTANCE_LABELS)) {
    if (Math.abs(parseFloat(key) - meters) < 1) {
      return label
    }
  }

  // 生成自定义标签
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(3)}公里`
  } else {
    return `${meters.toFixed(0)}米`
  }
}

// ========== 天气调整 ==========

/**
 * 应用天气调整
 * 基于汉森训练体系的天气影响公式
 */
function _applyWeatherAdjustment(
  baseSeconds: number,
  weather: HansonsWeatherAdjustment
): number {
  let adjustment = 0

  // 温度影响（假设理想温度为 50°F / 10°C）
  let tempF = weather.temperature
  if (weather.temperatureUnit === 'metric') {
    tempF = weather.temperature * 9/5 + 32  // 转换为华氏度
  }

  // 温度偏离 50°F 的影响（每度增加约 0.5%）
  if (tempF > 50) {
    adjustment += (tempF - 50) * 0.005
  } else if (tempF < 32) {
    // 寒冷天气影响
    adjustment += (32 - tempF) * 0.003
  }

  // 湿度影响（超过 60% 开始有明显影响）
  if (weather.humidity > 60) {
    adjustment += (weather.humidity - 60) * 0.002
  }

  // 风速影响（逆风）
  let windMph = weather.windSpeed
  if (weather.windUnit === 'metric') {
    windMph = weather.windSpeed * 0.621371  // km/h 转 mph
  }

  // 风速每 mph 增加约 1% 影响
  adjustment += windMph * 0.01

  // 应用调整（最大不超过 20%）
  adjustment = Math.min(adjustment, 0.2)

  return baseSeconds * (1 + adjustment)
}

// ========== 训练配速计算 ==========

/**
 * 计算训练配速
 * 基于汉森训练体系的配速百分比
 */
function _calculateTrainingPaces(
  adjustedTimeSeconds: number,
  distanceMeters: number
): HansonsTrainingPace[] {
  // 计算基础配速（秒/公里）
  const baseSecondsPerKm = adjustedTimeSeconds / (distanceMeters / 1000)
  const baseSecondsPerMile = secondsPerKmToSecondsPerMile(baseSecondsPerKm)

  // 训练配速计算公式（基于汉森训练体系）
  const paces: HansonsTrainingPace[] = []

  // 1. 轻松跑 (Easy) - 基础配速的 115-125%
  paces.push({
    type: 'easy',
    name: TRAINING_TYPE_CONFIG.easy.name,
    nameEn: TRAINING_TYPE_CONFIG.easy.nameEn,
    pacePerMile: formatPaceRange(baseSecondsPerMile * 1.15, baseSecondsPerMile * 1.25),
    pacePerKm: formatPaceRange(baseSecondsPerKm * 1.15, baseSecondsPerKm * 1.25),
    isRange: true,
  })

  // 2. 中等跑 (Moderate) - 基础配速的 108-115%
  paces.push({
    type: 'moderate',
    name: TRAINING_TYPE_CONFIG.moderate.name,
    nameEn: TRAINING_TYPE_CONFIG.moderate.nameEn,
    pacePerMile: formatPaceRange(baseSecondsPerMile * 1.08, baseSecondsPerMile * 1.15),
    pacePerKm: formatPaceRange(baseSecondsPerKm * 1.08, baseSecondsPerKm * 1.15),
    isRange: true,
  })

  // 3. 长距离跑 (Long Runs) - 基础配速的 110-120%
  paces.push({
    type: 'longRuns',
    name: TRAINING_TYPE_CONFIG.longRuns.name,
    nameEn: TRAINING_TYPE_CONFIG.longRuns.nameEn,
    pacePerMile: formatPaceRange(baseSecondsPerMile * 1.10, baseSecondsPerMile * 1.20),
    pacePerKm: formatPaceRange(baseSecondsPerKm * 1.10, baseSecondsPerKm * 1.20),
    isRange: true,
  })

  // 4. 速度训练 (Speed Workouts) - 基础配速的 85-95%
  paces.push({
    type: 'speed',
    name: TRAINING_TYPE_CONFIG.speed.name,
    nameEn: TRAINING_TYPE_CONFIG.speed.nameEn,
    pacePerMile: formatPaceRange(baseSecondsPerMile * 0.85, baseSecondsPerMile * 0.95),
    pacePerKm: formatPaceRange(baseSecondsPerKm * 0.85, baseSecondsPerKm * 0.95),
    isRange: true,
  })

  // 5. VO₂max训练 (VO₂max Workouts) - 基础配速的 90-98%
  paces.push({
    type: 'vo2max',
    name: TRAINING_TYPE_CONFIG.vo2max.name,
    nameEn: TRAINING_TYPE_CONFIG.vo2max.nameEn,
    pacePerMile: formatPaceRange(baseSecondsPerMile * 0.90, baseSecondsPerMile * 0.98),
    pacePerKm: formatPaceRange(baseSecondsPerKm * 0.90, baseSecondsPerKm * 0.98),
    isRange: true,
  })

  // 6. 乳酸阈值 (Lactate Threshold) - 基础配速的 95-105%
  paces.push({
    type: 'threshold',
    name: TRAINING_TYPE_CONFIG.threshold.name,
    nameEn: TRAINING_TYPE_CONFIG.threshold.nameEn,
    pacePerMile: formatPaceRange(baseSecondsPerMile * 0.95, baseSecondsPerMile * 1.05),
    pacePerKm: formatPaceRange(baseSecondsPerKm * 0.95, baseSecondsPerKm * 1.05),
    isRange: true,
  })

  // 7. 力量训练 (Strength Workouts) - 约比基础配速快 15%
  const strengthPace = baseSecondsPerKm * 0.85
  paces.push({
    type: 'strength',
    name: TRAINING_TYPE_CONFIG.strength.name,
    nameEn: TRAINING_TYPE_CONFIG.strength.nameEn,
    pacePerMile: formatPace(secondsPerKmToSecondsPerMile(strengthPace)),
    pacePerKm: formatPace(strengthPace),
    isRange: false,
  })

  // 8. 半马节奏跑 (Half Marathon Tempo) - 基于半马配速
  // 计算半马配速（假设比目标配速慢约 5%）
  const halfMarPace = baseSecondsPerKm * 1.05
  paces.push({
    type: 'halfMarTempo',
    name: TRAINING_TYPE_CONFIG.halfMarTempo.name,
    nameEn: TRAINING_TYPE_CONFIG.halfMarTempo.nameEn,
    pacePerMile: formatPace(secondsPerKmToSecondsPerMile(halfMarPace)),
    pacePerKm: formatPace(halfMarPace),
    isRange: false,
  })

  // 9. 马拉松节奏跑 (Marathon Tempo) - 基于马拉松配速
  // 马拉松配速约等于目标配速
  paces.push({
    type: 'marathonTempo',
    name: TRAINING_TYPE_CONFIG.marathonTempo.name,
    nameEn: TRAINING_TYPE_CONFIG.marathonTempo.nameEn,
    pacePerMile: formatPace(baseSecondsPerMile),
    pacePerKm: formatPace(baseSecondsPerKm),
    isRange: false,
  })

  // 10. 加速跑 (Strides) - 快速配速范围
  paces.push({
    type: 'strides',
    name: TRAINING_TYPE_CONFIG.strides.name,
    nameEn: TRAINING_TYPE_CONFIG.strides.nameEn,
    pacePerMile: formatPaceRange(baseSecondsPerMile * 0.65, baseSecondsPerMile * 0.75),
    pacePerKm: formatPaceRange(baseSecondsPerKm * 0.65, baseSecondsPerKm * 0.75),
    isRange: true,
  })

  return paces
}

// ========== 等效成绩计算 ==========

/**
 * 计算等效成绩
 * 使用 Riegel 公式推算不同距离的成绩
 * T2 = T1 * (D2 / D1) ^ 1.06
 */
function _calculateEquivalentPerformances(
  adjustedTimeSeconds: number,
  inputDistanceMeters: number
): HansonsEquivalentPerformance[] {
  const performances: HansonsEquivalentPerformance[] = []

  for (const dist of EQUIVALENT_DISTANCES) {
    // 跳过输入距离（避免重复）
    if (Math.abs(dist.meters - inputDistanceMeters) < 1) {
      continue
    }

    // 使用 Riegel 公式计算等效时间
    // 指数 1.06 是长距离跑者的经验值
    const predictedTime = adjustedTimeSeconds * Math.pow(
      dist.meters / inputDistanceMeters,
      1.06
    )

    // 计算配速
    const secondsPerKm = predictedTime / (dist.meters / 1000)
    const secondsPerMile = secondsPerKmToSecondsPerMile(secondsPerKm)

    performances.push({
      distance: dist.label,
      distanceMeters: dist.meters,
      time: formatTime(predictedTime),
      pacePerMile: formatPace(secondsPerMile),
      pacePerKm: formatPace(secondsPerKm),
    })
  }

  // 按距离排序
  return performances.sort((a, b) => a.distanceMeters - b.distanceMeters)
}

// ========== 主计算函数 ==========

/**
 * 计算汉森比赛等效配速
 * @param distanceMeters 比赛距离（米）
 * @param timeSeconds 完赛时间（秒）
 * @param weather 可选的环境调整参数
 * @returns 计算结果
 */
export function calculateHansonsRacePaces(
  distanceMeters: number,
  timeSeconds: number,
  weather?: HansonsWeatherAdjustment
): HansonsRaceResult {
  // 验证输入
  if (distanceMeters <= 0) {
    throw new Error("距离必须大于 0")
  }
  if (timeSeconds <= 0) {
    throw new Error("时间必须大于 0")
  }

  // 应用天气调整（如果提供）
  const adjustedTimeSeconds = weather
    ? _applyWeatherAdjustment(timeSeconds, weather)
    : timeSeconds

  // 计算基础配速
  const secondsPerKm = adjustedTimeSeconds / (distanceMeters / 1000)
  const secondsPerMile = secondsPerKmToSecondsPerMile(secondsPerKm)

  // 构建比赛信息
  const raceInfo: HansonsRaceInfo = {
    distance: getDistanceLabel(distanceMeters),
    time: formatTime(adjustedTimeSeconds),
    pacePerMile: formatPace(secondsPerMile),
    pacePerKm: formatPace(secondsPerKm),
  }

  // 计算训练配速
  const trainingPaces = _calculateTrainingPaces(adjustedTimeSeconds, distanceMeters)

  // 计算等效成绩
  const equivalentPerformances = _calculateEquivalentPerformances(
    adjustedTimeSeconds,
    distanceMeters
  )

  return {
    raceInfo,
    trainingPaces,
    equivalentPerformances,
    weatherAdjusted: !!weather,
  }
}

// ========== 导出常量 ==========

export { EQUIVALENT_DISTANCES }
