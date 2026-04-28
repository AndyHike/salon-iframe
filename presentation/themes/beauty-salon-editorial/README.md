# Beauty Salon Editorial

`beauty-salon-editorial` - контрастна editorial-тема для салону краси з великими заголовками, різкішою сіткою, framed gallery і solid navigation.

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

Навігація має режим `solid`, бо editorial hero може бути split-layout або image-driven і потребує стабільної читабельності navbar.

## Fallbacks

- `services` fallback: `list`
- `photoGallery` fallback: `grid`

Якщо адмінка передасть невідомий variant, `resolveThemeAppearance()` підставить fallback перед рендером.
