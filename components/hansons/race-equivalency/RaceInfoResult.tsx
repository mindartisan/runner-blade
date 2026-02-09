"use client"

import type { HansonsRaceInfo } from "@/types"

export default function RaceInfoResult({ raceInfo }: { raceInfo: HansonsRaceInfo }) {
  return (
    <div className="card" style={{ borderLeft: `4px solid #28a745` }}>
      <h2 className="text-base font-bold mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-green-500 rounded"></span>
        比赛信息
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div className="text-xs text-text-tertiary mb-1">距离</div>
          <div className="text-sm font-semibold text-text-primary">{raceInfo.distance}</div>
        </div>
        <div>
          <div className="text-xs text-text-tertiary mb-1">完赛时间</div>
          <div className="text-sm font-mono text-brand-primary">{raceInfo.time}</div>
        </div>
        <div>
          <div className="text-xs text-text-tertiary mb-1">配速/英里</div>
          <div className="text-sm font-mono text-text-secondary">{raceInfo.pacePerMile}</div>
        </div>
        <div>
          <div className="text-xs text-text-tertiary mb-1">配速/公里</div>
          <div className="text-sm font-mono text-text-secondary">{raceInfo.pacePerKm}</div>
        </div>
      </div>
    </div>
  )
}
