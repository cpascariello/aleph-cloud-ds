"use client";

import { StatusDot } from "@aleph-front-bkp/ds/status-dot";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

const statuses = ["healthy", "degraded", "error", "offline", "unknown"] as const;
const sizes = ["sm", "md"] as const;

export default function StatusDotPage() {
  return (
    <>
      <PageHeader
        title="StatusDot"
        description="Colored circle indicator for health status. Includes a pulse animation on healthy status."
      />
      <DemoSection title="Statuses">
        <div className="flex flex-wrap items-center gap-6">
          {statuses.map((s) => (
            <div key={s} className="flex items-center gap-2">
              <StatusDot status={s} aria-label={s} />
              <span className="text-sm capitalize">{s}</span>
            </div>
          ))}
        </div>
      </DemoSection>
      <DemoSection title="Sizes">
        <div className="flex flex-wrap items-center gap-6">
          {sizes.map((sz) => (
            <div key={sz} className="flex items-center gap-2">
              <StatusDot status="healthy" size={sz} aria-label={`${sz} dot`} />
              <span className="text-sm">Size {sz}</span>
            </div>
          ))}
        </div>
      </DemoSection>
      <DemoSection title="Inline with Text">
        <div className="space-y-2">
          <p className="flex items-center gap-2 text-sm">
            <StatusDot status="healthy" aria-label="healthy" />
            Node is healthy and responding
          </p>
          <p className="flex items-center gap-2 text-sm">
            <StatusDot status="degraded" aria-label="degraded" />
            Node performance degraded
          </p>
          <p className="flex items-center gap-2 text-sm">
            <StatusDot status="offline" aria-label="offline" />
            Node is offline
          </p>
        </div>
      </DemoSection>
    </>
  );
}
