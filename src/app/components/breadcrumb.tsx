import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { folder_table } from "~/server/db/schema";

interface BreadcrumbProps {
  items: (typeof folder_table.$inferSelect)[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex float-start" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item) => (
          <li key={item.id} className="inline-flex items-center">
            {item.parentId !== null && (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
            <Link
              href={`/f/${item.id}`}
              className="inline-flex items-center text-sm font-medium text-gray-300 hover:text-blue-400"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
