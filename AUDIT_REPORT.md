# 🚀 KENSEI SPEC (剣聖スペック) — 360° Comprehensive System Audit

## 1. 🌟 Executive Summary & Overall Health Score (0–100)

**Overall Health Score: 92/100 (Excellent)**

The KENSEI SPEC simulator demonstrates a high degree of maturity, blending robust hardware telemetry with a visually striking Neo-Tokyo Soft Cyber Minimalist aesthetic. The mathematical models for bottleneck calculation are significantly more advanced than typical static calculators, dynamically assessing resolution, engine soft-caps, and silicon architectures.

However, there are opportunities for architectural decoupling in the React layer, dynamic linking in the checkout flow, and legal compliance persistence.

---

## 2. 🏆 Top Technical Strengths & Architectural Victories

*   **Dynamic Bottleneck Physics (`calculator.ts`):** The transition from static bottleneck percentages to dynamic workload distribution is a major win. The logic accurately pushes GPU utilization to 99% at 4K and properly scales CPU load based on single/multi-core ratios and game engine reliance (`cpuDependence`).
*   **VRAM Thrashing & Architecture Buffs:** The implementation of VRAM capacity thrashing penalties (severe 1% Lows drops) and AMD 3D V-Cache latency compensation (`+0.07` to `onePercentFactor`) perfectly mirrors real-world PCIe bus bottlenecking and L3 cache advantages.
*   **Aesthetic & UX Cohesion:** The UI successfully adheres to the Soft Japanese Minimalist guidelines. The use of Lucide React icons over raw emojis ensures crisp scaling. The `FpsGauge` SVG implementation with neon-glow filters and framerate-based gradients creates a highly engaging telemetry readout.
*   **Cost-per-FPS Analytics:** The `GameBuildsCatalog.tsx` masterfully integrates real-time value metrics (`$X.X / FPS`) and utilizes an efficient lazy-load rendering system for the 250+ preset matrix.
*   **Build Optimization:** The Vite configuration correctly uses `base: './'` to support relative path resolution, guaranteeing frictionless deployment to XAMPP subfolders without breaking asset links.

---

## 3. 🚨 High-Priority Bugs, Bottlenecks & Edge Cases Found

*   **React Prop Drilling (`App.tsx`):** The main component orchestrates the entire 3-step wizard and passes dozens of props down to `GameSelector`, `FpsGauge`, and `UpgradeAdvisor`. This creates tight coupling and makes state management brittle.
*   **Upgrade Advisor Socket Mismatch (`UpgradeAdvisor.tsx`):** While the advisor brilliantly suggests +30% performance unlocks, it filters solely by `manufacturer === currentBrand`. It does not factor in motherboard socket compatibility (e.g., it may recommend an AM5 Ryzen 7 9800X3D to a user with an AM4 Ryzen 5 3600), which would necessitate a full platform rebuild rather than a drop-in upgrade.
*   **Engine Soft-Cap Logic Vulnerability (`calculator.ts`):** The engine soft-cap relies on a strict check (`baseFps === 240 ? 535 : 580`). Because `baseFps` is dynamically derived and modulated by resolution/preset, it rarely perfectly matches exactly `240`, potentially bypassing the soft-cap intended for titles like CS2 and Valorant.
*   **Static Store Links (`BuildBuyModal.tsx`):** The checkout buttons in the buy modal point to static root URLs (`https://www.amazon.com`). They do not dynamically generate search queries (e.g., `?k=Ryzen+7+7800X3D`), forcing the user to manually search for the calculated components.
*   **Non-Persistent Legal Agreements (`LegalDocsModal.tsx`):** The modal contains comprehensive APPI/GDPR disclosures, but clicking "I Acknowledge & Agree" merely unmounts the component (`onClose`). It lacks a `localStorage` or `cookie` write to persist the user's consent across sessions.

---

## 4. 🎨 UI/UX & Aesthetics Recommendations

*   **Dark/Light Mode Contrast:** Ensure that `text-white/60` and other alpha-channel text utilities remain legible if a user toggles to a lighter theme context.
*   **Dynamic Component Imagery:** Consider adding actual product silouhettes or vendor logos (e.g., AMD Red, Intel Blue, NVIDIA Green) in the `ComponentPicker` or `BuildBuyModal` to enhance visual feedback during hardware selection.
*   **Progressive Loading State:** In `GameBuildsCatalog`, instead of just an `animate-pulse` bar, consider staggered fade-ins for the newly loaded PC cards to maintain the premium feel during infinite scrolling.

---

## 5. ⚡ Performance & Telemetry Formula Refinements

*   **VRAM Calculation Heuristics:** The calculation `game.ramMinRequirementGB * 0.45` is a decent proxy for VRAM, but adding an explicit `baseVramGB` field to `games.json` would yield much higher accuracy for VRAM-hogging titles like *Hogwarts Legacy* or *Cyberpunk 2077*.
*   **Thermal Throttling Floor:** Currently, if a CPU TDP exceeds 170W, a warning is pushed. It would be mathematically sound to apply a slight variance penalty (e.g., `-3%` to 1% Lows) if the user selects a budget air cooler in the future.
*   **JSON Asset Chunking:** The hardware JSON databases (`cpus.json`, `gpus.json`) are currently bundled directly. For future scaling, importing these dynamically (`await import('./data/cpus.json')`) will shrink the main `index.js` payload and accelerate Time-To-Interactive (TTI).

---

## 6. 🚀 Actionable Step-by-Step Execution Plan

1.  **Refactor State Management:** Migrate global configurator state from `App.tsx` into a `HardwareContext.tsx` using the Context API or Zustand to eliminate prop drilling.
2.  **Patch Upgrade Advisor:** Update `UpgradeAdvisor.tsx` to explicitly check `candidate.socket === selectedCpu.socket` before recommending a drop-in CPU upgrade. If no drop-in exists, distinctively label the suggestion as a "Platform Upgrade (New Motherboard Required)".
3.  **Fix Soft-Cap Logic:** Revise `calculator.ts` engine soft-caps to operate on game IDs (`game.id === 'game-cs2'`) rather than checking arbitrary `baseFps` integer matches.
4.  **Dynamic Affiliate Links:** Update `BuildBuyModal.tsx` to interpolate component names into the Amazon/Newegg URL parameters (`https://www.amazon.com/s?k=${encodeURIComponent(selectedCpu.name)}`).
5.  **Persist Legal Consent:** Implement `localStorage.setItem('kensei_legal_accepted', 'true')` in `LegalDocsModal.tsx` and check this on initial load to maintain APPI/GDPR compliance across user sessions.
