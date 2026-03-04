"use client";

import { Badge } from "@aleph-front-bkp/ds/badge";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

const variants = ["default", "success", "warning", "error", "info"] as const;
const sizes = ["sm", "md"] as const;

export default function BadgePage() {
  return (
    <>
      <PageHeader
        title="Badge"
        description="5 semantic variants and 2 sizes. Used for status labels, counts, and category tags."
      />
      <DemoSection title="Variants">
        <div className="flex flex-wrap items-center gap-3">
          {variants.map((v) => (
            <Badge key={v} variant={v}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Badge>
          ))}
        </div>
      </DemoSection>
      <DemoSection title="Sizes">
        <div className="flex flex-wrap items-center gap-3">
          {sizes.map((s) => (
            <Badge key={s} size={s}>
              Size {s}
            </Badge>
          ))}
        </div>
      </DemoSection>
      <DemoSection title="Real-World Examples">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="success">Healthy</Badge>
          <Badge variant="warning">Degraded</Badge>
          <Badge variant="error">Offline</Badge>
          <Badge variant="default">Scheduled</Badge>
          <Badge variant="info">3 VMs</Badge>
        </div>
      </DemoSection>
    </>
  );
}
