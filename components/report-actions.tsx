"use client";

import { useState, type RefObject } from "react";
import { Download, Link2, Play, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { exportReportNode, type ExportFormat } from "@/lib/export";
import { toast } from "sonner";

export function ReportActions({
  reportRef,
  shareUrl,
  filename,
  onPresent,
}: {
  reportRef: RefObject<HTMLDivElement>;
  shareUrl: string;
  filename: string;
  onPresent: () => void;
}) {
  const [exporting, setExporting] = useState<ExportFormat | null>(null);

  async function handleExport(format: ExportFormat) {
    if (!reportRef.current) return;
    setExporting(format);
    try {
      await exportReportNode(reportRef.current, format, filename);
      toast.success(`Report exported as ${format.toUpperCase()}`);
    } catch {
      toast.error("Export failed", { description: "Please try again." });
    } finally {
      setExporting(null);
    }
  }

  async function copyShareLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied", { description: "Read-only link copied to clipboard." });
    } catch {
      toast.error("Couldn't copy link");
    }
  }

  return (
    <div className="no-print flex flex-wrap items-center gap-2">
      <Button variant="glass" onClick={copyShareLink} className="gap-2">
        <Link2 className="h-4 w-4" /> Share link
      </Button>
      <Button variant="glass" onClick={onPresent} className="gap-2">
        <Play className="h-4 w-4" /> Present
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="gap-2">
            {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Export
            <ChevronDown className="h-3.5 w-3.5 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Export report</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => handleExport("pdf")}>PDF document</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("png")}>PNG image</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("jpeg")}>JPEG image</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
