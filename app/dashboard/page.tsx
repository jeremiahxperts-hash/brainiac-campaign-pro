"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Inbox } from "lucide-react";
import { AppNav } from "@/components/app-nav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateCampaignModal } from "@/components/create-campaign-modal";
import { CampaignCard } from "@/components/campaign-card";
import { useCampaignStore } from "@/lib/store";
import type { CampaignStatus } from "@/lib/types";

const statusFilters: Array<CampaignStatus | "All"> = [
  "All",
  "Scheduled",
  "Live",
  "Wrapping Up",
  "Completed",
  "Paused",
];

export default function DashboardPage() {
  const campaigns = useCampaignStore((s) => s.campaigns);
  const hydrated = useCampaignStore((s) => s.hydrated);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof statusFilters)[number]>("All");

  const filtered = useMemo(() => {
    return campaigns.filter((c) => {
      const matchesStatus = status === "All" || c.status === status;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        c.campaignTitle.toLowerCase().includes(q) ||
        c.buyerName.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.keywordCoverage.some((k) => k.keyword.toLowerCase().includes(q));
      return matchesStatus && matchesQuery;
    });
  }, [campaigns, query, status]);

  const stats = useMemo(() => {
    const live = campaigns.filter((c) => c.status === "Live").length;
    const avgQuality = campaigns.length
      ? Math.round(campaigns.reduce((sum, c) => sum + c.qualityScore, 0) / campaigns.length)
      : 0;
    const totalReach = campaigns.reduce((sum, c) => sum + c.estimatedReach, 0);
    return { total: campaigns.length, live, avgQuality, totalReach };
  }, [campaigns]);

  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 bg-brainiac-mesh opacity-60" />
      <AppNav />

      <main className="container relative z-10 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {stats.total} campaign{stats.total === 1 ? "" : "s"} · {stats.live} live now
            </p>
          </div>
          <CreateCampaignModal />
        </div>

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="Total campaigns" value={stats.total.toString()} />
          <StatTile label="Live now" value={stats.live.toString()} />
          <StatTile label="Avg. quality" value={`${stats.avgQuality}`} />
          <StatTile label="Total est. reach" value={new Intl.NumberFormat("en-US", { notation: "compact" }).format(stats.totalReach)} />
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search campaigns, buyers, keywords…"
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 shrink-0 text-muted-foreground" />
            <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusFilters.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {!hydrated ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-72 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState hasCampaigns={campaigns.length > 0} />
        ) : (
          <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c, i) => (
              <CampaignCard key={c.id} campaign={c} index={i} />
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-panel p-4">
      <p className="font-mono text-xl font-bold sm:text-2xl">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function EmptyState({ hasCampaigns }: { hasCampaigns: boolean }) {
  return (
    <div className="glass-panel flex flex-col items-center gap-3 px-6 py-20 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Inbox className="h-5 w-5 text-muted-foreground" />
      </span>
      <h3 className="font-display text-lg font-semibold">
        {hasCampaigns ? "No campaigns match your filters" : "No campaigns yet"}
      </h3>
      <p className="max-w-sm text-sm text-muted-foreground">
        {hasCampaigns
          ? "Try a different search term or reset the status filter."
          : "Create your first campaign to generate indicators and a client-ready report."}
      </p>
      {!hasCampaigns && <CreateCampaignModal />}
    </div>
  );
}
