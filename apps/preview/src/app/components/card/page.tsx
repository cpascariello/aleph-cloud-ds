"use client";

import { Card } from "@aleph-front-bkp/ds/card";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

const paddings = ["sm", "md", "lg"] as const;

export default function CardPage() {
  return (
    <>
      <PageHeader
        title="Card"
        description="Content container with 2 variants, 3 padding sizes, and an optional title."
      />
      <DemoSection title="Default Variant">
        <div className="space-y-4">
          <Card>
            <p className="text-sm">Default card with medium padding, white background, and border.</p>
          </Card>
          <Card title="With Title">
            <p className="text-sm">Card content below the heading.</p>
          </Card>
        </div>
      </DemoSection>
      <DemoSection title="Ghost Variant">
        <Card variant="ghost">
          <p className="text-sm">Ghost card — transparent, no border. Useful for layout grouping.</p>
        </Card>
      </DemoSection>
      <DemoSection title="Padding Sizes">
        <div className="space-y-4">
          {paddings.map((p) => (
            <Card key={p} padding={p}>
              <p className="text-sm">Padding: {p}</p>
            </Card>
          ))}
        </div>
      </DemoSection>
      <DemoSection title="Stat Cards (Composition Example)">
        <div className="grid grid-cols-3 gap-4">
          <Card padding="sm">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Nodes</p>
            <p className="text-2xl font-heading font-bold mt-1">15</p>
          </Card>
          <Card padding="sm">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Healthy</p>
            <p className="text-2xl font-heading font-bold text-success-600 mt-1">9</p>
          </Card>
          <Card padding="sm">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Offline</p>
            <p className="text-2xl font-heading font-bold text-error-600 mt-1">2</p>
          </Card>
        </div>
      </DemoSection>
    </>
  );
}
