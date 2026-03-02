# Design: `destructive` Color Token Alias

**Date:** 2026-03-02
**Status:** Approved
**Source:** scheduler-dashboard backlog — `var(--color-destructive)` doesn't exist in DS

## Problem

Developers and AI models reach for `destructive` (shadcn/Tailwind convention) but the DS uses `error`. This causes silent CSS failures — `var(--color-destructive-400)` resolves to nothing.

## Decision

Add `destructive` as a pure CSS alias for `error` at the color token layer. DS components keep using `error` in their props — the concepts are different (`error` = state, `destructive` = intent) but the color is the same.

## Implementation

**Layer 1 (`@theme`):** Add `--color-destructive-{50..950}` aliases pointing to `--color-error-{50..950}`. Add `--gradient-destructive` pointing to `--gradient-error`.

No Layer 2 or Layer 3 changes needed — `@theme` declarations automatically generate Tailwind utilities.

**Docs:** Update ARCHITECTURE.md with alias convention, DESIGN-SYSTEM.md with both names, DECISIONS.md with rationale, BACKLOG.md to archive the item.
