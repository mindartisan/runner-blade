import Link from "next/link"
import { Tool } from "@/types"
import * as Icons from "lucide-react"

interface ToolCardProps {
  tool: Tool
}

export default function ToolCard({ tool }: ToolCardProps) {
  const IconComponent = Icons[tool.icon as keyof typeof Icons] as React.ComponentType<{ className?: string; style?: React.CSSProperties }>

  return (
    <Link href={`/tools/${tool.category}/${tool.slug}`}>
      <div className="card cursor-pointer group relative overflow-hidden">
        {/* 悬停光晕效果 */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
            opacity: 0.05
          }}
        />

        <div className="relative flex flex-col items-center text-center">
          {/* 图标容器 */}
          <div className="mb-4 p-4 relative">
            <div className="absolute inset-0 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ backgroundColor: 'var(--color-primary)', opacity: 0.1 }}
            />
            <div className="relative bg-theme-surface rounded-2xl p-4 border group-hover:scale-105 transition-all duration-300"
              style={{ borderColor: 'var(--color-border)' }}
            >
              {IconComponent && (
                <IconComponent
                  className="w-12 h-12 transition-colors duration-300"
                  style={{ color: 'var(--color-primary)' }}
                />
              )}
            </div>
          </div>

          <h3 className="text-xl font-bold mb-2 group-hover:underline decoration-2 underline-offset-2 transition-all duration-300" style={{ color: 'var(--color-text-primary)', textDecorationColor: 'var(--color-primary)' }}>
            {tool.name}
          </h3>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {tool.description}
          </p>

          {/* 底部装饰线 */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-16 h-0.5 rounded-full transition-all duration-300"
            style={{ backgroundColor: 'var(--color-primary)' }}
          />
        </div>
      </div>
    </Link>
  )
}
