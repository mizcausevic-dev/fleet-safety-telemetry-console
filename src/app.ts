import express from "express";
import { readFileSync } from "node:fs";
import { buildFleetSummary, type FleetInput } from "./index.js";

export function renderPage(input: FleetInput): string {
  const summary = buildFleetSummary(input);
  const cards = summary.findings
    .map(
      (asset) => `<article class="asset ${asset.readiness}"><span>${asset.readiness}</span><h3>${asset.unitId}</h3><p>${asset.boardNarrative}</p><dl><div><dt>Risk</dt><dd>${asset.safetyRiskScore}</dd></div><div><dt>Overrides</dt><dd>${asset.manualOverrides}</dd></div><div><dt>Gaps</dt><dd>${asset.telemetryGapMinutes}m</dd></div></dl><strong>${asset.nextAction}</strong></article>`
    )
    .join("");

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Fleet Safety Telemetry Console</title><meta name="description" content="Automotive and robotics safety telemetry console for sensor drift, override events, telemetry gaps, and readiness posture."/><style>:root{--bg:#050812;--panel:#0d1727;--text:#f4f1ea;--muted:#a8b3c7;--cyan:#25d7ef;--mint:#5ff0b6;--line:rgba(98,238,219,.22)}*{box-sizing:border-box}body{margin:0;font-family:"Segoe UI",sans-serif;color:var(--text);background:radial-gradient(circle at 84% 8%,rgba(95,240,182,.15),transparent 32rem),radial-gradient(circle at 12% 12%,rgba(37,215,239,.14),transparent 30rem),var(--bg)}main{width:min(1180px,calc(100% - 40px));margin:0 auto;padding:56px 0}.hero{border:1px solid var(--line);border-radius:28px;padding:clamp(28px,5vw,64px);background:linear-gradient(135deg,rgba(13,23,39,.96),rgba(8,11,24,.92))}.eyebrow{color:var(--mint);font-family:Consolas,monospace;font-size:.78rem;letter-spacing:.18em;text-transform:uppercase}h1{max-width:980px;margin:18px 0;font-size:clamp(3rem,8vw,7rem);line-height:.9;letter-spacing:-.075em}.lede{max-width:760px;color:var(--muted);font-size:1.25rem;line-height:1.7}.metrics,.grid{display:grid;gap:16px}.metrics{grid-template-columns:repeat(4,1fr);margin-top:34px}.metric,.asset{background:rgba(13,23,39,.9);border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:22px}.metric small,dt{color:var(--muted);text-transform:uppercase;letter-spacing:.12em;font-size:.75rem}.metric b{display:block;margin-top:10px;font-size:2rem}.grid{grid-template-columns:repeat(3,1fr);margin-top:22px}.asset{min-height:280px}.asset span{color:var(--cyan);font-family:Consolas,monospace;text-transform:uppercase;letter-spacing:.14em;font-size:.76rem}.asset.blocked{border-color:rgba(255,107,135,.42)}.asset.watch{border-color:rgba(255,209,102,.38)}h3{font-size:1.65rem;margin:14px 0 10px}p{color:var(--muted);line-height:1.6}dl{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:20px 0}dd{margin:5px 0 0;font-size:1.25rem;font-weight:800}.proof-pack{display:grid;grid-template-columns:1.05fr 1fr 1fr;gap:16px;margin-top:22px}.proof-card{background:linear-gradient(180deg,rgba(18,28,46,.94),rgba(10,16,28,.92));border:1px solid rgba(255,255,255,.1);border-radius:20px;padding:22px;box-shadow:0 16px 42px rgba(0,0,0,.18)}.proof-card small{display:block;color:var(--cyan);font-family:Consolas,monospace;text-transform:uppercase;letter-spacing:.14em;font-size:.72rem;margin-bottom:10px}.proof-card h2{font-size:1.35rem;margin:0 0 10px;letter-spacing:-.03em}.proof-card p{margin:0;color:var(--muted);line-height:1.62}.proof-card ul{margin:0;padding-left:18px;color:var(--muted);line-height:1.75}.proof-card li::marker{color:var(--cyan)}@media(max-width:900px){.proof-pack{grid-template-columns:1fr}}footer{margin-top:34px;color:var(--muted);font-family:Consolas,monospace}@media(max-width:900px){.metrics,.grid,dl{grid-template-columns:1fr}}</style></head><body><main><section class="hero"><div class="eyebrow">Automotive and Robotics / C++ + Rust + Python</div><h1>Fleet safety telemetry becomes a release decision surface.</h1><p class="lede">Fleet Safety Telemetry Console turns sensor drift, manual override pressure, near-miss events, telemetry gaps, and thermal exceptions into a board-readable readiness ledger.</p><div class="metrics"><div class="metric"><small>Aggregate risk</small><b>${summary.aggregateSafetyRisk}</b></div><div class="metric"><small>Blocked assets</small><b>${summary.blockedAssets}</b></div><div class="metric"><small>Assets tracked</small><b>${summary.findings.length}</b></div><div class="metric"><small>Top unit</small><b>${summary.findings[0].unitId}</b></div></div></section><section class="grid">${cards}</section><section class="proof-pack" aria-label="Evidence and board pack">
      <article class="proof-card">
        <small>Evidence matrix</small>
        <h2>What leaders can inspect</h2>
        <p>Each lane keeps the source signal, owner, risk posture, and next decision in the same public proof surface instead of hiding the work in screenshots.</p>
      </article>
      <article class="proof-card">
        <small>Board pack builder</small>
        <h2>How the packet gets used</h2>
        <ul><li>Translate technical telemetry into decision language.</li><li>Separate watch, contain, and escalation posture.</li><li>Keep remediation evidence attached to accountable owners.</li></ul>
      </article>
      <article class="proof-card">
        <small>Public-demo boundary</small>
        <h2>What is intentionally synthetic</h2>
        <p>Demo fixtures are synthetic and credential-free; the pattern is reusable for real diligence packets without exposing customer or regulated data.</p>
      </article>
    </section>
    <section class="proof-pack" aria-label="Product depth and shared pattern">
      <article class="proof-card">
        <small>Product purpose</small>
        <h2>What this product does</h2>
        <p>A fleet-risk operating surface for robotics, autonomy, and industrial operations where safety events, sensor drift, human override, and readiness evidence need a board-readable route.</p>
      </article>
      <article class="proof-card">
        <small>Go-to-market lens</small>
        <h2>Why buyers would care</h2>
        <p>For robotics and mobility buyers, the page maps technical telemetry to fleet reliability, operator trust, customer impact, and launch readiness.</p>
      </article>
      <article class="proof-card">
        <small>Value architecture</small>
        <h2>How it turns into action</h2>
        <p>It turns safety signals into accountable remediation and investment priorities instead of leaving them trapped in engineering dashboards.</p>
      </article>
      <article class="proof-card">
        <small>Technical proof</small>
        <h2>How reviewers can trust it</h2>
        <p>The proof uses synthetic telemetry fixtures, typed scoring, route output, prerendered HTML, and public-safe evidence packaging.</p>
      </article>
      <article class="proof-card">
        <small>What these repos have in common</small>
        <h2>Platform complexity becomes board-ready operating proof.</h2>
        <p>Each repo names a buyer pain, exposes an evidence model, produces a reusable artifact, and keeps the public page safe with synthetic data instead of credentials or customer exports.</p>
      </article>
      <article class="proof-card">
        <small>Interlinks</small>
        <h2>Where this fits</h2>
        <p><a href="https://portfolio.kineticgain.com/">Portfolio</a> · <a href="https://kineticgain.com/">Kinetic Gain</a> · <a href="https://github.com/mizcausevic-dev/fleet-safety-telemetry-console">GitHub</a></p>
      </article>
    </section><footer>Primary recommendation: ${summary.primaryRecommendation}</footer></main></body></html>`;
}

export function createApp() {
  const app = express();
  const input = JSON.parse(readFileSync("fixtures/fleet-telemetry.json", "utf8")) as FleetInput;
  app.get("/", (_req, res) => res.type("html").send(renderPage(input)));
  app.get("/api/fleet", (_req, res) => res.json(buildFleetSummary(input)));
  return app;
}

if (process.argv[1]?.endsWith("app.js")) {
  createApp().listen(4173, () => console.log("fleet-safety-telemetry-console listening on http://localhost:4173"));
}
