"use client"

import type { HansonsEquivalentPerformance } from "@/types"

export default function EquivalentPerformancesResult({
  performances
}: {
  performances: HansonsEquivalentPerformance[]
}) {
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span className="w-1 h-6 bg-gray-500 rounded"></span>
        等效比赛成绩
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">
                距离
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-text-secondary">
                完赛时间
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-text-secondary">
                配速/英里
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-text-secondary">
                配速/公里
              </th>
            </tr>
          </thead>
          <tbody>
            {performances.map((perf, index) => (
              <tr
                key={perf.distance}
                className={`border-b border-border-light ${
                  index % 2 === 0 ? 'bg-theme-surface' : 'bg-theme-secondary'
                }`}
              >
                <td className="py-3 px-4 font-semibold">
                  {perf.distance}
                </td>
                <td className="py-3 px-4 text-right font-mono">
                  {perf.time}
                </td>
                <td className="py-3 px-4 text-right font-mono text-text-secondary">
                  {perf.pacePerMile}
                </td>
                <td className="py-3 px-4 text-right font-mono text-text-secondary">
                  {perf.pacePerKm}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
