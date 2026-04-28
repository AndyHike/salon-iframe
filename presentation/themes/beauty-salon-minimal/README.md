# Beauty Salon Minimal

`beauty-salon-minimal` - стримана тема для салону краси з чистою типографікою, білим простором, solid navigation і компактними section renderer-ами.

## Files

- `index.ts` - збирає повний `BeautySalonThemeDefinition`.
- `manifest.ts` - описує публічний контракт теми для registry та адмінки.
- `theme.ts` - мапить `hero`, `services`, `photoGallery`, `contacts` на renderer-и.
- `themeData.ts` - парсить theme-specific knobs з `appearance.themeData`.
- `ADMIN_CONTROLS.md` - людський опис контролів для адмінки.

## Renderer Contract

Тема підтримує такі секції:

- `hero`
- `services`
- `photoGallery`
- `contacts`

Тема використовує shared shell:

- `DefaultNavbar`
- `DefaultFooter`

Навігація має режим `solid`, бо minimal layout розрахований на чистий верхній бар незалежно від hero image.

## Fallbacks

- `services` fallback: `list`
- `photoGallery` fallback: `grid`

Якщо адмінка передасть невідомий variant, `resolveThemeAppearance()` підставить fallback перед рендером.
