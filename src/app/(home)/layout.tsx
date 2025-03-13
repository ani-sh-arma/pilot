"use client";

import Link from "next/link";
import { Cloud } from "lucide-react";

export default function Home(props: { children: React.ReactNode }) {
  return (
    <div className="dark min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-900 text-gray-100">
      <header className="container mx-auto flex items-center justify-between px-4 py-6">
        <div className="flex items-center gap-2">
          <Cloud className="h-8 w-8 text-blue-400" />
          <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-2xl font-bold text-transparent">
            Pilot
          </span>
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/#features"
            className="text-gray-300 transition-colors hover:text-white"
          >
            Features
          </Link>
          <Link
            href="/#features"
            className="text-gray-300 transition-colors hover:text-white"
          >
            Pricing
          </Link>
        </nav>
      </header>
      <main>{props.children}</main>
    </div>
  );
}
