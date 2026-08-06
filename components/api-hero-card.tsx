"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Radio } from "lucide-react";

function Counter({ to, decimals = 0 }: { to: number; decimals?: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => v.toFixed(decimals));
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const controls = animate(count, to, { duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [to]);

  return <span>{display}</span>;
}

const lines = [
  { key: '"campaignId"', value: '"BPS-2026-0417"', color: "text-blossom" },
  { key: '"status"', value: '"live"', color: "text-emerald-300" },
  { key: '"visibilityScore"', value: <Counter to={88} />, color: "text-cream" },
  { key: '"discoveryScore"', value: <Counter to={81} />, color: "text-cream" },
  { key: '"campaignQuality"', value: <Counter to={93} />, color: "text-cream" },
  { key: '"estimatedReach"', value: <Counter to={48200} />, color: "text-cream" },
];

export function ApiHeroCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: -1 }}
      animate={{ opacity: 1, y: 0, rotate: -1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto w-full max-w-md"
    >
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-brainiac-glow blur-2xl" />
      <div className="glass-strong rounded-2xl border border-white/10 p-5 font-mono text-[13px] shadow-glass-lg">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/70" />
          </div>
          <span className="flex items-center gap-1.5 text-[11px] text-emerald-300">
            <Radio className="h-3 w-3 animate-pulse" /> streaming
          </span>
        </div>
        <p className="mb-3 text-blossom/80">
          GET <span className="text-cream">/v1/campaigns/BPS-2026-0417/indicators</span>
        </p>
        <div className="rounded-xl bg-black/20 p-4 leading-relaxed">
          <span className="text-blossom/60">{"{"}</span>
          <div className="pl-4">
            {lines.map((l, i) => (
              <motion.div
                key={l.key}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 * i + 0.2, duration: 0.4 }}
              >
                <span className="text-mauve dark:text-mauve">{l.key}</span>
                <span className="text-blossom/50">: </span>
                <span className={l.color}>{l.value}</span>
                {i < lines.length - 1 && <span className="text-blossom/50">,</span>}
              </motion.div>
            ))}
          </div>
          <span className="text-blossom/60">{"}"}</span>
        </div>
        <p className="mt-3 text-[11px] text-blossom/50">
          Modeled campaign indicators · generated from submitted campaign details
        </p>
      </div>
    </motion.div>
  );
}
