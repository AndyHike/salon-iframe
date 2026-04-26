# External Frontend Integration

Цей документ - головна точка входу для розробника зовнішнього вебсайту, який підключається до адмін-панелі. Якщо треба швидко зрозуміти, як отримувати дані, як поводитись зі статусами сайту, що можна рендерити і як працювати з темами, починайте звідси.

Детальні reference-документи залишаються окремо:

- [Public API Docs](../../PUBLIC_API_DOCS.md) - browser/server API для контенту, налаштувань, категорій, товарів, фільтрів і повідомлень.
- [Internal API Docs](../../INTERNAL_API_DOCS.md) - server-to-server доступ через `SYSTEM_MASTER_KEY` і `domain`.
- [Theme Contract](./theme-contract.md) - як створювати теми так, щоб адмінка могла ними керувати.
- [Frontend Integration Guide](../../FRONTEND_INTEGRATION_GUIDE.md) - rendering pipeline для appearance/layout/preview.

## Integration Modes

Зовнішній frontend може працювати у двох режимах.

| Режим | Коли використовувати | Авторизація |
| :--- | :--- | :--- |
| Browser Public API | Запити напряму з браузера клієнта сайту | `x-public-api-key: pk_...` + allowed origins |
| Server-to-server | SSR, SSG, edge/server routes, власний frontend backend | `Authorization: Bearer <SYSTEM_MASTER_KEY>` + `?domain=...` |

Рекомендований production-підхід для шаблонів сайтів: frontend server робить server-to-server запити з master key, а браузеру віддає вже відрендерений HTML або власні безпечні client endpoints.

## Required Runtime Configuration

Зовнішній frontend-шаблон повинен мати:

- `ADMIN_API_BASE_URL` - base URL адмін-панелі.
- `SYSTEM_MASTER_KEY` - тільки для server-to-server запитів, ніколи не передавати в браузер.
- Поточний `hostname`, який передається в `domain` для domain-based routing.

Для browser-only інтеграції потрібен public API key (`pk_...`) і правильно налаштований `Allowed Origins` у дашборді.

## Recommended Startup Flow

1. Визначити домен поточного сайту.
2. Отримати appearance через internal endpoint:

```http
GET /api/v1/internal/appearance?domain=example.com
Authorization: Bearer <SYSTEM_MASTER_KEY>
```

3. Отримати settings через public API у master-key режимі:

```http
GET /api/public/v1/settings?domain=example.com
Authorization: Bearer <SYSTEM_MASTER_KEY>
```

4. Отримувати секційні дані за потреби:

```http
GET /api/public/v1/categories?domain=example.com
GET /api/public/v1/items?domain=example.com&include=categories
GET /api/public/v1/filters?domain=example.com&categorySlug=services
```

5. Перед рендером перевірити HTTP status. Якщо API повернув `403`, рендерити спеціальний екран доступності сайту, а не звичайну сторінку.

## Public Site Availability

Адмінка керує доступністю зовнішнього сайту через `publicSiteMode`, billing state і subscription health. Зовнішній frontend не повинен сам обчислювати ці стани з billing-даних. Він повинен довіряти API response.

| Effective state | Source | Meaning | Frontend behavior |
| :--- | :--- | :--- | :--- |
| `ACTIVE` | none | Сайт доступний | Рендерити звичайний сайт |
| `MAINTENANCE` | manual | Адмін тимчасово поставив сайт на технічне обслуговування | Рендерити maintenance сторінку |
| `TEMPORARILY_CLOSED` | manual | Адмін тимчасово закрив сайт | Рендерити temporarily closed сторінку |
| `SUSPENDED` | billing | Сайт заблокований через оплату, trial expiry або manual billing override | Рендерити suspended/unavailable сторінку |

Блокування через billing має пріоритет над ручним `publicSiteMode`. Якщо магазин suspended через billing, API поверне `mode: "SUSPENDED"` навіть якщо ручний режим був `MAINTENANCE` або `TEMPORARILY_CLOSED`.

## Blocked Response Contract

Коли сайт недоступний, public/internal endpoints повертають `403` з таким JSON:

```json
{
  "success": false,
  "error": "This site is temporarily closed.",
  "code": "SITE_TEMPORARILY_CLOSED",
  "mode": "TEMPORARILY_CLOSED",
  "source": "manual",
  "message": "Ми сьогодні зачинені через ремонт.",
  "until": "2026-05-01T09:00:00.000Z"
}
```

Можливі `code`:

- `STORE_SUSPENDED` - сайт заблокований billing/access state.
- `SITE_MAINTENANCE` - ручний режим технічного обслуговування.
- `SITE_TEMPORARILY_CLOSED` - ручний режим тимчасового закриття.

Можливі `mode`:

- `SUSPENDED`
- `MAINTENANCE`
- `TEMPORARILY_CLOSED`

Можливі `source`:

- `billing`
- `manual`

`message` може бути `null`; тоді frontend повинен показати власний дефолтний текст для `code`. `until` може бути `null`; тоді стан діє без визначеної дати завершення.

## Frontend Error Handling Rules

- `200` - рендерити нормальний сайт.
- `400` - integration/configuration error, зазвичай неправильний або відсутній параметр.
- `401` - неправильний ключ або відсутня авторизація.
- `403` - сайт існує, але зараз недоступний для публіки; показати availability screen.
- `404` - домен або ресурс не знайдено.
- `500` - тимчасова помилка адмінки; показати generic error або fallback.

Frontend не повинен перетворювати `403` у `404`: це різні сценарії. `403` означає, що сайт є, але зараз не має публічного доступу.

## What Frontend Developers Can Add

Frontend-шаблон може додавати:

- нові theme renderers для існуючого `templateKey`;
- нові layout/rendering variants, якщо адмінка вже може передати відповідний `sectionVariants` або `themeData`;
- власні presentation-only компоненти, які читають існуючі API fields;
- graceful fallback UI для unavailable/error states;
- preview handling через `postMessage`.

Frontend-шаблон не повинен додавати приховані business states, які адмінка не контролює. Якщо потрібен новий mode, новий theme knob або новий section variant, його треба спочатку додати в admin/API contract.

## Preview Contract

В iframe preview адмінка надсилає:

```json
{
  "type": "UPDATE_APPEARANCE",
  "payload": {
    "templateKey": "beauty-salon",
    "themeKey": "beauty-salon-classic",
    "tokens": {},
    "layout": {},
    "sectionVariants": {},
    "themeData": {}
  }
}
```

Preview renderer повинен використовувати той самий pipeline, що й production renderer:

```text
templateKey -> themeKey -> layout.blocks -> sectionVariants -> themeData -> tokens
```

## Theme Work

Для створення або розширення тем відкрийте [Theme Contract](./theme-contract.md). Там описано, що є стабільним API, що може бути theme-specific, і які умови треба виконати, щоб адмінка могла керувати темою без змін у frontend-коді для кожного клієнта.
