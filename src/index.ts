export interface FleetAsset {
  unitId: string;
  mission: string;
  sensorDriftPct: number;
  manualOverrides: number;
  nearMissEvents: number;
  telemetryGapMinutes: number;
  batteryThermalEvents: number;
  softwareVersion: string;
  owner: string;
  nextAction: string;
}

export interface FleetInput {
  asOf: string;
  fleet: string;
  assets: FleetAsset[];
}

export interface FleetFinding extends FleetAsset {
  safetyRiskScore: number;
  readiness: "ready" | "watch" | "blocked";
  boardNarrative: string;
}

export interface FleetSummary {
  asOf: string;
  fleet: string;
  aggregateSafetyRisk: number;
  blockedAssets: number;
  primaryRecommendation: string;
  findings: FleetFinding[];
}

const clamp = (value: number): number => Math.max(0, Math.min(100, value));
const round = (value: number): number => Math.round(value * 100) / 100;

export function scoreAsset(asset: FleetAsset): FleetFinding {
  const safetyRiskScore = round(
    clamp(
      asset.sensorDriftPct * 5 +
        asset.manualOverrides * 4 +
        asset.nearMissEvents * 14 +
        asset.telemetryGapMinutes * 1.2 +
        asset.batteryThermalEvents * 12
    )
  );
  const readiness = safetyRiskScore >= 70 ? "blocked" : safetyRiskScore >= 38 ? "watch" : "ready";
  const boardNarrative =
    readiness === "blocked"
      ? `${asset.unitId} should not operate autonomously until telemetry and safety exceptions close.`
      : readiness === "watch"
        ? `${asset.unitId} can remain in constrained operation with owner-visible remediation.`
        : `${asset.unitId} is ready for monitored operation.`;

  return { ...asset, safetyRiskScore, readiness, boardNarrative };
}

export function buildFleetSummary(input: FleetInput): FleetSummary {
  if (!input.assets.length) {
    throw new Error("At least one fleet asset is required.");
  }
  const findings = input.assets.map(scoreAsset).sort((a, b) => b.safetyRiskScore - a.safetyRiskScore);
  const aggregateSafetyRisk = round(findings.reduce((sum, asset) => sum + asset.safetyRiskScore, 0) / findings.length);
  const blockedAssets = findings.filter((asset) => asset.readiness === "blocked").length;
  const top = findings[0];
  return {
    asOf: input.asOf,
    fleet: input.fleet,
    aggregateSafetyRisk,
    blockedAssets,
    primaryRecommendation: `${top.unitId}: ${top.nextAction}`,
    findings
  };
}
