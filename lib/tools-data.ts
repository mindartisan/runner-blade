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
  // ========== 杰克·丹尼尔斯 ==========
  {
    id: "vdot",
    name: "VDOT 计算器",
    description: "根据比赛成绩计算 VDOT 分数和训练配速",
    icon: "Calculator",
    category: "jack-daniels",
    slug: "vdot",
  },

  // ========== 汉森 ==========
  {
    id: "race-equivalency",
    name: "比赛等效计算器",
    description: "根据比赛成绩计算训练配速和等效成绩",
    icon: "Timer",
    category: "hansons",
    slug: "race-equivalency",
  },
  {
    id: "race-equivalency-reverse",
    name: "反向计算器",
    description: "根据目标成绩推算当前需要达到的水平",
    icon: "ArrowLeft",
    category: "hansons",
    slug: "race-equivalency-reverse",
  },
  {
    id: "improvement",
    name: "提升计算器",
    description: "分析两次比赛成绩，预测提升空间",
    icon: "TrendingUp",
    category: "hansons",
    slug: "improvement",
  },
  {
    id: "treadmill",
    name: "跑步机计算器",
    description: "速度与坡度配速转换",
    icon: "Activity",
    category: "hansons",
    slug: "treadmill",
  },
]
