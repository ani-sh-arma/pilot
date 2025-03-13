"use client";

import { Cloud } from "lucide-react";
import { motion } from "framer-motion";

export function LoadingUI({ rootId }: { rootId: string }) {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-slate-900 to-gray-900 text-gray-100">
      <div className="flex flex-col items-center space-y-6">
        <motion.div
          className="flex items-center gap-2"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div>
            <Cloud className="h-10 w-10 text-blue-400" />
          </div>
          <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-3xl font-bold text-transparent">
            Pilot
          </span>
        </motion.div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <motion.div
            className="flex gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="h-4 w-4 rounded-full bg-blue-400"
                animate={{
                  y: [-10, 10, -10],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
          <p className="text-lg text-gray-300">Preparing your workspace...</p>
        </div>
      </div>
      <div className="mt-12">
        <meta httpEquiv="refresh" content={`0;url=/f/${rootId}`} />
      </div>
    </div>
  );
}
