"use client";

import { Skeleton } from "@aleph-front-bkp/ds/ui/skeleton";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

export default function SkeletonPage() {
  return (
    <>
      <PageHeader
        title="Skeleton"
        description="Animated loading placeholder. Sizing via consumer className — no width/height props."
      />
      <DemoSection title="Basic Shapes">
        <div className="space-y-4">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="size-12 rounded-full" />
        </div>
      </DemoSection>
      <DemoSection title="Card Loading State">
        <div className="rounded-2xl border border-edge bg-surface p-6 space-y-4 max-w-sm">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-full" />
          <div className="flex gap-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </DemoSection>
      <DemoSection title="Table Row Loading">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="size-3 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </DemoSection>
    </>
  );
}
