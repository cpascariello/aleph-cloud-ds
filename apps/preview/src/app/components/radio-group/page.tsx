"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@aleph-front-bkp/ds/radio-group";
import { FormField } from "@aleph-front-bkp/ds/form-field";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

export default function RadioGroupPage() {
  const [value, setValue] = useState("a");

  return (
    <>
      <PageHeader
        title="Radio Group"
        description="A set of mutually exclusive options where only one can be selected."
      />

      <div className="space-y-12">
        <DemoSection title="Default">
          <RadioGroup defaultValue="a">
            <RadioGroupItem value="a" />
            <RadioGroupItem value="b" />
            <RadioGroupItem value="c" />
          </RadioGroup>
        </DemoSection>

        <DemoSection title="Sizes">
          <div className="flex gap-12">
            <RadioGroup defaultValue="a">
              <RadioGroupItem value="a" size="xs" />
              <RadioGroupItem value="b" size="xs" />
            </RadioGroup>
            <RadioGroup defaultValue="a">
              <RadioGroupItem value="a" size="sm" />
              <RadioGroupItem value="b" size="sm" />
            </RadioGroup>
            <RadioGroup defaultValue="a">
              <RadioGroupItem value="a" size="md" />
              <RadioGroupItem value="b" size="md" />
            </RadioGroup>
          </div>
        </DemoSection>

        <DemoSection title="States">
          <div className="flex gap-12">
            <RadioGroup defaultValue="a" disabled>
              <RadioGroupItem value="a" />
              <RadioGroupItem value="b" />
            </RadioGroup>
            <RadioGroup defaultValue="a">
              <RadioGroupItem value="a" />
              <RadioGroupItem value="b" disabled />
            </RadioGroup>
          </div>
        </DemoSection>

        <DemoSection title="Controlled">
          <div className="flex items-start gap-6">
            <RadioGroup value={value} onValueChange={setValue}>
              <RadioGroupItem value="a" />
              <RadioGroupItem value="b" />
              <RadioGroupItem value="c" />
            </RadioGroup>
            <span className="text-sm text-muted-foreground">
              Selected: {value}
            </span>
          </div>
        </DemoSection>

        <DemoSection title="With FormField">
          <div className="max-w-sm">
            <FormField label="Plan" required>
              <RadioGroup defaultValue="starter">
                <RadioGroupItem value="starter" />
                <RadioGroupItem value="pro" />
                <RadioGroupItem value="enterprise" />
              </RadioGroup>
            </FormField>
          </div>
        </DemoSection>
      </div>
    </>
  );
}
