# Admin Controls: Beauty Salon Editorial

Цей документ описує, які налаштування адмінка може показувати для теми `beauty-salon-editorial`.

## Global Tokens

| Field | Type | Behavior |
| :--- | :--- | :--- |
| `tokens.primaryColor` | color | Акцентний колір CTA, links і editorial labels. |
| `tokens.fontFamily` | string | Основний шрифт сайту через CSS variable `--font-site`. |
| `tokens.buttonStyle` | `pill`, `square`, `soft` | Радіус CTA і action controls через `--btn-radius`. |
| `tokens.heroOverlay` | number `0..1` | Прозорість overlay поверх hero image. |
| `tokens.heroBackgroundImage` | URL або `null` | Зображення для hero. У split mode зображення йде у праву/медійну частину. |
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
| `services` | `cards`, `grid`, `list`, `compact` | `list` |
| `photoGallery` | `grid`, `masonry`, `carousel` | `grid` |

## Theme Data

| Field | Values | Default | Behavior |
| :--- | :--- | :--- | :--- |
| `heroStyle` | `spotlight`, `split` | `spotlight` | `split` ділить hero на текстову і медійну частину, якщо є image. |
| `surfaceStyle` | `soft`, `paper` | `soft` | Керує поверхнями карток і form blocks. |
| `sectionSpacing` | `regular`, `airy` | `regular` | Керує вертикальними відступами секцій. |
| `galleryChrome` | `rounded`, `framed` | `rounded` | `framed` додає editorial frame навколо фото. |
| `ctaPlacement` | `navbar`, `hero` | `navbar` | Додає booking CTA в hero, якщо обрано `hero`. |
| `animationStyle` | `float`, `reveal` | `float` | Обирає стиль появи hero та секцій. |

## Preview Notes

Адмінка може надсилати ці поля через `UPDATE_APPEARANCE`. Preview має отримувати повний normalized `appearance`, а не partial patch.
