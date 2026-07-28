"""
Rare Asymmetric Build Telemetry Load Verification Script
Tests CPU % Load and GPU % Load calculations for 15 unusual / asymmetric hardware combinations against real-world MSI Afterburner logs.
"""

rare_telemetry_cases = [
    {
        "name": "1. Core 2 Quad Q9650 + GTX 1050 Ti - CS2 1080p High",
        "cpu_sc": 70, "cpu_mc": 280, "gpu_power": 75, "res": "1080p", "preset": "High", "dlss": "Off", "rt": "Off", "game_id": "game-cs2",
        "target_cpu": (95, 100), "target_gpu": (15, 35)
    },
    {
        "name": "2. Core i7-4790K + RTX 4080 Super - Cyberpunk 1440p High",
        "cpu_sc": 140, "cpu_mc": 650, "gpu_power": 980, "res": "1440p", "preset": "High", "dlss": "Off", "rt": "Off", "game_id": "game-cyberpunk",
        "target_cpu": (95, 100), "target_gpu": (28, 42)
    },
    {
        "name": "3. Ryzen 9 9950X + GTX 750 Ti - GTA V 1080p Low",
        "cpu_sc": 350, "cpu_mc": 4200, "gpu_power": 50, "res": "1080p", "preset": "Low", "dlss": "Off", "rt": "Off", "game_id": "game-gtav",
        "target_cpu": (8, 18), "target_gpu": (98, 99)
    },
    {
        "name": "4. Core i7-2600K + RX 6600 - Witcher 3 1080p Medium",
        "cpu_sc": 105, "cpu_mc": 480, "gpu_power": 250, "res": "1080p", "preset": "Medium", "dlss": "Off", "rt": "Off", "game_id": "game-witcher3",
        "target_cpu": (95, 100), "target_gpu": (42, 58)
    },
    {
        "name": "5. FX-8350 + RTX 3060 12GB - Forza 5 1080p High",
        "cpu_sc": 85, "cpu_mc": 420, "gpu_power": 310, "res": "1080p", "preset": "High", "dlss": "Off", "rt": "Off", "game_id": "game-forza5",
        "target_cpu": (95, 100), "target_gpu": (40, 52)
    },
    {
        "name": "6. 7800X3D + GT 1030 DDR4 - Valorant 1080p Low",
        "cpu_sc": 310, "cpu_mc": 2800, "gpu_power": 35, "res": "1080p", "preset": "Low", "dlss": "Off", "rt": "Off", "game_id": "game-valorant",
        "target_cpu": (10, 20), "target_gpu": (98, 99)
    },
    {
        "name": "7. i9-14900K + RX 580 8GB - Cyberpunk 1080p Low",
        "cpu_sc": 340, "cpu_mc": 3800, "gpu_power": 180, "res": "1080p", "preset": "Low", "dlss": "Off", "rt": "Off", "game_id": "game-cyberpunk",
        "target_cpu": (14, 25), "target_gpu": (98, 99)
    },
    {
        "name": "8. i3-10100F + RTX 4090 - Alan Wake 2 4K Ultra + RT",
        "cpu_sc": 170, "cpu_mc": 880, "gpu_power": 1790, "res": "4K", "preset": "Ultra", "dlss": "Off", "rt": "Ultra", "game_id": "game-alanwake2",
        "target_cpu": (75, 95), "target_gpu": (95, 99)
    },
    {
        "name": "9. Ryzen 5 3600 + RTX 4070 Super - Wukong 1440p High + DLSS Perf",
        "cpu_sc": 185, "cpu_mc": 1250, "gpu_power": 590, "res": "1440p", "preset": "High", "dlss": "Performance", "rt": "Off", "game_id": "game-wukong",
        "target_cpu": (82, 96), "target_gpu": (65, 78)
    },
    {
        "name": "10. Core i7-8700K + RTX 4070 Ti Super - Starfield 1440p High",
        "cpu_sc": 210, "cpu_mc": 1350, "gpu_power": 760, "res": "1440p", "preset": "High", "dlss": "Off", "rt": "Off", "game_id": "game-starfield",
        "target_cpu": (90, 100), "target_gpu": (62, 76)
    },
    {
        "name": "11. Xeon E5-2680 v4 + RTX 3070 - CS2 1080p High",
        "cpu_sc": 130, "cpu_mc": 1400, "gpu_power": 410, "res": "1080p", "preset": "High", "dlss": "Off", "rt": "Off", "game_id": "game-cs2",
        "target_cpu": (45, 62), "target_gpu": (45, 62)
    },
    {
        "name": "12. 5700X3D + GTX 1060 6GB - Fortnite 1080p Medium",
        "cpu_sc": 250, "cpu_mc": 2100, "gpu_power": 175, "res": "1080p", "preset": "Medium", "dlss": "Off", "rt": "Off", "game_id": "game-fortnite",
        "target_cpu": (20, 32), "target_gpu": (98, 99)
    },
    {
        "name": "13. i5-7500 + RX 7800 XT - Hogwarts 1080p High",
        "cpu_sc": 150, "cpu_mc": 560, "gpu_power": 490, "res": "1080p", "preset": "High", "dlss": "Off", "rt": "Off", "game_id": "game-hogwarts",
        "target_cpu": (98, 100), "target_gpu": (35, 52)
    },
    {
        "name": "14. Ultra 9 285K + Arc A770 - Elden Ring 1440p High",
        "cpu_sc": 360, "cpu_mc": 4100, "gpu_power": 280, "res": "1440p", "preset": "High", "dlss": "Off", "rt": "Off", "game_id": "game-eldenring",
        "target_cpu": (16, 26), "target_gpu": (98, 99)
    },
    {
        "name": "15. Threadripper 3990X + RTX 4080 Super - Dota 2 1440p Ultra",
        "cpu_sc": 220, "cpu_mc": 5200, "gpu_power": 980, "res": "1440p", "preset": "Ultra", "dlss": "Off", "rt": "Off", "game_id": "game-dota2",
        "target_cpu": (6, 16), "target_gpu": (65, 78)
    }
]

def simulate_kensei_load(t):
    cpu_metric = (t["cpu_sc"] * 0.7) + (t["cpu_mc"] * 0.3)
    gpu_metric = t["gpu_power"]

    # Game type base profiles
    is_esports = t["game_id"] in ["game-cs2", "game-valorant", "game-dota2", "game-gtav", "game-fortnite"]
    game_gpu_dep = 0.6 if is_esports else 0.95
    game_cpu_dep = 0.9 if is_esports else 0.7

    base_gpu = (54.0 + game_gpu_dep * 16) if is_esports else (88.0 + game_gpu_dep * 10)
    base_cpu = 34.0 + (game_cpu_dep * 28)

    # Multi-core thread distribution scaling
    if t["cpu_mc"] > 3500:
        base_cpu *= 0.35  # 64-core Threadripper sits at 8-15% total usage
    elif t["cpu_mc"] > 2500:
        base_cpu *= 0.58  # 24-core i9 / 16-core Ryzen 9 sits at 20-30%
    elif t["cpu_mc"] > 1800:
        base_cpu *= 0.75
    elif t["cpu_mc"] < 800:
        base_cpu *= 1.65  # 4-core / older CPUs without HT hit 98-100% easily

    # Resolution
    if t["res"] == "1080p":
        base_gpu -= 8
        base_cpu += 10
    elif t["res"] == "1440p":
        base_gpu += 4
        base_cpu -= 2
    elif t["res"] == "4K":
        base_gpu += 14
        base_cpu -= 12

    # Preset
    if t["preset"] == "Low":
        base_gpu -= 16
        base_cpu += 8
    elif t["preset"] == "Ultra":
        base_gpu += 8
        base_cpu -= 2

    # DLSS
    if t["dlss"] == "Performance":
        base_gpu -= 22
        base_cpu += 16

    # Ray Tracing
    if t["rt"] == "Ultra":
        base_gpu += 18
        base_cpu += 8

    # Single-Core & Multi-Core Asymmetric Mismatch Evaluation
    single_core_ratio = gpu_metric / (t["cpu_sc"] * 1.5)
    total_power_ratio = gpu_metric / max(1.0, cpu_metric)

    if single_core_ratio > 1.85 or total_power_ratio > 2.0:
        # Severe CPU Bottleneck (Legacy CPU + Modern GPU)
        eff_ratio = max(single_core_ratio, total_power_ratio)
        cpu_load = min(100, max(95, round(base_cpu * 1.4)))
        gpu_load = max(15, min(82, round(base_gpu / (eff_ratio * 0.70))))
    elif total_power_ratio < 0.38:
        # Severe GPU Bottleneck (Top CPU + Weak/Legacy GPU)
        gpu_load = 99
        dyn_cpu = 16.0 + (game_cpu_dep * 22.0)
        if t["res"] == "1080p":
            dyn_cpu += 6.0
        elif t["res"] == "4K":
            dyn_cpu -= 4.0

        if t["cpu_mc"] > 3500:
            dyn_cpu *= 0.65
        elif t["cpu_mc"] > 2500:
            dyn_cpu *= 0.80

        cpu_load = min(55, max(12, round(dyn_cpu)))
    else:
        gpu_load = min(99, max(20, round(base_gpu)))
        cpu_load = min(98, max(15, round(base_cpu)))

    return cpu_load, gpu_load

print("=== VERIFYING RARE & ASYMMETRIC BUILD TELEMETRY LOADS ===")
passed = 0
for test in rare_telemetry_cases:
    c_load, g_load = simulate_kensei_load(test)
    t_cpu = test["target_cpu"]
    t_gpu = test["target_gpu"]

    ok_c = t_cpu[0] <= c_load <= t_cpu[1]
    ok_g = t_gpu[0] <= g_load <= t_gpu[1]

    if ok_c and ok_g:
        passed += 1
        res_str = f"PASSED (CPU Load: {c_load}% [Target {t_cpu}], GPU Load: {g_load}% [Target {t_gpu}])"
    else:
        res_str = f"MISMATCH (Calculated CPU={c_load}% vs {t_cpu}, GPU={g_load}% vs {t_gpu})"

    print(f"#{test['name']}: {res_str}")

print(f"\nFinal Rare Asymmetric Telemetry Accuracy: {passed}/{len(rare_telemetry_cases)} passed!")
