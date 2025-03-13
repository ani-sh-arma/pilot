"use client";

import { motion } from "framer-motion";

export default function CustomLoader() {
  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <motion.div
        className="flex gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {Array.from({ length: 3 }).map((_, i) => (
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
    </div>
  );
}
