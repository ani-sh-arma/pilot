"use client";

import Link from "next/link";
import { ArrowRight, Cloud, Lock, Share2, Zap } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { getStartedAction } from "~/server/actions/actions";

export default function Home() {
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
            href="#features"
            className="text-gray-300 transition-colors hover:text-white"
          >
            Features
          </Link>
          <Link
            href="#features"
            className="text-gray-300 transition-colors hover:text-white"
          >
            Pricing
          </Link>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto flex flex-col items-center px-4 py-20 text-center md:py-32">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600/20 to-indigo-600/20 opacity-70 blur-3xl"></div>
            <h1 className="relative mb-6 text-4xl font-bold leading-tight md:text-6xl">
              Your files,{" "}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                everywhere
              </span>
            </h1>
          </div>
          <p className="mb-10 max-w-2xl text-xl text-gray-400">
            Store, share, and collaborate on files and folders from any mobile
            device, tablet, or computer
          </p>
          <div className="group relative">
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-60 blur transition duration-1000 group-hover:opacity-100"></div>
            <form action={getStartedAction}>
              <button className="relative flex items-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-medium text-white transition-all duration-300 hover:from-blue-500 hover:to-indigo-500 hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] group-hover:shadow-[0_0_25px_rgba(79,70,229,0.8)]">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </div>

          {/* Floating Elements Animation */}
          <div className="relative mt-20 h-64 w-full max-w-4xl md:h-80">
            <div className="absolute h-full w-full">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute h-32 w-40 rounded-lg border border-slate-700 bg-gradient-to-r from-slate-800 to-gray-800 p-4 opacity-80 shadow-lg"
                  style={{
                    left: `${10 + i * 18}%`,
                    top: `${20 + (i % 3) * 15}%`,
                    transform: `rotate(${(i % 2) * 3 - 1.5}deg)`,
                    animation: `float ${3 + i * 0.5}s ease-in-out infinite alternate`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                >
                  <div className="mb-2 h-3 w-full rounded bg-slate-700"></div>
                  <div className="mb-2 h-3 w-3/4 rounded bg-slate-700"></div>
                  <div className="h-3 w-1/2 rounded bg-slate-700"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-20">
          <h2 className="mb-16 text-center text-3xl font-bold md:text-4xl">
            <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
              Powerful features
            </span>{" "}
            for your workflow
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="group rounded-xl border border-slate-700 bg-slate-800/50 p-8 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]">
              <div className="mb-4 w-fit rounded-lg bg-blue-500/20 p-3 transition-colors group-hover:bg-blue-500/30">
                <Cloud className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Cloud Storage</h3>
              <p className="text-gray-400">
                Access your files from anywhere, anytime. Never worry about
                local storage again.
              </p>
            </div>

            <div className="group rounded-xl border border-slate-700 bg-slate-800/50 p-8 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]">
              <div className="mb-4 w-fit rounded-lg bg-blue-500/20 p-3 transition-colors group-hover:bg-blue-500/30">
                <Share2 className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Easy Sharing</h3>
              <p className="text-gray-400">
                {`Share files and folders with anyone, even if they don't have a
                Pilot account.`}
              </p>
            </div>

            <div className="group rounded-xl border border-slate-700 bg-slate-800/50 p-8 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]">
              <div className="mb-4 w-fit rounded-lg bg-blue-500/20 p-3 transition-colors group-hover:bg-blue-500/30">
                <Lock className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Advanced Security</h3>
              <p className="text-gray-400">
                Your files are encrypted and protected with industry-leading
                security measures.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 to-gray-900 p-10 md:p-16">
            <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-indigo-500 opacity-20 blur-3xl"></div>

            <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
              <div>
                <h2 className="mb-4 text-2xl font-bold md:text-3xl">
                  Ready to take control of your files?
                </h2>
                <p className="max-w-xl text-gray-400">
                  Join thousands of users who trust Pilot for their storage
                  needs.
                </p>
              </div>
              <button className="flex items-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-medium text-white transition-all duration-300 hover:from-blue-500 hover:to-indigo-500 hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]">
                Start for Free
                <Zap className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto border-t border-slate-800 px-4 py-10">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-4 flex items-center gap-2 md:mb-0">
            <Cloud className="h-6 w-6 text-blue-400" />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-xl font-bold text-transparent">
              Pilot
            </span>
          </div>
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} Pilot. All rights reserved.
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0px) rotate(var(--rotation, 0deg));
          }
          100% {
            transform: translateY(-10px) rotate(var(--rotation, 0deg));
          }
        }
      `}</style>
    </div>
  );
}
