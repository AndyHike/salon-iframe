# Public API Documentation

Цей документ описує зовнішні (публічні) API ендпоінти, доступні для інтеграції з вашим магазином. Ви можете використовувати або **Публічний ключ** (для браузерних запитів), або **Секретний ключ** (для серверних запитів).

> [!TIP]
> Якщо ви підключаєте новий зовнішній сайт і хочете побачити повну картину інтеграції, почніть з [External Frontend Integration](docs/external-frontends/README.md). Цей файл залишається детальним reference для Public API.

---

## Авторизація 🔐

Для доступу до API необхідно передати заголовок `x-public-api-key` при кожному запиті.

**Заголовок (Header):**
```http
x-public-api-key: <Ваш_API_Key>
```

### Вибір ключа (Public vs Secret)

| Тип ключа | Префікс | Призначення | Безпека |
| :--- | :--- | :--- | :--- |
| **Public Key** | `pk_live_...` | Для використання на фронтенді (JS в браузері). | Вимагає налаштування **Allowed Origins**. |
| **Secret Key** | `sk_live_...` | Для використання на бекенді (Server-to-Server). | Має server-side доступ до public data, **не можна** розголошувати. |

> [!WARNING]
> Ніколи не використовуйте **Secret Key** у клієнтському коді (браузері), оскільки він буде видимим для всіх користувачів. Для сайту використовуйте лише **Public Key**.

### Дозволені домени (Allowed Origins)

При використанні **Public Key**, запит буде дозволено лише з тих доменів, які ви вказали в полі **"Allowed Origins"** на Дашборді.
- Формат: `https://yourdomain.com, http://localhost:3000`
- Якщо список порожній, запити з публічним ключем будуть заблоковані.
- Секретний ключ (`sk_`) ігнорує origin-обмеження, але не обходить site availability або billing-блокування.

> [!IMPORTANT]
> Рекомендується використовувати версіюзовані кінцеві точки (наприклад, `/api/public/v1/...`). Старі адреси без префіса `v1` продовжують працювати як аліаси для поточної версії.

---

## Доступність сайту та статуси

Усі Public API endpoints перевіряють доступність магазину перед поверненням даних. Це означає, що зовнішній сайт може отримати `403 Forbidden`, навіть якщо ключ валідний і домен існує.

Адмінка підтримує такі ефективні стани публічного сайту:

| Стан | Джерело | Що означає |
| :--- | :--- | :--- |
| `ACTIVE` | none | Сайт доступний, API повертає звичайні `200`/`201` відповіді |
| `MAINTENANCE` | `manual` | Адмін тимчасово поставив сайт на технічне обслуговування |
| `TEMPORARILY_CLOSED` | `manual` | Адмін тимчасово закрив сайт |
| `SUSPENDED` | `billing` | Сайт призупинений через підписку, trial expiry або billing override |

Billing-блокування має пріоритет над ручним режимом. Якщо магазин призупинений через billing, API поверне `mode: "SUSPENDED"` незалежно від того, який `publicSiteMode` вибраний вручну.

### Формат `403 Forbidden`

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

- `STORE_SUSPENDED` - магазин зараз недоступний через billing/access state.
- `SITE_MAINTENANCE` - сайт у ручному режимі технічного обслуговування.
- `SITE_TEMPORARILY_CLOSED` - сайт у ручному режимі тимчасового закриття.

Можливі `mode`:

- `SUSPENDED`
- `MAINTENANCE`
- `TEMPORARILY_CLOSED`

Можливі `source`:

- `billing`
- `manual`

`message` може бути `null`; у такому випадку frontend повинен показати власний дефолтний текст для `code`. `until` може бути `null`; у такому випадку стан діє без визначеної дати завершення.

Frontend не повинен трактувати `403` як `404`: сайт існує, але зараз не має публічного доступу.

---

## 1. Отримати список категорій 🗂️
Повертає список усіх категорій, прив'язаних до конкретного магазину (проекту).

**URL**: `GET /api/public/v1/categories` (або застарілий `/api/public/categories`)

**Параметри запиту (Query Parameters):**
*Немає*

**Формат відповіді (Success 200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "cuid...",
      "storeId": "cuid...",
      "parentId": null,
      "title": { "uk": "Ноутбуки", "en": "Laptops" },
      "slug": "laptops",
      "description": null,
      "position": 0,
      "isActive": true,
      "createdAt": "2024-03-10T15:00:00Z",
      "updatedAt": "2024-03-10T15:00:00Z"
    }
  ]
}
```


---

### 1.1. Отримати одну категорію (за slug) 📄

**URL**: `GET /api/public/v1/categories/[slug]` (або застарілий `/api/public/categories/[slug]`)

**Формат відповіді (Success 200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "cuid...",
    "storeId": "cuid...",
    "slug": "laptops",
    "isActive": true,
    ...
  }
}
```

---


## 2. Отримати список товарів 📦
Повертає список товарів магазину з можливістю фільтрації, пошуку та пагінації.

**URL**: `GET /api/public/v1/items` (або застарілий `/api/public/items`)

**Параметри запиту (Query Parameters):**
Усі параметри є необов'язковими (Optional).
- `categorySlug` (string) - Відфільтрувати товари за конкретною категорією.
- `search` (string) - Пошук тексту у назві товару (регістронезалежний).
- `minPrice` (number) - Мінімальна ціна.
- `maxPrice` (number) - Максимальна ціна.
- `page` (number) - Номер сторінки для пагінації (за замовчуванням: `1`).
- `limit` (number) - Кількість товарів на сторінку (за замовчуванням: `20`).
- `include` (string) - Додаткові вкладені дані. Наразі підтримується значення `categories`.

**Приклад запиту:**
`GET /api/public/items?categorySlug=laptops&search=macbook&minPrice=1000&page=1&limit=10`

**Локалізовані поля**

Усі локалізовані текстові поля в Public Items API повертаються у фіксованому sparse shape:

```ts
type PublicLocalizedText = Partial<Record<"uk" | "en" | "cs", string>>;
```

Це стосується щонайменше:
- `title`
- `description`
- `content`
- `linkedItems[].targetItem.title`
- `categories[].title`
- `categories[].ancestors[].title`

**Формат відповіді (Success 200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "cuid...",
      "storeId": "cuid...",
      "title": { "uk": "MacBook Pro", "en": "MacBook Pro" },
      "slug": "macbook-pro",
      "description": { "uk": "Опис...", "en": "Desc..." },
      "content": null,
      "price": "1500.00",
      "attributes": { "color": "Space Gray", "ram": "16GB" },
      "position": 0,
      "isActive": true,
      "images": [
        {
          "id": "cuid...",
          "storeId": "cuid...",
          "itemId": "cuid...",
          "filePath": "https://pub-...r2.dev/uploads/...",
          "isMain": true,
          "position": 0
        }
      ],
      "createdAt": "2024-03-10T15:00:00Z",
      "updatedAt": "2024-03-10T15:00:00Z",
      "linkedItems": [
        {
          "type": "cross_sell",
          "targetItem": {
            "id": "cuid...",
            "title": { "uk": "Аксесуар до ноутбука", "en": "Laptop Accessory" },
            "slug": "laptop-accessory",
            "images": [
              {
                "filePath": "https://pub-...r2.dev/uploads/...",
                "isMain": true
              }
            ]
          }
        }
      ]
    }
  ],
  "metadata": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

> [!NOTE]
> Без `include=categories` items endpoints не повертають category tree context.

> [!CAUTION]
> **БЕЗПЕКА (XSS Prevention)**: Поле `content` може містити сирий HTML-код, доданий адміністратором. 
> При відображенні цього поля на вашій вітрині (наприклад, через `dangerouslySetInnerHTML` у React), ви **ЗОБОВ'ЯЗАНІ** використовувати бібліотеку-санітайзер (наприклад, `DOMPurify` або `sanitize-html`) для запобігання XSS-атакам на ваших користувачів.

**Типи зв'язків (`linkedItems[].type`)**:

| Тип | Назва | Опис |
| :--- | :--- | :--- |
| `cross_sell` | **Cross-sell** (Супутні) | Товари, які доповнюють основний. Наприклад: до телефону — чохол, до стрижки — шампунь. |
| `upsell` | **Upsell** (Апсейл) | Більш дорога або просунута версія товару. Наприклад: до пакету "Стандарт" — пакет "Преміум". |
| `portfolio_photo` | **Portfolio** (Роботи) | Фотографії результатів (кейсів) для конкретної послуги. Використовується для галереї на сторінці послуги. |
| `accessory` | **Accessory** (Аксесуари) | Запчастини або функціональні додатки, необхідні для роботи основного пристрою. |
| `related` | **Related** (Подібні) | Схожі товари, які можуть зацікавити користувача, якщо цей йому не підходить. |

---

### 2.1. Отримати один товар (за slug) 📄

**URL**: `GET /api/public/v1/items/[slug]` (або застарілий `/api/public/items/[slug]`)

**Параметри запиту (Query Parameters):**
- `include` (string) - Додаткові вкладені дані. Наразі підтримується значення `categories`.

**Приклад запиту:**
`GET /api/public/v1/items/macbook-pro`

**Формат відповіді (Success 200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "cuid...",
    "title": { "uk": "MacBook Pro", "en": "MacBook Pro" },
    "slug": "macbook-pro",
    "description": { "uk": "Опис...", "en": "Desc..." },
    "content": null,
    "price": "1500.00",
    "attributes": { "color": "Space Gray", "ram": "16GB" },
    "images": [],
    "linkedItems": []
  }
}
```

> [!IMPORTANT]
> `GET /api/public/v1/items/[slug]` більше не повертає `categories` за замовчуванням. Для category tree context треба явно додати `include=categories`.

### 2.2. Category Context для item через `include=categories`

Щоб отримати активні категорії item-а разом з їхнім активним lineage, викликайте:

- `GET /api/public/v1/items?include=categories`
- `GET /api/public/v1/items/[slug]?include=categories`

У цьому режимі кожен item отримує поле:

```json
{
  "categories": [
    {
      "id": "cuid...",
      "title": { "uk": "Стрижки", "en": "Haircuts" },
      "slug": "haircuts",
      "parentId": "cuid-parent",
      "position": 10,
      "imageUrl": null,
      "ancestors": [
        {
          "id": "cuid-root",
          "title": { "uk": "Послуги", "en": "Services" },
          "slug": "services",
          "parentId": null,
          "position": 0,
          "imageUrl": null
        }
      ]
    }
  ]
}
```

Правила побудови `categories`:
- Повертаються тільки активні direct categories, до яких реально прив'язаний item.
- `ancestors` ідуть у порядку `root -> direct parent`.
- Якщо parent неактивний або відсутній, lineage на ньому обривається.
- Якщо item не має жодної активної категорії, повертається `categories: []`.

---

## 3. Отримати фільтри (Атрибути) для категорії ⚙️
Повертає всі доступні атрибути (опції фільтрації) для конкретної категорії. Зручно для побудови UI фільтрів на вітрині (напр. чекбокси "Колір", "Розмір").

**URL**: `GET /api/public/v1/filters` (або застарілий `/api/public/filters`)

**Параметри запиту (Query Parameters):**
- `categorySlug` (string) - **Обов'язково**. Slug категорії, для якої треба отримати фільтри.
- `locale` (string) - Необов'язково. Мова для перекладу назв атрибутів і опцій (за замовчуванням: `uk`).

**Приклад запиту:**
`GET /api/public/filters?categorySlug=laptops&locale=uk`

**Формат відповіді (Success 200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "ram_size",
      "name": "Об'єм оперативної пам'яті",
      "type": "SELECT",
      "options": [
        {
          "id": "cuid...",
          "slug": "8gb",
          "value": "8 ГБ"
        },
        {
          "id": "cuid...",
          "slug": "16gb",
          "value": "16 ГБ"
        }
      ]
    }
  ]
}
```

---

## 5. Отримати налаштування та локалі сайту 🌐
Повертає глобальні налаштування для конкретного магазину: базову мову, контактну інформацію (разом зі статусом активності), посилання на соцмережі та доступні в системі мови (локалі). Це корисно для динамічної генерації футера або перемикача мов на клієнті.

**URL**: `GET /api/public/v1/settings` (або застарілий `/api/public/settings`)

**Параметри запиту (Query Parameters):**
*Немає*

**Формат відповіді (Success 200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "global",
    "storeId": "cuid...",
    ...
    "appearance": {
      "templateKey": "beauty-salon",
      "themeKey": "beauty-salon-classic",
      "tokens": {
        "primaryColor": "#db2777",
        "fontFamily": "'Playfair Display', serif",
        "buttonStyle": "pill",
        "heroOverlay": 0.3,
        "heroBackgroundImage": null,
        "logoUrl": null
      },
      "layout": {
        "blocks": ["hero", "services", "photoGallery", "contacts"]
      },
      "sectionVariants": {
        "services": "cards",
        "photoGallery": "masonry"
      },
      "themeData": {}
    },
    "workingHours": {
      "byAppointment": false,
      "days": [
        { "day": "monday", "open": "09:00", "close": "18:00", "isClosed": false },
        ...
      ]
    },
    ...
  }
}
```

### Деталі графіка роботи (`workingHours`)

Об'єкт `workingHours` містить параметри роботи магазину:

- `byAppointment` (boolean) — **"Тільки за записом"** (або "Змінний графік"). Якщо `true`, це означає, що магазин працює за домовленістю, а не за жорстким графіком.
- `days` (array) — Масив з 7 об'єктів (по одному на кожен день тижня):
    - `day` (string) — Назва дня (`monday`, `tuesday` тощо).
    - `open` (string) — Час відкриття у форматі `HH:MM` (наприклад, `"09:00"`).
    - `close` (string) — Час закриття у форматі `HH:MM` (наприклад, `"18:00"`).
    - `isClosed` (boolean) — Чи є цей день вихідним. Якщо `true`, час роботи зазвичай ігнорується.

---

## 4. Надіслати повідомлення зворотного зв'яка ✉️
Дозволяє відправляти повідомлення з контактних форм вашого сайту (або інших додатків) безпосередньо в розділ "Повідомлення" в адмін-панелі вашого магазину/проекту.

**URL**: `POST /api/public/v1/messages` (або застарілий `/api/public/messages`)

**Тіло запиту (Request Body - JSON):**
- `name` (string, **Обов'язково**) - Ім'я відправника
- `email` (string, **Обов'язково**) - Email для зв'язку (повинен містити `@`)
- `phone` (string, Необов'язково) - Контактний номер телефону
- `subject` (string, Необов'язково) - Тема повідомлення
- `message` (string, **Обов'язково**) - Текст самого повідомлення

**Приклад запиту:**
```http
POST /api/public/v1/messages
Content-Type: application/json
x-public-api-key: <Ваш_API_Key>

{
  "name": "Іван Іваненко",
  "email": "ivan@example.com",
  "phone": "+380501234567",
  "subject": "Запис на консультацію",
  "message": "Доброго дня, хотів би дізнатися ціни на послуги."
}
```

**Формат відповіді (Success 201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "cuid...",
    "message": "Message successfully received"
  }
}
```

---

## 6. Помилки (Errors) ❌

У разі помилки API повертає відповідний HTTP статус та JSON з описом:

**401 Unauthorized** (Ключ відсутній або невалідний):
```json
{
  "success": false,
  "error": "API Key is missing" // або "Invalid API Key format", "CORS Error..."
}
```

**400 Bad Request** (Відсутній обов'язковий параметр, напр. у `/filters`):
```json
{
  "success": false,
  "error": "categorySlug is required"
}
```

**403 Forbidden** (Сайт існує, але зараз недоступний публічно):
```json
{
  "success": false,
  "error": "This site is temporarily unavailable due to maintenance.",
  "code": "SITE_MAINTENANCE",
  "mode": "MAINTENANCE",
  "source": "manual",
  "message": null,
  "until": null
}
```

**500 Internal Server Error** (Помилка на сервері):
```json
{
  "success": false,
  "error": "Internal Server Error"
}
```
