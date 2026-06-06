import { readFileSync } from "node:fs";
import { buildFleetSummary, type FleetInput } from "./index.js";

const inputPath = process.argv[2] ?? "fixtures/fleet-telemetry.json";
const input = JSON.parse(readFileSync(inputPath, "utf8")) as FleetInput;
console.log(JSON.stringify(buildFleetSummary(input), null, 2));
