import { PageHeader } from "@preview/components/page-header";

const SHADOWS = [
  { name: "brand-sm", class: "shadow-brand-sm" },
  { name: "brand", class: "shadow-brand" },
  { name: "brand-lg", class: "shadow-brand-lg" },
] as const;

const GRADIENTS = [
  { name: "main", var: "var(--gradient-main)" },
  { name: "lime", var: "var(--gradient-lime)" },
  { name: "success", var: "var(--gradient-success)" },
  { name: "warning", var: "var(--gradient-warning)" },
  { name: "error", var: "var(--gradient-error)" },
  { name: "info", var: "var(--gradient-info)" },
] as const;

const TRANSITIONS = [
  { name: "fast", duration: "200ms" },
  { name: "normal", duration: "500ms" },
  { name: "slow", duration: "700ms" },
] as const;

export default function EffectsPage() {
  return (
    <div>
      <PageHeader
        title="Effects"
        description="Shadows, gradients, and transition tokens."
      />
      <div className="space-y-12">
        <section>
          <h3 className="text-lg font-bold mb-4">Shadows</h3>
          <div className="grid gap-6 md:grid-cols-3">
            {SHADOWS.map(({ name, class: cls }) => (
              <div key={name} className={`rounded-lg bg-card p-6 ${cls}`}>
                <p className="text-sm font-medium text-card-foreground">
                  {name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  shadow-{name}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold mb-4">Gradients</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {GRADIENTS.map(({ name, var: cssVar }) => (
              <div
                key={name}
                className="rounded-lg p-4 h-20 flex items-end"
                style={{ background: cssVar }}
              >
                <span className="text-sm font-medium text-white drop-shadow-md">
                  gradient-{name}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold mb-4">Transitions</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {TRANSITIONS.map(({ name, duration }) => (
              <div
                key={name}
                className="rounded-lg border border-edge p-4 hover:border-primary
                           hover:shadow-brand cursor-pointer"
                style={{
                  transitionProperty: "border-color, box-shadow",
                  transitionDuration: duration,
                  transitionTimingFunction: "var(--timing)",
                }}
              >
                <p className="text-sm font-medium">{name}</p>
                <p className="text-xs text-muted-foreground">{duration}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Hover to preview
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
