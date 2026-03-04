"use client";

import { useState } from "react";
import { Checkbox } from "@aleph-front-bkp/ds/checkbox";
import { FormField } from "@aleph-front-bkp/ds/form-field";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

export default function CheckboxPage() {
  const [checked, setChecked] = useState(false);

  return (
    <>
      <PageHeader
        title="Checkbox"
        description="A control that allows the user to toggle between checked and unchecked."
      />

      <div className="space-y-12">
        <DemoSection title="Default">
          <div className="flex items-center gap-6">
            <Checkbox />
            <Checkbox defaultChecked />
          </div>
        </DemoSection>

        <DemoSection title="Sizes">
          <div className="flex items-center gap-6">
            <Checkbox size="xs" defaultChecked />
            <Checkbox size="sm" defaultChecked />
            <Checkbox size="md" defaultChecked />
          </div>
        </DemoSection>

        <DemoSection title="States">
          <div className="flex items-center gap-6">
            <Checkbox disabled />
            <Checkbox disabled defaultChecked />
            <Checkbox error />
            <Checkbox error defaultChecked />
          </div>
        </DemoSection>

        <DemoSection title="Controlled">
          <div className="flex items-center gap-4">
            <Checkbox
              checked={checked}
              onCheckedChange={(v) => setChecked(v === true)}
            />
            <span className="text-sm text-muted-foreground">
              {checked ? "Checked" : "Unchecked"}
            </span>
          </div>
        </DemoSection>

        <DemoSection title="With FormField">
          <div className="max-w-sm space-y-4">
            <FormField label="Accept terms" required>
              <Checkbox />
            </FormField>
            <FormField
              label="Subscribe to newsletter"
              helperText="We send updates monthly"
            >
              <Checkbox />
            </FormField>
            <FormField label="Agree to privacy policy" error="Required">
              <Checkbox error />
            </FormField>
          </div>
        </DemoSection>
      </div>
    </>
  );
}
