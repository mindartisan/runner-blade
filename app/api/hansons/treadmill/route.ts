/**
 * 汉森跑步机计算器 API Route
 * 代理调用官方 API，解析 HTML 响应
 */

import {NextRequest, NextResponse} from 'next/server'
import {parseTreadmillHtml} from '@/lib/hansons-treadmill-parser'
import type {TreadmillInputMode} from '@/types'

interface ApiRequestBody {
  mode: TreadmillInputMode  // 'mph' 或 'pace'
  value: string             // MPH值或配速值
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

  // 验证必填字段
  if (!body.mode || !body.value) {
    return NextResponse.json<ApiErrorResponse>(
      { error: '缺少必填字段', message: 'mode 和 value 是必填的' },
      { status: 400 }
    )
  }

  // 验证模式
  if (body.mode !== 'mph' && body.mode !== 'pace') {
    return NextResponse.json<ApiErrorResponse>(
      { error: '无效的模式', message: 'mode 必须是 "mph" 或 "pace"' },
      { status: 400 }
    )
  }

  try {
    const formData = new URLSearchParams()

    // 根据模式选择 API 端点和参数
    const apiEndpoint = body.mode === 'mph'
      ? 'https://lukehumphreyrunning.com/hmmcalculator/treadmill_mph.php'
      : 'https://lukehumphreyrunning.com/hmmcalculator/treadmill_pace.php'

    if (body.mode === 'mph') {
      // MPH 模式：参数名为 C5
      formData.append('C5', body.value)
    } else {
      // Pace 模式：参数名为 J5，格式为 "HH:MM:SS"
      formData.append('J5', body.value)
    }

    formData.append('calculate', 'Calculate Paces')

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    const response = await fetch(
      apiEndpoint,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
          'Origin': 'https://lukehumphreyrunning.com',
          'Referer': 'https://lukehumphreyrunning.com/hmmcalculator/treadmill_mph.php',
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

    // 解析 HTML 响应
    const result = parseTreadmillHtml(html, body.value, body.mode)

    return NextResponse.json(result)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('汉森跑步机 API 调用失败:', errorMessage)

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
    // 调试模式：测试 API 连通性
    try {
      const formData = new URLSearchParams()
      formData.append('C5', '10')  // 测试 10 MPH
      formData.append('calculate', 'Calculate Paces')

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      const response = await fetch(
        'https://lukehumphreyrunning.com/hmmcalculator/treadmill_mph.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Origin': 'https://lukehumphreyrunning.com',
            'Referer': 'https://lukehumphreyrunning.com/hmmcalculator/treadmill_mph.php',
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
    message: '汉森跑步机计算器 API',
    method: '请使用 POST 请求',
    endpoint: '/api/hansons/treadmill',
    params: {
      mode: 'mph | pace',
      value: 'MPH值或配速时间（HH:MM:SS）'
    }
  })
}
