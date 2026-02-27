import type { NextConfig } from "next";

const config: NextConfig = {
  output: "export",
  transpilePackages: ["@aleph-front/ds"],
  turbopack: {
    root: "../..",
  },
};

export default config;
