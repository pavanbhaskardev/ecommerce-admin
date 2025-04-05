"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ShowLogin() {
  const router = useRouter();
  const [hovered, setHovered] = React.useState(false);

  return (
    <div className="flex justify-center items-center h-72">
      <motion.button
        initial={{ backgroundColor: "#3B82F6" }}
        whileHover={{ backgroundColor: "#2563EB" }}
        transition={{ duration: 0.3 }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onClick={() => router.push("/sign-in")}
        className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold shadow-md"
      >
        Login to see the stats{" "}
        <motion.span
          animate={{ x: hovered ? 5 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <ArrowRight className="h-5 w-5" />
        </motion.span>
      </motion.button>
    </div>
  );
}