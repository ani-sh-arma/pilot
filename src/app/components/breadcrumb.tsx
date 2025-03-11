import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { folder_table } from "~/server/db/schema";

interface BreadcrumbProps {
  items: (typeof folder_table.$inferSelect)[];
  onNavigate?: (id: bigint) => void;
}

export function Breadcrumb({ items, onNavigate }: BreadcrumbProps) {
  return (
    <nav className="float-start flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item) => (
          <li key={item.id} className="inline-flex items-center">
            {item.parentId !== null && (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
            {onNavigate ? (
              <button
                className="inline-flex items-center text-sm font-medium text-gray-300 hover:text-blue-400"
                onClick={onNavigate(item.id) ?? undefined}
              >
                {item.name}
              </button>
            ) : (
              <Link
                href={`/f/${item.id}`}
                className="inline-flex items-center text-sm font-medium text-gray-300 hover:text-blue-400"
              >
                {item.name}
              </Link>
            )}
            {/* <Link
              href={`/f/${item.id}`}
              className="inline-flex items-center text-sm font-medium text-gray-300 hover:text-blue-400"
            >
              {item.name}
            </Link> */}
          </li>
        ))}
      </ol>
    </nav>
  );
}
