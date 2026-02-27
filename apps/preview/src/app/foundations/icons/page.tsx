import { PageHeader } from "@preview/components/page-header";

const ICON_SIZES = [
  { name: "2xl", px: "36px" },
  { name: "xl", px: "24px" },
  { name: "lg", px: "16px" },
  { name: "md", px: "14px" },
  { name: "sm", px: "12px" },
  { name: "xs", px: "8px" },
] as const;

export default function IconsPage() {
  return (
    <div>
      <PageHeader
        title="Icons"
        description="Icon size tokens and library."
      />
      <div className="space-y-8">
        <section>
          <h3 className="text-lg font-bold mb-4">Icon Size Tokens</h3>
          <div className="space-y-3">
            {ICON_SIZES.map(({ name, px }) => (
              <div key={name} className="flex items-center gap-4">
                <span className="w-10 text-sm text-muted-foreground text-right">
                  {name}
                </span>
                <div
                  className="rounded bg-primary"
                  style={{ width: px, height: px }}
                />
                <span className="text-xs text-muted-foreground">{px}</span>
              </div>
            ))}
          </div>
        </section>

        <p className="text-sm text-muted-foreground">
          Icon library will be added in a future iteration.
        </p>
      </div>
    </div>
  );
}
