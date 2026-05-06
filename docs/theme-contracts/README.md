# Theme Contracts

This folder is the canonical place for per-theme frontend/admin contracts.

Use `docs/theme-contract.md` for the platform-level appearance contract and use the files in this folder for concrete theme behavior. Each theme contract defines what the admin can safely expose: supported sections, section variants, visual style knobs, `themeData`, fallbacks, and content requirements.

## Theme Index

| Theme key | Contract | Template |
| :--- | :--- | :--- |
| `beauty-salon-classic` | [beauty-salon-classic.md](./beauty-salon-classic.md) | `beauty-salon` |
| `beauty-salon-editorial` | [beauty-salon-editorial.md](./beauty-salon-editorial.md) | `beauty-salon` |
| `beauty-salon-minimal` | [beauty-salon-minimal.md](./beauty-salon-minimal.md) | `beauty-salon` |

## Rules For New Themes

Every new theme must get its own contract file before it is exposed in the admin UI.

Required sections:

- Theme identity and positioning.
- Supported `layout.blocks`.
- Supported `sectionVariants` with defaults.
- Supported global `tokens`.
- Theme-specific `themeData` schema with defaults.
- Per-section content contract.
- Per-section visual style contract.
- Fallback behavior for missing or invalid data.
- Preview/admin notes.

The admin should treat these contracts as allowlists. Unknown fields can be stored by the backend, but the UI should not expose a control until the theme contract documents it.
