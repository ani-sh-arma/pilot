import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { folders } from "~/server/db/schema";

interface BreadcrumbProps {
  items: (typeof folders.$inferSelect)[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li key={"1"} className="inline-flex items-center">
          <Link
            href={`/f/1`}
            className="inline-flex items-center text-sm font-medium text-gray-300 hover:text-blue-400"
          >
            {"Home"}
          </Link>
        </li>
        {items.map((item, index) =>
          item.parentId !== null ? (
            <li key={item.id} className="inline-flex items-center">
              <ChevronRight className="h-4 w-4 text-gray-400" />
              {/* {index > 1 && <ChevronRight className="h-4 w-4 text-gray-400" />} */}
              <Link
                href={`/f/${item.id}`}
                className="inline-flex items-center text-sm font-medium text-gray-300 hover:text-blue-400"
              >
                {item.name}
              </Link>
            </li>
          ) : null,
        )}
      </ol>
    </nav>
  );
}
