# Theme Contract For External Frontends

Per-theme contracts now live in `docs/theme-contracts/`.

- `beauty-salon-classic`: `docs/theme-contracts/beauty-salon-classic.md`
- `beauty-salon-editorial`: `docs/theme-contracts/beauty-salon-editorial.md`
- `beauty-salon-minimal`: `docs/theme-contracts/beauty-salon-minimal.md`

Use this document for the platform-level shape of `SiteAppearance`; use the per-theme files as the admin allowlist for concrete controls and styles.

Цей документ описує, як зовнішній frontend має створювати та підтримувати теми, щоб адмінка могла керувати ними через `SiteAppearance`.

## Core Principle

Тема не повинна бути просто набором кольорів. Тема - це реальний renderer/design system, який приймає стабільний appearance contract від адмінки.

```text
templateKey -> themeKey -> layout.blocks -> sectionVariants -> themeData -> tokens
```

| Field | Responsibility |
| :--- | :--- |
| `templateKey` | Визначає бізнесову структуру сайту і доступні секції |
| `themeKey` | Вибирає конкретний дизайн/renderer |
| `layout.blocks` | Визначає порядок і видимість блоків |
| `sectionVariants` | Вибирає variant renderer для окремих секцій |
| `themeData` | Зберігає theme-specific параметри |
| `tokens` | Дозволяє адмінці міняти базові стилі без зміни renderer |

## Appearance Shape

Frontend повинен приймати appearance у такому базовому shape:

```ts
type SiteAppearance = {
  templateKey: string;
  themeKey: string;
  tokens: {
    primaryColor?: string;
    fontFamily?: string;
    buttonStyle?: "pill" | "square" | "soft" | string;
    heroOverlay?: number;
    heroBackgroundImage?: string | null;
    logoUrl?: string | null;
    [key: string]: unknown;
  };
  layout: {
    blocks: string[];
    [key: string]: unknown;
  };
  sectionVariants: Record<string, string>;
  themeData: Record<string, unknown>;
};
```

Frontend має бути tolerant reader: невідомі поля ігнорувати, відсутні поля підставляти дефолтами теми.

## Theme Renderer Requirements

Кожен `themeKey` повинен:

- мати власний renderer або mapping на renderer;
- підтримувати всі секції, які можуть прийти для відповідного `templateKey`;
- мати дефолти для всіх token/themeData значень;
- коректно працювати без `heroBackgroundImage`, `logoUrl` і optional section data;
- рендерити fallback для невідомого `sectionVariants[sectionKey]`;
- підтримувати preview update без повного reload, якщо сайт відкритий в iframe адмінки.

## Tokens

`tokens` - це параметри, якими адмінка може керувати напряму.

| Token | Expected behavior |
| :--- | :--- |
| `primaryColor` | Акцентний колір теми: кнопки, links, selected states |
| `fontFamily` | Основний display/body font або theme-specific font mapping |
| `buttonStyle` | Глобальна форма кнопок: `pill`, `square`, `soft` |
| `heroOverlay` | Opacity overlay для hero image, значення `0..1` |
| `heroBackgroundImage` | URL hero background image або `null` |
| `logoUrl` | URL логотипу або `null` |

Якщо тема потребує більше параметрів, додайте їх у `themeData`, а не перевантажуйте generic `tokens`.

## Theme Data

`themeData` використовується для параметрів, які мають сенс тільки для конкретної теми.

Приклади:

```json
{
  "hero": {
    "composition": "centered",
    "mediaTone": "warm"
  },
  "cards": {
    "density": "compact",
    "imageRatio": "4:3"
  }
}
```

Правила:

- `themeData` має бути JSON-serializable.
- Значення мають мати дефолти у frontend renderer.
- Не зберігайте там secrets, API keys або billing/access state.
- Не використовуйте `themeData` для бізнес-даних, які мають жити в section/content APIs.

## Layout Blocks

`layout.blocks` визначає порядок секцій. Frontend повинен:

- рендерити тільки відомі section keys;
- пропускати невідомі keys без падіння;
- не показувати disabled/empty секції, якщо їх data відсутня або секція вимкнена на рівні features;
- зберігати порядок, який прийшов з API.

Приклад:

```tsx
const SECTION_MAP = {
  hero: HeroSection,
  services: ServicesSection,
  photoGallery: PhotoGallerySection,
  contacts: ContactsSection,
};

export function Page({ appearance, data }) {
  return (
    <main>
      {appearance.layout.blocks.map((key) => {
        const Component = SECTION_MAP[key];
        return Component ? <Component key={key} appearance={appearance} data={data[key]} /> : null;
      })}
    </main>
  );
}
```

## Section Variants

`sectionVariants` дозволяє адмінці вибирати renderer для конкретної секції.

Приклад:

```json
{
  "services": "cards",
  "photoGallery": "masonry"
}
```

Frontend повинен мати fallback:

```ts
const variant = appearance.sectionVariants.services ?? "cards";
const Renderer = SERVICES_VARIANTS[variant] ?? SERVICES_VARIANTS.cards;
```

## Availability Screens

Кожна тема повинна мати спеціальний renderer для blocked site state:

- `STORE_SUSPENDED`
- `SITE_MAINTENANCE`
- `SITE_TEMPORARILY_CLOSED`

Ці екрани мають використовувати `message` і `until` з `403` response, якщо вони є. Якщо `message` немає, тема показує власний дефолтний текст для відповідного `code`.

## Preview Support

Preview iframe отримує `UPDATE_APPEARANCE` через `postMessage`. Theme renderer повинен застосовувати payload як повний normalized appearance object.

```ts
window.addEventListener("message", (event) => {
  if (event.data?.type === "UPDATE_APPEARANCE") {
    renderWithAppearance(event.data.payload);
  }
});
```

Preview не повинен мати окрему модель даних від production. Якщо preview працює, а production ні, це означає, що renderer використовує різні contracts.

## Adding A New Theme

Щоб додати тему:

1. Обрати `templateKey`, для якого тема працює.
2. Додати стабільний `themeKey`, наприклад `beauty-salon-minimal`.
3. Реалізувати renderer і fallback values.
4. Підтримати всі потрібні `layout.blocks`.
5. Підтримати relevant `sectionVariants`.
6. Описати supported `themeData`.
7. Перевірити `200` rendering, `403` availability screen і iframe preview.
8. Лише після цього додавати тему в адмінку як доступний вибір.

## Compatibility Rules

- Не перейменовуйте existing `themeKey` без міграції.
- Не прибирайте existing token behavior без fallback.
- Не робіть frontend-only settings, які неможливо змінити або зрозуміти з адмінки.
- Нові optional поля мають бути backward-compatible.
- Breaking changes мають проходити через новий `themeKey` або versioned contract.
