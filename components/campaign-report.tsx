"use client";

import { forwardRef } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Info, Radar, Target, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScoreRing } from "@/components/score-ring";
import type { Campaign } from "@/lib/types";
import { formatDate, formatNumber } from "@/lib/utils";
import { HEALTH_COLOR, STATUS_COLOR } from "@/lib/campaign-utils";

export const CampaignReport = forwardRef<HTMLDivElement, { campaign: Campaign; agencyName: string }>(
  function CampaignReport({ campaign, agencyName }, ref) {
    const chartData = campaign.timeline.map((t) => ({
      date: new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      Reach: t.reach,
      Discovery: t.discovery,
    }));

    return (
      <div ref={ref} className="relative space-y-6 rounded-3xl bg-background p-1">
        {/* Overview */}
        <Card className="overflow-visible">
          <CardContent className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {agencyName} · {campaign.id}
              </p>
              <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                {campaign.campaignTitle}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={STATUS_COLOR[campaign.status]}>
                  {campaign.status}
                </Badge>
                <Badge variant="outline" className={HEALTH_COLOR[campaign.health]}>
                  {campaign.health}
                </Badge>
                <Badge variant="secondary">{campaign.package} package</Badge>
              </div>
              <p className="max-w-md text-sm text-muted-foreground">
                Prepared for <span className="text-foreground">{campaign.buyerName}</span> ·{" "}
                <a
                  href={campaign.twitchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-dotted underline-offset-4 hover:text-foreground"
                >
                  {campaign.twitchUrl.replace(/^https?:\/\//, "")}
                </a>
              </p>
            </div>

            <div className="flex gap-6 sm:gap-8">
              <ScoreRing value={campaign.visibilityScore} label="Visibility" colorClass="stroke-blossom" />
              <ScoreRing value={campaign.discoveryScore} label="Discovery" colorClass="stroke-mauve" />
              <ScoreRing value={campaign.qualityScore} label="Quality" colorClass="stroke-mulberry dark:stroke-cream" />
            </div>
          </CardContent>
        </Card>

        {/* Timeline / progress */}
        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
            <CardDescription>
              {formatDate(campaign.launchDate)} → {formatDate(campaign.completionDate)} · {campaign.duration} day
              flight
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall progress</span>
              <span className="font-mono font-medium">{campaign.progress}%</span>
            </div>
            <Progress value={campaign.progress} />

            <div className="h-64 pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ left: -20, right: 10, top: 10 }}>
                  <defs>
                    <linearGradient id="reachFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#854F6C" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="#854F6C" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="discoveryFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#DFB6B2" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="#DFB6B2" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} vertical={false} />
                  <XAxis dataKey="date" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} tickLine={false} axisLine={false} width={40} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid rgba(133,79,108,0.25)",
                      background: "rgba(43,18,76,0.92)",
                      color: "#FBE4D8",
                      fontSize: 12,
                    }}
                  />
                  <Area type="monotone" dataKey="Reach" stroke="#854F6C" fill="url(#reachFill)" strokeWidth={2} />
                  <Area
                    type="monotone"
                    dataKey="Discovery"
                    stroke="#DFB6B2"
                    fill="url(#discoveryFill)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Estimated reach & discovery */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blossom" /> Estimated community reach
              </CardTitle>
              <CardDescription>Modeled audience exposure across the flight</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-4xl font-bold">{formatNumber(campaign.estimatedReach)}</p>
              <p className="mt-1 text-xs text-muted-foreground">viewers reached (estimate)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Radar className="h-4 w-4 text-mauve" /> Estimated creator discovery
              </CardTitle>
              <CardDescription>New-viewer discovery indicator</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-4xl font-bold">{formatNumber(campaign.estimatedDiscovery)}</p>
              <p className="mt-1 text-xs text-muted-foreground">new discovery events (estimate)</p>
            </CardContent>
          </Card>
        </div>

        {/* Keyword coverage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-4 w-4 text-mulberry dark:text-cream" /> Keyword coverage
            </CardTitle>
            <CardDescription>Indicator of how strongly each keyword is represented</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaign.keywordCoverage} layout="vertical" margin={{ left: 0, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis
                    dataKey="keyword"
                    type="category"
                    width={110}
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid rgba(133,79,108,0.25)",
                      background: "rgba(43,18,76,0.92)",
                      color: "#FBE4D8",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="coverage" radius={[0, 8, 8, 0]} fill="#854F6C" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Campaign summary */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <SummaryRow label="Buyer" value={campaign.buyerName} />
              <SummaryRow label="Channel" value={campaign.twitchUrl.replace(/^https?:\/\//, "")} />
              <SummaryRow label="Package" value={campaign.package} />
              <SummaryRow label="Target audience" value={campaign.targetAudience} />
              <SummaryRow
                label="Keywords"
                value={campaign.keywordCoverage.map((k) => k.keyword).join(", ")}
              />
              <SummaryRow label="Duration" value={`${campaign.duration} days`} />
            </CardContent>
          </Card>

          {/* Promotion notes */}
          <Card>
            <CardHeader>
              <CardTitle>Promotion notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                {campaign.notes?.trim() || "No additional notes were provided for this campaign."}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Activity feed */}
        <Card>
          <CardHeader>
            <CardTitle>Activity feed</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {campaign.activity.map((event) => (
                <li key={event.id} className="flex gap-3 text-sm">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gradient-to-br from-mulberry to-blossom" />
                  <div>
                    <p className="font-medium">{event.label}</p>
                    <p className="text-xs text-muted-foreground">{event.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <div className="flex items-start gap-2.5 rounded-2xl border border-border/60 bg-muted/40 p-4 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <p>
            All figures on this report — visibility, discovery, quality, reach, and keyword coverage — are
            modeled campaign indicators generated from the submitted campaign details. They are estimates for
            planning and reporting purposes, not verified Twitch advertising metrics or a Twitch Ads
            integration.
          </p>
        </div>
      </div>
    );
  }
);

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/50 pb-3 last:border-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="max-w-[60%] text-right font-medium">{value}</span>
    </div>
  );
}
