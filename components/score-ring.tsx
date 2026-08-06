"use client";

import { motion } from "framer-motion";

export function ScoreRing({
  value,
  label,
  size = 108,
  stroke = 9,
  colorClass = "stroke-blossom",
}: {
  value: number;
  label: string;
  size?: number;
  stroke?: number;
  colorClass?: string;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={stroke}
            className="stroke-muted fill-none"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={stroke}
            strokeLinecap="round"
            className={`fill-none ${colorClass}`}
            style={{ strokeDasharray: circumference }}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-bold">{value}</span>
          <span className="text-[10px] text-muted-foreground">/ 100</span>
        </div>
      </div>
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
    </div>
  );
}
