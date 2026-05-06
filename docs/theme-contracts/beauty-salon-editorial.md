# Theme Contract: Beauty Salon Editorial

## Identity

| Field | Value |
| :--- | :--- |
| `themeKey` | `beauty-salon-editorial` |
| `templateKey` | `beauty-salon` |
| Display name | `Editorial` / `Едіторіальна` |
| Visual role | High-contrast editorial salon theme with oversized type, sharp spacing, framed photography, and solid navigation. |
| Navigation | `solid` |

## Supported Sections

`appearance.layout.blocks` may contain these section keys in any order:

| Section key | Renderer | Required data | Empty behavior |
| :--- | :--- | :--- | :--- |
| `hero` | `Hero` | `settings`, `servicesItems`, `appearance.tokens` | Renders spotlight fallback when no image exists. |
| `services` | `ServicesSection` | `servicesItems` | Shows localized empty services text. |
| `photoGallery` | `PhotoGallerySection` | `galleryItems`, `servicesItems` | Shows localized empty gallery text. |
| `contacts` | `ContactsSection` | `settings` contact fields | Omits missing contact rows individually. |

Unknown blocks must be ignored by the renderer. If no supported blocks remain, the theme falls back to all supported blocks in this order: `hero`, `services`, `photoGallery`, `contacts`.

## Section Variants

| Section | Variants | Default | Admin label guidance |
| :--- | :--- | :--- | :--- |
| `services` | `cards`, `grid`, `list`, `compact` | `list` | Offer as service presentation styles. |
| `photoGallery` | `grid`, `masonry`, `carousel` | `grid` | Offer as photo layout styles. |

Invalid variants are normalized by `resolveThemeAppearance()`.

## Global Tokens

| Token | Type | Behavior |
| :--- | :--- | :--- |
| `primaryColor` | CSS color string | Accent color for CTAs, labels, links, filters, and hover states. |
| `fontFamily` | CSS font-family string | Main site font via `--font-site`. |
| `buttonStyle` | `pill`, `square`, `soft` | Button radius via `--btn-radius`. Editorial layout still keeps sharper visual language. |
| `heroOverlay` | number `0..1` | Overlay opacity on hero image. Default renderer behavior uses `0.4` when omitted. |
| `heroBackgroundImage` | URL or `null` | Hero image. In split mode it becomes the media column. |
| `logoUrl` | URL or `null` | Logo in shared navbar. |

## Theme Data

| Field | Values | Default | Supported sections | Behavior |
| :--- | :--- | :--- | :--- | :--- |
| `heroStyle` | `spotlight`, `split` | `spotlight` | `hero` | `spotlight` centers the hero. `split` uses text plus image columns when `heroBackgroundImage` exists. |
| `surfaceStyle` | `soft`, `paper` | `soft` | `services`, `contacts` | Controls bordered/paper surfaces for service groups and form block. |
| `sectionSpacing` | `regular`, `airy` | `regular` | `services`, `photoGallery`, `contacts` | `regular` keeps editorial density. `airy` increases vertical breathing room. |
| `galleryChrome` | `rounded`, `framed` | `rounded` | `photoGallery` | `rounded` removes extra frame. `framed` adds editorial white frame and border. |
| `ctaPlacement` | `navbar`, `hero` | `navbar` | `hero`, navbar | `hero` adds booking CTA in hero. |
| `animationStyle` | `float`, `reveal` | `float` | `hero`, `services`, `photoGallery`, `contacts` | Chooses between scale/float style and direct reveal style. |

## Section Style Contract

### `hero`

| `heroStyle` | Visual style | Image requirement |
| :--- | :--- | :--- |
| `spotlight` | Centered, uppercase, oversized title with image or plain fallback. | Optional. |
| `split` | Left text column and right media column. | Requires `heroBackgroundImage`; otherwise renderer falls back to spotlight. |

Hero CTAs follow `buttonStyle`. `heroOverlay` applies only when image media exists.

### `services`

| Variant | Visual style | Photo support | Best use |
| :--- | :--- | :--- | :--- |
| `cards` | Two-column editorial cards inside a bordered surface. | No service photo rendering in this variant. | Featured service categories. |
| `grid` | Two-column open grid with large gaps. | No service photo rendering in this variant. | Magazine-like service menu. |
| `list` | Wide vertical list with large titles and separators. | No service photo rendering in this variant. | Default editorial price/menu view. |
| `compact` | Dense bordered list. | No service photo rendering in this variant. | Many services with short copy. |

Services are grouped by categories. Price uses the item price or localized "price on request" fallback.

### `photoGallery`

| Variant | Photo style | Ratio behavior | Interaction |
| :--- | :--- | :--- | :--- |
| `grid` | One/two/four-column editorial grid. | Fixed `3/4` portrait. | Opens shared lightbox. |
| `masonry` | CSS columns with large gutters. | Alternates tall, square, and landscape blocks. | Opens shared lightbox. |
| `carousel` | Horizontal snap carousel. | `3/4` portrait cards. | Opens shared lightbox. |

Photos render in grayscale by default and transition to color on hover. `galleryChrome = framed` adds the editorial frame; `rounded` keeps sharp unframed photos.

### `contacts`

- Supports address, phone, email, working hours, social links, and contact/appointment form.
- Uses uppercase labels and serif contact values.
- `workingHours` supports either plain text or structured admin object:

```json
{
  "byAppointment": true,
  "days": [
    { "day": "monday", "open": "09:00", "close": "18:00", "isClosed": false },
    { "day": "sunday", "open": null, "close": null, "isClosed": true }
  ]
}
```

Structured days render as localized day rows. Closed days render localized `contacts.closed`. `byAppointment = true` renders localized `contacts.byAppointment`.

## Availability

The theme supports these blocked-site codes:

- `STORE_SUSPENDED`
- `SITE_MAINTENANCE`
- `SITE_TEMPORARILY_CLOSED`

Availability rendering is handled by the shared availability screen.

## Admin Checklist

- Do not expose `heroStyle = split` as image-independent; it needs `heroBackgroundImage` for the actual split renderer.
- Show only documented variants and `themeData` fields.
- Send full normalized `appearance` to preview.
- Keep unknown future fields hidden until this contract is updated.
