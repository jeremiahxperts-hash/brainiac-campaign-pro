"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Brain, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/theme-toggle";
import { CampaignReport } from "@/components/campaign-report";
import { PresentationMode } from "@/components/presentation-mode";
import { useCampaignStore } from "@/lib/store";
import { useSettingsStore } from "@/lib/settings-store";

export default function SharedReportPage() {
  const params = useParams<{ id: string }>();
  const hydrated = useCampaignStore((s) => s.hydrated);
  const getByShareId = useCampaignStore((s) => s.getByShareId);
  const agencyName = useSettingsStore((s) => s.agencyName);
  const campaign = hydrated ? getByShareId(params.id) : undefined;
  const reportRef = useRef<HTMLDivElement>(null);
  const [presenting, setPresenting] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 bg-brainiac-mesh opacity-50" />
      <header className="no-print relative z-10 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-mulberry to-mauve text-cream shadow-glow">
              <Brain className="h-5 w-5" />
            </span>
            <span className="font-display text-sm font-semibold tracking-tight">
              Brainiac <span className="text-muted-foreground font-normal">Studio</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {campaign && (
              <Button variant="glass" size="sm" className="gap-1.5" onClick={() => setPresenting(true)}>
                <Play className="h-3.5 w-3.5" /> Present
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container relative z-10 max-w-4xl py-8">
        {!hydrated ? (
          <div className="space-y-6">
            <Skeleton className="h-56 w-full" />
            <Skeleton className="h-80 w-full" />
          </div>
        ) : !campaign ? (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <h1 className="font-display text-2xl font-bold">Report unavailable</h1>
            <p className="text-muted-foreground">
              This share link is invalid or the campaign has been removed.
            </p>
          </div>
        ) : (
          <>
            <p className="no-print mb-4 text-xs text-muted-foreground">
              You're viewing a read-only shared report.
            </p>
            <CampaignReport ref={reportRef} campaign={campaign} agencyName={agencyName} />
          </>
        )}
      </main>

      {presenting && campaign && (
        <PresentationMode campaign={campaign} agencyName={agencyName} onClose={() => setPresenting(false)} />
      )}
    </div>
  );
}
