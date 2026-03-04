# Changelog

All notable changes to `@aleph-front-bkp/ds` will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Verified end-to-end publish pipeline

### Added

- Button component with 6 variants (primary, secondary, outline, text, destructive, warning), 4 sizes, loading state, icon slots, asChild polymorphism
- Input component with 2 sizes, shadow-brand style, error/disabled states
- Textarea component with shadow-brand style, vertical resize, error/disabled states
- Checkbox component (Radix UI) with 3 sizes, clip-path animation, error/disabled states
- RadioGroup component (Radix UI) with 3 sizes, clip-path animation, group/item disabled
- Switch component (Radix UI) with 3 sizes, animated sliding thumb, disabled state
- Select component (Radix UI) with flat options prop, 2 sizes, shadow-brand style, portal dropdown
- FormField wrapper with label, required asterisk, helper text, error message, auto-wired accessibility
- Badge component with 5 semantic variants, 2 sizes
- StatusDot component with 5 health variants, pulse animation, 2 sizes
- Card component with 3 variants (default/noise/ghost), 3 padding sizes, optional title
- Table component with generic typing, sortable columns, keyboard-accessible sorting, row highlight
- Tooltip component (Radix UI) with composable API, dark mode contrast fix
- Skeleton loading placeholder with consumer-driven sizing
- Spinner component for loading states
- cn() utility (clsx + tailwind-merge)
- Three-layer OKLCH token system with light/dark themes
- `destructive` color alias for shadcn/Tailwind compatibility
