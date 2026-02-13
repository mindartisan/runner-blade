/**
 * 汉森跑步机计算器 HTML 响应解析器
 * 解析官方 PHP 页面返回的 HTML，提取配速数据
 */

import * as cheerio from 'cheerio'
import type {TreadmillGradePace, TreadmillInputMode, TreadmillResult} from '@/types'

// ========== 工具函数 ==========

/**
 * 格式化配速文本
 * @param rawText 原始配速文本
 * @returns 格式化后的配速（MM:SS 或 H:MM:SS）
 */
function formatPaceText(rawText: string): string {
  const cleaned = rawText
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  // 标准化时间格式 MM:SS 或 H:MM:SS
  const parts = cleaned.split(':').filter(p => p.trim())

  if (parts.length === 2) {
    const minutes = parts[0].trim()
    const seconds = parts[1].padStart(2, '0')
    return `${minutes}:${seconds}`
  } else if (parts.length === 3) {
    const hours = parts[0].trim()
    const minutes = parts[1].padStart(2, '0')
    const seconds = parts[2].padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }

  return cleaned
}

/**
 * 通过文本内容查找跑步机配速表格
 * @param $ Cheerio 实例
 * @returns 表格元素或 null
 */
function findTreadmillTable($: cheerio.CheerioAPI, searchText: string): cheerio.Cheerio | null {
  const tables = $('table')

  for (let i = 0; i < tables.length; i++) {
    const table = tables.eq(i)
    const tableText = table.text() || ''

    // 查找包含指定文本的表格
    if (tableText.includes(searchText)) {
      return table
    }
  }

  return null
}

// ========== 配速转换函数 ==========

/**
 * 配速转换：英里配速转公里配速
 * 公式：公里配速（秒）= 英里配速（秒）/ 1.609344
 * @param paceMile 英里配速（格式：MM:SS 或 H:MM:SS）
 * @returns 公里配速（格式：MM:SS）
 */
export function convertPaceMileToKm(paceMile: string): string {
  const parts = paceMile.split(':').map(Number)
  let totalSeconds: number

  if (parts.length === 2) {
    totalSeconds = parts[0] * 60 + parts[1]
  } else if (parts.length === 3) {
    totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2]
  } else {
    return paceMile
  }

  const kmSeconds = Math.round(totalSeconds / 1.609344)
  const minutes = Math.floor(kmSeconds / 60)
  const seconds = kmSeconds % 60

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// ========== 主解析函数 ==========

/**
 * 解析跑步机计算器 HTML 响应
 * @param html HTML 响应内容
 * @param originalInput 原始输入值
 * @param mode 输入模式（mph 或 pace）
 * @returns 解析后的跑步机计算结果
 */
export function parseTreadmillHtml(
  html: string,
  originalInput: string,
  mode: TreadmillInputMode
): TreadmillResult {
  const $ = cheerio.load(html) as cheerio.CheerioAPI

  // 查找包含 "VALUES" 和 "%Grade" 的表格
  const table = findTreadmillTable($, 'VALUES')

  if (!table || table.length === 0) {
    throw new Error('无法找到跑步机配速表格')
  }

  const gradePaces: TreadmillGradePace[] = []

  // 解析表格数据行
  table.find('tbody tr').each((_index: number, row: any) => {
    const $row = $(row)
    const cells = $row.find('td')

    if (cells.length >= 2) {
      const gradeText = cells.eq(0).text().trim()
      const paceText = cells.eq(1).text().trim()

      // 提取坡度数值（去掉 % 符号）
      const grade = parseFloat(gradeText.replace('%', ''))

      if (!isNaN(grade) && paceText) {
        const pacePerMile = formatPaceText(paceText)
        gradePaces.push({
          grade,
          gradeFormatted: `${grade}%`,
          pacePerMile,
          pacePerKm: convertPaceMileToKm(pacePerMile),
        })
      }
    }
  })

  if (gradePaces.length === 0) {
    throw new Error('跑步机配速表格没有数据')
  }

  // 格式化输入值显示
  const inputDisplay = mode === 'mph'
    ? `${originalInput} MPH`
    : `${originalInput} /英里`

  return {
    mode,
    inputValue: originalInput,
    inputDisplay,
    gradePaces,
  }
}
