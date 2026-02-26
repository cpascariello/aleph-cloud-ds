"use client";

import { useState } from "react";
import { ColorsTab } from "@ac/components/tabs/colors-tab";
import { TypographyTab } from "@ac/components/tabs/typography-tab";

const TABS = ["Colors", "Typography", "Spacing", "Effects", "Icons"] as const;
type Tab = (typeof TABS)[number];

export function PreviewTabs() {
  const [active, setActive] = useState<Tab>("Colors");

  return (
    <div>
      <nav className="flex gap-1 border-b border-border mb-8">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-4 py-2 text-sm font-medium transition-colors
              ${active === tab
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground"
              }`}
            style={{ transitionDuration: "var(--duration-fast)" }}
          >
            {tab}
          </button>
        ))}
      </nav>
      <TabContent tab={active} />
    </div>
  );
}

function TabContent({ tab }: { tab: Tab }) {
  switch (tab) {
    case "Colors":
      return <ColorsTab />;
    case "Typography":
      return <TypographyTab />;
    case "Spacing":
      return <SpacingPlaceholder />;
    case "Effects":
      return <EffectsPlaceholder />;
    case "Icons":
      return <IconsPlaceholder />;
  }
}

function SpacingPlaceholder() {
  return <p className="text-muted-foreground">Spacing tab — next task</p>;
}
function EffectsPlaceholder() {
  return <p className="text-muted-foreground">Effects tab — next task</p>;
}
function IconsPlaceholder() {
  return <p className="text-muted-foreground">Icons tab — next task</p>;
}
