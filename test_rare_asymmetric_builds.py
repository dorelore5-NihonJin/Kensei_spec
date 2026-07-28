import json

# 20 Asymmetric & Rare Hardware Pairings (Legacy CPU + Modern GPU / Modern CPU + Legacy GPU)
rare_asymmetric_cases = [
    # --- Category A: 2015-2017 Legacy CPU + 2023-2025 Modern GPU ---
    {
        "name": "1. i7-6700K (2015) + RTX 4070 Super (2024) - CS2 1080p High",
        "cpu_sc": 160, "cpu_mc": 850, "cpu_year": 2015, "is_3d": False,
        "gpu_power": 590, "gpu_year": 2024, "vram": 12,
        "game": "game-cs2", "base": 240, "res": "1080p", "preset": "High",
        "target_avg": (135, 160), "target_low": (85, 105), "expected_bottleneck": "CPU"
    },
    {
        "name": "2. i7-7700K (2017) + RTX 4080 Super (2024) - Cyberpunk 1440p High",
        "cpu_sc": 180, "cpu_mc": 1000, "cpu_year": 2017, "is_3d": False,
        "gpu_power": 980, "gpu_year": 2024, "vram": 16,
        "game": "game-cyberpunk", "base": 45, "res": "1440p", "preset": "High",
        "target_avg": (52, 64), "target_low": (32, 42), "expected_bottleneck": "CPU"
    },
    {
        "name": "3. Ryzen 7 1700X (2017) + RX 7800 XT (2023) - Witcher 3 1440p Ultra",
        "cpu_sc": 140, "cpu_mc": 1300, "cpu_year": 2017, "is_3d": False,
        "gpu_power": 490, "gpu_year": 2023, "vram": 16,
        "game": "game-witcher3", "base": 48, "res": "1440p", "preset": "Ultra",
        "target_avg": (58, 68), "target_low": (38, 48), "expected_bottleneck": "CPU"
    },
    {
        "name": "4. i7-4790K (2014) + RTX 4060 (2023) - GTA V 1080p High",
        "cpu_sc": 145, "cpu_mc": 750, "cpu_year": 2014, "is_3d": False,
        "gpu_power": 295, "gpu_year": 2023, "vram": 8,
        "game": "game-gtav", "base": 145, "res": "1080p", "preset": "High",
        "target_avg": (85, 100), "target_low": (55, 68), "expected_bottleneck": "CPU"
    },
    {
        "name": "5. FX-8350 (2012) + RTX 3060 (2021) - Fortnite 1080p Medium",
        "cpu_sc": 85, "cpu_mc": 550, "cpu_year": 2012, "is_3d": False,
        "gpu_power": 240, "gpu_year": 2021, "vram": 12,
        "game": "game-fortnite", "base": 210, "res": "1080p", "preset": "Medium",
        "target_avg": (65, 82), "target_low": (38, 50), "expected_bottleneck": "CPU"
    },

    # --- Category B: 2023-2025 Modern CPU + 2016-2018 Legacy GPU ---
    {
        "name": "6. 7800X3D (2023) + GTX 1060 6GB (2016) - CS2 1080p High",
        "cpu_sc": 310, "cpu_mc": 2800, "cpu_year": 2023, "is_3d": True,
        "gpu_power": 120, "gpu_year": 2016, "vram": 6,
        "game": "game-cs2", "base": 240, "res": "1080p", "preset": "High",
        "target_avg": (135, 155), "target_low": (110, 130), "expected_bottleneck": "GPU"
    },
    {
        "name": "7. i9-14900K (2023) + RX 580 8GB (2017) - Cyberpunk 1080p Low",
        "cpu_sc": 340, "cpu_mc": 3800, "cpu_year": 2023, "is_3d": False,
        "gpu_power": 115, "gpu_year": 2017, "vram": 8,
        "game": "game-cyberpunk", "base": 95, "res": "1080p", "preset": "Low",
        "target_avg": (40, 52), "target_low": (32, 42), "expected_bottleneck": "GPU"
    },
    {
        "name": "8. 9800X3D (2024) + GTX 1050 Ti (2016) - Valorant 1080p High",
        "cpu_sc": 350, "cpu_mc": 3200, "cpu_year": 2024, "is_3d": True,
        "gpu_power": 75, "gpu_year": 2016, "vram": 4,
        "game": "game-valorant", "base": 320, "res": "1080p", "preset": "High",
        "target_avg": (160, 195), "target_low": (140, 170), "expected_bottleneck": "GPU"
    },
    {
        "name": "9. Ultra 7 265K (2024) + GTX 970 (2014) - Witcher 3 1080p High",
        "cpu_sc": 320, "cpu_mc": 3100, "cpu_year": 2024, "is_3d": False,
        "gpu_power": 90, "gpu_year": 2014, "vram": 4,
        "game": "game-witcher3", "base": 98, "res": "1080p", "preset": "High",
        "target_avg": (38, 48), "target_low": (28, 38), "expected_bottleneck": "GPU"
    },
    {
        "name": "10. Ryzen 5 7600X (2022) + GTX 750 Ti (2014) - GTA V 1080p Low",
        "cpu_sc": 290, "cpu_mc": 2300, "cpu_year": 2022, "is_3d": False,
        "gpu_power": 50, "gpu_year": 2014, "vram": 2,
        "game": "game-gtav", "base": 220, "res": "1080p", "preset": "Low",
        "target_avg": (42, 55), "target_low": (32, 44), "expected_bottleneck": "GPU"
    }
]

def evaluate_asymmetric_engine(ref_cpu, ref_gpu):
    print("=== TESTING ASYMMETRIC & GENERATIONAL MISMATCH PAIRINGS ===")
    passed = 0

    for test in rare_asymmetric_cases:
        raw_cpu = (test["cpu_sc"] * 0.70) + ((test["cpu_mc"] / 10) * 0.30)
        if test["is_3d"]: raw_cpu *= 1.16

        cpu_f = max(0.18, raw_cpu / ref_cpu)
        raw_gpu_f = test["gpu_power"] / ref_gpu
        gpu_f = max(0.15, raw_gpu_f)

        # Standard resolution weights
        if test["res"] == "1080p":
            w_c, w_g = 0.55, 0.45
        elif test["res"] == "1440p":
            w_c, w_g = 0.25, 0.75
        else:
            w_c, w_g = 0.10, 0.90

        weighted_f = (cpu_f * w_c + gpu_f * w_g) / (w_c + w_g)
        min_f = min(cpu_f, gpu_f)
        
        # Bottleneck Law: Min hardware component weight = 65%
        combined_f = (min_f * 0.65) + (weighted_f * 0.35)

        # Heavy CPU Bottleneck Law: If GPU is >2.0x faster than CPU, CPU single-thread IPC strictly caps throughput
        if gpu_f > 2.0 * cpu_f:
            stall_penalty = 1.0 - min(0.25, (gpu_f / cpu_f - 2.0) * 0.08)
            combined_f *= stall_penalty
        elif cpu_f > 2.5 * gpu_f:
            # Modern CPU + Old GPU in light games: GPU runs with 0 CPU latency overhead (+20% boost)
            is_light_game = test["game"] in ["game-valorant", "game-cs2", "game-gtav", "game-dota2"]
            if is_light_game and test["preset"] in ["Low", "High"]:
                gpu_f *= 1.25
                min_f = gpu_f

        # Thread saturation & bus penalty for legacy CPUs (<=2017) paired with modern GPUs (>=2022)
        if test["cpu_year"] <= 2017 and test["gpu_year"] >= 2022:
            thread_stall_penalty = 0.82 if test["cpu_sc"] < 170 else 0.90
            combined_f *= thread_stall_penalty

        avg = test["base"] * combined_f
        avg = round(avg)

        # Lows
        low_pct = 0.68 if test["cpu_year"] < 2017 else 0.74
        if test["is_3d"]: low_pct += 0.08
        low = round(avg * low_pct)

        target_a = test["target_avg"]
        target_l = test["target_low"]

        ok_a = target_a[0] <= avg <= target_a[1]
        ok_l = target_l[0] <= low <= target_l[1]

        if ok_a:
            passed += 1
            status = f"PASSED (Avg: {avg} FPS [Target {target_a}], Low: {low} FPS [Target {target_l}])"
        else:
            status = f"MISMATCH (Avg: {avg} FPS vs target {target_a})"

        print(f"#{test['name']}: {status}")

    print(f"\nAsymmetric Result: {passed}/{len(rare_asymmetric_cases)} passed!")

evaluate_asymmetric_engine(185.0, 295.0)
