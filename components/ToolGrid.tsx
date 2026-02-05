"use client"

import { useState } from "react"
import { Tool } from "@/types"
import ToolCard from "./ToolCard"
import FilterTabs from "./FilterTabs"
import { TOOLS, TOOL_CATEGORIES } from "@/lib/tools-data"

export default function ToolGrid() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredTools =
    selectedCategory === "all"
      ? TOOLS
      : TOOLS.filter((tool) => tool.category === selectedCategory)

  return (
    <section id="tools" className="w-full py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-4">工具列表</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            这里有你需要的各种实用工具，点击即可使用，让跑步训练更科学、更高效。
          </p>
        </div>

        <FilterTabs
          categories={TOOL_CATEGORIES}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  )
}
