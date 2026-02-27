import Link from "next/link";
import { PageHeader } from "@preview/components/page-header";

const FOUNDATIONS = [
  { label: "Colors", href: "/foundations/colors", description: "OKLCH scales and semantic tokens" },
  { label: "Typography", href: "/foundations/typography", description: "Heading scale, body styles, font families" },
  { label: "Spacing", href: "/foundations/spacing", description: "Spacing scale, breakpoints, border radius" },
  { label: "Effects", href: "/foundations/effects", description: "Shadows, gradients, transitions" },
  { label: "Icons", href: "/foundations/icons", description: "Icon size tokens" },
];

const COMPONENTS = [
  { label: "Button", href: "/components/button", description: "6 variants, 4 sizes, icons, loading" },
  { label: "Input", href: "/components/input", description: "Text input with sizes and error state" },
  { label: "Textarea", href: "/components/textarea", description: "Multi-line input with resize" },
  { label: "FormField", href: "/components/form-field", description: "Label + input wrapper with accessibility" },
];

export default function OverviewPage() {
  return (
    <>
      <PageHeader
        title="Aleph Cloud DS"
        description="Tokens-first design system with OKLCH color scales, semantic theming, and accessible components."
      />

      <section className="mb-12">
        <h3 className="text-xl font-bold mb-4">Foundations</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FOUNDATIONS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg border border-edge p-4 hover:border-primary
                         hover:shadow-brand-sm transition-all"
              style={{ transitionDuration: "var(--duration-fast)" }}
            >
              <p className="font-bold mb-1">{item.label}</p>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h3 className="text-xl font-bold mb-4">Components</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COMPONENTS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg border border-edge p-4 hover:border-primary
                         hover:shadow-brand-sm transition-all"
              style={{ transitionDuration: "var(--duration-fast)" }}
            >
              <p className="font-bold mb-1">{item.label}</p>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
