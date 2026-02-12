/**
 * 汉森反向计算器 API Route
 * 代理调用官方反向计算器 API，解析 HTML 响应
 */

import { NextRequest, NextResponse } from 'next/server'
import { parseHansonsHtml } from '@/lib/hansons-html-parser'

interface ApiRequestBody {
  race_type?: string
  F3?: string
  race_units?: string
  C3: string
  D3: string
  E3: string
  G8?: string
  G9?: string
  G10?: string
  G11?: 'imperial' | 'metric'
}

interface ApiErrorResponse {
  error: string
  message: string
}

export async function POST(request: NextRequest) {
  let body: ApiRequestBody

  try {
    body = await request.json()
  } catch {
    return NextResponse.json<ApiErrorResponse>(
      { error: '无效的请求', message: '请求体必须是有效的 JSON' },
      { status: 400 }
    )
  }

  if (!body.C3 || !body.D3 || !body.E3) {
    return NextResponse.json<ApiErrorResponse>(
      { error: '缺少必填字段', message: 'C3 (小时), D3 (分钟), E3 (秒) 是必填的' },
      { status: 400 }
    )
  }

  try {
    const formData = new URLSearchParams()
    formData.append('race_type', body.race_type || '')
    formData.append('F3', body.F3 || '')
    formData.append('race_units', body.race_units || '')
    formData.append('C3', body.C3)
    formData.append('D3', body.D3)
    formData.append('E3', body.E3)
    formData.append('G8', body.G8 || '')
    formData.append('G9', body.G9 || '')
    formData.append('G10', body.G10 || '')
    formData.append('G11', body.G11 || 'imperial')
    formData.append('calculate', 'Calculate Paces')

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    const response = await fetch(
      'https://lukehumphreyrunning.com/hmmcalculator/race_equivalency_calculator_reverse.php',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
          'Origin': 'https://lukehumphreyrunning.com',
          'Referer': 'https://lukehumphreyrunning.com/hmmcalculator/race_equivalency_calculator_reverse.php',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        body: formData.toString(),
        signal: controller.signal,
      }
    )

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`官方 API 返回错误状态: ${response.status}`)
    }

    const html = await response.text()

    if (!html || html.trim().length === 0) {
      throw new Error('官方 API 返回空响应')
    }

    const result = parseHansonsHtml(html)
    return NextResponse.json(result)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('汉森反向计算器 API 调用失败:', errorMessage)

    return NextResponse.json<ApiErrorResponse>(
      {
        error: '服务暂不可用',
        message: '汉森官方 API 服务暂时无法访问，请稍后重试',
      },
      { status: 503 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const debug = searchParams.get('debug')

  if (debug === '1') {
    try {
      const formData = new URLSearchParams()
      formData.append('race_type', 'Marathon')
      formData.append('C3', '03')
      formData.append('D3', '30')
      formData.append('E3', '00')
      formData.append('G11', 'imperial')
      formData.append('calculate', 'Calculate Paces')

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      const response = await fetch(
        'https://lukehumphreyrunning.com/hmmcalculator/race_equivalency_calculator_reverse.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Origin': 'https://lukehumphreyrunning.com',
            'Referer': 'https://lukehumphreyrunning.com/hmmcalculator/race_equivalency_calculator_reverse.php',
          },
          body: formData.toString(),
          signal: controller.signal,
        }
      )

      clearTimeout(timeoutId)
      const html = await response.text()

      return NextResponse.json({
        status: response.status,
        htmlLength: html.length,
        htmlPreview: html.substring(0, 2000),
      }, { status: response.ok ? 200 : 500 })
    } catch {
      return NextResponse.json(
        { error: '调试请求失败' },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({
    message: '汉森反向计算器 API',
    method: '请使用 POST 请求',
    endpoint: '/api/hansons/race-equivalency-reverse',
  })
}
