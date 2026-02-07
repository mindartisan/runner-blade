import { Tool, ToolCategory } from "@/types"

// ============================================================================
// 工具分类配置
// ============================================================================
/**
 * 工具分类列表
 * 用于首页的分类筛选标签
 *
 * @example 添加新分类
 * { id: "training", name: "训练" }
 */
export const TOOL_CATEGORIES: ToolCategory[] = [
  { id: "all", name: "全部" },
  { id: "jack-daniels", name: "杰克·丹尼尔斯" },
  { id: "hansons", name: "汉森" },
]

// ============================================================================
// 工具列表配置
// ============================================================================
/**
 * 工具列表
 *
 * 每个工具的 category 必须对应 TOOL_CATEGORIES 中的 id
 * slug 用于生成路由：/tools/{category}/{slug}
 *
 * @example VDOT 计算器
 * category: "jack-daniels"
 * slug: "vdot"
 * 最终路由: /tools/jack-daniels/vdot
 */
export const TOOLS: Tool[] = [
  {
    id: "vdot",
    name: "VDOT 计算器",
    description: "根据比赛成绩计算 VDOT 分数和训练配速",
    icon: "Calculator",
    category: "jack-daniels",
    slug: "vdot",
  },
  {
    id: "hansons-calculator",
    name: "汉森计算器",
    description: "基于汉森训练体系的配速计算工具",
    icon: "TrendingUp",
    category: "hansons",
    slug: "hansons-calculator",
  },
]
