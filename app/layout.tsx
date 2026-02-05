import type { Metadata } from "next"
import { Inter, Noto_Sans_SC } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/contexts/ThemeContext"

const inter = Inter({ subsets: ["latin"] })
const notoSansSC = Noto_Sans_SC({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Runner Blade - 跑者工具站",
  description: "专业的跑步工具集合，帮助跑者科学训练",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} ${notoSansSC.className}`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
