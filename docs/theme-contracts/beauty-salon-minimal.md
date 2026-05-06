# Theme Contract: Beauty Salon Minimal

## Identity

| Field | Value |
| :--- | :--- |
| `themeKey` | `beauty-salon-minimal` |
| `templateKey` | `beauty-salon` |
| Display name | `Minimal` / `Мінімальна` |
| Visual role | Restrained salon theme with clean typography, white space, solid navigation, compact service layouts, and quiet gallery presentation. |
| Navigation | `solid` |
| Fixture path | `/theme-fixtures/beauty-salon-minimal` |

## Supported Sections

`appearance.layout.blocks` may contain these section keys in any order:

| Section key | Renderer | Required data | Empty behavior |
| :--- | :--- | :--- | :--- |
| `hero` | `Hero` | `settings`, `servicesItems`, `appearance.tokens` | Uses `heroBackgroundImage` or a deterministic fallback image. |
| `services` | `ServicesSection` | `servicesItems` | Shows localized empty services text. |
| `photoGallery` | `PhotoGallerySection` | `galleryItems`, `servicesItems` | Shows localized empty gallery text. |
| `contacts` | `ContactsSection` | `settings` contact fields | Omits missing contact rows individually. |

Unknown blocks must be ignored by the renderer. If no supported blocks remain, the theme falls back to all supported blocks in this order: `hero`, `services`, `photoGallery`, `contacts`.

## Section Variants

| Section | Variants | Default | Admin label guidance |
| :--- | :--- | :--- | :--- |
| `services` | `cards`, `list` | `list` | Offer as compact menu style choices. |
| `photoGallery` | `grid`, `masonry` | `grid` | Offer as minimal photo layout styles. |

Invalid variants are normalized by `resolveThemeAppearance()`.

## Global Tokens

| Token | Type | Behavior |
| :--- | :--- | :--- |
| `primaryColor` | CSS color string | Accent color for CTAs, service price, links, and selected filters. |
| `fontFamily` | CSS font-family string | Main site font via `--font-site`. |
| `buttonStyle` | `pill`, `square`, `soft` | Button and action radius via `--btn-radius`. |
| `heroOverlay` | number `0..1` | Overlay opacity on hero image. Default renderer behavior uses `0.16` when omitted. |
| `heroBackgroundImage` | URL or `null` | Main hero image. If empty, renderer uses a deterministic fallback image. |
| `logoUrl` | URL or `null` | Logo in shared navbar and hero. |

## Theme Data

| Field | Values | Default | Supported sections | Behavior |
| :--- | :--- | :--- | :--- | :--- |
| `sectionSpacing` | `compact`, `regular`, `airy` | `regular` | `services`, `photoGallery`, `contacts` | Controls vertical section spacing. |
| `serviceDensity` | `regular`, `compact` | `regular` | `services` | Controls padding of service cards/rows. |
| `galleryImageRatio` | `portrait`, `square` | `portrait` | `photoGallery` | Controls grid and masonry photo ratios. |
| `heroChrome` | `caption`, `clean` | `caption` | `hero` | `caption` shows the lower image caption overlay. `clean` removes it. |

## Section Style Contract

### `hero`

- Uses a two-column desktop layout: text left, image right.
- Uses stacked mobile layout.
- Uses `logoUrl` in hero when present.
- Uses `heroChrome = caption` to show the bottom image caption; `clean` hides it.
- Uses `heroOverlay` on the image.
- Shows booking CTA and services CTA.

### `services`

| Variant | Visual style | Density support | Photo support | Best use |
| :--- | :--- | :--- | :--- | :--- |
| `list` | Minimal divided list with price column. | `serviceDensity` controls row padding. | No service photo rendering in this variant. | Default clean price/menu view. |
| `cards` | Two-column flat cards with subtle background. | `serviceDensity` controls card padding. | No service photo rendering in this variant. | Short featured service list. |

Services render in the order provided by CMS. Price uses the item price or localized "price on request" fallback.

### `photoGallery`

| Variant | Photo style | Ratio behavior | Interaction |
| :--- | :--- | :--- | :--- |
| `grid` | Two/four-column clean image grid. | `galleryImageRatio = portrait` uses `4/5`; `square` uses `1/1`. | Opens shared lightbox. |
| `masonry` | CSS columns with minimal gutters. | `square` forces all `1/1`; `portrait` alternates `4/5`, `1/1`, and `5/4`. | Opens shared lightbox. |

Photos have no decorative frame in this theme. Hover gently scales the image.

### `contacts`

- Supports address, phone, email, working hours, Instagram, Telegram, and contact/appointment form.
- Facebook is not currently rendered by the minimal contact section even if `facebookActive` is true.
- `workingHours` supports either plain text or structured admin object:

```json
{
  "byAppointment": false,
  "days": [
    { "day": "monday", "open": "09:00", "close": "18:00", "isClosed": false },
    { "day": "sunday", "open": null, "close": null, "isClosed": true }
  ]
}
```

Structured days render as localized day rows. Closed days render localized `contacts.closed`. `byAppointment = true` renders localized `contacts.byAppointment`. Plain text renders with preserved line breaks.

## Availability

The theme supports these blocked-site codes:

- `STORE_SUSPENDED`
- `SITE_MAINTENANCE`
- `SITE_TEMPORARILY_CLOSED`

Availability rendering is handled by the shared availability screen.

## Admin Checklist

- Expose only `services = cards/list` and `photoGallery = grid/masonry`.
- Expose `galleryImageRatio` only for this theme unless another theme contract adds it.
- Do not expose Facebook as a minimal-theme contact control until the renderer supports it.
- Send structured `workingHours` with `days[]` when the admin uses the schedule editor.
- Send full normalized `appearance` to preview.
