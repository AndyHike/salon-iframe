# Admin Controls: Beauty Salon Minimal

Цей документ описує, які налаштування адмінка може показувати для теми `beauty-salon-minimal`.

## Global Tokens

| Field | Type | Behavior |
| :--- | :--- | :--- |
| `tokens.primaryColor` | color | Акцентний колір CTA, service price і links. |
| `tokens.fontFamily` | string | Основний шрифт сайту через CSS variable `--font-site`. |
| `tokens.buttonStyle` | `pill`, `square`, `soft` | Радіус CTA і action controls через `--btn-radius`. |
| `tokens.heroOverlay` | number `0..1` | Прозорість overlay поверх hero image. |
| `tokens.heroBackgroundImage` | URL або `null` | Основне hero image. Якщо пусто, тема бере перше gallery image або fallback image. |
| `tokens.logoUrl` | URL або `null` | Логотип у navbar і hero. |

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
| `services` | `cards`, `list` | `list` |
| `photoGallery` | `grid`, `masonry` | `grid` |

## Theme Data

| Field | Values | Default | Behavior |
| :--- | :--- | :--- | :--- |
| `sectionSpacing` | `compact`, `regular`, `airy` | `regular` | Керує вертикальними відступами `services`, `photoGallery`, `contacts`. |
| `serviceDensity` | `regular`, `compact` | `regular` | Керує щільністю service rows/cards. |
| `galleryImageRatio` | `portrait`, `square` | `portrait` | Керує пропорціями gallery grid і masonry images. |
| `heroChrome` | `caption`, `clean` | `caption` | `clean` прибирає нижній caption overlay з hero image. |

## Preview Notes

Адмінка може надсилати ці поля через `UPDATE_APPEARANCE`. Preview має отримувати повний normalized `appearance`, а не partial patch.
