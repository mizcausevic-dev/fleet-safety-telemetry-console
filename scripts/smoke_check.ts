import { readFileSync } from "node:fs";

const html = readFileSync("site/index.html", "utf8");
for (const marker of ["Fleet Safety Telemetry Console", "Fleet safety telemetry becomes", "YARD-17", "FORK-22"]) {
  if (!html.includes(marker)) {
    throw new Error(`Missing smoke marker: ${marker}`);
  }
}
console.log("smoke ok");
