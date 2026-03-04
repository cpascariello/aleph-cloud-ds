"use client";

import { Textarea } from "@aleph-front-bkp/ds/textarea";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

export default function TextareaPage() {
  return (
    <>
      <PageHeader
        title="Textarea"
        description="Multi-line text input with vertical resize, error and disabled states."
      />
      <DemoSection title="Default">
        <div className="grid gap-4 max-w-md">
          <Textarea placeholder="Default textarea" aria-label="Default textarea" />
        </div>
      </DemoSection>
      <DemoSection title="States">
        <div className="grid gap-4 max-w-md">
          <Textarea error placeholder="Error textarea" aria-label="Error textarea" />
          <Textarea disabled placeholder="Disabled textarea" aria-label="Disabled textarea" />
        </div>
      </DemoSection>
    </>
  );
}
