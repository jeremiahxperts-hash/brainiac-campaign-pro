export type CampaignPackage = "Starter" | "Growth" | "Signature" | "Enterprise";

export type CampaignStatus = "Scheduled" | "Live" | "Wrapping Up" | "Completed" | "Paused";

export type CampaignHealth = "Excellent" | "On Track" | "Needs Attention" | "At Risk";

export interface ActivityEvent {
  id: string;
  label: string;
  detail: string;
  timestamp: string; // ISO
}

export interface CampaignFormInput {
  buyerName: string;
  email: string;
  twitchUrl: string;
  campaignTitle: string;
  package: CampaignPackage;
  duration: number; // days
  keywords: string; // comma separated
  targetAudience: string;
  notes?: string;
  launchDate: string; // ISO date
  completionDate: string; // ISO date
}

export interface Campaign extends CampaignFormInput {
  id: string; // Campaign ID e.g. BPS-2026-0417
  createdAt: string;
  status: CampaignStatus;
  progress: number; // 0-100
  health: CampaignHealth;
  visibilityScore: number; // 0-100
  discoveryScore: number; // 0-100
  qualityScore: number; // 0-100
  estimatedReach: number;
  estimatedDiscovery: number;
  keywordCoverage: { keyword: string; coverage: number }[];
  timeline: { date: string; reach: number; discovery: number; quality: number }[];
  activity: ActivityEvent[];
  shareId: string;
}
