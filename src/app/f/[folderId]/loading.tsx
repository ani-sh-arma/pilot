"use client";

import { Cloud } from "lucide-react";
import { motion } from "framer-motion";
import CustomLoader from "~/app/components/custom-loader";

export default function Loading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-900">
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
    </div>
  );
}
