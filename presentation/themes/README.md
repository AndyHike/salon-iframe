# Theme Packages

Кожна тема у цій папці є окремим пакетом renderer-ів для `templateKey = beauty-salon`.

Мінімальна структура теми:

```text
beauty-salon-example/
  index.ts
  manifest.ts
  theme.ts
  themeData.ts
  README.md
  ADMIN_CONTROLS.md
  Hero.tsx
  ServicesSection.tsx
  PhotoGallerySection.tsx
  ContactsSection.tsx
```

## Runtime Flow

1. CMS повертає `appearance`.
2. `resolveThemeDefinition(appearance.themeKey)` вибирає пакет теми.
3. `resolveThemeAppearance()` нормалізує блоки та variants під можливості теми.
4. Renderer бере `theme.sections[blockName]`.
5. `theme.shell.Navbar` і `theme.shell.Footer` рендерять глобальну оболонку, яку тема може замінити.

## Package Responsibilities

- `manifest.ts` описує те, що може побачити адмінка: назву, tokens, blocks, variants, `themeDataSchema`, fallback-и.
- `themeData.ts` парсить theme-specific налаштування і завжди повертає дефолти.
- `theme.ts` мапить section keys на React renderer-и.
- `README.md` пояснює архітектуру теми для розробника.
- `ADMIN_CONTROLS.md` пояснює, які поля адмінка може показувати користувачу.

Нова тема не повинна додавати прихованих frontend-only налаштувань. Якщо тема реагує на новий knob, він має бути описаний у `themeDataSchema` і в `ADMIN_CONTROLS.md`.
