# Spin: brand authority and mobile rendering

## Source authority

- [AeroVista Brand & Style Guide — 2026](https://app.notion.com/p/3bc2a204d0c481d1a090c653b6cdd0d1) is marked **Current** and explicitly supersedes the 2025 parent-brand rules. It was last edited November 5, 2026.
- The approved **AeroVista HQ** and **EchoVerse Audio** records in `lumina-kits-export-2026-04-22.json` provide the palette, typography, and icon direction used here. Kit IDs: `aerovista-hq`, `echoverse-promo-kit`.
- The older divisions overview is historical context. Its brighter generic cyberpunk assumptions do not override the current parent-brand guide.

## Application to these games

| Game | Visual direction | Palette | Typography | Symbol language |
| --- | --- | --- | --- | --- |
| AeroVista Apex | Mature, restrained creative technology; graphite panels and precise geometry | Core Black #0F1115, Neon Blue #00AEEF, Cyber Silver #C0C0C0, Soft White #E8EDF2 | Orbitron 700 headings; Montserrat supporting text | Apex mark, connected nodes, grid, modules, specification frame, signal trace |
| EchoVerse Encore | Audio, pulse, resonance, and immersive music worlds | Neon Pink #FF1493, Dark Violet #221133, Soft Glow #F8F1FF; lavender support | Inter 800 hero type; Inter supporting text | Record rings, waveform, speaker, studio tools, echo rings |
| Wild x125!, Cyber Surge, Lucky 7s | Independent fictional game themes | Existing game-specific palettes | Existing game-specific fonts | Existing symbols |

The AeroVista game must not use planes, wings, jets, propellers, runways, pilot badges, drones, flight instruments, or flight-themed names. Mountains and compasses are also excluded from this implementation following the founder's recorded brand boundary. Aviation/aerial imagery belongs to Horizon Aerial & Visual when appropriate to its actual work.

Game-specific symbols are original procedural artwork, not replacements for official company logos. Neither the parent guide nor the approved division kit is being rewritten by this game.

EchoVerse's palette remains distinct from AeroVista's. Amber/gold casino decoration and generic music-note iconography are not its governing brand language.

## Mobile rendering contract

- Only the artwork is scaled; the touch deck and menus use native CSS pixels.
- Controls remain at least 44 CSS pixels high. Landscape places the deck beside the reels.
- Mobile removes nested 3D perspective, clipped/filter animation, continuous sign lighting, and reel SVG blur.
- Active play uses bounded particles and a lower canvas pixel ratio. The particle canvas paints **behind the touch deck**.
- Mobile buttons use stable borders/backgrounds; active and autoplay states do not blink or move the controls.
- Browser-bar resize events are coalesced into one layout update per animation frame. Pinch zoom does not become a new layout height.
- Reduced-motion preferences disable decorative CSS motion and particle emission.
- Local fonts and their SIL Open Font License texts are bundled; runtime rendering requires no font CDN.

## Validation scope

Use the repeatable browser checks described in the README. Acceptance includes changing phone sizes while effects are running, stable control rectangles and hit targets, unchanged deck pixels under a particle burst, touch spins and stop/skip behavior, all game selections, menu scrolling, and desktop layout.

Headless browser emulation can verify geometry, behavior, and paint ordering. It cannot certify every physical phone GPU or Safari version. If a device-specific rendering defect persists, retain the exact browser, device, orientation, and trigger when reproducing it.

## Paint-order reproduction

The prior mobile implementation at `1d8593e` painted the particle canvas above the button deck. Under a forced particle burst, screenshots of the opaque control area changed in the prior version and remained identical with the corrected layering. This verifies the effect/controls overlap defect; it does not attribute every possible device-specific artifact to that one cause.
