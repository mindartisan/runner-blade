/**
 * 汉森官方 API HTML 响应解析器
 * 解析官方 PHP 页面返回的 HTML，提取计算结果
 */

import * as cheerio from 'cheerio'

// ========== 类型定义 ==========

export interface HansonsApiResult {
  raceInfo: {
    distance: string
    time: string
    pacePerMile: string
    pacePerKm: string
  }
  trainingPaces: Array<{
    type: string
    name: string
    pacePerMile: string
    pacePerKm: string
    isRange: boolean
  }>
  equivalentPerformances: Array<{
    distance: string
    time: string
    pacePerMile: string
    pacePerKm: string
  }>
}

// ========== 常量定义 ==========

/**
 * 训练类型映射（英文 → 类型代码）
 */
const TRAINING_TYPE_MAP: Record<string, string> = {
  'Easy': 'easy',
  'Moderate': 'moderate',
  'Long Runs': 'longRuns',
  'Speed Workouts': 'speed',
  'Vo2max Workouts': 'vo2max',
  'Lactate Threshold': 'threshold',
  'Strength Workouts': 'strength',
  'Half Mar Tempos': 'halfMarTempo',
  'Marathon Tempos': 'marathonTempo',
  'Strides': 'strides',
}

// ========== 工具函数 ==========

function normalizeText(text: string): string {
  return text.toUpperCase().replace(/\s+/g, ' ').trim()
}

function matchText(text: string, pattern: string): boolean {
  return normalizeText(text).includes(normalizeText(pattern))
}

/**
 * 格式化时间为标准格式 H:MM:SS 或 MM:SS
 */
function formatTimeText(rawText: string): string {
  const cleaned = rawText
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const normalized = cleaned.replace(/:\s*:/g, ':').replace(/:\s*/g, ':').replace(/\s*:/g, ':')
  const parts = normalized.split(/[\s:]+/).filter(p => p.trim())

  if (parts.length >= 3) {
    const hours = parts[0].trim()
    const minutes = parts[1].padStart(2, '0')
    const seconds = parts[2].padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  } else if (parts.length === 2) {
    const minutes = parts[0].trim()
    const seconds = parts[1].padStart(2, '0')
    return `${minutes}:${seconds}`
  }

  return normalized
}

/**
 * 通过文本内容查找表格
 */
function findTableByText($: cheerio.CheerioAPI, searchText: string): cheerio.Cheerio | null {
  const tables = $('table')

  for (let i = 0; i < tables.length; i++) {
    const table = tables.eq(i)
    const tableText = table.text() || ''

    if (matchText(tableText, searchText)) {
      return table
    }
  }

  return null
}

// ========== 解析函数 ==========

/**
 * 预处理 HTML，移除中间多余的 head/body 标签
 */
function preprocessHtml(html: string): string {
  return html
    .replace(/(?<!^)<\/head\s*>/gi, '')
    .replace(/(?<!^)<body[^>]*>/gi, '')
}

/**
 * 主解析函数
 */
export function parseHansonsHtml(html: string): HansonsApiResult {
  const preprocessedHtml = preprocessHtml(html)
  const $ = cheerio.load(preprocessedHtml) as cheerio.CheerioAPI

  const raceInfo = parseRaceInfo($)
  const trainingPaces = parseTrainingPaces($)
  const equivalentPerformances = parseEquivalentPerformances($)

  return { raceInfo, trainingPaces, equivalentPerformances }
}

function parseRaceInfo($: cheerio.CheerioAPI): HansonsApiResult['raceInfo'] {
  const raceInfoTable = findTableByText($, 'RECENT RACE INFORMATION')

  if (!raceInfoTable || raceInfoTable.length === 0) {
    throw new Error('无法找到比赛信息表格 (RECENT RACE INFORMATION)')
  }

  const rows = raceInfoTable.find('tr')
  let dataRow: any | null = null

  rows.each((_index: number, row: any) => {
    const $row = $(row)
    const cells = $row.find('td')
    if (cells.length >= 4 && !dataRow) {
      dataRow = $row
    }
  })

  if (!dataRow) {
    throw new Error('比赛信息表格没有数据行')
  }

  const cells = dataRow.find('td')

  return {
    distance: cells.eq(0).text().trim(),
    time: formatTimeText(cells.eq(1).html() || ''),
    pacePerMile: cells.eq(2).text().trim(),
    pacePerKm: cells.eq(3).text().trim(),
  }
}

function parseTrainingPaces($: cheerio.CheerioAPI): HansonsApiResult['trainingPaces'] {
  const trainingTable = findTableByText($, 'TRAINING PACES')

  if (!trainingTable || trainingTable.length === 0) {
    throw new Error('无法找到训练配速表格 (TRAINING PACES)')
  }

  const rows = trainingTable.find('tr')
  const paces: HansonsApiResult['trainingPaces'] = []

  rows.each((_index: number, row: any) => {
    const $row = $(row)
    const cells = $row.find('td')
    if (cells.length < 3) return

    const nameEn = cells.eq(0).text().trim()
    const pacePerMile = cells.eq(1).text().trim()
    const pacePerKm = cells.eq(2).text().trim()

    if (!nameEn || nameEn === 'Workout Type' || nameEn === 'Pace/mi') {
      return
    }

    const isRange = pacePerMile.includes('-')

    paces.push({
      type: TRAINING_TYPE_MAP[nameEn] || nameEn.toLowerCase().replace(/\s+/g, ''),
      name: nameEn,
      pacePerMile,
      pacePerKm,
      isRange,
    })
  })

  return paces
}

function parseEquivalentPerformances($: cheerio.CheerioAPI): HansonsApiResult['equivalentPerformances'] {
  const perfTable = findTableByText($, 'EQUIVALENT RACE PERFORMANCES')

  if (!perfTable || perfTable.length === 0) {
    throw new Error('无法找到等效成绩表格 (EQUIVALENT RACE PERFORMANCES)')
  }

  const rows = perfTable.find('tr')
  const performances: HansonsApiResult['equivalentPerformances'] = []

  rows.each((_index: number, row: any) => {
    const $row = $(row)
    const cells = $row.find('td')
    if (cells.length < 4) return

    const distance = cells.eq(0).text().trim()

    if (distance === 'Distance' || !distance) {
      return
    }

    performances.push({
      distance: distance,
      time: formatTimeText(cells.eq(1).html() || ''),
      pacePerMile: cells.eq(2).text().trim(),
      pacePerKm: cells.eq(3).text().trim(),
    })
  })

  return performances
}
