use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct RawAsset {
    pub unit_id: String,
    pub mission: String,
    pub sensor_drift_pct: f64,
    pub manual_overrides: u32,
    pub near_miss_events: u32,
    pub telemetry_gap_minutes: u32,
    pub battery_thermal_events: u32,
    pub software_version: String,
    pub owner: String,
    pub next_action: String,
}

#[derive(Debug, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct NormalizedAsset {
    pub unit_id: String,
    pub mission: String,
    pub exception_pressure: f64,
    pub safety_window: String,
    pub owner: String,
}

pub fn normalize(asset: RawAsset) -> NormalizedAsset {
    let exception_pressure = asset.sensor_drift_pct * 5.0
        + asset.manual_overrides as f64 * 4.0
        + asset.near_miss_events as f64 * 14.0
        + asset.telemetry_gap_minutes as f64 * 1.2
        + asset.battery_thermal_events as f64 * 12.0;
    let safety_window = if exception_pressure >= 70.0 {
        "blocked"
    } else if exception_pressure >= 38.0 {
        "watch"
    } else {
        "ready"
    };

    NormalizedAsset {
        unit_id: asset.unit_id,
        mission: asset.mission,
        exception_pressure: (exception_pressure * 100.0).round() / 100.0,
        safety_window: safety_window.to_string(),
        owner: asset.owner,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn normalizes_blocked_asset() {
        let asset = RawAsset {
            unit_id: "YARD-17".into(),
            mission: "warehouse transfer".into(),
            sensor_drift_pct: 8.4,
            manual_overrides: 7,
            near_miss_events: 2,
            telemetry_gap_minutes: 14,
            battery_thermal_events: 1,
            software_version: "2.8.4".into(),
            owner: "Fleet safety".into(),
            next_action: "pull".into(),
        };
        let normalized = normalize(asset);
        assert_eq!(normalized.safety_window, "blocked");
        assert!(normalized.exception_pressure > 100.0);
    }
}
