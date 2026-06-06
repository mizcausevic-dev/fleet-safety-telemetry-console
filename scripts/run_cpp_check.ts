import { spawnSync } from "node:child_process";

const binaryPath = process.platform === "win32" ? "cpp/safety_score.exe" : "cpp/safety_score";
const executable = process.platform === "win32" ? ".\\cpp\\safety_score.exe" : "./cpp/safety_score";

const compile = spawnSync(
  "clang++",
  ["-std=c++20", "-Wall", "-Wextra", "-pedantic", "cpp/safety_score.cpp", "-o", binaryPath],
  { stdio: "inherit" }
);

if (compile.status !== 0) {
  process.exit(compile.status ?? 1);
}

const run = spawnSync(executable, ["fixtures/fleet-telemetry.json"], {
  stdio: "inherit"
});

if (run.status !== 0) {
  process.exit(run.status ?? 1);
}
