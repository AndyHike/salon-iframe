# Beauty Salon Classic

`beauty-salon-classic` - базова тема для салону краси з м'якою візуальною мовою, великим hero, картками послуг і гнучкою галереєю.

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

Навігація має режим `transparent-over-hero-image`: navbar може бути прозорим над hero, якщо є `tokens.heroBackgroundImage`; після scroll або без hero image він стає solid.

## Fallbacks

- `services` fallback: `cards`
- `photoGallery` fallback: `masonry`

Якщо адмінка передасть невідомий variant, `resolveThemeAppearance()` підставить fallback перед рендером.
