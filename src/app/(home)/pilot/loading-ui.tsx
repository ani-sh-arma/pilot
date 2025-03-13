"use client";

import { Cloud } from "lucide-react";
import { motion } from "framer-motion";
import CustomLoader from "~/app/components/custom-loader";

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
        <CustomLoader />
        <p className="text-lg text-gray-300">Preparing your workspace...</p>
      </div>
      <div className="mt-12">
        <meta httpEquiv="refresh" content={`0;url=/f/${rootId}`} />
      </div>
    </div>
  );
}
