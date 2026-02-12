"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity } from "lucide-react"
import ThemeToggle from "./ThemeToggle"

// 页面标题映射
const PAGE_TITLES: Record<string, string> = {
  "/tools/jack-daniels/vdot": "VDOT 计算器",
  "/tools/hansons/race-equivalency": "汉森比赛等效计算器",
}

export default function Header() {
  const pathname = usePathname()
  const pageTitle = PAGE_TITLES[pathname] || "RunnerBlade"

  return (
    <header className="w-full py-4 px-6 md:px-12 sticky top-0 z-50 backdrop-blur-md border-b border-border" style={{ backgroundColor: 'rgba(var(--color-background), 0.8)' }}>
      <nav className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <Activity className="w-8 h-8 transition-all duration-300 rounded-lg" style={{ color: 'var(--color-primary)' }} />
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm" style={{ backgroundColor: 'var(--color-primary)', opacity: 0.15 }} />
          </div>
          <span className="text-xl font-bold tracking-wide" style={{ color: 'var(--color-text-primary)' }}>
            {pageTitle === "RunnerBlade" ? (
              <>
                Runner<span style={{ color: 'var(--color-secondary)' }}>Blade</span>
              </>
            ) : (
              pageTitle
            )}
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
