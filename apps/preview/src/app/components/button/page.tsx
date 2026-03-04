"use client";

import { Button } from "@aleph-front-bkp/ds/button";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

const variants = ["primary", "secondary", "outline", "text", "destructive", "warning"] as const;
const sizes = ["xs", "sm", "md", "lg"] as const;

function PlaceholderIcon({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <title>{label}</title>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

export default function ButtonPage() {
  return (
    <>
      <PageHeader
        title="Button"
        description="6 variants, 4 sizes, icon slots, loading/disabled states, and asChild polymorphism."
      />
      <DemoSection title="Variants">
        <div className="flex flex-wrap items-center gap-3">
          {variants.map((v) => (
            <Button key={v} variant={v}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </div>
      </DemoSection>
      <DemoSection title="Sizes">
        <div className="flex flex-wrap items-end gap-3">
          {sizes.map((s) => (
            <Button key={s} size={s}>
              Size {s}
            </Button>
          ))}
        </div>
      </DemoSection>
      <DemoSection title="With Icons">
        <div className="flex flex-wrap items-center gap-3">
          <Button iconLeft={<PlaceholderIcon label="Add" />}>Icon Left</Button>
          <Button iconRight={<PlaceholderIcon label="Arrow" />}>Icon Right</Button>
          <Button iconLeft={<PlaceholderIcon label="Add" />} iconRight={<PlaceholderIcon label="Arrow" />}>
            Both Icons
          </Button>
        </div>
      </DemoSection>
      <DemoSection title="Loading">
        <div className="flex flex-wrap items-center gap-3">
          {variants.map((v) => (
            <Button key={v} variant={v} loading>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </div>
      </DemoSection>
      <DemoSection title="Disabled">
        <div className="flex flex-wrap items-center gap-3">
          {variants.map((v) => (
            <Button key={v} variant={v} disabled>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </div>
      </DemoSection>
      <DemoSection title="As Link">
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="primary">
            <a href="#demo">Primary Link</a>
          </Button>
          <Button asChild variant="text">
            <a href="#demo">Text Link</a>
          </Button>
        </div>
      </DemoSection>
    </>
  );
}
