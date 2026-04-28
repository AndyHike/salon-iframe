# Admin Controls: Beauty Salon Classic

Цей документ описує, які налаштування адмінка може показувати для теми `beauty-salon-classic`.

## Global Tokens

| Field | Type | Behavior |
| :--- | :--- | :--- |
| `tokens.primaryColor` | color | Акцентний колір кнопок, links, selected states і декоративних ліній. |
| `tokens.fontFamily` | string | Основний шрифт сайту через CSS variable `--font-site`. |
| `tokens.buttonStyle` | `pill`, `square`, `soft` | Радіус кнопок через `--btn-radius`. |
| `tokens.heroOverlay` | number `0..1` | Прозорість чорного overlay поверх hero image. |
| `tokens.heroBackgroundImage` | URL або `null` | Фонове зображення hero. Якщо пусто, тема використовує світлий fallback. |
| `tokens.logoUrl` | URL або `null` | Логотип у navbar. |

## Layout Blocks

`appearance.layout.blocks` може міняти порядок та видимість:

- `hero`
- `services`
- `photoGallery`
- `contacts`

Невідомі blocks ігноруються.

## Section Variants

| Section | Variants | Default |
| :--- | :--- | :--- |
| `services` | `cards`, `grid`, `list`, `compact` | `cards` |
| `photoGallery` | `grid`, `masonry`, `carousel` | `masonry` |

## Theme Data

| Field | Values | Default | Behavior |
| :--- | :--- | :--- | :--- |
| `surfaceStyle` | `soft`, `paper` | `soft` | Впливає на фон і рамки карток послуг та contact form. |
| `sectionSpacing` | `regular`, `airy` | `regular` | Керує вертикальними відступами секцій. |
| `galleryChrome` | `rounded`, `framed` | `rounded` | Керує радіусом або framed-обрамленням фото. |
| `ctaPlacement` | `navbar`, `hero` | `navbar` | Додає booking CTA в hero, якщо обрано `hero`. |
| `animationStyle` | `float`, `reveal` | `float` | Обирає стиль появи hero та секцій. |

## Preview Notes

Адмінка може надсилати ці поля через `UPDATE_APPEARANCE`. Preview має отримувати повний normalized `appearance`, а не partial patch.
