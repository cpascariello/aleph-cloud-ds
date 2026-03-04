"use client";

import { useCallback, useEffect, useState } from "react";
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
      { label: "Badge", href: "/components/badge" },
      { label: "Button", href: "/components/button" },
      { label: "Card", href: "/components/card" },
      { label: "Skeleton", href: "/components/skeleton" },
      { label: "Table", href: "/components/table" },
      { label: "StatusDot", href: "/components/status-dot" },
      { label: "Tooltip", href: "/components/tooltip" },
      {
        group: "Forms",
        items: [
          { label: "Input", href: "/components/input" },
          { label: "Textarea", href: "/components/textarea" },
          { label: "Checkbox", href: "/components/checkbox" },
          { label: "Radio Group", href: "/components/radio-group" },
          { label: "Switch", href: "/components/switch" },
          { label: "Select", href: "/components/select" },
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

function NavLink({
  item,
  pathname,
  onClick,
}: {
  item: NavItem;
  pathname: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={item.href}
      {...(onClick ? { onClick } : {})}
      className={`block rounded-md px-3 py-2 text-sm transition-colors ${
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
  onLinkClick,
}: {
  group: NavGroup;
  pathname: string;
  onLinkClick?: () => void | undefined;
}) {
  const hasActiveChild = group.items.some((i) => pathname === i.href);
  const [open, setOpen] = useState(hasActiveChild);

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
          hasActiveChild
            ? "text-primary-700 dark:text-primary-200 font-medium"
            : LINK_IDLE
        }`}
        style={{ transitionDuration: "var(--duration-fast)" }}
      >
        {group.group}
        <svg
          className={`size-3.5 transition-transform motion-reduce:transition-none ${open ? "rotate-90" : ""}`}
          style={{ transitionDuration: "var(--duration-fast)" }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden="true"
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
              <NavLink
                item={item}
                pathname={pathname}
                {...(onLinkClick ? { onClick: onLinkClick } : {})}
              />
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function NavContent({
  onLinkClick,
}: {
  onLinkClick?: () => void | undefined;
}) {
  const pathname = usePathname();

  return (
    <>
      {NAV.map((entry) => {
        if (isSection(entry)) {
          return (
            <div key={entry.section} className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 px-3">
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
                        {...(onLinkClick ? { onLinkClick } : {})}
                      />
                    );
                  }
                  return (
                    <li key={item.href}>
                      <NavLink
                        item={item}
                        pathname={pathname}
                        {...(onLinkClick ? { onClick: onLinkClick } : {})}
                      />
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
            {...(onLinkClick ? { onClick: onLinkClick } : {})}
            className={`block rounded-md px-3 py-2 text-sm mb-4 transition-colors ${
              pathname === entry.href ? LINK_ACTIVE : LINK_IDLE
            }`}
            style={{ transitionDuration: "var(--duration-fast)" }}
          >
            {entry.label}
          </Link>
        );
      })}
    </>
  );
}

/* ── Desktop sidebar (lg+) ────────────────────── */

function DesktopSidebar() {
  return (
    <nav
      aria-label="Design system"
      className="hidden lg:block w-75 shrink-0 border-r border-edge overflow-y-auto py-6 px-4"
    >
      <NavContent />
    </nav>
  );
}

/* ── Mobile drawer (below lg) ─────────────────── */

function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-40 lg:hidden ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-foreground/30 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDuration: "var(--duration-normal)" }}
        onClick={onClose}
      />
      {/* Drawer panel */}
      <nav
        aria-label="Design system"
        className={`absolute inset-y-0 left-0 w-80 bg-background border-r border-edge
                    overflow-y-auto py-6 px-4 shadow-brand-lg
                    transition-transform motion-reduce:transition-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ transitionDuration: "var(--duration-normal)" }}
      >
        <NavContent onLinkClick={onClose} />
      </nav>
    </div>
  );
}

/* ── Hamburger button (below lg) ──────────────── */

function MenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="lg:hidden flex items-center justify-center size-10 -ml-2 rounded-md
                 text-foreground hover:bg-muted transition-colors"
      style={{ transitionDuration: "var(--duration-fast)" }}
      aria-label="Open navigation menu"
    >
      <svg
        className="size-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  );
}

/* ── Exported shell ────────────────────────────── */

export function SidebarShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <>
      <MobileDrawer open={drawerOpen} onClose={closeDrawer} />
      <div className="flex flex-1 overflow-hidden">
        <DesktopSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Mobile header with menu button — visible below lg */}
          <div className="flex items-center gap-3 px-4 py-2 lg:hidden border-b border-edge">
            <MenuButton onClick={() => setDrawerOpen(true)} />
          </div>
          <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto max-w-4xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
