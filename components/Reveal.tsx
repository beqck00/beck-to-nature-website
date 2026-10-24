"use client";

import { motion } from "motion/react";

// Fades a block up into place the first time it scrolls into view.
export default function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ type: "spring", bounce: 0, visualDuration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}
