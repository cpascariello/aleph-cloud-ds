"use client";

import { FormField } from "@aleph-front/ds/form-field";
import { Input } from "@aleph-front/ds/input";
import { Textarea } from "@aleph-front/ds/textarea";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

export default function FormFieldPage() {
  return (
    <>
      <PageHeader
        title="FormField"
        description="Label + input wrapper with required asterisk, helper text, error message, and auto-wired accessibility."
      />
      <DemoSection title="With Helper Text">
        <div className="grid gap-6 max-w-md">
          <FormField label="Username" helperText="Choose a unique username">
            <Input placeholder="aleph_user" />
          </FormField>
        </div>
      </DemoSection>
      <DemoSection title="Required with Error">
        <div className="grid gap-6 max-w-md">
          <FormField label="Email" required error="Please enter a valid email">
            <Input type="email" placeholder="you@example.com" error />
          </FormField>
        </div>
      </DemoSection>
      <DemoSection title="With Textarea">
        <div className="grid gap-6 max-w-md">
          <FormField label="Bio" helperText="Tell us about yourself">
            <Textarea placeholder="I build on Aleph Cloud..." />
          </FormField>
        </div>
      </DemoSection>
    </>
  );
}
