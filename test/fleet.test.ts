import { describe, expect, it } from "vitest";
import fixture from "../fixtures/fleet-telemetry.json" with { type: "json" };
import { buildFleetSummary, scoreAsset, type FleetInput } from "../src/index.js";

describe("fleet safety telemetry", () => {
  it("prioritizes blocked fleet assets", () => {
    const summary = buildFleetSummary(fixture as FleetInput);
    expect(summary.findings[0].unitId).toBe("YARD-17");
    expect(summary.blockedAssets).toBe(2);
  });

  it("increases risk with near misses and telemetry gaps", () => {
    const base = (fixture as FleetInput).assets[1];
    const clean = scoreAsset(base);
    const degraded = scoreAsset({ ...base, nearMissEvents: 4, telemetryGapMinutes: 40 });
    expect(degraded.safetyRiskScore).toBeGreaterThan(clean.safetyRiskScore);
    expect(degraded.readiness).toBe("blocked");
  });
});
