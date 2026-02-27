# Form Components Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build 4 form components (Checkbox, RadioGroup, Switch, Select) using Radix UI primitives wrapped with CVA and the existing token system.

**Architecture:** Each component wraps a Radix primitive with `forwardRef`, applies CVA variants for sizing, styles Radix `data-[state=*]` attributes with Tailwind classes, and integrates with `<FormField>`. Consumers import from `@aleph-front/ds/<component>` — Radix is an internal dependency.

**Tech Stack:** radix-ui 1.4.3, CVA, Tailwind CSS 4, Vitest + Testing Library

**Design doc:** `docs/plans/2026-02-27-form-components-design.md`

---

### Task 0: Install Radix UI

**Files:**
- Modify: `packages/ds/package.json`

**Step 1: Install radix-ui**

Run:
```bash
cd packages/ds && pnpm add radix-ui@1.4.3
```

**Step 2: Verify install**

Run:
```bash
pnpm ls radix-ui --filter @aleph-front/ds
```

Expected: `radix-ui 1.4.3`

**Step 3: Commit**

```bash
git add packages/ds/package.json pnpm-lock.yaml
git commit -m "chore: add radix-ui 1.4.3 to DS package"
```

---

### Task 1: Checkbox — tests

**Files:**
- Create: `packages/ds/src/components/checkbox/checkbox.test.tsx`

**Step 1: Write the failing tests**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { createRef } from "react";
import { Checkbox } from "@ac/components/checkbox/checkbox";

describe("Checkbox", () => {
  it("renders as unchecked by default", () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  it("renders as checked when defaultChecked", () => {
    render(<Checkbox defaultChecked />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("toggles on click", async () => {
    const user = userEvent.setup();
    render(<Checkbox />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it("calls onCheckedChange when toggled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox onCheckedChange={onChange} />);
    await user.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox disabled onCheckedChange={onChange} />);
    await user.click(screen.getByRole("checkbox"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("sets aria-invalid when error is true", () => {
    render(<Checkbox error />);
    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Checkbox ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("merges custom className", () => {
    render(<Checkbox className="custom-class" />);
    expect(screen.getByRole("checkbox")).toHaveClass("custom-class");
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `cd packages/ds && pnpm vitest run src/components/checkbox/checkbox.test.tsx`
Expected: FAIL — module not found

**Step 3: Commit**

```bash
git add packages/ds/src/components/checkbox/checkbox.test.tsx
git commit -m "test: add Checkbox component tests"
```

---

### Task 2: Checkbox — implementation

**Files:**
- Create: `packages/ds/src/components/checkbox/checkbox.tsx`
- Modify: `packages/ds/package.json` (add export)

**Step 1: Write the component**

```tsx
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";

const checkboxVariants = cva(
  [
    "peer shrink-0 bg-card",
    "border-2 border-edge rounded-md",
    "hover:border-edge-hover",
    "focus-visible:outline-none focus-visible:ring-3",
    "focus-visible:ring-primary-500",
    "disabled:opacity-50 disabled:pointer-events-none",
    "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
    "data-[state=checked]:text-primary-foreground",
    "transition-colors",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "size-4",
        md: "size-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type CheckboxProps = Omit<
  ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
  "size"
> &
  VariantProps<typeof checkboxVariants> & {
    error?: boolean;
  };

const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ size, error = false, className, ...rest }, ref) => {
    return (
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          checkboxVariants({ size }),
          error && "border-3 border-error-400 hover:border-error-500",
          className,
        )}
        aria-invalid={error || undefined}
        {...rest}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-3/4"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
  },
);

Checkbox.displayName = "Checkbox";

export { Checkbox, checkboxVariants, type CheckboxProps };
```

**Step 2: Add subpath export to package.json**

Add to `"exports"` in `packages/ds/package.json`:
```json
"./checkbox": "./src/components/checkbox/checkbox.tsx"
```

**Step 3: Run tests to verify they pass**

Run: `cd packages/ds && pnpm vitest run src/components/checkbox/checkbox.test.tsx`
Expected: all 8 tests PASS

**Step 4: Run typecheck**

Run: `cd packages/ds && pnpm typecheck`
Expected: no errors

**Step 5: Commit**

```bash
git add packages/ds/src/components/checkbox/ packages/ds/package.json
git commit -m "feat: add Checkbox component"
```

---

### Task 3: RadioGroup — tests

**Files:**
- Create: `packages/ds/src/components/radio-group/radio-group.test.tsx`

**Step 1: Write the failing tests**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { createRef } from "react";
import {
  RadioGroup,
  RadioGroupItem,
} from "@ac/components/radio-group/radio-group";

describe("RadioGroup", () => {
  const renderGroup = (props = {}) =>
    render(
      <RadioGroup {...props}>
        <RadioGroupItem value="a" />
        <RadioGroupItem value="b" />
        <RadioGroupItem value="c" />
      </RadioGroup>,
    );

  it("renders all radio items", () => {
    renderGroup();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("selects defaultValue on mount", () => {
    renderGroup({ defaultValue: "b" });
    const radios = screen.getAllByRole("radio");
    expect(radios[1]).toBeChecked();
  });

  it("selects item on click", async () => {
    const user = userEvent.setup();
    renderGroup();
    const radios = screen.getAllByRole("radio");
    await user.click(radios[0]);
    expect(radios[0]).toBeChecked();
  });

  it("only one item selected at a time", async () => {
    const user = userEvent.setup();
    renderGroup({ defaultValue: "a" });
    const radios = screen.getAllByRole("radio");
    await user.click(radios[1]);
    expect(radios[0]).not.toBeChecked();
    expect(radios[1]).toBeChecked();
  });

  it("calls onValueChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderGroup({ onValueChange: onChange });
    await user.click(screen.getAllByRole("radio")[1]);
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("disables all items when group is disabled", () => {
    renderGroup({ disabled: true });
    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).toBeDisabled();
    }
  });

  it("disables a single item", () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="a" />
        <RadioGroupItem value="b" disabled />
      </RadioGroup>,
    );
    const radios = screen.getAllByRole("radio");
    expect(radios[0]).not.toBeDisabled();
    expect(radios[1]).toBeDisabled();
  });

  it("forwards ref on RadioGroup", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <RadioGroup ref={ref}>
        <RadioGroupItem value="a" />
      </RadioGroup>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `cd packages/ds && pnpm vitest run src/components/radio-group/radio-group.test.tsx`
Expected: FAIL — module not found

**Step 3: Commit**

```bash
git add packages/ds/src/components/radio-group/radio-group.test.tsx
git commit -m "test: add RadioGroup component tests"
```

---

### Task 4: RadioGroup — implementation

**Files:**
- Create: `packages/ds/src/components/radio-group/radio-group.tsx`
- Modify: `packages/ds/package.json` (add export)

**Step 1: Write the component**

```tsx
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";

const radioItemVariants = cva(
  [
    "peer shrink-0 rounded-full bg-card",
    "border-2 border-edge",
    "hover:border-edge-hover",
    "focus-visible:outline-none focus-visible:ring-3",
    "focus-visible:ring-primary-500",
    "disabled:opacity-50 disabled:pointer-events-none",
    "data-[state=checked]:border-primary",
    "transition-colors",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "size-4",
        md: "size-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type RadioGroupProps = ComponentPropsWithoutRef<
  typeof RadioGroupPrimitive.Root
> & {
  size?: "sm" | "md";
};

const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, ...rest }, ref) => {
    return (
      <RadioGroupPrimitive.Root
        ref={ref}
        className={cn("flex flex-col gap-2", className)}
        {...rest}
      />
    );
  },
);
RadioGroup.displayName = "RadioGroup";

type RadioGroupItemProps = Omit<
  ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
  "size"
> &
  VariantProps<typeof radioItemVariants>;

const RadioGroupItem = forwardRef<HTMLButtonElement, RadioGroupItemProps>(
  ({ size, className, ...rest }, ref) => {
    return (
      <RadioGroupPrimitive.Item
        ref={ref}
        className={cn(radioItemVariants({ size }), className)}
        {...rest}
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <span className="block size-1/2 rounded-full bg-primary" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
    );
  },
);
RadioGroupItem.displayName = "RadioGroupItem";

export {
  RadioGroup,
  RadioGroupItem,
  radioItemVariants,
  type RadioGroupProps,
  type RadioGroupItemProps,
};
```

**Step 2: Add subpath export to package.json**

Add to `"exports"` in `packages/ds/package.json`:
```json
"./radio-group": "./src/components/radio-group/radio-group.tsx"
```

**Step 3: Run tests to verify they pass**

Run: `cd packages/ds && pnpm vitest run src/components/radio-group/radio-group.test.tsx`
Expected: all 8 tests PASS

**Step 4: Run typecheck**

Run: `cd packages/ds && pnpm typecheck`
Expected: no errors

**Step 5: Commit**

```bash
git add packages/ds/src/components/radio-group/ packages/ds/package.json
git commit -m "feat: add RadioGroup component"
```

---

### Task 5: Switch — tests

**Files:**
- Create: `packages/ds/src/components/switch/switch.test.tsx`

**Step 1: Write the failing tests**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { createRef } from "react";
import { Switch } from "@ac/components/switch/switch";

describe("Switch", () => {
  it("renders with switch role", () => {
    render(<Switch />);
    expect(screen.getByRole("switch")).toBeDefined();
  });

  it("is unchecked by default", () => {
    render(<Switch />);
    expect(screen.getByRole("switch")).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("respects defaultChecked", () => {
    render(<Switch defaultChecked />);
    expect(screen.getByRole("switch")).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("toggles on click", async () => {
    const user = userEvent.setup();
    render(<Switch />);
    const sw = screen.getByRole("switch");
    expect(sw).toHaveAttribute("aria-checked", "false");
    await user.click(sw);
    expect(sw).toHaveAttribute("aria-checked", "true");
  });

  it("calls onCheckedChange when toggled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch onCheckedChange={onChange} />);
    await user.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch disabled onCheckedChange={onChange} />);
    await user.click(screen.getByRole("switch"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Switch ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("merges custom className", () => {
    render(<Switch className="custom-class" />);
    expect(screen.getByRole("switch")).toHaveClass("custom-class");
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `cd packages/ds && pnpm vitest run src/components/switch/switch.test.tsx`
Expected: FAIL — module not found

**Step 3: Commit**

```bash
git add packages/ds/src/components/switch/switch.test.tsx
git commit -m "test: add Switch component tests"
```

---

### Task 6: Switch — implementation

**Files:**
- Create: `packages/ds/src/components/switch/switch.tsx`
- Modify: `packages/ds/package.json` (add export)

**Step 1: Write the component**

```tsx
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Switch as SwitchPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";

const switchVariants = cva(
  [
    "peer inline-flex shrink-0 cursor-pointer",
    "items-center rounded-full",
    "border-2 border-edge bg-muted",
    "hover:border-edge-hover",
    "focus-visible:outline-none focus-visible:ring-3",
    "focus-visible:ring-primary-500",
    "disabled:opacity-50 disabled:pointer-events-none",
    "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
    "transition-colors",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-[18px] w-8",
        md: "h-[22px] w-10",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const thumbVariants = cva(
  [
    "pointer-events-none block rounded-full bg-white",
    "shadow-sm transition-transform",
    "data-[state=unchecked]:translate-x-0.5",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "size-3 data-[state=checked]:translate-x-3.5",
        md: "size-4 data-[state=checked]:translate-x-[18px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type SwitchProps = Omit<
  ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
  "size"
> &
  VariantProps<typeof switchVariants>;

const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ size, className, ...rest }, ref) => {
    return (
      <SwitchPrimitive.Root
        ref={ref}
        className={cn(switchVariants({ size }), className)}
        {...rest}
      >
        <SwitchPrimitive.Thumb className={thumbVariants({ size })} />
      </SwitchPrimitive.Root>
    );
  },
);

Switch.displayName = "Switch";

export { Switch, switchVariants, type SwitchProps };
```

**Step 2: Add subpath export to package.json**

Add to `"exports"` in `packages/ds/package.json`:
```json
"./switch": "./src/components/switch/switch.tsx"
```

**Step 3: Run tests to verify they pass**

Run: `cd packages/ds && pnpm vitest run src/components/switch/switch.test.tsx`
Expected: all 8 tests PASS

**Step 4: Run typecheck**

Run: `cd packages/ds && pnpm typecheck`
Expected: no errors

**Step 5: Commit**

```bash
git add packages/ds/src/components/switch/ packages/ds/package.json
git commit -m "feat: add Switch component"
```

---

### Task 7: Select — tests

**Files:**
- Create: `packages/ds/src/components/select/select.test.tsx`

**Step 1: Write the failing tests**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { createRef } from "react";
import { Select } from "@ac/components/select/select";

const OPTIONS = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
  { value: "c", label: "Option C", disabled: true },
];

describe("Select", () => {
  it("renders a trigger with combobox role", () => {
    render(<Select options={OPTIONS} />);
    expect(screen.getByRole("combobox")).toBeDefined();
  });

  it("shows placeholder when no value", () => {
    render(<Select options={OPTIONS} placeholder="Choose..." />);
    expect(screen.getByText("Choose...")).toBeDefined();
  });

  it("opens dropdown on trigger click", async () => {
    const user = userEvent.setup();
    render(<Select options={OPTIONS} />);
    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeDefined();
  });

  it("shows all options when open", async () => {
    const user = userEvent.setup();
    render(<Select options={OPTIONS} />);
    await user.click(screen.getByRole("combobox"));
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("calls onValueChange when item selected", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select options={OPTIONS} onValueChange={onChange} />);
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("Option A"));
    expect(onChange).toHaveBeenCalledWith("a");
  });

  it("sets aria-invalid when error is true", () => {
    render(<Select options={OPTIONS} error />);
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("forwards ref to trigger", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Select ref={ref} options={OPTIONS} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `cd packages/ds && pnpm vitest run src/components/select/select.test.tsx`
Expected: FAIL — module not found

**Step 3: Commit**

```bash
git add packages/ds/src/components/select/select.test.tsx
git commit -m "test: add Select component tests"
```

---

### Task 8: Select — implementation

**Files:**
- Create: `packages/ds/src/components/select/select.tsx`
- Modify: `packages/ds/package.json` (add export)

**Step 1: Write the component**

```tsx
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Select as SelectPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";

const triggerVariants = cva(
  [
    "inline-flex items-center justify-between",
    "w-full font-sans text-foreground bg-card",
    "border-2 border-edge rounded-full",
    "hover:border-edge-hover",
    "focus-visible:outline-none focus-visible:ring-3",
    "focus-visible:ring-primary-500",
    "disabled:opacity-50 disabled:pointer-events-none",
    "ring-0 transition-[color,border-color,box-shadow]",
    "data-[placeholder]:text-muted-foreground",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "py-1.5 px-4 text-sm",
        md: "py-2 px-5 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SelectProps = Omit<
  ComponentPropsWithoutRef<typeof SelectPrimitive.Root>,
  "children"
> &
  VariantProps<typeof triggerVariants> & {
    options: SelectOption[];
    placeholder?: string;
    error?: boolean;
    className?: string;
    id?: string;
    "aria-describedby"?: string;
  };

const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      options,
      placeholder,
      size,
      error = false,
      className,
      id,
      "aria-describedby": ariaDescribedBy,
      ...rest
    },
    ref,
  ) => {
    return (
      <SelectPrimitive.Root {...rest}>
        <SelectPrimitive.Trigger
          ref={ref}
          id={id}
          aria-describedby={ariaDescribedBy}
          aria-invalid={error || undefined}
          className={cn(
            triggerVariants({ size }),
            error && "border-3 border-error-400 hover:border-error-500",
            className,
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon className="ml-2 shrink-0 text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className={cn(
              "z-50 overflow-hidden rounded-2xl",
              "bg-card border border-edge shadow-brand",
              "data-[state=open]:animate-in data-[state=open]:fade-in-0",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
            )}
            position="popper"
            sideOffset={4}
          >
            <SelectPrimitive.Viewport className="p-1">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={cn(
                    "relative flex items-center rounded-xl px-4 py-2",
                    "text-sm text-foreground cursor-pointer select-none",
                    "outline-none",
                    "data-[highlighted]:bg-muted",
                    "data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
                  )}
                >
                  <SelectPrimitive.ItemText>
                    {option.label}
                  </SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="ml-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-4"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    );
  },
);

Select.displayName = "Select";

export { Select, triggerVariants, type SelectProps, type SelectOption };
```

**Step 2: Add subpath export to package.json**

Add to `"exports"` in `packages/ds/package.json`:
```json
"./select": "./src/components/select/select.tsx"
```

**Step 3: Run tests to verify they pass**

Run: `cd packages/ds && pnpm vitest run src/components/select/select.test.tsx`
Expected: all 7 tests PASS

**Step 4: Run typecheck**

Run: `cd packages/ds && pnpm typecheck`
Expected: no errors

**Step 5: Commit**

```bash
git add packages/ds/src/components/select/ packages/ds/package.json
git commit -m "feat: add Select component"
```

---

### Task 9: Install @testing-library/user-event

Tests in Tasks 1, 3, 5, 7 use `userEvent.setup()` for click simulation. Check if `@testing-library/user-event` is already installed. If not:

Run:
```bash
cd packages/ds && pnpm add -D @testing-library/user-event
```

**Note:** This task should be done before running any tests. If already installed, skip.

---

### Task 10: Preview pages — Checkbox

**Files:**
- Create: `apps/preview/src/app/components/checkbox/page.tsx`

**Step 1: Write the preview page**

```tsx
"use client";

import { useState } from "react";
import { Checkbox } from "@aleph-front/ds/checkbox";
import { FormField } from "@aleph-front/ds/form-field";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

export default function CheckboxPage() {
  const [checked, setChecked] = useState(false);

  return (
    <>
      <PageHeader
        title="Checkbox"
        description="A control that allows the user to toggle between checked and unchecked."
      />

      <div className="space-y-12">
        <DemoSection title="Default">
          <div className="flex items-center gap-6">
            <Checkbox />
            <Checkbox defaultChecked />
          </div>
        </DemoSection>

        <DemoSection title="Sizes">
          <div className="flex items-center gap-6">
            <Checkbox size="sm" defaultChecked />
            <Checkbox size="md" defaultChecked />
          </div>
        </DemoSection>

        <DemoSection title="States">
          <div className="flex items-center gap-6">
            <Checkbox disabled />
            <Checkbox disabled defaultChecked />
            <Checkbox error />
            <Checkbox error defaultChecked />
          </div>
        </DemoSection>

        <DemoSection title="Controlled">
          <div className="flex items-center gap-4">
            <Checkbox
              checked={checked}
              onCheckedChange={(v) => setChecked(v === true)}
            />
            <span className="text-sm text-muted-foreground">
              {checked ? "Checked" : "Unchecked"}
            </span>
          </div>
        </DemoSection>

        <DemoSection title="With FormField">
          <div className="max-w-sm space-y-4">
            <FormField label="Accept terms" required>
              <Checkbox />
            </FormField>
            <FormField
              label="Subscribe to newsletter"
              helperText="We send updates monthly"
            >
              <Checkbox />
            </FormField>
            <FormField label="Agree to privacy policy" error="Required">
              <Checkbox error />
            </FormField>
          </div>
        </DemoSection>
      </div>
    </>
  );
}
```

**Step 2: Verify dev server renders**

Run: `pnpm dev` and navigate to `/components/checkbox`

**Step 3: Commit**

```bash
git add apps/preview/src/app/components/checkbox/
git commit -m "feat: add Checkbox preview page"
```

---

### Task 11: Preview pages — RadioGroup

**Files:**
- Create: `apps/preview/src/app/components/radio-group/page.tsx`

**Step 1: Write the preview page**

```tsx
"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@aleph-front/ds/radio-group";
import { FormField } from "@aleph-front/ds/form-field";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

export default function RadioGroupPage() {
  const [value, setValue] = useState("a");

  return (
    <>
      <PageHeader
        title="Radio Group"
        description="A set of mutually exclusive options where only one can be selected."
      />

      <div className="space-y-12">
        <DemoSection title="Default">
          <RadioGroup defaultValue="a">
            <RadioGroupItem value="a" />
            <RadioGroupItem value="b" />
            <RadioGroupItem value="c" />
          </RadioGroup>
        </DemoSection>

        <DemoSection title="Sizes">
          <div className="flex gap-12">
            <RadioGroup defaultValue="a">
              <RadioGroupItem value="a" size="sm" />
              <RadioGroupItem value="b" size="sm" />
            </RadioGroup>
            <RadioGroup defaultValue="a">
              <RadioGroupItem value="a" size="md" />
              <RadioGroupItem value="b" size="md" />
            </RadioGroup>
          </div>
        </DemoSection>

        <DemoSection title="States">
          <div className="flex gap-12">
            <RadioGroup defaultValue="a" disabled>
              <RadioGroupItem value="a" />
              <RadioGroupItem value="b" />
            </RadioGroup>
            <RadioGroup defaultValue="a">
              <RadioGroupItem value="a" />
              <RadioGroupItem value="b" disabled />
            </RadioGroup>
          </div>
        </DemoSection>

        <DemoSection title="Controlled">
          <div className="flex items-start gap-6">
            <RadioGroup value={value} onValueChange={setValue}>
              <RadioGroupItem value="a" />
              <RadioGroupItem value="b" />
              <RadioGroupItem value="c" />
            </RadioGroup>
            <span className="text-sm text-muted-foreground">
              Selected: {value}
            </span>
          </div>
        </DemoSection>

        <DemoSection title="With FormField">
          <div className="max-w-sm">
            <FormField label="Plan" required>
              <RadioGroup defaultValue="starter">
                <RadioGroupItem value="starter" />
                <RadioGroupItem value="pro" />
                <RadioGroupItem value="enterprise" />
              </RadioGroup>
            </FormField>
          </div>
        </DemoSection>
      </div>
    </>
  );
}
```

**Step 2: Verify dev server renders**

Navigate to `/components/radio-group`

**Step 3: Commit**

```bash
git add apps/preview/src/app/components/radio-group/
git commit -m "feat: add RadioGroup preview page"
```

---

### Task 12: Preview pages — Switch

**Files:**
- Create: `apps/preview/src/app/components/switch/page.tsx`

**Step 1: Write the preview page**

```tsx
"use client";

import { useState } from "react";
import { Switch } from "@aleph-front/ds/switch";
import { FormField } from "@aleph-front/ds/form-field";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

export default function SwitchPage() {
  const [checked, setChecked] = useState(false);

  return (
    <>
      <PageHeader
        title="Switch"
        description="A toggle control for switching between on and off states."
      />

      <div className="space-y-12">
        <DemoSection title="Default">
          <div className="flex items-center gap-6">
            <Switch />
            <Switch defaultChecked />
          </div>
        </DemoSection>

        <DemoSection title="Sizes">
          <div className="flex items-center gap-6">
            <Switch size="sm" defaultChecked />
            <Switch size="md" defaultChecked />
          </div>
        </DemoSection>

        <DemoSection title="Disabled">
          <div className="flex items-center gap-6">
            <Switch disabled />
            <Switch disabled defaultChecked />
          </div>
        </DemoSection>

        <DemoSection title="Controlled">
          <div className="flex items-center gap-4">
            <Switch
              checked={checked}
              onCheckedChange={setChecked}
            />
            <span className="text-sm text-muted-foreground">
              {checked ? "On" : "Off"}
            </span>
          </div>
        </DemoSection>

        <DemoSection title="With FormField">
          <div className="max-w-sm space-y-4">
            <FormField label="Email notifications">
              <Switch />
            </FormField>
            <FormField
              label="Marketing emails"
              helperText="Receive promotional content"
            >
              <Switch />
            </FormField>
          </div>
        </DemoSection>
      </div>
    </>
  );
}
```

**Step 2: Verify dev server renders**

Navigate to `/components/switch`

**Step 3: Commit**

```bash
git add apps/preview/src/app/components/switch/
git commit -m "feat: add Switch preview page"
```

---

### Task 13: Preview pages — Select

**Files:**
- Create: `apps/preview/src/app/components/select/page.tsx`

**Step 1: Write the preview page**

```tsx
"use client";

import { useState } from "react";
import { Select } from "@aleph-front/ds/select";
import { FormField } from "@aleph-front/ds/form-field";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

const REGIONS = [
  { value: "us-east", label: "US East" },
  { value: "us-west", label: "US West" },
  { value: "eu-west", label: "EU West" },
  { value: "ap-south", label: "Asia Pacific" },
  { value: "deprecated", label: "Legacy (deprecated)", disabled: true },
];

const PLANS = [
  { value: "starter", label: "Starter" },
  { value: "pro", label: "Pro" },
  { value: "enterprise", label: "Enterprise" },
];

export default function SelectPage() {
  const [value, setValue] = useState<string>();

  return (
    <>
      <PageHeader
        title="Select"
        description="A dropdown control for choosing from a list of options."
      />

      <div className="space-y-12">
        <DemoSection title="Default">
          <div className="max-w-xs">
            <Select options={REGIONS} placeholder="Select region..." />
          </div>
        </DemoSection>

        <DemoSection title="Sizes">
          <div className="max-w-xs space-y-4">
            <Select options={PLANS} placeholder="Small" size="sm" />
            <Select options={PLANS} placeholder="Medium" size="md" />
          </div>
        </DemoSection>

        <DemoSection title="States">
          <div className="max-w-xs space-y-4">
            <Select options={PLANS} disabled placeholder="Disabled" />
            <Select options={PLANS} error placeholder="Error" />
          </div>
        </DemoSection>

        <DemoSection title="Controlled">
          <div className="max-w-xs space-y-2">
            <Select
              options={REGIONS}
              value={value}
              onValueChange={setValue}
              placeholder="Select..."
            />
            <p className="text-sm text-muted-foreground">
              Selected: {value ?? "(none)"}
            </p>
          </div>
        </DemoSection>

        <DemoSection title="With FormField">
          <div className="max-w-sm space-y-4">
            <FormField label="Region" required>
              <Select options={REGIONS} placeholder="Select region..." />
            </FormField>
            <FormField label="Plan" helperText="You can change this later">
              <Select options={PLANS} placeholder="Select plan..." />
            </FormField>
            <FormField label="Region" required error="Region is required">
              <Select
                options={REGIONS}
                error
                placeholder="Select region..."
              />
            </FormField>
          </div>
        </DemoSection>
      </div>
    </>
  );
}
```

**Step 2: Verify dev server renders**

Navigate to `/components/select`

**Step 3: Commit**

```bash
git add apps/preview/src/app/components/select/
git commit -m "feat: add Select preview page"
```

---

### Task 14: Add sidebar entries

**Files:**
- Modify: `apps/preview/src/components/sidebar.tsx`

**Step 1: Add new entries to the sidebar navigation**

Find the Components group in the sidebar and add entries for the 4 new components. Group them under a "Forms" subheading alongside the existing Input, Textarea, FormField entries:

- `/components/checkbox` — Checkbox
- `/components/radio-group` — Radio Group
- `/components/switch` — Switch
- `/components/select` — Select

**Step 2: Verify sidebar renders correctly**

Run dev server, check all 4 links appear and navigate correctly.

**Step 3: Commit**

```bash
git add apps/preview/src/components/sidebar.tsx
git commit -m "feat: add form component sidebar entries"
```

---

### Task 15: Full verification

**Step 1: Run all tests**

Run: `pnpm test`
Expected: all tests pass (existing + 4 new suites)

**Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: no errors in either workspace

**Step 3: Run lint**

Run: `pnpm lint`
Expected: no warnings

**Step 4: Run build**

Run: `pnpm build`
Expected: static export succeeds

---

### Task 16: Update docs

- [ ] DESIGN-SYSTEM.md — add Checkbox, RadioGroup, Switch, Select component docs
- [ ] ARCHITECTURE.md — add Radix wrapper pattern, update "Adding a New Component" recipe to mention Radix
- [ ] DECISIONS.md — log decision: chose Radix UI for headless primitives, rationale: multi-skin DS, battle-tested accessibility, `asChild` pattern match, unified package
- [ ] BACKLOG.md — move "Form components" to Completed (note: Checkbox, Radio, Switch, Select done; Combobox, Slider, File Upload, Number Stepper remain)
- [ ] CLAUDE.md — update Current Features list: add Radix-based form components
