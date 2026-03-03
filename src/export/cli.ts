#!/usr/bin/env node
// ---------------------------------------------------------------------------
// CLI entry point for slidemotion PDF export
//
// Usage:
//   bun src/export/cli.ts [options]
//
// Options:
//   --url <url>       Dev server URL (default: http://localhost:5173)
//   --output <path>   Output PDF path (default: slides.pdf)
//   --width <px>      Viewport width (default: 1920)
//   --height <px>     Viewport height (default: 1080)
//   --timeout <ms>    Per-slide idle timeout (default: 10000)
//   --settle <ms>     Settle delay after idle (default: 100)
// ---------------------------------------------------------------------------

import { exportToPDF } from "./pdf.js";
import type { ExportOptions } from "./types.js";

function parseArgs(args: ReadonlyArray<string>): ExportOptions {
  let url = "http://localhost:5173";
  let output = "slides.pdf";
  let width: number | undefined;
  let height: number | undefined;
  let timeout: number | undefined;
  let settleDelay: number | undefined;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];

    switch (arg) {
      case "--url":
        if (next === undefined) throw new Error("--url requires a value");
        url = next;
        i++;
        break;
      case "--output":
        if (next === undefined) throw new Error("--output requires a value");
        output = next;
        i++;
        break;
      case "--width":
        if (next === undefined) throw new Error("--width requires a value");
        width = Number(next);
        i++;
        break;
      case "--height":
        if (next === undefined) throw new Error("--height requires a value");
        height = Number(next);
        i++;
        break;
      case "--timeout":
        if (next === undefined) throw new Error("--timeout requires a value");
        timeout = Number(next);
        i++;
        break;
      case "--settle":
        if (next === undefined) throw new Error("--settle requires a value");
        settleDelay = Number(next);
        i++;
        break;
      case "--help":
      case "-h":
        printUsage();
        process.exit(0);
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  const result: ExportOptions = {
    url,
    output,
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
    ...(timeout !== undefined ? { timeout } : {}),
    ...(settleDelay !== undefined ? { settleDelay } : {}),
  };

  return result;
}

function printUsage(): void {
  console.log(`
slidemotion PDF export

Usage:
  bun src/export/cli.ts [options]

Options:
  --url <url>       Dev server URL (default: http://localhost:5173)
  --output <path>   Output PDF path (default: slides.pdf)
  --width <px>      Viewport width (default: 1920)
  --height <px>     Viewport height (default: 1080)
  --timeout <ms>    Per-slide idle timeout (default: 10000)
  --settle <ms>     Settle delay after idle (default: 100)
  --help, -h        Show this help
`.trim());
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  console.log(`Exporting PDF from ${options.url} → ${options.output}`);
  await exportToPDF(options);
}

main().catch((err: unknown) => {
  console.error("Export failed:", err);
  process.exit(1);
});
