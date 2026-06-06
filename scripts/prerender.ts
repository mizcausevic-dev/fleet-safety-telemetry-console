import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { renderPage } from "../src/app.js";
import type { FleetInput } from "../src/index.js";

const input = JSON.parse(readFileSync("fixtures/fleet-telemetry.json", "utf8")) as FleetInput;
mkdirSync("site", { recursive: true });
writeFileSync("site/index.html", renderPage(input));
writeFileSync("site/robots.txt", "User-agent: *\nAllow: /\n");
