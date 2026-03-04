import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    "components/button/button": "src/components/button/button.tsx",
    "components/checkbox/checkbox":
      "src/components/checkbox/checkbox.tsx",
    "components/input/input": "src/components/input/input.tsx",
    "components/textarea/textarea":
      "src/components/textarea/textarea.tsx",
    "components/select/select": "src/components/select/select.tsx",
    "components/switch/switch": "src/components/switch/switch.tsx",
    "components/form-field/form-field":
      "src/components/form-field/form-field.tsx",
    "components/badge/badge": "src/components/badge/badge.tsx",
    "components/card/card": "src/components/card/card.tsx",
    "components/status-dot/status-dot":
      "src/components/status-dot/status-dot.tsx",
    "components/table/table": "src/components/table/table.tsx",
    "components/tooltip/tooltip":
      "src/components/tooltip/tooltip.tsx",
    "components/radio-group/radio-group":
      "src/components/radio-group/radio-group.tsx",
    "components/ui/skeleton": "src/components/ui/skeleton.tsx",
    "components/ui/spinner": "src/components/ui/spinner.tsx",
    "lib/cn": "src/lib/cn.ts",
  },
  format: ["esm"],
  dts: true,
  splitting: true,
  outDir: "dist",
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "class-variance-authority",
    "clsx",
    "radix-ui",
    "tailwind-merge",
  ],
  esbuildOptions(options) {
    options.alias = { "@ac": "./src" };
  },
});
