import { nanoid } from "nanoid";
import type {
  Campaign,
  CampaignFormInput,
  CampaignHealth,
  CampaignStatus,
} from "./types";

/** Simple deterministic string hash -> seeded PRNG so a given campaign's
 * generated indicators stay stable across re-renders instead of re-rolling. */
function seededRandom(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822519);
    h = Math.imul(h ^ (h >>> 13), 3266489917);
    h = (h ^= h >>> 16) >>> 0;
    return h / 4294967296;
  };
}

function inRange(rand: () => number, min: number, max: number) {
  return Math.round(min + rand() * (max - min));
}

export function generateCampaignId(launchDate: string): string {
  const year = launchDate ? new Date(launchDate).getFullYear() : new Date().getFullYear();
  const suffix = nanoid(6).toUpperCase().replace(/[^A-Z0-9]/g, "X");
  return `BPS-${year}-${suffix}`;
}

function deriveStatus(launch: string, completion: string): CampaignStatus {
  const now = Date.now();
  const l = new Date(launch).getTime();
  const c = new Date(completion).getTime();
  if (Number.isNaN(l) || Number.isNaN(c)) return "Scheduled";
  if (now < l) return "Scheduled";
  if (now > c) return "Completed";
  const total = c - l;
  const elapsed = now - l;
  if (elapsed / total > 0.85) return "Wrapping Up";
  return "Live";
}

function deriveProgress(launch: string, completion: string): number {
  const now = Date.now();
  const l = new Date(launch).getTime();
  const c = new Date(completion).getTime();
  if (Number.isNaN(l) || Number.isNaN(c) || c <= l) return 0;
  if (now < l) return 0;
  if (now > c) return 100;
  return Math.round(((now - l) / (c - l)) * 100);
}

function deriveHealth(visibility: number, discovery: number, quality: number): CampaignHealth {
  const avg = (visibility + discovery + quality) / 3;
  if (avg >= 85) return "Excellent";
  if (avg >= 70) return "On Track";
  if (avg >= 50) return "Needs Attention";
  return "At Risk";
}

const PACKAGE_MULTIPLIER: Record<string, number> = {
  Starter: 0.7,
  Growth: 0.85,
  Signature: 1,
  Enterprise: 1.15,
};

export function buildCampaign(input: CampaignFormInput): Campaign {
  const id = generateCampaignId(input.launchDate);
  const rand = seededRandom(id + input.campaignTitle);
  const mult = PACKAGE_MULTIPLIER[input.package] ?? 1;

  const visibilityScore = Math.min(99, Math.round(inRange(rand, 58, 92) * mult));
  const discoveryScore = Math.min(99, Math.round(inRange(rand, 52, 90) * mult));
  const qualityScore = Math.min(99, Math.round(inRange(rand, 65, 96) * mult));

  const durationDays = Math.max(1, input.duration || 7);
  const baseReach = inRange(rand, 1800, 5200) * mult;
  const estimatedReach = Math.round(baseReach * (1 + durationDays / 30));
  const estimatedDiscovery = Math.round(estimatedReach * (0.18 + rand() * 0.22));

  const keywords = input.keywords
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean)
    .slice(0, 8);

  const keywordCoverage = (keywords.length ? keywords : ["general discovery"]).map((keyword) => ({
    keyword,
    coverage: inRange(rand, 34, 96),
  }));

  const timelinePoints = Math.min(10, Math.max(4, Math.round(durationDays / 3)));
  const launchTime = new Date(input.launchDate).getTime() || Date.now();
  const completionTime = new Date(input.completionDate).getTime() || launchTime + durationDays * 86400000;
  const span = Math.max(completionTime - launchTime, 86400000);

  const timeline = Array.from({ length: timelinePoints }, (_, i) => {
    const t = launchTime + (span * i) / (timelinePoints - 1 || 1);
    const progressFactor = (i + 1) / timelinePoints;
    return {
      date: new Date(t).toISOString(),
      reach: Math.round(estimatedReach * progressFactor * (0.75 + rand() * 0.3)),
      discovery: Math.round(discoveryScore * progressFactor * (0.8 + rand() * 0.3)),
      quality: Math.round(qualityScore * (0.85 + rand() * 0.2)),
    };
  });

  const activity = [
    {
      id: nanoid(8),
      label: "Campaign created",
      detail: `${input.campaignTitle} was set up on the ${input.package} package.`,
      timestamp: new Date().toISOString(),
    },
    {
      id: nanoid(8),
      label: "Keyword coverage indexed",
      detail: `${keywordCoverage.length} keyword${keywordCoverage.length === 1 ? "" : "s"} mapped for discovery tracking.`,
      timestamp: new Date().toISOString(),
    },
    {
      id: nanoid(8),
      label: "Baseline indicators generated",
      detail: "Visibility, discovery, and quality indicators calculated from campaign inputs.",
      timestamp: new Date().toISOString(),
    },
  ];

  return {
    ...input,
    id,
    createdAt: new Date().toISOString(),
    status: deriveStatus(input.launchDate, input.completionDate),
    progress: deriveProgress(input.launchDate, input.completionDate),
    health: deriveHealth(visibilityScore, discoveryScore, qualityScore),
    visibilityScore,
    discoveryScore,
    qualityScore,
    estimatedReach,
    estimatedDiscovery,
    keywordCoverage,
    timeline,
    activity,
    shareId: nanoid(12),
  };
}

export function refreshDerived(campaign: Campaign): Campaign {
  return {
    ...campaign,
    status: deriveStatus(campaign.launchDate, campaign.completionDate),
    progress: deriveProgress(campaign.launchDate, campaign.completionDate),
  };
}

export const HEALTH_COLOR: Record<CampaignHealth, string> = {
  Excellent: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
  "On Track": "text-blossom bg-blossom/10 border-blossom/30",
  "Needs Attention": "text-amber-500 bg-amber-500/10 border-amber-500/30",
  "At Risk": "text-red-500 bg-red-500/10 border-red-500/30",
};

export const STATUS_COLOR: Record<CampaignStatus, string> = {
  Scheduled: "text-mauve bg-mauve/10 border-mauve/30",
  Live: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
  "Wrapping Up": "text-amber-500 bg-amber-500/10 border-amber-500/30",
  Completed: "text-muted-foreground bg-muted border-border",
  Paused: "text-red-500 bg-red-500/10 border-red-500/30",
};
