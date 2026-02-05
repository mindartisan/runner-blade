"use client"

import { ToolCategory } from "@/types"

interface FilterTabsProps {
  categories: ToolCategory[]
  selectedCategory: string
  onCategoryChange: (categoryId: string) => void
}

export default function FilterTabs({
  categories,
  selectedCategory,
  onCategoryChange,
}: FilterTabsProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-8">
      {categories.map((category) => {
        const isSelected = selectedCategory === category.id
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className="relative px-6 py-2.5 rounded-xl font-medium transition-all duration-200"
            style={{
              backgroundColor: isSelected ? 'var(--color-surface)' : 'var(--color-background-secondary)',
              color: isSelected ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
              boxShadow: isSelected ? '0 0 12px var(--color-primary)' : 'var(--shadow-button)',
            }}
          >
            {/* 激活状态的内部光晕 */}
            {isSelected && (
              <div className="absolute inset-0 rounded-xl blur-sm -z-10"
                style={{ backgroundColor: 'var(--color-primary)', opacity: 0.1 }}
              />
            )}
            {category.name}
          </button>
        )
      })}
    </div>
  )
}
