"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/score-ring";
import type { Campaign } from "@/lib/types";
import { formatDate, formatNumber } from "@/lib/utils";
import { STATUS_COLOR } from "@/lib/campaign-utils";

export function PresentationMode({
  campaign,
  agencyName,
  onClose,
}: {
  campaign: Campaign;
  agencyName: string;
  onClose: () => void;
}) {
  const slides = useMemo(
    () => [
      { kind: "title" as const },
      { kind: "scores" as const },
      { kind: "reach" as const },
      { kind: "keywords" as const },
      { kind: "notes" as const },
    ],
    []
  );
  const [index, setIndex] = useState(0);

  const next = useCallback(() => setIndex((i) => Math.min(i + 1, slides.length - 1)), [slides.length]);
  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " ") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, onClose]);

  const slide = slides[index];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-void text-cream grain">
      <div className="relative z-10 flex items-center justify-between px-8 py-6">
        <p className="font-mono text-xs uppercase tracking-widest text-blossom/80">
          {agencyName} · {campaign.id}
        </p>
        <Button variant="glass" size="icon" onClick={onClose} aria-label="Exit presentation">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-3xl text-center"
          >
            {slide.kind === "title" && (
              <div className="space-y-6">
                <Badge variant="outline" className={STATUS_COLOR[campaign.status] + " mx-auto"}>
                  {campaign.status}
                </Badge>
                <h1 className="text-gradient font-display text-4xl font-bold tracking-tight sm:text-6xl">
                  {campaign.campaignTitle}
                </h1>
                <p className="text-blossom/70">
                  Prepared for {campaign.buyerName} · {formatDate(campaign.launchDate)} —{" "}
                  {formatDate(campaign.completionDate)}
                </p>
              </div>
            )}

            {slide.kind === "scores" && (
              <div className="space-y-10">
                <h2 className="font-display text-2xl font-semibold sm:text-3xl">Campaign indicators</h2>
                <div className="flex justify-center gap-10">
                  <ScoreRing value={campaign.visibilityScore} label="Visibility" size={140} colorClass="stroke-blossom" />
                  <ScoreRing value={campaign.discoveryScore} label="Discovery" size={140} colorClass="stroke-mauve" />
                  <ScoreRing value={campaign.qualityScore} label="Quality" size={140} colorClass="stroke-cream" />
                </div>
                <p className="mx-auto max-w-md text-xs text-blossom/50">
                  Modeled campaign indicators, not verified Twitch advertising data.
                </p>
              </div>
            )}

            {slide.kind === "reach" && (
              <div className="space-y-10">
                <h2 className="font-display text-2xl font-semibold sm:text-3xl">Estimated impact</h2>
                <div className="grid grid-cols-2 gap-10">
                  <div>
                    <p className="font-mono text-5xl font-bold sm:text-6xl">
                      {formatNumber(campaign.estimatedReach)}
                    </p>
                    <p className="mt-2 text-sm uppercase tracking-wide text-blossom/70">
                      Estimated community reach
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-5xl font-bold sm:text-6xl">
                      {formatNumber(campaign.estimatedDiscovery)}
                    </p>
                    <p className="mt-2 text-sm uppercase tracking-wide text-blossom/70">
                      Estimated creator discovery
                    </p>
                  </div>
                </div>
              </div>
            )}

            {slide.kind === "keywords" && (
              <div className="space-y-8">
                <h2 className="font-display text-2xl font-semibold sm:text-3xl">Keyword coverage</h2>
                <div className="flex flex-wrap justify-center gap-3">
                  {campaign.keywordCoverage.map((k) => (
                    <span
                      key={k.keyword}
                      className="rounded-full border border-blossom/30 bg-white/5 px-4 py-2 text-sm"
                    >
                      {k.keyword} <span className="font-mono text-blossom">· {k.coverage}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {slide.kind === "notes" && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl font-semibold sm:text-3xl">Promotion notes</h2>
                <p className="mx-auto max-w-xl text-lg leading-relaxed text-blossom/85">
                  {campaign.notes?.trim() || "No additional notes were provided for this campaign."}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 flex items-center justify-center gap-6 pb-10">
        <Button variant="glass" size="icon" onClick={prev} disabled={index === 0} aria-label="Previous slide">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-blossom" : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>
        <Button
          variant="glass"
          size="icon"
          onClick={next}
          disabled={index === slides.length - 1}
          aria-label="Next slide"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-brainiac-mesh" />
    </div>
  );
}
