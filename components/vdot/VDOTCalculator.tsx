"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { VDOTResult, AdvancedAdjustment, RacePaceBreakdown, AdvancedDisplayMode } from "@/types"
import { calculateVDOT, getTrainingPaces, calculateRacePaceBreakdown, getEquivalentPerformances } from "@/lib/vdot-calculator"
import InputForm from "./InputForm"
import TrainingDefinitions from "./TrainingDefinitions"
import VDOTOverview from "./VDOTOverview"
import PaceTabs from "./PaceTabs"
import AdvancedAdjustmentResult from "./AdvancedAdjustmentResult"
import ThemeToggle from "@/components/ThemeToggle"

// VDOT 等级评价
function getVDOTLevel(vdot: number): { label: string; color: string } {
  if (vdot >= 60) return { label: "精英", color: "#FF6B00" }
  if (vdot >= 50) return { label: "优秀", color: "#00D4FF" }
  if (vdot >= 40) return { label: "良好", color: "#00FFD4" }
  if (vdot >= 30) return { label: "中等", color: "#A78BFA" }
  return { label: "入门", color: "#94A3B8" }
}

interface CalculationResult {
  vdot: number
  distance: number
  time: number
  trainingPaces: VDOTResult['trainingPaces']
  equivalentPerformances: VDOTResult['equivalentPerformances']
  racePaceBreakdown: RacePaceBreakdown
  advancedAdjustment?: AdvancedAdjustment | null
}

interface CalculatedPace {
  km: { minutes: number; seconds: number }
  mi: { minutes: number; seconds: number }
}

export default function VDOTCalculator() {
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [calculatedPace, setCalculatedPace] = useState<CalculatedPace | null>(null)
  const [currentPaceUnit, setCurrentPaceUnit] = useState<"km" | "mi">("km")
  const [advancedMode, setAdvancedMode] = useState<'temperature' | 'altitude' | 'off'>('off')
  const [advancedDisplayMode, setAdvancedDisplayMode] = useState<AdvancedDisplayMode>('effect')
  const [error, setError] = useState<string | null>(null)

  const handleCalculate = (
    distance: number,
    time: number,
    advancedAdjustment?: AdvancedAdjustment | null,
    inputPaceUnit?: "km" | "mi",
    mode?: 'temperature' | 'altitude' | 'off'
  ) => {
    // 清除之前的错误
    setError(null)

    // 更新高级选项模式状态
    if (mode !== undefined) {
      setAdvancedMode(mode)
    }
    const vdotResult = calculateVDOT(distance, time)

    // 检查是否为错误类型
    if (vdotResult && 'type' in vdotResult) {
      setError(vdotResult.message)
      setResult(null)
      return
    }

    // 检查是否为 null
    if (!vdotResult) {
      setError('计算失败，请检查输入')
      setResult(null)
      return
    }

    // 确定用于计算训练配速的 VDOT
    // 如果有高级调整，根据显示模式选择对应的 VDOT
    // - Effect 模式：使用 slowerVdot（预期成绩变慢）
    // - Conversion 模式：使用 fasterVdot（推算成绩变快）
    let effectiveVdot = vdotResult.vdot
    if (advancedAdjustment) {
      const displayMode = advancedAdjustment.displayMode || advancedDisplayMode
      effectiveVdot = displayMode === 'effect' ? advancedAdjustment.slowerVdot : advancedAdjustment.fasterVdot
    }

    // 使用有效 VDOT 重新计算训练配速
    const trainingPaces = getTrainingPaces(effectiveVdot)

    // 计算用户输入距离的配速细分
    const racePaceBreakdown = calculateRacePaceBreakdown(distance, time)

    setResult({
      vdot: vdotResult.vdot,
      distance,
      time,
      trainingPaces,  // 使用基于调整后 VDOT 的配速
      equivalentPerformances: vdotResult.equivalentPerformances,
      racePaceBreakdown,
      advancedAdjustment,
    })

    // 确定使用的配速单位
    const paceUnitToUse = inputPaceUnit || "km"

    // 同时计算公里和英里配速
    // 公里配速：秒/公里
    const paceSecondsPerKm = time / (distance / 1000)
    const kmPaceMinutes = Math.floor(paceSecondsPerKm / 60)
    const kmPaceSeconds = Math.round(paceSecondsPerKm % 60)

    // 英里配速：秒/英里
    const paceSecondsPerMi = time / (distance / 1609.344)
    const miPaceMinutes = Math.floor(paceSecondsPerMi / 60)
    const miPaceSeconds = Math.round(paceSecondsPerMi % 60)

    setCalculatedPace({
      km: { minutes: kmPaceMinutes, seconds: kmPaceSeconds },
      mi: { minutes: miPaceMinutes, seconds: miPaceSeconds },
    })
    setCurrentPaceUnit(paceUnitToUse)
  }

  const handleReset = () => {
    setResult(null)
    setCalculatedPace(null)
    setError(null)
  }

  // 监听 advancedDisplayMode 变化，自动重新计算训练配速、等效成绩和更新调整显示模式
  useEffect(() => {
    // 只有在有计算结果且有高级调整时才自动重新计算
    if (!result || !result.advancedAdjustment) return

    // 确定用于计算训练配速的 VDOT
    // - Effect 模式：使用 slowerVdot（预期成绩变慢）
    // - Conversion 模式：使用 fasterVdot（推算成绩变快）
    const effectiveVdot = advancedDisplayMode === 'effect'
      ? result.advancedAdjustment.slowerVdot
      : result.advancedAdjustment.fasterVdot

    // 使用有效 VDOT 重新计算训练配速
    const trainingPaces = getTrainingPaces(effectiveVdot)

    // 使用有效 VDOT 重新计算等效成绩
    const equivalentPerformances = getEquivalentPerformances(
      effectiveVdot,
      result.distance,
      result.time
    )

    // 更新结果中的训练配速、等效成绩和调整显示模式，保持其他值不变
    setResult(prev => prev ? {
      ...prev,
      trainingPaces,
      equivalentPerformances,
      // 同步更新 advancedAdjustment 的 displayMode，确保 AdvancedAdjustmentResult 组件正确显示
      advancedAdjustment: prev.advancedAdjustment ? {
        ...prev.advancedAdjustment,
        displayMode: advancedDisplayMode,
      } : null,
    } : null)
  }, [advancedDisplayMode, result?.advancedAdjustment])

  const level = result ? getVDOTLevel(result.vdot) : null

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 返回按钮和标题 */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 transition-colors duration-200"
            style={{ color: 'var(--color-text-secondary)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-secondary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </Link>
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            VDOT 计算器
          </h1>
          <ThemeToggle />
        </div>

        {/* 主内容区域 - 左右分栏布局 (6:4 比例) */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* 左侧：训练定义信息区 (3 列，约 60%) */}
          <div className="lg:col-span-3">
            <TrainingDefinitions />
          </div>

          {/* 右侧：计算功能区和结果展示 (2 列，约 40%) */}
          <div className="lg:col-span-2 space-y-3">
            {/* VDOT 概述卡片 */}
            <VDOTOverview />

            {/* 输入表单 */}
            <InputForm
              onCalculate={handleCalculate}
              calculatedPace={calculatedPace}
              currentPaceUnit={currentPaceUnit}
              onPaceUnitChange={setCurrentPaceUnit}
              advancedMode={advancedMode}
              onAdvancedModeChange={setAdvancedMode}
              advancedDisplayMode={advancedDisplayMode}
              onAdvancedDisplayModeChange={setAdvancedDisplayMode}
              onReset={handleReset}
            />

            {/* 错误提示 */}
            {error && (
              <div
                className="card p-4 text-center animate-in fade-in slide-in-from-top-2"
                style={{
                  backgroundColor: 'rgba(255, 107, 0, 0.15)',
                  border: '1px solid rgba(255, 107, 0, 0.3)'
                }}
              >
                <p style={{ color: '#FF6B00', fontSize: '0.875rem' }}>
                  {error}
                </p>
              </div>
            )}

            {/* VDOT 结果展示 */}
            {result && (
              <>
                <div
                  className="card relative overflow-hidden text-white"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 50%, var(--color-secondary) 100%)',
                  }}
                >
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%)' }} />
                  <div className="text-center relative z-10 py-4">
                    <p className="text-xs font-medium tracking-wide mb-2 opacity-90">你的 VDOT 分数</p>
                    <div className="flex items-center justify-center gap-3">
                      <p className="text-5xl font-bold tracking-tight">{result.vdot.toFixed(1)}</p>
                      {level && (
                        <span
                          className="px-3 py-1 rounded-full text-sm font-medium"
                          style={{
                            backgroundColor: level.color + '30',
                            color: '#FFFFFF',
                            border: `1px solid ${level.color}50`,
                          }}
                        >
                          {level.label}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 高级调整结果 */}
                {result.advancedAdjustment && (
                  <AdvancedAdjustmentResult
                    adjustment={result.advancedAdjustment}
                    calculatedDistance={result.distance}
                    advancedMode={advancedMode}
                    displayMode={advancedDisplayMode}
                    onReverseMode={() => setAdvancedDisplayMode(
                      advancedDisplayMode === 'effect' ? 'conversion' : 'effect'
                    )}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* 底部标签栏 */}
        <div className="mt-6">
          <PaceTabs result={result ? {
            vdot: result.vdot,
            trainingPaces: result.trainingPaces,
            equivalentPerformances: result.equivalentPerformances,
            racePaceBreakdown: result.racePaceBreakdown,
          } : null} />
        </div>
      </div>
    </div>
  )
}
