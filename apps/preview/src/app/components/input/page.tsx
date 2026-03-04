"use client";

import { Input } from "@aleph-front-bkp/ds/input";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

export default function InputPage() {
  return (
    <>
      <PageHeader
        title="Input"
        description="Text input with 2 sizes, error and disabled states."
      />
      <DemoSection title="Sizes">
        <div className="grid gap-4 max-w-md">
          <Input size="sm" placeholder="Small input" aria-label="Small input" />
          <Input size="md" placeholder="Medium input" aria-label="Medium input" />
        </div>
      </DemoSection>
      <DemoSection title="States">
        <div className="grid gap-4 max-w-md">
          <Input placeholder="Default" aria-label="Default" />
          <Input error placeholder="Error state" aria-label="Error" />
          <Input disabled placeholder="Disabled" aria-label="Disabled" />
        </div>
      </DemoSection>
    </>
  );
}
