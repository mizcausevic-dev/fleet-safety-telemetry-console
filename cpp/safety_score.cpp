#include <fstream>
#include <iostream>
#include <regex>
#include <string>

double sum_field(const std::string& json, const std::string& field) {
    const std::regex pattern("\"" + field + "\"\\s*:\\s*([0-9]+(?:\\.[0-9]+)?)");
    double total = 0.0;
    for (std::sregex_iterator it(json.begin(), json.end(), pattern), end; it != end; ++it) {
        total += std::stod((*it)[1].str());
    }
    return total;
}

int main(int argc, char** argv) {
    if (argc < 2) {
        std::cerr << "usage: safety_score <fleet-telemetry.json>\n";
        return 2;
    }

    std::ifstream file(argv[1]);
    if (!file) {
        std::cerr << "unable to read input\n";
        return 2;
    }

    const std::string json((std::istreambuf_iterator<char>(file)), std::istreambuf_iterator<char>());
    const double drift = sum_field(json, "sensorDriftPct");
    const double overrides = sum_field(json, "manualOverrides");
    const double near_misses = sum_field(json, "nearMissEvents");
    const double gaps = sum_field(json, "telemetryGapMinutes");
    const double thermals = sum_field(json, "batteryThermalEvents");
    const double score = drift * 5.0 + overrides * 4.0 + near_misses * 14.0 + gaps * 1.2 + thermals * 12.0;

    std::cout << "fleet_safety_score=" << score << "\n";
    if (score <= 0.0) {
        return 1;
    }
    return 0;
}
