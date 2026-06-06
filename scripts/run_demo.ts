import { readFileSync } from "node:fs";
import { buildFleetSummary, type FleetInput } from "../src/index.js";

const input = JSON.parse(readFileSync("fixtures/fleet-telemetry.json", "utf8")) as FleetInput;
const summary = buildFleetSummary(input);
console.log(`fleet=${summary.fleet}`);
console.log(`risk=${summary.aggregateSafetyRisk}`);
console.log(`blocked=${summary.blockedAssets}`);
console.log(`recommendation=${summary.primaryRecommendation}`);
