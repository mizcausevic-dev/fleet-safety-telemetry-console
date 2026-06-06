import argparse
import json
from pathlib import Path


def _score(asset: dict) -> dict:
    risk = round(
        min(
            100,
            asset["sensorDriftPct"] * 5
            + asset["manualOverrides"] * 4
            + asset["nearMissEvents"] * 14
            + asset["telemetryGapMinutes"] * 1.2
            + asset["batteryThermalEvents"] * 12,
        ),
        2,
    )
    readiness = "blocked" if risk >= 70 else "watch" if risk >= 38 else "ready"
    return {**asset, "safetyRiskScore": risk, "readiness": readiness}


def build_pack(input_path: str | Path) -> dict:
    payload = json.loads(Path(input_path).read_text(encoding="utf-8"))
    findings = sorted((_score(asset) for asset in payload["assets"]), key=lambda row: row["safetyRiskScore"], reverse=True)
    top = findings[0]
    return {
        "title": "Fleet Safety Telemetry Incident Pack",
        "fleet": payload["fleet"],
        "blockedAssets": sum(1 for row in findings if row["readiness"] == "blocked"),
        "primaryRecommendation": f"{top['unitId']}: {top['nextAction']}",
        "findings": findings,
    }


def _markdown(pack: dict) -> str:
    lines = [f"# {pack['title']}", "", f"Fleet: {pack['fleet']}", f"Blocked assets: {pack['blockedAssets']}", f"Primary recommendation: {pack['primaryRecommendation']}", "", "## Findings"]
    for row in pack["findings"]:
        lines.append(f"- {row['unitId']} | {row['readiness']} | risk {row['safetyRiskScore']} | owner {row['owner']}")
    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input")
    parser.add_argument("--format", choices=["json", "markdown"], default="json")
    args = parser.parse_args()
    pack = build_pack(args.input)
    print(_markdown(pack) if args.format == "markdown" else json.dumps(pack, indent=2))


if __name__ == "__main__":
    main()
