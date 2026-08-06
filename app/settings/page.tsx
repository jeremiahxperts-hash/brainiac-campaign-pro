"use client";

import { AppNav } from "@/components/app-nav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettingsStore } from "@/lib/settings-store";

const packages = ["Starter", "Growth", "Signature", "Enterprise"];

export default function SettingsPage() {
  const settings = useSettingsStore();

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="container max-w-2xl space-y-6 py-8">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Agency profile and defaults used across dashboards and reports.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Agency profile</CardTitle>
            <CardDescription>Shown on every campaign report and shared link.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="agencyName">Agency name</Label>
              <Input
                id="agencyName"
                value={settings.agencyName}
                onChange={(e) => settings.update({ agencyName: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contactEmail">Contact email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => settings.update({ contactEmail: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="footerNote">Report footer note</Label>
              <Textarea
                id="footerNote"
                rows={3}
                value={settings.reportFooterNote}
                onChange={(e) => settings.update({ reportFooterNote: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaign defaults</CardTitle>
            <CardDescription>Applied when starting a new campaign.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Default package</Label>
              <Select
                value={settings.defaultPackage}
                onValueChange={(v) => settings.update({ defaultPackage: v })}
              >
                <SelectTrigger className="w-full sm:w-56">
                  <SelectValue />
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Display</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Compact campaign cards</p>
                <p className="text-xs text-muted-foreground">Show less detail per card on the dashboard.</p>
              </div>
              <Switch
                checked={settings.compactCards}
                onCheckedChange={(v) => settings.update({ compactCards: v })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Auto-refresh indicators</p>
                <p className="text-xs text-muted-foreground">
                  Recalculate status and progress automatically as flight dates pass.
                </p>
              </div>
              <Switch
                checked={settings.autoRefreshIndicators}
                onCheckedChange={(v) => settings.update({ autoRefreshIndicators: v })}
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
