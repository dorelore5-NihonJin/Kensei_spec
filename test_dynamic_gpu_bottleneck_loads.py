"""
Comprehensive Dynamic GPU Bottleneck CPU Load Verification Test
Verifies that high-tier CPUs (Core Ultra 7 265KF, Ryzen 7 7800X3D, Core i9-14900K) paired with low-to-mid tier GPUs
produce dynamically varying CPU % loads depending on the selected game and resolution (e.g. 14% to 32%) rather than a static 8%.
"""

from test_rare_telemetry_builds import simulate_kensei_load

test_matrix = [
    {
        "cpu_name": "Core Ultra 7 265KF",
        "cpu_sc": 340, "cpu_mc": 3600, "gpu_power": 110, "gpu_name": "GTX 1650",
        "games": [
            {"game_id": "game-cs2", "res": "1080p", "expected_cpu_range": (26, 34)},
            {"game_id": "game-cyberpunk", "res": "1080p", "expected_cpu_range": (20, 26)},
            {"game_id": "game-minecraft", "res": "1080p", "expected_cpu_range": (22, 28)},
            {"game_id": "game-sims4", "res": "4K", "expected_cpu_range": (12, 18)},
            {"game_id": "game-wukong", "res": "1440p", "expected_cpu_range": (18, 24)},
        ]
    },
    {
        "cpu_name": "Ryzen 7 7800X3D",
        "cpu_sc": 310, "cpu_mc": 2800, "gpu_power": 180, "gpu_name": "RX 580 8GB",
        "games": [
            {"game_id": "game-valorant", "res": "1080p", "expected_cpu_range": (28, 36)},
            {"game_id": "game-alanwake2", "res": "1440p", "expected_cpu_range": (18, 26)},
            {"game_id": "game-fortnite", "res": "1080p", "expected_cpu_range": (26, 34)},
            {"game_id": "game-gtavi", "res": "4K", "expected_cpu_range": (14, 20)},
        ]
    }
]

print("=== VERIFYING DYNAMIC GAME-DEPENDENT CPU LOAD UNDER GPU BOTTLENECK ===")
all_passed = True

for build in test_matrix:
    print(f"\n[Hardware]: {build['cpu_name']} + {build['gpu_name']}")
    for g in build["games"]:
        t = {
            "cpu_sc": build["cpu_sc"],
            "cpu_mc": build["cpu_mc"],
            "gpu_power": build["gpu_power"],
            "res": g["res"],
            "preset": "High",
            "dlss": "Off",
            "rt": "Off",
            "game_id": g["game_id"]
        }
        c_load, g_load = simulate_kensei_load(t)
        exp_min, exp_max = g["expected_cpu_range"]
        status = "PASSED" if exp_min <= c_load <= exp_max else "MISMATCH"
        if status == "MISMATCH":
            all_passed = False
        print(f"  * {g['game_id']} [{g['res']}]: CPU Load = {c_load}% | GPU Load = {g_load}% ({status})")

if all_passed:
    print("\nSUCCESS: All test builds display dynamic game & resolution CPU load variance!")
else:
    print("\nNote: Check variance tolerances if any test mismatch.")
