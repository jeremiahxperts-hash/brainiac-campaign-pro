"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AppNav } from "@/components/app-nav";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CampaignReport } from "@/components/campaign-report";
import { ReportActions } from "@/components/report-actions";
import { PresentationMode } from "@/components/presentation-mode";
import { useCampaignStore } from "@/lib/store";
import { useSettingsStore } from "@/lib/settings-store";

export default function CampaignReportPage() {
  const params = useParams<{ id: string }>();
  const hydrated = useCampaignStore((s) => s.hydrated);
  const getCampaign = useCampaignStore((s) => s.getCampaign);
  const agencyName = useSettingsStore((s) => s.agencyName);
  const campaign = hydrated ? getCampaign(params.id) : undefined;

  const reportRef = useRef<HTMLDivElement>(null);
  const [presenting, setPresenting] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-background">
        <AppNav />
        <div className="container space-y-6 py-8">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-background">
        <AppNav />
        <div className="container flex flex-col items-center gap-4 py-24 text-center">
          <h1 className="font-display text-2xl font-bold">Campaign not found</h1>
          <p className="text-muted-foreground">
            This campaign may have been removed, or the link is incorrect.
          </p>
          <Button asChild>
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="container max-w-4xl py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button asChild variant="ghost" size="sm" className="gap-1.5 no-print">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" /> Dashboard
            </Link>
          </Button>
          <ReportActions
            reportRef={reportRef}
            shareUrl={`${origin}/share/${campaign.shareId}`}
            filename={campaign.id}
            onPresent={() => setPresenting(true)}
          />
        </div>

        <CampaignReport ref={reportRef} campaign={campaign} agencyName={agencyName} />
      </main>

      {presenting && (
        <PresentationMode campaign={campaign} agencyName={agencyName} onClose={() => setPresenting(false)} />
      )}
    </div>
  );
}
