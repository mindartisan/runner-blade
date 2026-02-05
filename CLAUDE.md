# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Runner Blade 是一个专业的跑步工具集合网站，基于 Next.js 16 App Router 架构。当前实现的核心功能是 **VDOT 计算器**（基于 Jack Daniels Running Formula）。

## 设计风格

- **速度科技风**: 刀锋元素 + 流体线条，深蓝/橙色渐变，霓虹光效
- **轻度拟物**: 精致阴影、物理质感、微互动反馈
- **Smartisan 设计理念**: 注重细节、精致动效、优雅交互

## 开发命令

```bash
# 开发服务器
npm run dev

# 生产构建
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
npm run lint:fix

# TypeScript 类型检查
npm run type-check

# 清理构建缓存
npm run clean

# 完全重装依赖
npm run reinstall

# 中文排版修复（自动添加中英文之间的空格）
npm run format:cn
# 或
npm run fix:cn
```

### package.json 依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| `next` | ^16.1.6 | React 框架 |
| `react` | ^18.3.0 | UI 库 |
| `react-dom` | ^18.3.0 | React DOM |
| `lucide-react` | ^0.400.0 | 图标库 |
| `typescript` | ^5.0.0 | TypeScript 编译器 |
| `tailwindcss` | ^3.4.0 | CSS 框架 |
| `postcss` | ^8.0.0 | CSS 后处理器 |
| `autoprefixer` | ^10.0.0 | CSS 前缀自动添加 |
| `eslint` | ^9.39.2 | 代码检查（ESLint 9 Flat Config） |
| `eslint-config-next` | ^16.1.6 | Next.js ESLint 配置 |
| `rimraf` | ^6.1.2 | 跨平台文件删除工具 |

## 技术栈

- **框架**: Next.js 16 (App Router)
- **UI**: React 18 + TypeScript
- **样式**: Tailwind CSS + PostCSS
- **图标**: lucide-react
- **字体**: Inter + Noto Sans SC (Google Fonts)
- **主题**: CSS 变量 + React Context
- **代码检查**: ESLint 9 (Flat Config)

## 项目架构

```
├── app/                           # Next.js App Router 页面
│   ├── layout.tsx                # 根布局（字体配置、元数据、主题提供者）
│   ├── page.tsx                  # 首页（工具网格展示）
│   ├── globals.css               # 全局样式（CSS 变量、Tailwind 层）
│   └── tools/                    # 各工具页面
│       └── jack-daniels/         # 杰克·丹尼尔斯分类
│           └── vdot/             # VDOT 计算器
│               └── page.tsx      # 页面入口（渲染 VDOTCalculator 组件）
├── components/                   # React 组件
│   ├── Header.tsx               # 全局头部导航
│   ├── Footer.tsx               # 全局底部信息
│   ├── Hero.tsx                 # 首页 Hero 区域
│   ├── ToolGrid.tsx             # 工具网格（带分类过滤）
│   ├── FilterTabs.tsx           # 分类过滤器标签
│   ├── ToolCard.tsx             # 工具卡片
│   ├── ClockWidget.tsx          # 时钟小组件
│   ├── ThemeToggle.tsx          # 主题切换按钮
│   └── vdot/                    # VDOT 专用组件目录
│       ├── VDOTCalculator.tsx        # 主容器组件
│       ├── InputForm.tsx             # 输入表单（距离、时间、配速、高级选项）
│       ├── TrainingDefinitions.tsx   # 训练类型定义展示（6种训练类型说明）
│       ├── VDOTOverview.tsx          # VDOT 概述信息卡片
│       ├── PaceTabs.tsx              # 配速标签页（比赛/训练/等效成绩）
│       └── AdvancedAdjustmentResult.tsx  # 高级调整结果展示（温度/海拔）
├── contexts/                     # React Context
│   └── ThemeContext.tsx         # 主题上下文（明暗/自动切换）
├── lib/                         # 核心业务逻辑（纯函数）
│   ├── vdot-calculator.ts       # VDOT 计算核心算法
│   ├── theme.ts                 # 主题配置和工具函数
│   └── tools-data.ts            # 工具元数据配置（分类、工具列表）
├── types/                       # TypeScript 类型定义
│   └── index.ts                 # 全局类型导出
├── scripts/                     # 工具脚本
│   └── fix-chinese-typesetting.js  # 中文排版自动修复
├── public/                      # 静态资源
├── eslint.config.js             # ESLint 9 Flat Config 配置
├── tailwind.config.ts           # Tailwind CSS 配置
├── tsconfig.json                # TypeScript 配置
└── next.config.js               # Next.js 配置
```

## 核心类型定义 (types/index.ts)

```typescript
// ========== 基础类型 ==========

// 配速单位
export type DistanceUnit = 'm' | 'km' | 'mi'

// 计算模式
export type CalculationMode = 'distance-time' | 'distance-pace' | 'time-pace'

// ========== VDOT 核心类型 ==========

// 配速范围
export interface PaceRange {
  slow: number   // 慢速配速（秒/公里）
  fast: number   // 快速配速（秒/公里）
  unit: string   // 'km' 或 'mi'
}

// 训练配速（6种训练类型）
export interface TrainingPaces {
  easy: PaceRange          // 轻松跑
  marathon: PaceRange      // 马拉松配速
  interval: PaceRange      // 间歇跑
  threshold: PaceRange     // 乳酸阈值
  rep: PaceRange           // 重复跑
  fastRep: PaceRange       // 快速重复跑
}

// 等效成绩
export interface EquivalentPerformance {
  distance: string         // 距离标签（如 "5K", "10K"）
  distanceMeters: number   // 距离（米）
  time: number             // 预测时间（秒）
  pacePerKm: number        // 每公里配速（秒）
  pacePerMile: number      // 每英里配速（秒）
}

// 配速细分（用户输入距离的详细配速）
export interface RacePaceBreakdown {
  distance: string         // 距离标签
  distanceMeters: number   // 距离（米）
  totalTime: number        // 完赛时间（秒）
  pacePerKm: number        // 每公里配速（秒）
  pacePerMile: number      // 每英里配速（秒）
  pace800m: number         // 800米配速（秒）
  pace400m: number         // 400米配速（秒）
}

// 高级调整显示模式
export type AdvancedDisplayMode = 'effect' | 'conversion'

// 高级调整（温度/海拔影响）
export interface AdvancedAdjustment {
  originalVdot: number        // 原始 VDOT
  slowerVdot: number          // 调整后较慢的 VDOT
  fasterVdot: number          // 调整后较快的 VDOT
  slowerTime: number          // 调整后较慢的时间（秒）
  fasterTime: number          // 调整后较快的时间（秒）
  effectTime: number          // 影响时间量（秒）
  paceDiff: number            // 配速差异（秒/公里）
  temperature?: number        // 温度值
  temperatureUnit?: number    // 0: °F, 1: °C
  altitude?: number           // 海拔值
  altitudeUnit?: number       // 0: ft, 1: m
  displayMode?: AdvancedDisplayMode  // 显示模式：'effect'（影响）或 'conversion'（转换）
}

// VDOT 计算结果
export interface VDOTResult {
  vdot: number                           // VDOT 分数
  trainingPaces: TrainingPaces           // 训练配速
  equivalentPerformances: EquivalentPerformance[]  // 等效成绩
  racePaceBreakdown?: RacePaceBreakdown  // 配速细分（可选）
}

// VDOT 计算错误类型（内联定义）
export interface VDOTCalculationError {
  type: 'invalid_distance' | 'invalid_time' | 'vdot_too_low' | 'vdot_too_high'
  message: string
  details?: {
    distance?: number
    time?: number
    calculatedVdot?: number
  }
}

// ========== 工具数据类型 ==========

// 工具分类
export interface ToolCategory {
  id: string
  name: string
}

// 工具信息
export interface Tool {
  id: string
  name: string
  description: string
  icon: string           // lucide-react 图标名称
  category: string       // 对应 ToolCategory.id
  slug: string           // URL 路径段
}
```

## 核心计算函数 (lib/vdot-calculator.ts)

### 常量定义

| 常量 | 值 | 说明 |
|------|-----|------|
| `KILOMETERS_TO_METERS` | 1000 | 公里转米 |
| `MILES_TO_METERS` | 1609.344 | 英里转米 |
| `MINUTES_TO_SECONDS` | 60 | 分钟转秒 |
| `SECONDS_TO_MINUTES` | 1/60 | 秒转分钟 |
| `SLOW_VDOT_LIMIT` | 39 | 慢速 VDOT 阈值 |

### 比赛距离常量 (RACE_DISTANCES)

```typescript
export const RACE_DISTANCES = [
  { label: "Marathon", value: 42195 },
  { label: "Half-Marathon", value: 21097.5 },
  { label: "15K", value: 15000 },
  { label: "10K", value: 10000 },
  { label: "5K", value: 5000 },
  { label: "3Mi", value: 4828.032 },
  { label: "2Mi", value: 3218.688 },
  { label: "3200m", value: 3200 },
  { label: "3K", value: 3000 },
  { label: "1Mi", value: 1609.344 },
  { label: "1600m", value: 1600 },
  { label: "1500m", value: 1500 },
]
```

### 核心计算函数

| 函数 | 说明 |
|------|------|
| `calculateVDOT(distanceMeters, timeSeconds)` | 主函数：计算 VDOT 分数，返回结果或错误 |
| `getVDOT(distanceMeters, timeSeconds)` | VDOT 核心计算公式 |
| `_getVO2(speedParam)` | VO2max 计算：-4.6 + 0.182258*v + 0.000104*v² |
| `_getVDOTSpeedParam(distanceMeters, timeMinutes)` | 速度参数（米/分钟），处理短距离调整 |
| `_isSlowVdot(vdot)` | 检查是否为慢速 VDOT (< 39) |
| `_getSRVDOT(vdot)` | 获取慢速 VDOT 的调整值 |
| `getTrainingPaces(vdot)` | 计算所有训练配速（6种类型） |
| `calculateRacePaceBreakdown(distanceMeters, timeSeconds)` | 计算用户输入距离的配速细分 |
| `calculateAdvancedAdjustment(...)` | 计算温度/海拔对成绩的影响 |
| `getDistanceFromTimeAndPace(timeSeconds, paceSeconds, paceUnit)` | 从时间和配速计算距离 |

#### 私有函数（内部实现）

| 函数 | 说明 |
|------|------|
| `getVDOT(distanceMeters, timeSeconds)` | VDOT 核心计算公式 |
| `_getVO2(speedParam)` | VO2max 计算：-4.6 + 0.182258*v + 0.000104*v² |
| `_getVDOTSpeedParam(distanceMeters, timeMinutes)` | 速度参数（米/分钟），处理短距离调整 |
| `_isSlowVdot(vdot)` | 检查是否为慢速 VDOT (< 39) |
| `_getSRVDOT(vdot)` | 获取慢速 VDOT 的调整值 |
| `getEasyPace(vdot, distanceMeters, isSlow)` | 计算轻松跑配速 |
| `getEasyPaceRange(vdot, distanceMeters, unit)` | 获取轻松跑配速范围 |
| `getMarathonPace(vdot, distanceMeters)` | 计算马拉松配速 |
| `getThresholdPace(vdot, distanceMeters)` | 计算乳酸阈值配速 |
| `getIntervalPace(vdot, distanceMeters)` | 计算间歇跑配速 |
| `getRepetitionPace(vdot, distanceMeters)` | 计算重复跑配速 |
| `getFastRepsPace(vdot, distanceMeters)` | 计算快速重复跑配速 |
| `getCustomTrainingPace(paceType, percentage, distanceMeters, vdot, unit)` | 计算自定义训练配速 |
| `getPredictedRaceTime(vdot, targetDistance)` | 预测比赛时间（牛顿迭代法）|
| `getEquivalentPerformances(vdot, distanceMeters, timeSeconds)` | 预测其他距离比赛成绩 |
| `getTemperatureEffect(temperature, unit, timeSeconds)` | 计算温度对时间的影响 |
| `getAltitudeEffect(altitude, unit, timeSeconds)` | 计算海拔对时间的影响 |
| `_getPaceVelocity(vdot)` | 计算配速速度 |
| `_getCustomEffortPace(vdot, distanceMeters, percentage)` | 计算自定义训练配速（核心）|
| `_secondsToMinutes(seconds)` | 秒转分钟 |
| `_minutesToSeconds(minutes)` | 分钟转秒 |
| `parseTime(timeStr)` | 解析时间字符串为秒数 |

### 工具函数

| 函数 | 说明 |
|------|------|
| `formatTime(seconds)` | 格式化时间字符串 (HH:MM:SS) |
| `formatTimeWithDecimal(seconds)` | 格式化带小数的时间 (MM:SS.ss) |
| `formatPace(secondsPerKm, unit)` | 格式化配速字符串 (MM:SS/km 或 MM:SS/mi) |

### 训练配速类型

| 类型 | 强度 | VO2max范围 | HRmax范围 | 说明 |
|------|------|-----------|-----------|------|
| Easy | 62-70% VDOT | 59-74% | 65-79% | 轻松跑（慢速VDOT使用SRVDOT调整）|
| Marathon | 84% VDOT | 75-84% | 80-90% | 马拉松配速 |
| Threshold | 88% VDOT | 83-88% | 88-92% | 乳酸阈值配速（慢速VDOT使用平均值）|
| Interval | 97.5% VDOT | 97-100% | 98-100% | 间歇跑配速（VO2max间歇）|
| Repetition | 比间歇快 6秒/400m | - | - | 重复跑配速（类似1500m/英里比赛）|
| FastRep | 比重复快 4秒/200m | - | - | 快速重复跑配速（类似800m比赛）|

### VDOT 等级评价

| 分数范围 | 等级 | 颜色（霓虹风格）|
|----------|------|-----------------|
| >= 60 | 精英 | #FF6B00 (霓虹橙) |
| >= 50 | 优秀 | #00D4FF (霓虹蓝) |
| >= 40 | 良好 | #00FFD4 (霓虹青) |
| >= 30 | 中等 | #A78BFA (紫色) |
| < 30 | 入门 | #94A3B8 (灰色) |

### 训练配速分组

训练配速按距离分组显示：

| 分组 | 包含距离 | 显示的训练类型 |
|------|----------|----------------|
| 长距离 | 1Mi, 1K | Easy, Marathon, Threshold, Interval, Rep |
| 中距离 | 1200m, 800m, 600m | Threshold, Interval, Rep |
| 短距离 | 400m, 300m, 200m | Interval, Rep, FastRep |

### 高级功能

| 功能 | 说明 |
|------|------|
| **配速计算模式** | 支持时间+配速计算距离、距离+配速计算时间 |
| **温度调整** | 计算温度对成绩的影响：(温度-15°C) × 0.16667 × 时间 |
| **海拔调整** | 计算海拔对成绩的影响：(海拔×0.004-3)/100 × 时间 |
| **单位自动转换** | 配速单位切换时，自定义距离自动同步并转换显示值 |
| **精确距离显示** | 显示计算出的精确距离值（如 42.353km）而非预设标签 |
| **错误处理** | 返回详细的错误类型和消息 |

### InputForm 输入模式

InputForm 组件支持三种计算模式：

| 模式 | 输入 | 输出 | 说明 |
|------|------|------|------|
| 距离+时间 | 选择/输入距离 + 输入时间 | VDOT、配速 | 基础模式，计算 VDOT 和训练配速 |
| 时间+配速 | 输入时间 + 输入配速 | 距离 | 自动计算并选择匹配的比赛距离 |
| 距离+配速 | 选择/输入距离 + 输入配速 | 时间 | 计算完成指定距离所需时间 |

**智能输入处理：**
- 配速单位切换时自动转换配速值（公里 ⇔ 英里）
- 修改时间时自动清除自动回填的配速
- 修改配速时清除自动回填标记
- 时间+配速→距离模式自动匹配预设距离或显示自定义距离

### 训练类型定义 (TrainingDefinitions.tsx)

基于 Jack Daniels Running Formula 的 6 种训练类型：

| 类型 | 英文 | 代码 | 变化 | 强度 | 目的 | 示例训练 |
|------|------|------|------|------|------|----------|
| 轻松跑 | Easy Pace | E | 热身、放松跑、恢复跑、一般长跑 | 59-74% VO₂max / 65-79% HRmax | 建立稳固基础，强化心肌 | 30-45 分钟 E |
| 马拉松配速 | Marathon Pace | M | 稳定跑或长重复跑 | 75-84% VO₂max / 80-90% HRmax | 体验比赛配速条件 | 10 分钟 E，60-90 分钟 M |
| 乳酸阈值 | Threshold Pace | T | 稳定、长距离或节奏跑，巡航间歇 | 83-88% VO₂max / 88-92% HRmax | 提高耐力 | 3 × 1 英里 T（1 分钟）或 20 分钟 T |
| 间歇跑 | Interval Pace | I | VO₂max 间歇跑 | 97-100% VO₂max / 98-100% HRmax | 给有氧能力施加压力 | 6 × 2 分钟 I（1 分钟慢跑） |
| 重复跑 | Rep Pace | R | 配速重复跑和加速跑 | 类似 1500m/英里比赛配速 | 提高速度和经济性 | 8 × 200m R（200m 慢跑） |
| 快速重复 | Fast Reps Pace | F | 800 米比赛配速重复跑 | 类似 800m 比赛配速 | 提高速度、无氧能力，学习 800m 配速 | 2 × 400m F（4 分钟慢跑） |

**训练配速颜色标识：**
- 轻松跑 (E): `#28a745` (绿色)
- 马拉松配速 (M): `#007bff` (蓝色)
- 乳酸阈值 (T): `#ffc107` (黄色)
- 间歇跑 (I): `#fd7e14` (橙色)
- 重复跑 (R): `#dc3545` (红色)
- 快速重复 (F): `#6f42c1` (紫色)

### VDOT 概述 (VDOTOverview.tsx)

VDOT（V̇O₂max）相关信息卡片包含三个部分：

| 标题 | 短码 | 颜色 | 内容说明 |
|------|------|------|----------|
| VDOT 是什么 | VDOT | 绿色 #28a745 | 衡量有氧能力的指标，由 Jack Daniels 开发，可预测表现和计算训练配速 |
| 科学原理 | Science | 蓝色 #007bff | 基于 Jack Daniels 训练体系，通过比赛成绩计算 VO₂max，已被验证超过 40 年 |
| 提升方法 | Tips | 黄色 #ffc107 | 帮助跑者以正确高效方式训练，减少努力获得最大效果，防止过度训练 |

### 高级调整显示模式 (AdvancedDisplayMode)

`AdvancedAdjustmentResult` 组件支持两种显示模式：

| 模式 | 值 | 说明 | 显示内容 | 颜色标识 |
|------|-----|------|----------|----------|
| 影响模式 | `'effect'` | 显示环境因素导致的预期变慢结果 | slowerVdot, slowerTime, 预期配速 | 霓虹蓝 #00D4FF |
| 转换模式 | `'conversion'` | 显示排除环境因素后的推算变快结果 | fasterVdot, fasterTime, 推算配速 | 霓虹青 #00FFD4 |

**模式切换效果：**
- 训练配速根据选择的模式动态重新计算
- 等效成绩根据选择的模式动态更新
- VDOT 分数显示原始值 → 调整后值的变化

### VDOT 计算错误处理

| 错误类型 | 条件 | 消息 |
|----------|------|------|
| `invalid_distance` | distance <= 0 | "距离必须大于 0" |
| `invalid_time` | time <= 0 | "时间必须大于 0" |
| `vdot_too_low` | vdot <= 0 | "VDOT 值无效，请输入实际的成绩数据" |
| `vdot_too_high` | vdot >= 100 | "VDOT 值超出支持范围（最大 100）" |

## 工具数据配置 (lib/tools-data.ts)

### 工具分类 (TOOL_CATEGORIES)

```typescript
export const TOOL_CATEGORIES: ToolCategory[] = [
  { id: "all", name: "全部" },
  { id: "jack-daniels", name: "杰克·丹尼尔斯" },
]
```

### 工具列表 (TOOLS)

```typescript
export const TOOLS: Tool[] = [
  {
    id: "vdot",
    name: "VDOT 计算器",
    description: "根据比赛成绩计算 VDOT 分数和训练配速",
    icon: "Calculator",
    category: "jack-daniels",
    slug: "vdot",
  },
]
```

### 路由规则

```
工具路由模式: /tools/{category}/{slug}

示例:
- VDOT 计算器: /tools/jack-daniels/vdot
```

## 主题系统 (lib/theme.ts + contexts/ThemeContext.tsx)

### 主题模式

```typescript
export type ThemeMode = 'light' | 'dark' | 'auto'
export type ActualThemeMode = 'light' | 'dark'
```

### 主题切换函数

| 函数 | 说明 |
|------|------|
| `applyTheme(theme)` | 应用指定主题到 CSS 变量 |
| `getTheme(mode)` | 获取当前主题（考虑自动模式）|
| `getThemeByTime()` | 根据时间获取主题（同步，默认 6:00-18:00 为白天）|
| `getThemeByTimeAsync()` | 根据日出日落获取主题（异步，调用 API）|

### ThemeContext Hooks

| Hook/属性 | 说明 |
|-----------|------|
| `useTheme()` | 获取主题上下文 |
| `mode` | 当前模式（'light' / 'dark' / 'auto'）|
| `actualMode` | 实际应用的主题（'light' / 'dark'）|
| `theme` | 主题配置对象 |
| `setMode(mode)` | 设置主题模式 |
| `toggleTheme()` | 切换主题（auto → light → dark → auto）|
| `isLoadingSunTime` | 是否正在加载日出日落时间 |

### CSS 变量

#### 夜间模式（默认）
```css
--color-background: #0A1628              /* 深空蓝背景 */
--color-background-secondary: #0D1F35    /* 次级背景 */
--color-surface: #122542                 /* 卡片表面 */
--color-text-primary: #FFFFFF            /* 主文本 */
--color-text-secondary: #94A3B8          /* 次文本 */
--color-text-tertiary: #64748B           /* 三级文本 */
--color-primary: #00D4FF                 /* 霓虹蓝 */
--color-secondary: #FF6B00               /* 霓虹橙 */
--color-accent: #00FFD4                  /* 霓虹青 */
--color-border: rgba(255, 255, 255, 0.15) /* 边框 */
--color-border-light: rgba(255, 255, 255, 0.08) /* 浅边框 */
--shadow-card: 0 4px 16px rgba(0, 0, 0, 0.4), 0 1px 4px rgba(0, 0, 0, 0.3)
--shadow-card-hover: 0 8px 32px rgba(0, 212, 255, 0.15), 0 2px 8px rgba(0, 0, 0, 0.4)
--shadow-button: 0 4px 12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)
```

#### 白天模式
```css
--color-background: #F8FAFC              /* slate-50 */
--color-background-secondary: #F1F5F9    /* slate-100 */
--color-surface: #FFFFFF                 /* 白色 */
--color-text-primary: #1E293B            /* slate-800 */
--color-text-secondary: #475569          /* slate-600 */
--color-text-tertiary: #94A3B8           /* slate-400 */
--color-primary: #0EA5E9                 /* sky-500 */
--color-secondary: #F97316               /* orange-500 */
--color-accent: #06B6D4                  /* cyan-500 */
--color-border: #E2E8F0                  /* slate-200 */
--color-border-light: #F1F5F9            /* slate-100 */
--shadow-card: 0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)
--shadow-card-hover: 0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06)
--shadow-button: 0 4px 12px rgba(14, 165, 233, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)
```

### 主题切换行为

| 当前模式 | 切换后 | 说明 |
|----------|--------|------|
| auto | light | 强制使用白天模式 |
| light | dark | 强制使用夜间模式 |
| dark | auto | 自动根据时间/日出日落切换 |

### 日出日落 API

- **API 端点**: `https://api.sunrise-sunset.org/json`
- **缓存策略**: 同一天的数据缓存 1 小时
- **回退机制**: API 失败时使用默认时间（6:00-18:00）
- **轮询间隔**: 在 auto 模式下每 60 秒检查一次

## 页面结构

### 首页 (app/page.tsx)

```
HomePage
├── Header（顶部导航）
│   ├── Logo/标题
│   ├── 导航链接
│   └── 主题切换按钮
├── Hero（Hero 区域）
│   ├── 主标题：让跑步训练更科学
│   ├── 副标题：专业的跑步工具集合...
│   ├── CTA 按钮：开始使用、了解更多
│   ├── 背景装饰光晕（仅夜间模式）
│   └── ClockWidget（时钟小组件）
├── ToolGrid（工具网格 + 分类过滤）
│   ├── FilterTabs（分类过滤器）
│   └── ToolCard 列表（响应式网格）
└── Footer（底部信息）
```

### 首页组件详情

| 组件 | 文件 | 说明 |
|------|------|------|
| Header | [Header.tsx](components/Header.tsx) | 全局头部导航，包含返回链接和主题切换 |
| Hero | [Hero.tsx](components/Hero.tsx) | 首页 Hero 区域，背景光晕装饰，响应式布局 |
| ToolGrid | [ToolGrid.tsx](components/ToolGrid.tsx) | 工具网格，支持分类过滤 |
| FilterTabs | [FilterTabs.tsx](components/FilterTabs.tsx) | 分类过滤器标签，激活状态带光晕效果 |
| ToolCard | [ToolCard.tsx](components/ToolCard.tsx) | 工具卡片，悬停光晕效果，lucide-react 图标 |
| ClockWidget | [ClockWidget.tsx](components/ClockWidget.tsx) | 时钟小组件，数字发光效果，12 个刻度装饰 |
| Footer | [Footer.tsx](components/Footer.tsx) | 全局底部信息，版权和链接 |

### VDOT 计算器页面 (app/tools/jack-daniels/vdot/page.tsx)

```
VDOTCalculator (主容器)
├── Header (顶部导航)
│   ├── 返回按钮
│   ├── 标题 "VDOT 计算器"
│   └── 主题切换按钮
├── 主内容区 (5列网格布局)
│   ├── 左侧 (3列, 60%)
│   │   └── TrainingDefinitions (训练类型定义)
│   └── 右侧 (2列, 40%)
│       ├── VDOTOverview (VDOT概述)
│       ├── InputForm (输入表单)
│       ├── VDOT分数显示卡片
│       └── AdvancedAdjustmentResult (高级调整结果)
└── PaceTabs (底部标签页)
    ├── 比赛配速 (RacePacesContent)
    ├── 训练配速 (TrainingPacesContent)
    └── 等效成绩 (EquivalentPerformancesContent)
```

### PaceTabs 组件详情

PaceTabs 组件提供三个标签页展示不同的配速数据：

| 标签页 | 内容 | 数据来源 | 表格列 |
|--------|------|----------|--------|
| 比赛配速 | 用户输入距离的配速细分 | `racePaceBreakdown` | 距离、配速 |
| 训练配速 | 按距离分组的训练配速 | `trainingPaces` | 类型、各距离完成时间 |
| 等效成绩 | 各距离的预测比赛成绩 | `equivalentPerformances` | 距离、完赛时间、配速/英里、配速/公里 |

**比赛配速显示内容：**
- 用户输入的距离标签（如 "Marathon" 或精确距离 "42.195km"）
- 完赛总时间
- 每英里配速
- 每公里配速
- 800米配速
- 400米配速

**训练配速分组：**
- 长距离组 (1Mi, 1K): Easy, Marathon, Threshold, Interval, Rep
- 中距离组 (1200m, 800m, 600m): Threshold, Interval, Rep
- 短距离组 (400m, 300m, 200m): Interval, Rep, FastRep

## 组件开发规范

### 1. 交互组件

所有带交互的组件必须声明 `"use client"`：

```tsx
"use client"

import { useState } from "react"

export default function MyComponent() {
  // ...
}
```

### 2. 主题系统

使用 CSS 变量实现主题切换：

```tsx
// 访问主题颜色
style={{ color: 'var(--color-text-primary)' }}
style={{ backgroundColor: 'var(--color-primary)' }}
```

可用的 CSS 变量：

| 变量 | 说明 |
|------|------|
| `--color-background` | 背景色 |
| `--color-background-secondary` | 次级背景色 |
| `--color-surface` | 卡片表面色 |
| `--color-text-primary` | 主文本色 |
| `--color-text-secondary` | 次文本色 |
| `--color-text-tertiary` | 三级文本色 |
| `--color-primary` | 主色（霓虹蓝/天蓝）|
| `--color-secondary` | 次色（霓虹橙/橙色）|
| `--color-accent` | 强调色（霓虹青/青色）|
| `--color-border` | 边框色 |
| `--color-border-light` | 浅边框色 |
| `--shadow-card` | 卡片阴影 |
| `--shadow-card-hover` | 卡片悬停阴影 |
| `--shadow-button` | 按钮阴影 |

### Tailwind 主题变量映射

在 `tailwind.config.ts` 中定义的 Tailwind 类别名：

| Tailwind 类 | CSS 变量 | 说明 |
|-------------|----------|------|
| `bg-theme-background` | `--color-background` | 背景色 |
| `bg-theme-secondary` | `--color-background-secondary` | 次级背景 |
| `bg-theme-surface` | `--color-surface` | 卡片表面 |
| `text-text-primary` | `--color-text-primary` | 主文本 |
| `text-text-secondary` | `--color-text-secondary` | 次文本 |
| `text-text-tertiary` | `--color-text-tertiary` | 三级文本 |
| `text-brand-primary` | `--color-primary` | 主色文本 |
| `text-brand-secondary` | `--color-secondary` | 次色文本 |
| `text-brand-accent` | `--color-accent` | 强调色文本 |
| `border-border` | `--color-border` | 边框 |
| `border-border-light` | `--color-border-light` | 浅边框 |
| `shadow-card` | `--shadow-card` | 卡片阴影 |
| `shadow-card-hover` | `--shadow-card-hover` | 悬停阴影 |
| `shadow-button` | `--shadow-button` | 按钮阴影 |

### 3. Tailwind 样式类

项目使用 Tailwind CSS，常用类：

| 用途 | 类名 |
|------|------|
| 卡片 | `card` |
| 主按钮 | `btn-primary` |
| 次按钮 | `btn-secondary` |
| 输入框 | `input-skeuo` |
| 居中输入框（时间/配速） | `input-skeuo-center` |
| 下拉框 | `select-skeuo` |
| 玻璃拟态行 | `glass-row` |

### globals.css 样式类详细定义

在 `app/globals.css` 中定义的样式类：

```css
/* 卡片样式 - 轻度拟物风格 */
.card {
  background-color: var(--color-surface);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-card);
  transition: all 300ms;
  backdrop-filter: blur(8px);
}

/* 主按钮 - 渐变背景 + 光晕效果 */
.btn-primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  padding: 0.75rem 2rem;
  border-radius: 0.75rem;
  font-weight: 600;
  box-shadow: var(--shadow-button);
}
.btn-primary:hover {
  transform: scale(1.02);
  box-shadow: 0 0 20px var(--color-primary);
}

/* 输入框 - 内嵌阴影拟物效果 */
.input-skeuo {
  background-color: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 数字输入框隐藏箭头 */
.input-skeuo::-webkit-outer-spin-button,
.input-skeuo::-webkit-inner-spin-button,
.input-skeuo-center::-webkit-outer-spin-button,
.input-skeuo-center::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.input-skeuo, .input-skeuo-center {
  -moz-appearance: textfield;
}

/* 玻璃拟态行 */
.glass-row {
  background-color: var(--color-background-secondary);
  border-radius: 0.75rem;
  border: 1px solid var(--color-border);
  backdrop-filter: blur(4px);
}
```

### 4. 工具扩展模式

添加新工具需遵循以下约定：

1. **类型定义**: 在 `types/index.ts` 添加工具相关的类型
2. **工具注册**: 在 `lib/tools-data.ts` 添加配置
   - 在 `TOOL_CATEGORIES` 添加分类（如需要）
   - 在 `TOOLS` 数组添加工具配置
   - 必需字段: `id`, `name`, `description`, `icon`, `category`, `slug`
3. **页面路由**: 在 `app/tools/{category}/{slug}/page.tsx` 创建页面
4. **组件组织**: 在 `components/{tool-id}/` 创建专属组件
   - 主容器组件命名: `{ToolId}Calculator.tsx`
   - 使用 `"use client"` 指令

### 可用分类

当前可用分类（在 `lib/tools-data.ts` 的 `TOOL_CATEGORIES` 中定义）：

| ID | 名称 |
|----|------|
| `all` | 全部 |
| `jack-daniels` | 杰克·丹尼尔斯 |

## 设计原则

### SOLID 原则

- **S (单一职责)**: 每个组件/函数只做一件事
  - `lib/vdot-calculator.ts` 中的函数都是纯函数，职责单一
- **O (开闭原则)**: 易扩展，无需修改现有代码
  - 添加新工具只需在 `tools-data.ts` 添加配置
- **L (里氏替换)**: 子类型可替换父类型
- **I (接口隔离)**: 接口专一，避免"胖接口"
- **D (依赖倒置)**: 依赖抽象而非具体实现

### KISS (简单至上)

- 追求代码和设计的极致简洁
- 拒绝不必要的复杂性
- 优先选择最直观的解决方案

### DRY (杜绝重复)

- 自动识别重复代码模式
- 统一相似功能的实现方式
- 使用私有函数封装内部逻辑
- 避免导出未使用的函数和类型

## TypeScript 配置

### 路径别名

```json
"paths": {
  "@/*": ["./*"]
}
```

使用示例：
```tsx
import { calculateVDOT } from "@/lib/vdot-calculator"
import { VDOTResult } from "@/types"
```

### 编译选项

- `strict: true` - 启用所有严格检查
- `target: ES2017` - 目标 ES2017
- `moduleResolution: bundler` - 使用 bundler 解析

## 常见问题

### VDOT 计算返回错误

可能原因和对应的错误类型：
1. **距离 <= 0**: 返回 `invalid_distance` 错误
2. **时间 <= 0**: 返回 `invalid_time` 错误
3. **VDOT <= 0**: 返回 `vdot_too_low` 错误
4. **VDOT >= 100**: 返回 `vdot_too_high` 错误

### 主题不生效

确保：
1. `ThemeProvider` 包裹在根 layout 中
2. 使用 CSS 变量而不是硬编码颜色
3. 检查 `lib/theme.ts` 中的主题配置

### 添加新工具的步骤

1. 在 `types/index.ts` 添加工具相关类型
2. 在 `lib/tools-data.ts` 的 `TOOLS` 数组添加配置
3. 创建 `components/{tool-id}/` 目录和组件
4. 创建 `app/tools/{category}/{slug}/page.tsx` 页面
5. 在 `lib/` 添加工具的业务逻辑（保持纯函数）

## 开发建议

1. **移动优先**: 响应式设计使用 `md:` 断点
2. **类型安全**: 充分利用 TypeScript 类型检查
3. **纯函数**: lib 目录下的函数保持纯函数特性
4. **错误处理**: 使用友好的错误提示而不是 console.error
5. **组件拆分**: 保持组件小而专一，便于复用和维护
6. **状态提升**: 共享状态提升到最近的共同父组件
7. **Ref 使用**: 使用 ref 跟踪不触发重渲染的值（如自动回填标记）
8. **useEffect 清理**: 在 useEffect 中清理副作用和定时器

## VDOTCalculator 组件状态管理

VDOTCalculator 使用以下状态模式：

| 状态 | 类型 | 说明 |
|------|------|------|
| `result` | `CalculationResult \| null` | 计算结果，包含 VDOT、训练配速、等效成绩等 |
| `calculatedPace` | `CalculatedPace \| null` | 计算出的配速（公里和英里）|
| `currentPaceUnit` | `'km' \| 'mi'` | 当前配速单位 |
| `advancedMode` | `'temperature' \| 'altitude' \| 'off'` | 高级选项模式 |
| `advancedDisplayMode` | `AdvancedDisplayMode` | 高级调整显示模式（effect/conversion）|
| `error` | `string \| null` | 错误消息 |

**自动重新计算触发条件：**
- `advancedDisplayMode` 变化时，自动重新计算训练配速和等效成绩
- 使用 `useEffect` 监听模式变化，更新结果中的相关数据

## InputForm 组件智能输入

InputForm 实现了智能输入处理逻辑：

| 场景 | 行为 |
|------|------|
| 用户手动修改配速 | 清除自动回填标记，保留用户输入 |
| 用户手动修改时间 | 清除自动回填的配速 |
| 用户手动修改自定义距离 | 清除存储的计算距离 |
| 配速单位切换 | 自动转换配速值（仅在非自动回填时）|
| 时间+配速→距离 | 自动匹配预设距离或设置为自定义距离 |

**使用的 Ref：**
- `lastCalculatedPaceRef`: 跟踪配速是否为自动回填
- `calculatedDistanceKmRef`: 存储计算的公里距离
- `calculatedDistanceMiRef`: 存储计算的英里距离
- `isAutoSelectingDistanceRef`: 防止自动选择触发清空逻辑

## 中文排版规范

项目提供自动修复脚本：

```bash
npm run format:cn
```

该脚本会自动在中英文之间添加空格，提升排版可读性。

### fix-chinese-typesetting.js 脚本规则

中文排版修复脚本 (`scripts/fix-chinese-typesetting.js`) 应用以下规则：

| 规则 | 模式 | 替换 | 说明 |
|------|------|------|------|
| 中英文空格 | `([\u4e00-\u9fa5])([A-Za-z])` | `$1 $2` | 中文后跟英文加空格 |
| 英文中空格 | `([A-Za-z])([\u4e00-\u9fa5])` | `$1 $2` | 英文后跟中文加空格 |
| 中文数字空格 | `([\u4e00-\u9fa5])([0-9])` | `$1 $2` | 中文后跟数字加空格 |
| 数字中文空格 | `([0-9])([\u4e00-\u9fa5])` | `$1 $2` | 数字后跟中文加空格 |
| VO₂max 下标 | `\bVO[Uu]?2[\s_]?max\b` | `VO₂max` | 统一 VO₂max 格式 |
| 全角括号 | `\(可选\)` | `（可选）` | 中文使用全角标点 |

### 配置文件详情

#### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {}
module.exports = nextConfig
```
当前使用默认配置，可根据需要添加优化选项。

#### tsconfig.json
```json
{
  "compilerOptions": {
    "strict": true,              // 启用严格模式
    "target": "ES2017",           // 目标 ES2017
    "moduleResolution": "bundler", // 使用 bundler 解析
    "jsx": "preserve",            // 保留 JSX
    "paths": {
      "@/*": ["./*"]             // 路径别名
    }
  }
}
```

#### postcss.config.js
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},   // Tailwind CSS
    autoprefixer: {}, // 自动添加浏览器前缀
  },
}
```

#### eslint.config.js
```javascript
const eslintConfig = [
  // 忽略文件和目录（必须在其他配置之前）
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/out/**',
      '**/build/**',
    ],
  },
  // 应用配置
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // 基础规则
      'no-console': 'warn',
      'no-unused-vars': 'off',
    },
  },
];

module.exports = eslintConfig;
```
使用 ESLint 9 Flat Config 格式（最小化配置，可根据需要扩展）。

## 设计细节

### 霓虹光效系统

项目使用渐变和阴影实现霓虹光效：

| 元素 | 夜间模式 | 白天模式 |
|------|----------|----------|
| 主色光晕 | `radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)` | `radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)` |
| 次色光晕 | `radial-gradient(circle, rgba(255,107,0,0.15) 0%, transparent 70%)` | 类似白天模式主色 |
| 卡片悬停 | 内边框发光 + 背景渐变 | 简化阴影效果 |

### 动画效果

| 动画类 | 用途 | 持续时间 |
|--------|------|----------|
| `animate-in fade-in slide-in-from-top-2` | 内容淡入滑入 | 300ms |
| `transition-all duration-200` | 交互状态过渡 | 200ms |
| `transition-all duration-300` | 主题切换、悬停效果 | 300ms |
| `hover:scale-105` | 按钮悬停缩放 | 默认 |

### 玻璃拟态效果

使用 `glass-row` 类实现玻璃拟态行：

```css
/* 在 globals.css 中定义 */
.glass-row {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### 图标系统

项目使用 **lucide-react** 图标库：

```tsx
import * as Icons from "lucide-react"
import { Tool } from "@/types"

// 动态渲染图标
const IconComponent = Icons[tool.icon as keyof typeof Icons]
```

常用图标：
- `Calculator` - VDOT 计算器
- `Sun`, `Moon`, `SunMoon` - 主题切换
- `ArrowLeft` - 返回按钮
- `Activity` - Logo 图标
- `Info` - 信息提示

### ClockWidget 组件详情

ClockWidget 是首页 Hero 区域的时钟小组件，具有以下特性：

| 特性 | 说明 |
|------|------|
| **尺寸** | 256×256px (w-64 h-64) |
| **更新频率** | 每秒更新 (1000ms interval) |
| **时间格式** | HH:MM:SS (24小时制，zh-CN locale) |
| **刻度装饰** | 12 个刻度线，每 30° 旋转一个 |
| **发光效果** | 数字发光 (blur-lg, opacity 0.15) |
| **脉冲指示** | 橙色圆点动画 (animate-pulse) |
| **玻璃反光** | 渐变叠加层 (135deg, rgba(255,255,255,0.1)) |

**层次结构：**
```
ClockWidget (256×256)
├── 外层边框 (渐变背景)
├── 内层表面 (内嵌阴影)
│   └── 数字显示屏区域
│       ├── 12 个刻度装饰
│       ├── 时间显示 (发光效果)
│       ├── 秒表标签 (RunnerBlade + 脉冲点)
│       └── 玻璃反光效果
```

### Header 组件详情

Header 是全局顶部导航栏：

| 特性 | 说明 |
|------|------|
| **固定定位** | sticky top-0, backdrop-blur-md |
| **层级** | z-50 |
| **Logo** | Activity 图标 + RunnerBlade 文字 |
| **悬停效果** | Logo 图标发光 (blur-sm, opacity 0.15) |
| **主题切换** | 右侧 ThemeToggle 按钮 |
| **背景透明度** | rgba(80%, 支持 backdrop-filter) |

### Footer 组件详情

Footer 是全局底部信息栏：

| 内容 | 说明 |
|------|------|
| **链接** | 关于我们、隐私政策、联系我们 |
| **版权** | © {年份} RunnerBlade. All rights reserved. |
| **悬停效果** | 下划线装饰 (decoration-2, underline-offset-2) |
| **下划线颜色** | 主色 (var(--color-primary)) |
| **布局** | 响应式 (移动端垂直，桌面端水平) |

## 性能优化建议

1. **组件懒加载**: 使用 `next/dynamic` 懒加载大型组件
2. **图片优化**: 使用 Next.js Image 组件
3. **代码分割**: 按路由自动分割代码
4. **CSS 优化**: 使用 Tailwind 的 JIT 模式
5. **避免不必要的重渲染**: 使用 `useMemo` 和 `useCallback`

## 文件命名约定

| 类型 | 约定 | 示例 |
|------|------|------|
| 组件文件 | PascalCase | `VDOTCalculator.tsx`, `Header.tsx` |
| 工具组件目录 | 小写 + kebab-case | `components/vdot/` |
| 页面文件 | 小写 + kebab-case | `app/tools/jack-daniels/vdot/page.tsx` |
| 工具函数 | camelCase | `vdot-calculator.ts`, `theme.ts` |
| 类型定义 | 统一导出 | `types/index.ts` |
| 配置文件 | kebab-case | `next.config.js`, `tailwind.config.ts` |

## 代码组织最佳实践

### lib/ 目录规范

- **纯函数原则**: 所有导出函数应为纯函数，无副作用
- **类型导出**: 使用 `export` 导出类型，便于类型推导
- **常量定义**: 文件顶部定义常量，使用 UPPER_CASE
- **工具函数**: 使用 `_` 前缀标记内部函数

```typescript
// ✅ 正确示例
export const CONSTANT_VALUE = 1000

export function publicFunction(input: number): number {
  return _privateHelper(input)
}

function _privateHelper(value: number): number {
  return value * 2
}
```

### components/ 目录规范

- **"use client" 指令**: 交互组件必须声明
- **Props 接口**: 使用 interface 定义 props
- **默认导出**: 组件使用 `export default`
- **类型导入**: 优先使用类型导入 `import { type }`

```typescript
// ✅ 正确示例
"use client"

import { useState } from "react"
import { type VDOTResult } from "@/types"

interface MyComponentProps {
  result: VDOTResult
  onAction: () => void
}

export default function MyComponent({ result, onAction }: MyComponentProps) {
  // ...
}
```

### 样式使用规范

- **CSS 变量优先**: 使用 `var(--color-xxx)` 而非硬编码
- **Tailwind 类优先**: 优先使用 Tailwind 类而非内联样式
- **内联样式例外**: 动态值（如颜色、渐变）使用内联样式
- **响应式**: 移动优先，使用 `md:` 断点

```typescript
// ✅ 正确示例
<div className="card p-4 md:p-6" style={{ color: 'var(--color-text-primary)' }}>

// ❌ 避免硬编码颜色
<div style={{ color: '#FFFFFF' }}>
```

## 调试技巧

### React DevTools

1. **组件树查看**: 检查组件层级和 props
2. **状态检查**: 使用 Profiler 监控性能
3. **Console 日志**: 使用 `console.log` 调试（生产环境需移除）

### 常见问题排查

| 问题 | 可能原因 | 解决方法 |
|------|----------|----------|
| 主题不切换 | ThemeProvider 未包裹 | 检查 `app/layout.tsx` |
| 样式未生效 | Tailwind 类名错误 | 检查类名拼写和 `tailwind.config.ts` |
| 路由 404 | 路径大小写错误 | Next.js 路由区分大小写 |
| 类型错误 | 类型未导入 | 检查 `types/index.ts` 导出 |
| VDOT 计算错误 | 输入数据格式错误 | 检查距离和时间单位 |

### 性能分析

使用 React DevTools Profiler：

```typescript
import { Profiler } from "react"

function onRenderCallback(
  id: string,
  phase: "mount" | "update",
  actualDuration: number,
  baseDuration: number
) {
  console.log({ id, phase, actualDuration, baseDuration })
}

<Profiler id="VDOTCalculator" onRender={onRenderCallback}>
  <VDOTCalculator />
</Profiler>
```

## 浏览器兼容性

| 浏览器 | 最低版本 | 说明 |
|--------|----------|------|
| Chrome | 最新 2 个版本 | 主要开发浏览器 |
| Firefox | 最新 2 个版本 | 支持 CSS 变量和 backdrop-filter |
| Safari | 最新 2 个版本 | 支持 CSS 变量和 backdrop-filter |
| Edge | 最新 2 个版本 | 基于 Chromium |

**关键特性支持：**
- CSS 变量 (`var()`) - 现代浏览器完全支持
- backdrop-filter - 需要 Safari 9+、Chrome 76+
- 渐变背景 - 所有现代浏览器

## 项目扩展指南

### 添加新工具步骤

根据工具扩展模式，添加新工具需要：

1. **定义类型** ([types/index.ts](types/index.ts))
```typescript
// 工具相关的类型定义
export interface NewToolResult {
  // 结果数据结构
}
```

2. **注册工具** ([lib/tools-data.ts](lib/tools-data.ts))
```typescript
// 在 TOOL_CATEGORIES 添加分类（如需要）
export const TOOL_CATEGORIES: ToolCategory[] = [
  // ...existing categories
  { id: "new-category", name: "新分类" },
]

// 在 TOOLS 添加工具
export const TOOLS: Tool[] = [
  // ...existing tools
  {
    id: "new-tool",
    name: "新工具",
    description: "工具描述",
    icon: "Calculator",
    category: "new-category",
    slug: "new-tool",
  },
]
```

3. **创建页面** ([app/tools/new-category/new-tool/page.tsx](app/tools/new-category/new-tool/page.tsx))
```typescript
import NewToolCalculator from "@/components/new-tool/NewToolCalculator"

export default function NewToolPage() {
  return <NewToolCalculator />
}
```

4. **创建组件** ([components/new-tool/NewToolCalculator.tsx](components/new-tool/NewToolCalculator.tsx))
```typescript
"use client"

export default function NewToolCalculator() {
  // 工具实现
}
```

5. **添加业务逻辑** ([lib/new-tool-calculator.ts](lib/new-tool-calculator.ts))
```typescript
// 纯函数实现工具核心逻辑
export function calculateNewTool(input: InputType): ResultType {
  // 计算逻辑
}
```

### 可用的图标（lucide-react）

计算类图标：
- `Calculator` - 计算器
- `Activity` - 活动/运动
- `TrendingUp` - 趋势向上
- `Target` - 目标
- `Zap` - 快速/闪电

导航类图标：
- `Home`, `ArrowLeft`, `ArrowRight`
- `Menu`, `X`

用户类图标：
- `User`, `Settings`, `Info`, `Help`

更多图标参考：[lucide.dev](https://lucide.dev/)

## 未来规划

### 短期计划
- [ ] 添加更多跑步工具（配速计算器、心率区间计算器）
- [ ] 支持数据导出功能（PDF、CSV）

### 中期计划
- [ ] 多语言支持（i18n）

### 长期计划
- [ ] AI 训练计划生成
- [ ] 移动端 App

## 更新日志

### 2026-02-05 - 依赖和工具链优化

**Next.js 升级**
- 从 Next.js 15.5.11 升级到 Next.js 16.1.6
- 解决 @next/swc 版本不匹配问题

**ESLint 升级**
- 从 ESLint 8 升级到 ESLint 9.39.2
- 迁移到 ESLint 9 Flat Config 格式（eslint.config.js）
- eslint-config-next 升级到 16.1.6

**新增工具**
- 添加 `rimraf@6.1.2` 跨平台文件删除工具
- 添加 `@eslint/eslintrc@3.3.3` ESLint 配置兼容性工具

**新增脚本命令**
- `npm run type-check` - TypeScript 类型检查（不生成文件）
- `npm run clean` - 清理构建缓存和输出目录
- `npm run reinstall` - 完全重装所有依赖

**依赖树优化**
- 运行 `npm dedupe` 优化依赖树，减少重复依赖

**配置文件变更**
- 移除 `.eslintrc.js`（旧格式）
- 新增 `eslint.config.js`（ESLint 9 Flat Config 格式）
