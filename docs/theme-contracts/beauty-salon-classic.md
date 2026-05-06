# Theme Contract: Beauty Salon Classic

## Identity

| Field | Value |
| :--- | :--- |
| `themeKey` | `beauty-salon-classic` |
| `templateKey` | `beauty-salon` |
| Display name | `Classic` / `Класична` |
| Visual role | Warm classic salon theme with a large hero, soft cards, rounded gallery photos, and optional transparent navigation over the hero image. |
| Navigation | `transparent-over-hero-image` |

## Supported Sections

`appearance.layout.blocks` may contain these section keys in any order:

| Section key | Renderer | Required data | Empty behavior |
| :--- | :--- | :--- | :--- |
| `hero` | `Hero` | `settings`, `servicesItems`, `appearance.tokens` | Renders with a light fallback background when `heroBackgroundImage` is missing. |
| `services` | `ServicesSection` | `servicesItems` | Shows localized empty services text. |
| `photoGallery` | `PhotoGallerySection` | `galleryItems`, `servicesItems` | Shows localized empty gallery text. |
| `contacts` | `ContactsSection` | `settings` contact fields | Omits missing contact rows individually. |

Unknown blocks must be ignored by the renderer. If no supported blocks remain, the theme falls back to all supported blocks in this order: `hero`, `services`, `photoGallery`, `contacts`.

## Section Variants

| Section | Variants | Default | Admin label guidance |
| :--- | :--- | :--- | :--- |
| `services` | `cards`, `grid`, `list`, `compact` | `cards` | Offer as mutually exclusive service layout styles. |
| `photoGallery` | `grid`, `masonry`, `carousel` | `masonry` | Offer as mutually exclusive photo layout styles. |

Invalid variants are normalized by `resolveThemeAppearance()`.

## Global Tokens

| Token | Type | Behavior |
| :--- | :--- | :--- |
| `primaryColor` | CSS color string | Accent color for CTAs, selected filters, links, decorative dividers, and hover states. |
| `fontFamily` | CSS font-family string | Main site font via `--font-site`. |
| `buttonStyle` | `pill`, `square`, `soft` | Button radius via `--btn-radius`. |
| `heroOverlay` | number `0..1` | Black overlay opacity on hero background image. Default renderer behavior uses `0.4` when omitted. |
| `heroBackgroundImage` | URL or `null` | Optional full hero background image. |
| `logoUrl` | URL or `null` | Logo in shared navbar. |

## Theme Data

| Field | Values | Default | Supported sections | Behavior |
| :--- | :--- | :--- | :--- | :--- |
| `surfaceStyle` | `soft`, `paper` | `soft` | `services`, `contacts` | `soft` uses subtle white/stone surfaces. `paper` adds stronger borders and paper-like background. |
| `sectionSpacing` | `regular`, `airy` | `regular` | `services`, `photoGallery`, `contacts` | `regular` uses standard vertical spacing. `airy` increases vertical spacing. |
| `galleryChrome` | `rounded`, `framed` | `rounded` | `photoGallery` | `rounded` gives photos rounded corners. `framed` gives photos a white framed border. |
| `ctaPlacement` | `navbar`, `hero` | `navbar` | `hero`, navbar | `hero` adds the booking CTA in hero. `navbar` keeps booking primarily in navigation. |
| `animationStyle` | `float`, `reveal` | `float` | `hero`, `services`, `photoGallery`, `contacts` | `float` adds gentle hero motion. `reveal` uses simpler reveal transitions. |

## Section Style Contract

### `hero`

- Supports image hero and non-image fallback.
- Uses centered composition.
- Uses `heroOverlay` only when `heroBackgroundImage` exists.
- Main CTA style follows `buttonStyle`.
- `ctaPlacement = hero` adds booking CTA next to the services CTA.

### `services`

| Variant | Visual style | Photo support | Best use |
| :--- | :--- | :--- | :--- |
| `cards` | Two-column grouped cards inside a soft/paper surface. | No service photo rendering in this variant. | Default salon price/menu view. |
| `grid` | Two-column grouped grid without a wrapping surface. | No service photo rendering in this variant. | More open service menu. |
| `list` | Narrow vertical service list. | No service photo rendering in this variant. | Price-list style. |
| `compact` | Dense list inside a soft/paper surface. | No service photo rendering in this variant. | Many services with shorter descriptions. |

Services are grouped by categories. Price uses the item price or localized "price on request" fallback.

### `photoGallery`

| Variant | Photo style | Ratio behavior | Interaction |
| :--- | :--- | :--- | :--- |
| `grid` | Four-column square grid on desktop, two columns on mobile. | Fixed square. | Opens shared lightbox. |
| `masonry` | CSS columns with mixed ratios. | Alternates `3/4`, `4/3`, and `1/1`. | Opens shared lightbox. |
| `carousel` | Horizontal snap carousel. | `4/5` portrait cards. | Opens shared lightbox. |

`galleryChrome = rounded` applies rounded corners. `galleryChrome = framed` applies a white frame.

### `contacts`

- Supports address, phone, email, working hours, social links, and contact/appointment form.
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

Structured days render as localized day rows. Closed days render localized `contacts.closed`. `byAppointment = true` renders localized `contacts.byAppointment`.

## Availability

The theme supports these blocked-site codes:

- `STORE_SUSPENDED`
- `SITE_MAINTENANCE`
- `SITE_TEMPORARILY_CLOSED`

Availability rendering is handled by the shared availability screen.

## Admin Checklist

- Show only documented `sectionVariants`.
- Show only documented `themeData` controls.
- Treat `layout.blocks` as reorderable and hideable.
- Send full normalized `appearance` to preview, not partial patches.
- Keep unknown future fields hidden until this contract is updated.
