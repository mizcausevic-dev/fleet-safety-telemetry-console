# Architecture

Fleet Safety Telemetry Console is intentionally small but multi-language:

- `fixtures/fleet-telemetry.json` stores synthetic asset telemetry.
- `src/index.ts` scores records and produces the public summary.
- `src/app.ts` renders the static HTML surface and local Express route.
- `cpp/safety_score.cpp` simulates an embedded safety-score lane.
- `crates/fleet-normalizer` normalizes fleet assets into readiness events.
- `python/fleet_safety_console/pack.py` produces review-pack narratives.

The repo avoids production integrations. Real deployments would replace the fixture with an authenticated ingest path, redact identifiers, and separate operator telemetry from public-facing readiness narratives.

