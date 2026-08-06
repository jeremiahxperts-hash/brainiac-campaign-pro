import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Campaign, CampaignFormInput } from "./types";
import { buildCampaign, refreshDerived } from "./campaign-utils";

interface CampaignStore {
  campaigns: Campaign[];
  hydrated: boolean;
  setHydrated: () => void;
  addCampaign: (input: CampaignFormInput) => Campaign;
  removeCampaign: (id: string) => void;
  getCampaign: (id: string) => Campaign | undefined;
  getByShareId: (shareId: string) => Campaign | undefined;
}

export const useCampaignStore = create<CampaignStore>()(
  persist(
    (set, get) => ({
      campaigns: [],
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      addCampaign: (input) => {
        const campaign = buildCampaign(input);
        set((state) => ({ campaigns: [campaign, ...state.campaigns] }));
        return campaign;
      },
      removeCampaign: (id) =>
        set((state) => ({ campaigns: state.campaigns.filter((c) => c.id !== id) })),
      getCampaign: (id) => {
        const c = get().campaigns.find((c) => c.id === id);
        return c ? refreshDerived(c) : undefined;
      },
      getByShareId: (shareId) => {
        const c = get().campaigns.find((c) => c.shareId === shareId);
        return c ? refreshDerived(c) : undefined;
      },
    }),
    {
      name: "brainiac-campaigns",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
