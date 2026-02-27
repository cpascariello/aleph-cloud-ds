import { PageHeader } from "@preview/components/page-header";

const HEADINGS = [
  { tag: "header", size: "8rem", label: "Header -- 128px" },
  { tag: "h1", size: "4.5rem", label: "H1 -- 72px" },
  { tag: "h2", size: "4rem", label: "H2 -- 64px" },
  { tag: "h3", size: "3rem", label: "H3 -- 48px" },
  { tag: "h4", size: "2.5rem", label: "H4 -- 40px" },
  { tag: "h5", size: "2.25rem", label: "H5 -- 36px" },
  { tag: "h6", size: "2rem", label: "H6 -- 32px" },
  { tag: "h7", size: "1.5rem", label: "H7 -- 24px" },
] as const;

export default function TypographyPage() {
  return (
    <div>
      <PageHeader
        title="Typography"
        description="Heading scale, body styles, and font families."
      />
      <div className="space-y-12">
        <section>
          <h3 className="text-lg font-bold mb-4">Heading Scale</h3>
          <div className="space-y-4">
            {HEADINGS.map(({ tag, size, label }) => (
              <div key={tag} className="border-b border-edge pb-4">
                <p className="text-xs text-muted-foreground mb-1">{label}</p>
                <p
                  className="font-heading font-extrabold italic leading-none"
                  style={{ fontSize: size }}
                >
                  {tag === "header" ? "Header" : tag.toUpperCase()}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold mb-4">Body Styles</h3>
          <div className="space-y-4 max-w-prose">
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Body -- Titillium Web 400, 16px, 1.6 line-height
              </p>
              <p className="font-sans text-base leading-relaxed">
                The quick brown fox jumps over the lazy dog. Aleph Cloud provides
                decentralized computing, storage, and networking.
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Body Bold -- Titillium Web 700
              </p>
              <p className="font-sans text-base font-bold leading-relaxed">
                The quick brown fox jumps over the lazy dog.
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Body Italic -- Titillium Web 400 italic
              </p>
              <p className="font-sans text-base italic leading-relaxed">
                The quick brown fox jumps over the lazy dog.
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Code -- Source Code Pro 400
              </p>
              <p className="font-mono text-base leading-relaxed">
                const node = await aleph.create({"{"} channel: &quot;test&quot;{" "}
                {"}"});
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold mb-4">Font Families</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-edge p-4">
              <p className="text-xs text-muted-foreground mb-2">font-heading</p>
              <p className="font-heading text-xl font-extrabold italic">
                rigid-square
              </p>
            </div>
            <div className="rounded-lg border border-edge p-4">
              <p className="text-xs text-muted-foreground mb-2">font-sans</p>
              <p className="font-sans text-xl">Titillium Web</p>
            </div>
            <div className="rounded-lg border border-edge p-4">
              <p className="text-xs text-muted-foreground mb-2">font-mono</p>
              <p className="font-mono text-xl">Source Code Pro</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
