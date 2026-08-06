import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Gauge,
  LayoutTemplate,
  Presentation,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ApiHeroCard } from "@/components/api-hero-card";

const features = [
  {
    icon: Gauge,
    title: "Auto-generated indicators",
    body: "Every campaign gets a Visibility, Discovery, and Quality score the moment it's created — no manual entry.",
  },
  {
    icon: LayoutTemplate,
    title: "Client-ready reports",
    body: "Overview, timeline, keyword coverage, and promotion notes, laid out for a buyer to open and understand instantly.",
  },
  {
    icon: Presentation,
    title: "Presentation mode",
    body: "Turn any report into a full-screen walkthrough for calls — no separate deck to build.",
  },
  {
    icon: ShieldCheck,
    title: "Clearly labeled estimates",
    body: "Every metric is marked as a modeled campaign indicator, never presented as verified ad platform data.",
  },
];

const steps = [
  {
    n: "01",
    title: "Log the campaign",
    body: "Buyer details, channel, package, keywords, and flight dates — one form, under a minute.",
  },
  {
    n: "02",
    title: "Indicators generate",
    body: "Brainiac calculates visibility, discovery, and quality indicators plus a full activity timeline.",
  },
  {
    n: "03",
    title: "Share the report",
    body: "Export to PDF or image, or send a read-only link straight to your buyer.",
  },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-brainiac-mesh" />

      <header className="relative z-10">
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-mulberry to-mauve text-cream shadow-glow">
              <Brain className="h-5 w-5" />
            </span>
            <span className="font-display text-base font-semibold tracking-tight">
              Brainiac <span className="text-muted-foreground font-normal">Promotion Studio</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button asChild variant="glass" className="hidden sm:inline-flex">
              <Link href="/dashboard">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">
                Open dashboard <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="container grid items-center gap-14 py-16 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-up space-y-7">
            <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5 text-blossom" /> Built for Twitch promotion agencies
            </span>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Campaign reports that read like a{" "}
              <span className="text-gradient">real API</span>, not a spreadsheet
            </h1>
            <p className="max-w-lg text-lg text-muted-foreground">
              Log a campaign once. Brainiac generates visibility, discovery, and quality indicators,
              builds the timeline, and lays out a polished report your buyers can open, present, or
              export — in minutes.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link href="/dashboard">
                  Start a campaign <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="glass">
                <Link href="/dashboard">See the dashboard</Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Campaign management &amp; reporting only — not affiliated with or verified by Twitch Ads.
            </p>
          </div>

          <ApiHeroCard />
        </section>

        <section className="container py-16">
          <div className="mb-10 max-w-xl">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Everything a report needs, nothing it doesn't
            </h2>
            <p className="mt-2 text-muted-foreground">
              Four things buyers actually look for in a promotion report.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, body }) => (
              <div key={title} className="glass-panel p-6">
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-display text-base font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container py-16">
          <div className="mb-10 max-w-xl">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              From intake to report in three steps
            </h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="relative rounded-2xl border border-border/60 p-6">
                <span className="font-mono text-sm text-blossom/70">{s.n}</span>
                <h3 className="mt-3 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container pb-24 pt-8">
          <div className="glass-panel flex flex-col items-center gap-5 p-10 text-center sm:p-14">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Ready to build your first report?
            </h2>
            <p className="max-w-md text-muted-foreground">
              No setup, no integrations to configure. Create a campaign and Brainiac takes it from
              there.
            </p>
            <Button asChild size="lg" className="gap-2">
              <Link href="/dashboard">
                Open dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-border/60 py-8">
        <div className="container flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Brainiac Promotion Studio.</p>
          <p>Campaign management &amp; reporting platform. Not affiliated with Twitch Ads.</p>
        </div>
      </footer>
    </div>
  );
}
