import { ChevronRight } from "lucide-react"
import type { FileItem } from "../../lib/mock-data"

interface BreadcrumbProps {
  items: FileItem[]
  onItemClick: (index: number) => void
}

export function Breadcrumb({ items, onItemClick }: BreadcrumbProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={item.id} className="inline-flex items-center">
            {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
            <button
              onClick={() => onItemClick(index)}
              className="inline-flex items-center text-sm font-medium text-gray-300 hover:text-blue-400"
            >
              {item.name}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  )
}

