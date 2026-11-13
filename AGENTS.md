# Spin project rules

Read [docs/BRAND_AND_MOBILE.md](docs/BRAND_AND_MOBILE.md) before changing visual identity or mobile rendering.

- AeroVista follows the current 2026 parent-brand guide: black/graphite, restrained #00AEEF and #C0C0C0, apex and connected-system geometry. No aircraft, wings, drones, aviation instruments, mountains, compasses, or flight-themed naming.
- EchoVerse follows its own approved pink/violet pulse-and-resonance direction. Do not infer division branding from the parent name or generic casino decoration.
- Keep existing game IDs and payout models unless the task explicitly changes gameplay.
- Mobile controls and menus stay outside the scaled artwork. Effects must paint behind the touch deck. Preserve 44px targets and reduced-motion support.
- For mobile changes, run the browser regression suite (`npm ci`, `npm test`) and visually inspect relevant phone and desktop previews.
- Browser emulation is not physical-phone or Safari verification. Report validation scope accurately.
- Runtime remains static and offline-capable. Node and Puppeteer are development checks only.
