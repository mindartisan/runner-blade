import {
  VDOTResult,
  TrainingPaces,
  PaceRange,
  EquivalentPerformance,
  DistanceUnit,
  AdvancedAdjustment,
  AdvancedDisplayMode,
  RacePaceBreakdown,
  VDOTCalculationError,
} from "@/types"

// 常量定义
const MILES_TO_METERS = 1609.344
const KILOMETERS_TO_METERS = 1000
const MINUTES_TO_SECONDS = 60
const SLOW_VDOT_LIMIT = 39

// 时间单位转换常量（用于内部计算）
const SECONDS_TO_MINUTES = 1 / 60

/**
 * 将秒转换为分钟（用于内部计算）
 */
function _secondsToMinutes(seconds: number): number {
  return seconds * SECONDS_TO_MINUTES
}

/**
 * 将分钟转换为秒（用于返回结果）
 */
function _minutesToSeconds(minutes: number): number {
  return minutes * MINUTES_TO_SECONDS
}

// 比赛距离选项
export const RACE_DISTANCES = [
  { label: "Marathon", value: 42195 },
  { label: "Half-Marathon", value: 21097.5 },
  { label: "15K", value: 15000 },
  { label: "10K", value: 10000 },
  { label: "5K", value: 5000 },
  { label: "3Mi", value: 4828.032 },  // 3 英里 = 3 * 1609.344
  { label: "2Mi", value: 3218.688 },
  { label: "3200m", value: 3200 },
  { label: "3K", value: 3000 },
  { label: "1Mi", value: 1609.344 },
  { label: "1600m", value: 1600 },
  { label: "1500m", value: 1500 },
]

// ========== 核心计算函数 ==========

/**
 * 计算 VDOT 分数
 * @param distanceMeters 距离（米）
 * @param timeSeconds 时间（秒）
 * @returns VDOT 分数
 */
function getVDOT(distanceMeters: number, timeSeconds: number): number {
  // 转换为分钟（Jack Daniels 公式使用分钟）
  const timeMinutes = _secondsToMinutes(timeSeconds)

  const speedParam = _getVDOTSpeedParam(distanceMeters, timeMinutes)
  const vo2 = _getVO2(speedParam)
  const fatigueFactor =
    0.8 +
    0.298956 * Math.exp(-0.193261 * timeMinutes) +
    0.189439 * Math.exp(-0.012778 * timeMinutes)
  const result = vo2 / fatigueFactor
  return result
}

/**
 * 获取 VDOT 速度参数（处理短距离调整）
 */
function _getVDOTSpeedParam(distanceMeters: number, timeMinutes: number): number {
  if (distanceMeters >= 1200) {
    return distanceMeters / timeMinutes  // 返回 米/分钟
  }
  if (distanceMeters > 800) {
    const ratio = 1600 / distanceMeters
    const extra = (1600 - distanceMeters) / 800
    const adjustedRatio = ratio + 0.1 * extra
    const adjustedTime = timeMinutes * adjustedRatio
    return 1600 / adjustedTime
  } else {
    const ratio = 800 / distanceMeters
    const adjustedRatio = ratio * 2.1
    const adjustedTime = timeMinutes * adjustedRatio
    return 1600 / adjustedTime
  }
}

/**
 * 计算 VO₂max（Jack Daniels 核心公式）
 * VO₂max = -4.6 + 0.182258 * v + 0.000104 * v²
 */
function _getVO2(speed: number): number {
  return -4.6 + 0.182258 * speed + 0.000104 * Math.pow(speed, 2)
}

/**
 * 将 VDOT 转换为速度（米/分钟）
 */
function _getPaceVelocity(vdot: number): number {
  return 29.54 + 5.000663 * vdot - 0.007546 * Math.pow(vdot, 2)
}

/**
 * 获取自定义训练配速（返回时间，单位：分钟）
 * @param vdot VDOT 值
 * @param distanceMeters 距离（米）
 * @param percentage VDOT 百分比（0-1）
 * @returns 时间（分钟）
 */
function _getCustomEffortPace(vdot: number, distanceMeters: number, percentage: number): number {
  const adjustedVdot = vdot * percentage
  const velocity = _getPaceVelocity(adjustedVdot)  // 米/分钟
  return distanceMeters / velocity  // 返回分钟
}

/**
 * 获取慢速 VDOT 的调整值
 */
function _getSRVDOT(vdot: number): number {
  return (vdot * 2) / 3 + 13
}

/**
 * 检查是否为慢速 VDOT
 */
function _isSlowVdot(vdot: number): boolean {
  return vdot < SLOW_VDOT_LIMIT
}

// ========== 温度和海拔影响计算 ==========

/**
 * 计算温度对时间的影响（分钟）
 * @param temperature 温度值
 * @param unit 温度单位 (0: °F, 1: °C)
 * @param timeSeconds 原始时间（秒）
 * @returns 影响分钟数（正数表示更慢，负数表示更快）
 */
function getTemperatureEffect(temperature: number, unit: number, timeSeconds: number): number {
  const celsius = unit === 0 ? (temperature - 32) * 5 / 9 : temperature
  // 公式：(温度 - 15) * 0.16667 * 时间
  const effectSeconds = (celsius - 15) * 0.16667 * timeSeconds
  return effectSeconds / 60  // 返回分钟
}

/**
 * 计算海拔对时间的影响（分钟）
 * @param altitude 海拔值
 * @param unit 海拔单位 (0: ft, 1: m)
 * @param timeSeconds 原始时间（秒）
 * @returns 影响分钟数（正数表示更慢）
 */
function getAltitudeEffect(altitude: number, unit: number, timeSeconds: number): number {
  const meters = unit === 0 ? altitude * 0.3048 : altitude
  // 公式：(海拔 * 0.004 - 3) / 100 * 时间
  const effectSeconds = ((meters * 0.004 - 3) / 100) * timeSeconds
  return effectSeconds
}

/**
 * 计算高级调整后的时间和 VDOT
 * @param distanceMeters 距离（米）
 * @param timeSeconds 时间（秒）
 * @param temperature 温度（可选）
 * @param temperatureUnit 温度单位
 * @param altitude 海拔（可选）
 * @param altitudeUnit 海拔单位
 * @param displayMode 显示模式（可选）
 * @returns 调整后的结果
 */
export function calculateAdvancedAdjustment(
  distanceMeters: number,
  timeSeconds: number,
  temperature?: number,
  temperatureUnit?: number,
  altitude?: number,
  altitudeUnit?: number,
  displayMode?: AdvancedDisplayMode
): AdvancedAdjustment | null {
  if (temperature === undefined && altitude === undefined) {
    return null
  }

  const originalVdot = getVDOT(distanceMeters, timeSeconds)
  let totalEffectSeconds = 0

  if (temperature !== undefined) {
    totalEffectSeconds += getTemperatureEffect(temperature, temperatureUnit || 0, timeSeconds)
  }

  if (altitude !== undefined) {
    totalEffectSeconds += getAltitudeEffect(altitude, altitudeUnit || 0, timeSeconds)
  }

  // 确保影响不为负
  if (totalEffectSeconds < 0) {
    totalEffectSeconds = 0
  }

  // 计算调整后的时间
  const slowerTime = timeSeconds + totalEffectSeconds
  const fasterTime = Math.max(timeSeconds - totalEffectSeconds, 0)

  // 计算调整后的 VDOT
  const slowerVdot = getVDOT(distanceMeters, slowerTime)
  const fasterVdot = getVDOT(distanceMeters, fasterTime)

  // 计算配速差异（秒/公里）
  const paceDiffSeconds = totalEffectSeconds / (distanceMeters / KILOMETERS_TO_METERS)

  return {
    originalVdot,
    slowerVdot,
    fasterVdot,
    slowerTime,
    fasterTime,
    effectTime: totalEffectSeconds,
    paceDiff: paceDiffSeconds,
    temperature,
    temperatureUnit,
    altitude,
    altitudeUnit,
    displayMode,
  }
}

// ========== 从配速计算距离 ==========

/**
 * 从时间和配速计算距离
 * @param timeSeconds 时间（秒）
 * @param paceSeconds 配速（秒/公里或英里）
 * @param paceUnit 配速单位
 * @returns 距离（米）
 */
export function getDistanceFromTimeAndPace(
  timeSeconds: number,
  paceSeconds: number,
  paceUnit: DistanceUnit
): number {
  const paceDistance = paceUnit === "mi" ? MILES_TO_METERS : KILOMETERS_TO_METERS
  return (paceDistance * timeSeconds) / paceSeconds
}

// ========== 训练配速计算 ==========

/**
 * 计算 Easy Pace（轻松跑配速）
 * 62-70% VDOT（Jack Daniels Running Formula）
 */
function getEasyPace(vdot: number, distanceMeters: number, isSlow: boolean): number {
  let effectiveVdot = vdot
  if (_isSlowVdot(vdot)) {
    effectiveVdot = _getSRVDOT(vdot)
  }

  // Jack Daniels: 62%-70% VDOT
  const percentage = isSlow ? 0.62 : 0.70

  const timeMinutes = _getCustomEffortPace(effectiveVdot, distanceMeters, percentage)
  return _minutesToSeconds(timeMinutes)
}

/**
 * 获取 Easy Pace 范围
 */
function getEasyPaceRange(vdot: number, distanceMeters: number, unit: DistanceUnit): PaceRange {
  const slow = getEasyPace(vdot, distanceMeters, true)
  const fast = getEasyPace(vdot, distanceMeters, false)
  return { slow, fast, unit }
}

/**
 * 计算 Marathon Pace（马拉松配速）
 * 使用牛顿迭代法求解（Jack Daniels Running Formula）
 */
function getMarathonPace(vdot: number, distanceMeters: number): number {
  // 对于训练配速表，使用 84% VDOT 作为马拉松配速强度
  // 牛顿迭代法仅用于完整马拉松距离的精确计算
  const timeMinutes = _getCustomEffortPace(vdot, distanceMeters, 0.84)
  return _minutesToSeconds(timeMinutes)
}

/**
 * 计算 Threshold Pace（阈值配速）
 * 88% VDOT（Jack Daniels Running Formula）
 */
function getThresholdPace(vdot: number, distanceMeters: number): number {
  let effectiveVdot = vdot
  if (_isSlowVdot(vdot)) {
    const srvdot = _getSRVDOT(vdot)
    effectiveVdot = (vdot + srvdot) / 2
  }

  // Jack Daniels: 88% VDOT
  const percentage = 0.88

  const timeMinutes = _getCustomEffortPace(effectiveVdot, distanceMeters, percentage)
  return _minutesToSeconds(timeMinutes)
}

/**
 * 计算 Interval Pace（间歇跑配速）
 * 97.5% VDOT（Jack Daniels Running Formula）
 */
function getIntervalPace(vdot: number, distanceMeters: number): number {
  let effectiveVdot = vdot
  if (_isSlowVdot(vdot)) {
    effectiveVdot = _getSRVDOT(vdot)
  }

  // Jack Daniels: 97.5% VDOT
  const percentage = 0.975

  const timeMinutes = _getCustomEffortPace(effectiveVdot, distanceMeters, percentage)
  return _minutesToSeconds(timeMinutes)
}

/**
 * 计算 Repetition Pace（重复跑配速）
 * 类似 1500m 或英里比赛配速
 * 比 Interval pace 快 6 秒/400m（Jack Daniels Running Formula）
 * 注意：这里 distanceMeters 是计算配速用的距离（通常是 1000 米）
 */
function getRepetitionPace(vdot: number, distanceMeters: number): number {
  // 获取该距离的间歇跑配速（分钟）
  const intervalPaceSeconds = getIntervalPace(vdot, distanceMeters)
  const intervalPaceMinutes = _secondsToMinutes(intervalPaceSeconds)

  // 调整：比间歇跑快 6 秒/400m（adjustment 单位：分钟）
  const adjustmentMinutes = (distanceMeters / 400) * (6 / 60)

  const repPaceMinutes = intervalPaceMinutes - adjustmentMinutes
  return _minutesToSeconds(repPaceMinutes)
}

/**
 * 计算 Fast Reps Pace（快速重复跑配速）
 * 类似 800 米比赛配速
 * 比 Rep pace 快 4 秒/200m（Jack Daniels Running Formula）
 */
function getFastRepsPace(vdot: number, distanceMeters: number): number {
  const repPaceSeconds = getRepetitionPace(vdot, distanceMeters)
  const repPaceMinutes = _secondsToMinutes(repPaceSeconds)

  // Fast Reps 比 Rep 快 4 秒/200m
  const adjustmentMinutes = (distanceMeters / 200) * (4 / 60)

  const fastRepPaceMinutes = repPaceMinutes - adjustmentMinutes
  return _minutesToSeconds(fastRepPaceMinutes)
}

/**
 * 获取所有训练配速
 * @param vdot VDOT 值
 * @returns 训练配速对象
 */
export function getTrainingPaces(vdot: number): TrainingPaces {
  const km = KILOMETERS_TO_METERS
  const mi = MILES_TO_METERS

  return {
    easy: getEasyPaceRange(vdot, km, "km"),
    marathon: { slow: getMarathonPace(vdot, km), fast: getMarathonPace(vdot, km), unit: "km" },
    interval: { slow: getIntervalPace(vdot, km), fast: getIntervalPace(vdot, km), unit: "km" },
    threshold: { slow: getThresholdPace(vdot, km), fast: getThresholdPace(vdot, km), unit: "km" },
    rep: { slow: getRepetitionPace(vdot, km), fast: getRepetitionPace(vdot, km), unit: "km" },
    fastRep: { slow: getFastRepsPace(vdot, km), fast: getFastRepsPace(vdot, km), unit: "km" },
  }
}

/**
 * 计算用户输入距离的配速细分
 * @param distanceMeters 用于计算配速的距离（米）
 * @param timeSeconds 用户输入的完赛时间（秒）
 * @param originalDistanceMeters 原始输入/计算的距离，用于显示距离标签（可选）
 * @returns 配速细分对象
 */
export function calculateRacePaceBreakdown(
  distanceMeters: number,
  timeSeconds: number,
  originalDistanceMeters?: number
): RacePaceBreakdown {
  // 使用原始距离来生成标签（如果提供的话）
  const distanceForLabel = originalDistanceMeters ?? distanceMeters

  // 查找距离标签（使用更严格的匹配：1 米容差）
  const raceDistance = RACE_DISTANCES.find(
    r => Math.abs(r.value - distanceForLabel) < 1
  )
  // 对于不匹配预设距离的情况，显示精确的公里数
  const distanceLabel = raceDistance?.label || `${(distanceForLabel / 1000).toFixed(3)}km`

  // 计算每公里配速（秒/公里）
  const pacePerKm = timeSeconds / (distanceMeters / KILOMETERS_TO_METERS)

  // 计算每英里配速（秒/英里）
  const pacePerMile = timeSeconds / (distanceMeters / MILES_TO_METERS)

  // 计算 800m 配速（秒/800m）
  const pace800m = timeSeconds / (distanceMeters / 800)

  // 计算 400m 配速（秒/400m）
  const pace400m = timeSeconds / (distanceMeters / 400)

  return {
    distance: distanceLabel,
    distanceMeters: distanceForLabel,  // 使用原始距离用于显示
    totalTime: timeSeconds,
    pacePerKm,
    pacePerMile,
    pace800m,
    pace400m,
  }
}

// ========== 等效比赛成绩预测 ==========

/**
 * 预测其他距离的比赛时间（Jack Daniels Running Formula）
 * 使用牛顿迭代法求解
 *
 * @param vdot VDOT 分数
 * @param targetDistance 目标距离（米）
 * @returns 预测时间（秒）
 *
 * 算法说明：
 * 1. 使用牛顿迭代法求解非线性方程，找到满足 VDOT 公式的时间
 * 2. 初始估计：时间 = 距离 / (4 * VDOT)
 * 3. 迭代 3 次达到收敛
 *
 * 魔法数字来源（Jack Daniels Running Formula）：
 * - -0.193261, -0.012778: 疲劳因子的指数衰减系数
 * - 0.298956, 0.189439, 0.8: 疲劳因子计算系数
 * - -0.0075, 5.000663, 29.54: 速度-VDOT 转换系数
 *
 * 短距离调整（< 1200 米）：
 * - 原因：短距离比赛涉及无氧代谢，VDOT 公式在短距离预测不够准确
 * - 方法：使用速度参数比率进行修正
 */
function getPredictedRaceTime(vdot: number, targetDistance: number): number {
  // 使用分钟进行计算
  let timeMinutes = targetDistance / (4 * vdot)

  // 牛顿迭代法（3 次迭代）
  // 求解目标：找到时间 t，使得 VDOT(t, distance) = 给定 VDOT
  for (let i = 0; i < 3; i++) {
    const exp1 = Math.exp(-0.193261 * timeMinutes)
    const exp2 = Math.exp(-0.012778 * timeMinutes)

    // 疲劳因子：随时间增加而衰减
    const fatigueFactor = 0.298956 * exp1 + 0.189439 * exp2 + 0.8

    // 速度（米/分钟）：从 VDOT 和疲劳因子计算
    const velocity = Math.pow(vdot * fatigueFactor, 2) * -0.0075 +
                     vdot * fatigueFactor * 5.000663 + 29.54

    // 导数计算：用于牛顿迭代法的收敛
    const term1 = 0.298956 * exp1 * 0.19326
    const term2 = term1 - exp2 * 0.189439 * -0.012778
    const term3 = fatigueFactor * term2 * vdot * -0.007546 * 3
    const derivative = term2 * vdot * 5.000663 + term3

    // 牛顿迭代更新：t_new = t - f(t) / f'(t)
    const factor = targetDistance * derivative / Math.pow(velocity, 2) + 1
    const delta = (timeMinutes - targetDistance / velocity) / factor
    timeMinutes = timeMinutes - delta
  }

  // 使用迭代后的速度计算最终时间
  const velocityMetersPerMin = targetDistance / timeMinutes
  const finalTimeMinutes = targetDistance / velocityMetersPerMin

  // 短距离调整（< 1200 米）
  // 短距离比赛需要特殊处理，因为 VDOT 公式在短距离预测时不够准确
  // 调整方法：使用速度参数比率修正
  if (targetDistance < 1200) {
    const exp1 = Math.exp(-0.193261 * finalTimeMinutes)
    const exp2 = Math.exp(-0.012778 * finalTimeMinutes)
    const fatigueFactor = 0.298956 * exp1 + 0.189439 * exp2 + 0.8

    const rawVelocity = targetDistance / (vdot * fatigueFactor)
    const speedParam = _getVDOTSpeedParam(targetDistance, targetDistance / rawVelocity)
    const ratio = rawVelocity / speedParam

    const timeSeconds = _minutesToSeconds(targetDistance / rawVelocity)
    return timeSeconds / ratio
  }

  return _minutesToSeconds(finalTimeMinutes)
}

/**
 * 获取所有等效比赛成绩
 */
export function getEquivalentPerformances(
  vdot: number,
  inputDistance: number,
  inputTime: number
): EquivalentPerformance[] {
  const results: EquivalentPerformance[] = []

  for (const race of RACE_DISTANCES) {
    const isInputDistance = Math.abs(race.value - inputDistance) < 5
    const time = isInputDistance ? inputTime : getPredictedRaceTime(vdot, race.value)
    const pacePerKm = time / (race.value / KILOMETERS_TO_METERS)
    const pacePerMile = time / (race.value / MILES_TO_METERS)

    results.push({
      distance: race.label,
      distanceMeters: race.value,
      time,
      pacePerKm,
      pacePerMile,
    })
  }

  return results
}

// ========== 主函数 ==========

/**
 * 计算 VDOT 结果
 * @param distanceMeters 比赛距离（米）
 * @param timeSeconds 完赛时间（秒）
 * @returns VDOT 计算结果或错误信息
 */
export function calculateVDOT(
  distanceMeters: number,
  timeSeconds: number
): VDOTResult | VDOTCalculationError | null {
  // 验证距离
  if (distanceMeters <= 0) {
    return {
      type: 'invalid_distance',
      message: '距离必须大于 0',
      details: { distance: distanceMeters }
    }
  }

  // 验证时间
  if (timeSeconds <= 0) {
    return {
      type: 'invalid_time',
      message: '时间必须大于 0',
      details: { time: timeSeconds }
    }
  }

  const vdot = getVDOT(distanceMeters, timeSeconds)

  // 验证 VDOT 是否合理（官方实现：vdot >= 100 为无效）
  if (vdot <= 0) {
    return {
      type: 'vdot_too_low',
      message: 'VDOT 值无效，请输入实际的成绩数据',
      details: { calculatedVdot: vdot }
    }
  }

  if (vdot >= 100) {
    return {
      type: 'vdot_too_high',
      message: 'VDOT 值超出支持范围（最大 100）',
      details: { calculatedVdot: vdot }
    }
  }

  const trainingPaces = getTrainingPaces(vdot)
  const equivalentPerformances = getEquivalentPerformances(vdot, distanceMeters, timeSeconds)

  return {
    vdot,
    trainingPaces,
    equivalentPerformances,
  }
}

// ========== 工具函数 ==========

/**
 * 将秒数格式化为时间字符串 (HH:MM:SS)
 */
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`
}

/**
 * 将秒数格式化为时间字符串，带小数秒 (MM:SS.ss 或 HH:MM:SS.ss)
 * 用于比赛配速显示，如 6:51.9
 */
export function formatTimeWithDecimal(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  // 格式化秒数，保留一位小数
  const secsFormatted = secs.toFixed(1)

  if (hours > 0) {
    const minsFormatted = minutes.toString().padStart(2, "0")
    return `${hours}:${minsFormatted}:${secsFormatted.padStart(4, "0")}`
  }
  return `${minutes}:${secsFormatted.padStart(4, "0")}`
}

/**
 * 将秒数格式化为配速字符串 (MM:SS /km)
 */
export function formatPace(secondsPerKm: number, unit: DistanceUnit = "km"): string {
  const minutes = Math.floor(secondsPerKm / 60)
  const secs = Math.floor(secondsPerKm % 60)
  const unitLabel = unit === "km" ? "/km" : "/mi"

  // 如果超过 60 分钟，显示小时
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}:${remainingMinutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}${unitLabel}`
  }

  return `${minutes}:${secs.toString().padStart(2, "0")}${unitLabel}`
}


