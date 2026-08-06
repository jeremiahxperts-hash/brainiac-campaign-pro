"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, Sparkles, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Campaign } from "@/lib/types";
import { formatDate, formatNumber, initials } from "@/lib/utils";
import { HEALTH_COLOR, STATUS_COLOR } from "@/lib/campaign-utils";
import { useCampaignStore } from "@/lib/store";
import { toast } from "sonner";

export function CampaignCard({ campaign, index = 0 }: { campaign: Campaign; index?: number }) {
  const removeCampaign = useCampaignStore((s) => s.removeCampaign);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4), ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="group flex h-full flex-col transition-shadow hover:shadow-glass-lg">
        <div className="pointer-events-none absolute inset-0 bg-card-sheen opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="flex items-start justify-between gap-3 p-6 pb-3">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{initials(campaign.buyerName || "??")}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-display text-base font-semibold leading-tight">
                {campaign.campaignTitle}
              </p>
              <p className="truncate text-xs text-muted-foreground">{campaign.buyerName}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
            onClick={(e) => {
              e.preventDefault();
              removeCampaign(campaign.id);
              toast("Campaign removed", { description: campaign.campaignTitle });
            }}
            aria-label="Delete campaign"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2 px-6">
          <Badge variant="outline" className={STATUS_COLOR[campaign.status]}>
            {campaign.status}
          </Badge>
          <Badge variant="outline" className={HEALTH_COLOR[campaign.health]}>
            <Sparkles className="h-3 w-3" /> {campaign.health}
          </Badge>
          <Badge variant="secondary">{campaign.package}</Badge>
        </div>

        <div className="mt-4 space-y-1.5 px-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span className="font-mono">{campaign.progress}%</span>
          </div>
          <Progress value={campaign.progress} />
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 px-6">
          <div className="rounded-xl bg-muted/60 p-2.5 text-center">
            <p className="font-mono text-sm font-semibold">{formatNumber(campaign.estimatedReach)}</p>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Reach est.</p>
          </div>
          <div className="rounded-xl bg-muted/60 p-2.5 text-center">
            <p className="font-mono text-sm font-semibold">{campaign.visibilityScore}</p>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Visibility</p>
          </div>
          <div className="rounded-xl bg-muted/60 p-2.5 text-center">
            <p className="font-mono text-sm font-semibold">{campaign.discoveryScore}</p>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Discovery</p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-border/60 px-6 py-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(campaign.launchDate)} — {formatDate(campaign.completionDate)}
          </div>
          <Button asChild variant="ghost" size="sm" className="gap-1 text-xs">
            <Link href={`/campaign/${campaign.id}`}>
              View report <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
