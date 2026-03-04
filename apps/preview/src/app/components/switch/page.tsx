"use client";

import { useState } from "react";
import { Switch } from "@aleph-front-bkp/ds/switch";
import { FormField } from "@aleph-front-bkp/ds/form-field";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

export default function SwitchPage() {
  const [checked, setChecked] = useState(false);

  return (
    <>
      <PageHeader
        title="Switch"
        description="A toggle control for switching between on and off states."
      />

      <div className="space-y-12">
        <DemoSection title="Default">
          <div className="flex items-center gap-6">
            <Switch />
            <Switch defaultChecked />
          </div>
        </DemoSection>

        <DemoSection title="Sizes">
          <div className="flex items-center gap-6">
            <Switch size="xs" defaultChecked />
            <Switch size="sm" defaultChecked />
            <Switch size="md" defaultChecked />
          </div>
        </DemoSection>

        <DemoSection title="Disabled">
          <div className="flex items-center gap-6">
            <Switch disabled />
            <Switch disabled defaultChecked />
          </div>
        </DemoSection>

        <DemoSection title="Controlled">
          <div className="flex items-center gap-4">
            <Switch
              checked={checked}
              onCheckedChange={setChecked}
            />
            <span className="text-sm text-muted-foreground">
              {checked ? "On" : "Off"}
            </span>
          </div>
        </DemoSection>

        <DemoSection title="With FormField">
          <div className="max-w-sm space-y-4">
            <FormField label="Email notifications">
              <Switch />
            </FormField>
            <FormField
              label="Marketing emails"
              helperText="Receive promotional content"
            >
              <Switch />
            </FormField>
          </div>
        </DemoSection>
      </div>
    </>
  );
}
