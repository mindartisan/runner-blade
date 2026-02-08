"use client"

import type { HansonsTrainingPace } from "@/types"
import { TRAINING_TYPE_CONFIG } from "@/lib/hansons-race-calculator"

export default function TrainingPacesResult({
  trainingPaces
}: {
  trainingPaces: HansonsTrainingPace[]
}) {
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span className="w-1 h-6 bg-blue-500 rounded"></span>
        训练配速
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">
                训练类型
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
            {trainingPaces.map((pace, index) => {
              const config = TRAINING_TYPE_CONFIG[pace.type]
              return (
                <tr
                  key={pace.type}
                  className={`border-b border-border-light ${
                    index % 2 === 0 ? 'bg-theme-surface' : 'bg-theme-secondary'
                  }`}
                  style={{ borderLeft: `3px solid ${config.color}` }}
                >
                  <td className="py-3 px-4">
                    <div className="font-semibold" style={{ color: config.color }}>
                      {config.name}
                    </div>
                    <div className="text-xs text-text-tertiary">{config.nameEn}</div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono">
                    {pace.pacePerMile}
                  </td>
                  <td className="py-3 px-4 text-right font-mono">
                    {pace.pacePerKm}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
