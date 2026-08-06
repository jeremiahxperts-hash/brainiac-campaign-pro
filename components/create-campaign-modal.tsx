"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Sparkles, Wand2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCampaignStore } from "@/lib/store";
import { useSettingsStore } from "@/lib/settings-store";
import { toast } from "sonner";

const packages = ["Starter", "Growth", "Signature", "Enterprise"] as const;

const schema = z
  .object({
    buyerName: z.string().min(2, "Enter the buyer's full name"),
    email: z.string().email("Enter a valid email"),
    twitchUrl: z
      .string()
      .min(1, "Enter a Twitch channel URL")
      .refine((v) => /twitch\.tv\//i.test(v), "Use a twitch.tv channel URL"),
    campaignTitle: z.string().min(3, "Give the campaign a title"),
    package: z.enum(packages),
    duration: z.coerce.number().min(1, "At least 1 day").max(365, "Keep it under 365 days"),
    keywords: z.string().min(2, "Add at least one keyword"),
    targetAudience: z.string().min(2, "Describe the target audience"),
    notes: z.string().optional(),
    launchDate: z.string().min(1, "Pick a launch date"),
    completionDate: z.string().min(1, "Pick a completion date"),
  })
  .refine((d) => new Date(d.completionDate) > new Date(d.launchDate), {
    message: "Completion date must be after the launch date",
    path: ["completionDate"],
  });

type FormValues = z.infer<typeof schema>;

export function CreateCampaignModal({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const addCampaign = useCampaignStore((s) => s.addCampaign);
  const defaultPackage = useSettingsStore((s) => s.defaultPackage);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      package: (defaultPackage as (typeof packages)[number]) || "Growth",
      duration: 14,
    },
  });

  const onSubmit = async (values: FormValues) => {
    await new Promise((r) => setTimeout(r, 500));
    const campaign = addCampaign(values);
    toast.success("Campaign created", {
      description: `${campaign.campaignTitle} · ${campaign.id}`,
    });
    reset();
    setOpen(false);
    router.push(`/campaign/${campaign.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="lg" className="gap-2">
            <Wand2 className="h-4 w-4" />
            New campaign
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blossom" /> Create campaign
          </DialogTitle>
          <DialogDescription>
            Enter the buyer and channel details. Brainiac generates campaign indicators and a
            client-ready report automatically once it's created.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="buyerName">Buyer name</Label>
            <Input id="buyerName" placeholder="Jordan Vale" {...register("buyerName")} />
            {errors.buyerName && <p className="text-xs text-destructive">{errors.buyerName.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="jordan@buyer.com" {...register("email")} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="twitchUrl">Twitch channel URL</Label>
            <Input id="twitchUrl" placeholder="https://twitch.tv/channelname" {...register("twitchUrl")} />
            {errors.twitchUrl && <p className="text-xs text-destructive">{errors.twitchUrl.message}</p>}
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="campaignTitle">Campaign title</Label>
            <Input id="campaignTitle" placeholder="Summer Discovery Push" {...register("campaignTitle")} />
            {errors.campaignTitle && (
              <p className="text-xs text-destructive">{errors.campaignTitle.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Package</Label>
            <Select
              defaultValue={watch("package")}
              onValueChange={(v) => setValue("package", v as FormValues["package"])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a package" />
              </SelectTrigger>
              <SelectContent>
                {packages.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="duration">Duration (days)</Label>
            <Input id="duration" type="number" min={1} max={365} {...register("duration")} />
            {errors.duration && <p className="text-xs text-destructive">{errors.duration.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="launchDate">Launch date</Label>
            <Input id="launchDate" type="date" {...register("launchDate")} />
            {errors.launchDate && <p className="text-xs text-destructive">{errors.launchDate.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="completionDate">Completion date</Label>
            <Input id="completionDate" type="date" {...register("completionDate")} />
            {errors.completionDate && (
              <p className="text-xs text-destructive">{errors.completionDate.message}</p>
            )}
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="keywords">Keywords (comma separated)</Label>
            <Input id="keywords" placeholder="speedrun, cozy games, variety" {...register("keywords")} />
            {errors.keywords && <p className="text-xs text-destructive">{errors.keywords.message}</p>}
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="targetAudience">Target audience</Label>
            <Input
              id="targetAudience"
              placeholder="18-34, cozy & variety gaming viewers in NA/EU"
              {...register("targetAudience")}
            />
            {errors.targetAudience && (
              <p className="text-xs text-destructive">{errors.targetAudience.message}</p>
            )}
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" placeholder="Anything the report should mention" {...register("notes")} />
          </div>

          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Generating…" : "Create campaign"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
