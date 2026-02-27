import { PageHeader } from "@preview/components/page-header";

const SPACING_SCALE = [
  { name: "0.5", px: "2px" },
  { name: "1", px: "4px" },
  { name: "2", px: "8px" },
  { name: "3", px: "12px" },
  { name: "4", px: "16px" },
  { name: "5", px: "20px" },
  { name: "6", px: "24px" },
  { name: "8", px: "32px" },
  { name: "10", px: "40px" },
  { name: "12", px: "48px" },
  { name: "16", px: "64px" },
  { name: "20", px: "80px" },
  { name: "24", px: "96px" },
] as const;

const BREAKPOINTS = [
  { name: "sm", px: "640px" },
  { name: "md", px: "768px" },
  { name: "lg", px: "1024px" },
  { name: "xl", px: "1280px" },
  { name: "2xl", px: "1536px" },
] as const;

export default function SpacingPage() {
  return (
    <div>
      <PageHeader
        title="Spacing"
        description="Spacing scale, breakpoints, and border radius tokens."
      />
      <div className="space-y-12">
        <section>
          <h3 className="text-lg font-bold mb-4">Spacing Scale</h3>
          <div className="space-y-2">
            {SPACING_SCALE.map(({ name, px }) => (
              <div key={name} className="flex items-center gap-4">
                <span className="w-12 text-sm text-muted-foreground text-right">
                  {name}
                </span>
                <div
                  className="h-4 rounded bg-primary"
                  style={{ width: px }}
                />
                <span className="text-xs text-muted-foreground">{px}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold mb-4">Breakpoints</h3>
          <div className="overflow-x-auto">
            <table className="text-sm">
              <thead>
                <tr className="border-b border-edge">
                  <th className="text-left py-2 pr-8 text-muted-foreground font-medium">
                    Name
                  </th>
                  <th className="text-left py-2 pr-8 text-muted-foreground font-medium">
                    Min-width
                  </th>
                  <th className="text-left py-2 text-muted-foreground font-medium">
                    CSS
                  </th>
                </tr>
              </thead>
              <tbody>
                {BREAKPOINTS.map(({ name, px }) => (
                  <tr key={name} className="border-b border-edge">
                    <td className="py-2 pr-8 font-mono">{name}</td>
                    <td className="py-2 pr-8">{px}</td>
                    <td className="py-2 font-mono text-muted-foreground">
                      @media (min-width: {px})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold mb-4">Border Radius</h3>
          <div className="flex flex-wrap gap-4">
            {(
              [
                "rounded-sm",
                "rounded",
                "rounded-md",
                "rounded-lg",
                "rounded-xl",
                "rounded-full",
              ] as const
            ).map((cls) => (
              <div key={cls} className="text-center">
                <div className={`w-16 h-16 bg-primary ${cls}`} />
                <p className="text-xs text-muted-foreground mt-2">{cls}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
