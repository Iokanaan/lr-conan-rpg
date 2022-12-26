import esbuild from "esbuild";
import { transformFile } from "@swc/core";
import { transformForLR } from "./transpile.conf";
import fs from "fs";

esbuild
  .build({
    entryPoints: ["src/index.ts"],
    target: "es2022",
    bundle: true,
    minify: false,
    platform: "neutral",
    outfile: "build/lre.tmp.js",
    format: "iife",
    define: {
      "console.log": "log",
    },
  })
  .then(() => transformFile("build/lre.tmp.js", transformForLR))
  .then((result) => fs.writeFileSync("build/lre.js", result.code.trim()));