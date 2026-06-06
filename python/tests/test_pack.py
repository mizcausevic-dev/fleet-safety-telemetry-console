import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from fleet_safety_console import build_pack  # noqa: E402


class PackTest(unittest.TestCase):
    def test_pack_prioritizes_blocked_asset(self):
        pack = build_pack("fixtures/fleet-telemetry.json")
        self.assertEqual(pack["findings"][0]["unitId"], "YARD-17")
        self.assertEqual(pack["blockedAssets"], 2)
        self.assertIn("YARD-17", pack["primaryRecommendation"])


if __name__ == "__main__":
    unittest.main()
