"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { label: string; href: string };
type NavGroup = { group: string; items: NavItem[] };
type NavSectionItem = NavItem | NavGroup;
type NavSection = { section: string; items: NavSectionItem[] };
type NavEntry = NavItem | NavSection;

function isSection(entry: NavEntry): entry is NavSection {
  return "section" in entry;
}

function isGroup(item: NavSectionItem): item is NavGroup {
  return "group" in item;
}

const NAV: NavEntry[] = [
  { label: "Overview", href: "/" },
  {
    section: "Foundations",
    items: [
      { label: "Colors", href: "/foundations/colors" },
      { label: "Typography", href: "/foundations/typography" },
      { label: "Spacing", href: "/foundations/spacing" },
      { label: "Effects", href: "/foundations/effects" },
      { label: "Icons", href: "/foundations/icons" },
    ],
  },
  {
    section: "Components",
    items: [
      { label: "Button", href: "/components/button" },
      {
        group: "Forms",
        items: [
          { label: "Input", href: "/components/input" },
          { label: "Textarea", href: "/components/textarea" },
          { label: "FormField", href: "/components/form-field" },
        ],
      },
    ],
  },
];

const LINK_ACTIVE =
  "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200 font-medium";
const LINK_IDLE =
  "text-muted-foreground hover:text-foreground hover:bg-muted";

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  return (
    <Link
      href={item.href}
      className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
        pathname === item.href ? LINK_ACTIVE : LINK_IDLE
      }`}
      style={{ transitionDuration: "var(--duration-fast)" }}
    >
      {item.label}
    </Link>
  );
}

function CollapsibleGroup({
  group,
  pathname,
}: {
  group: NavGroup;
  pathname: string;
}) {
  const hasActiveChild = group.items.some((i) => pathname === i.href);
  const [open, setOpen] = useState(hasActiveChild);

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors ${
          hasActiveChild
            ? "text-primary-700 dark:text-primary-200 font-medium"
            : LINK_IDLE
        }`}
        style={{ transitionDuration: "var(--duration-fast)" }}
      >
        {group.group}
        <svg
          className={`size-3.5 transition-transform ${open ? "rotate-90" : ""}`}
          style={{ transitionDuration: "var(--duration-fast)" }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
      {open && (
        <ul className="mt-0.5 ml-3 space-y-0.5 border-l border-edge pl-2">
          {group.items.map((item) => (
            <li key={item.href}>
              <NavLink item={item} pathname={pathname} />
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-60 shrink-0 border-r border-edge overflow-y-auto py-6 px-4">
      {NAV.map((entry) => {
        if (isSection(entry)) {
          return (
            <div key={entry.section} className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 px-2">
                {entry.section}
              </p>
              <ul className="space-y-0.5">
                {entry.items.map((item) => {
                  if (isGroup(item)) {
                    return (
                      <CollapsibleGroup
                        key={item.group}
                        group={item}
                        pathname={pathname}
                      />
                    );
                  }
                  return (
                    <li key={item.href}>
                      <NavLink item={item} pathname={pathname} />
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        }
        return (
          <Link
            key={entry.href}
            href={entry.href}
            className={`block rounded-md px-2 py-1.5 text-sm mb-4 transition-colors ${
              pathname === entry.href ? LINK_ACTIVE : LINK_IDLE
            }`}
            style={{ transitionDuration: "var(--duration-fast)" }}
          >
            {entry.label}
          </Link>
        );
      })}
    </nav>
  );
}
