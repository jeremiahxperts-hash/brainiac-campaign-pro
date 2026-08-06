import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AgencySettings {
  agencyName: string;
  contactEmail: string;
  defaultPackage: string;
  reportFooterNote: string;
  compactCards: boolean;
  autoRefreshIndicators: boolean;
}

interface SettingsStore extends AgencySettings {
  update: (patch: Partial<AgencySettings>) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      agencyName: "Brainiac Promotion Studio",
      contactEmail: "reports@brainiacstudio.io",
      defaultPackage: "Growth",
      reportFooterNote:
        "All figures are modeled campaign indicators generated from submitted campaign details, not verified Twitch advertising data.",
      compactCards: false,
      autoRefreshIndicators: true,
      update: (patch) => set(patch),
    }),
    { name: "brainiac-settings" }
  )
);
