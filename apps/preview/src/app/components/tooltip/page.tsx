"use client";

import { Button } from "@aleph-front-bkp/ds/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@aleph-front-bkp/ds/tooltip";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

export default function TooltipPage() {
  return (
    <TooltipProvider>
      <PageHeader
        title="Tooltip"
        description="Radix UI tooltip with DS styling. Composable API: TooltipProvider, Tooltip, TooltipTrigger, TooltipContent."
      />
      <DemoSection title="Basic">
        <div className="flex flex-wrap items-center gap-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                Hover me
              </Button>
            </TooltipTrigger>
            <TooltipContent>This is a tooltip</TooltipContent>
          </Tooltip>
        </div>
      </DemoSection>
      <DemoSection title="Sides">
        <div className="flex flex-wrap items-center gap-6">
          {(["top", "right", "bottom", "left"] as const).map((side) => (
            <Tooltip key={side}>
              <TooltipTrigger asChild>
                <Button variant="text" size="sm">
                  {side}
                </Button>
              </TooltipTrigger>
              <TooltipContent side={side}>
                Tooltip on {side}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </DemoSection>
      <DemoSection title="Truncated Hash">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help font-mono text-sm underline decoration-dotted">
                a1b2c3...e5f6
              </span>
            </TooltipTrigger>
            <TooltipContent>
              a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8
            </TooltipContent>
          </Tooltip>
        </div>
      </DemoSection>
    </TooltipProvider>
  );
}
