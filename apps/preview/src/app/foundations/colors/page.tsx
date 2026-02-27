import { PageHeader } from "@preview/components/page-header";

function Swatch({
  label,
  colorClass,
  textClass,
}: {
  label: string;
  colorClass: string;
  textClass: string;
}) {
  return (
    <div className={`rounded-lg p-4 ${colorClass}`}>
      <span className={`text-sm font-medium ${textClass}`}>{label}</span>
    </div>
  );
}

function SwatchRow({
  title,
  swatches,
}: {
  title: string;
  swatches: { label: string; colorClass: string; textClass: string }[];
}) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold mb-3">{title}</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {swatches.map((s) => (
          <Swatch key={s.label} {...s} />
        ))}
      </div>
    </div>
  );
}

const SCALE_BG: Record<string, Record<number, string>> = {
  primary: {
    50: "bg-primary-50", 100: "bg-primary-100", 200: "bg-primary-200",
    300: "bg-primary-300", 400: "bg-primary-400", 500: "bg-primary-500",
    600: "bg-primary-600", 700: "bg-primary-700", 800: "bg-primary-800",
    900: "bg-primary-900", 950: "bg-primary-950",
  },
  accent: {
    50: "bg-accent-50", 100: "bg-accent-100", 200: "bg-accent-200",
    300: "bg-accent-300", 400: "bg-accent-400", 500: "bg-accent-500",
    600: "bg-accent-600", 700: "bg-accent-700", 800: "bg-accent-800",
    900: "bg-accent-900", 950: "bg-accent-950",
  },
  success: {
    50: "bg-success-50", 100: "bg-success-100", 200: "bg-success-200",
    300: "bg-success-300", 400: "bg-success-400", 500: "bg-success-500",
    600: "bg-success-600", 700: "bg-success-700", 800: "bg-success-800",
    900: "bg-success-900", 950: "bg-success-950",
  },
  warning: {
    50: "bg-warning-50", 100: "bg-warning-100", 200: "bg-warning-200",
    300: "bg-warning-300", 400: "bg-warning-400", 500: "bg-warning-500",
    600: "bg-warning-600", 700: "bg-warning-700", 800: "bg-warning-800",
    900: "bg-warning-900", 950: "bg-warning-950",
  },
  error: {
    50: "bg-error-50", 100: "bg-error-100", 200: "bg-error-200",
    300: "bg-error-300", 400: "bg-error-400", 500: "bg-error-500",
    600: "bg-error-600", 700: "bg-error-700", 800: "bg-error-800",
    900: "bg-error-900", 950: "bg-error-950",
  },
  neutral: {
    50: "bg-neutral-50", 100: "bg-neutral-100", 200: "bg-neutral-200",
    300: "bg-neutral-300", 400: "bg-neutral-400", 500: "bg-neutral-500",
    600: "bg-neutral-600", 700: "bg-neutral-700", 800: "bg-neutral-800",
    900: "bg-neutral-900", 950: "bg-neutral-950",
  },
};

const STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

function ScaleRow({
  title,
  color,
}: {
  title: string;
  color: string;
}) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold mb-3">{title}</h3>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-11">
        {STOPS.map((stop) => (
          <div
            key={stop}
            className={`rounded-lg p-3 ${SCALE_BG[color]?.[stop] ?? ""}`}
          >
            <span
              className={`text-xs font-medium ${stop >= 500 ? "text-white" : "text-black"}`}
            >
              {stop}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ColorsPage() {
  return (
    <div>
      <PageHeader
        title="Colors"
        description="OKLCH color scales (50-950) and semantic theme-aware tokens."
      />
      <ScaleRow title="Primary" color="primary" />
      <ScaleRow title="Accent" color="accent" />
      <ScaleRow title="Success" color="success" />
      <ScaleRow title="Warning" color="warning" />
      <ScaleRow title="Error" color="error" />
      <ScaleRow title="Neutral" color="neutral" />

      <SwatchRow
        title="Semantic (theme-aware)"
        swatches={[
          {
            label: "background",
            colorClass: "bg-background border border-edge",
            textClass: "text-foreground",
          },
          {
            label: "foreground",
            colorClass: "bg-foreground",
            textClass: "text-background",
          },
          {
            label: "primary",
            colorClass: "bg-primary",
            textClass: "text-primary-foreground",
          },
          {
            label: "accent",
            colorClass: "bg-accent",
            textClass: "text-accent-foreground",
          },
          {
            label: "muted",
            colorClass: "bg-muted",
            textClass: "text-muted-foreground",
          },
          {
            label: "card",
            colorClass: "bg-card border border-edge",
            textClass: "text-card-foreground",
          },
        ]}
      />
      <SwatchRow
        title="Border"
        swatches={[
          {
            label: "border",
            colorClass: "border-2 border-edge bg-background",
            textClass: "text-foreground",
          },
          {
            label: "border-hover",
            colorClass: "border-2 border-edge-hover bg-background",
            textClass: "text-foreground",
          },
        ]}
      />
    </div>
  );
}
