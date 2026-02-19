/**
 * Mock Data for Demo Mode
 * Реалистичные данные цветочного магазина для демонстрации без бэкенда
 */

import type { Product, Category, AvailableFilters, PaginatedResponse } from '@/lib/types';

// ─── Unsplash Images ───────────────────────────────────────────

const img = (id: string, w = 600, h = 600) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&q=80`;

// ─── Categories ────────────────────────────────────────────────

export const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Букеты',
    slug: 'bukety',
    description: 'Авторские букеты из свежих цветов',
    image_url: img('photo-1487530811176-3780de880c2d'),
    parent_id: null,
    sort_order: 1,
    is_active: true,
    products_count: 6,
    children: [],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'Комнатные растения',
    slug: 'komnatnye-rasteniya',
    description: 'Живые растения для дома и офиса',
    image_url: img('photo-1494336956603-39a3f0e3a180'),
    parent_id: null,
    sort_order: 2,
    is_active: true,
    products_count: 3,
    children: [],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 3,
    name: 'Подарки',
    slug: 'podarki',
    description: 'Подарочные наборы и корзины',
    image_url: img('photo-1549488344-cbb6c34cf08b'),
    parent_id: null,
    sort_order: 3,
    is_active: true,
    products_count: 2,
    children: [],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 4,
    name: 'Свадебная флористика',
    slug: 'svadebnaya-floristika',
    description: 'Букеты невесты и свадебные композиции',
    image_url: img('photo-1519741497674-611481863552'),
    parent_id: null,
    sort_order: 4,
    is_active: true,
    products_count: 2,
    children: [],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
];

// ─── Products ──────────────────────────────────────────────────

const now = '2026-02-19T10:00:00Z';

export const mockProducts: Product[] = [
  // ── Букеты ──
  {
    id: 1,
    name: 'Букет «Нежность»',
    slug: 'buket-nezhnost',
    description: 'Изысканный букет из 25 нежно-розовых роз с эвкалиптом. Идеальный подарок для любимого человека. Розы сорта Pink Avalanche отличаются крупными бутонами и нежным ароматом.',
    price: 3990,
    compare_at_price: 4500,
    discount_percent: 11,
    images: [
      img('photo-1490750967868-88aa4f44baee'),
      img('photo-1455659817273-f96807779a8a'),
    ],
    main_image: img('photo-1490750967868-88aa4f44baee'),
    category: mockCategories[0],
    stock: 12,
    sku: 'BKT-001',
    weight: 800,
    height: 45,
    flower_types: ['Роза', 'Эвкалипт'],
    colors: ['Розовый'],
    occasions: ['День рождения', 'Романтика'],
    is_featured: true,
    is_new: false,
    is_active: true,
    average_rating: 4.8,
    reviews_count: 24,
    views_count: 1250,
    sales_count: 87,
    meta_title: 'Букет Нежность — 25 розовых роз',
    meta_description: 'Купить букет из 25 розовых роз с доставкой по Москве',
    created_at: '2026-01-15T10:00:00Z',
    updated_at: now,
  },
  {
    id: 2,
    name: 'Букет «Страсть»',
    slug: 'buket-strast',
    description: 'Роскошный букет из 51 красной розы сорта Freedom. Классика, которая никогда не выходит из моды. Каждая роза тщательно отобрана флористом.',
    price: 7990,
    compare_at_price: null,
    discount_percent: null,
    images: [
      img('photo-1444021465936-c6ca81d39b84'),
      img('photo-1490750967868-88aa4f44baee'),
    ],
    main_image: img('photo-1444021465936-c6ca81d39b84'),
    category: mockCategories[0],
    stock: 5,
    sku: 'BKT-002',
    weight: 1500,
    height: 55,
    flower_types: ['Роза'],
    colors: ['Красный'],
    occasions: ['Романтика', '14 февраля'],
    is_featured: true,
    is_new: false,
    is_active: true,
    average_rating: 4.9,
    reviews_count: 42,
    views_count: 2100,
    sales_count: 134,
    meta_title: null,
    meta_description: null,
    created_at: '2026-01-10T10:00:00Z',
    updated_at: now,
  },
  {
    id: 3,
    name: 'Букет «Весеннее настроение»',
    slug: 'buket-vesennee-nastroenie',
    description: 'Яркий весенний букет из 35 разноцветных тюльпанов. Микс из красных, жёлтых и розовых тюльпанов подарит весеннее настроение в любое время года.',
    price: 2990,
    compare_at_price: 3500,
    discount_percent: 15,
    images: [
      img('photo-1487530811176-3780de880c2d'),
    ],
    main_image: img('photo-1487530811176-3780de880c2d'),
    category: mockCategories[0],
    stock: 20,
    sku: 'BKT-003',
    weight: 600,
    height: 40,
    flower_types: ['Тюльпан'],
    colors: ['Красный', 'Жёлтый', 'Розовый'],
    occasions: ['8 марта', 'День рождения'],
    is_featured: true,
    is_new: true,
    is_active: true,
    average_rating: 4.7,
    reviews_count: 18,
    views_count: 980,
    sales_count: 62,
    meta_title: null,
    meta_description: null,
    created_at: '2026-02-01T10:00:00Z',
    updated_at: now,
  },
  {
    id: 4,
    name: 'Букет «Роскошь пионов»',
    slug: 'buket-roskosh-pionov',
    description: 'Невероятно ароматный букет из 15 крупных пионов Sarah Bernhardt. Пионы — символ благополучия и романтики. Сезонный букет, доступен с мая по июль.',
    price: 5490,
    compare_at_price: null,
    discount_percent: null,
    images: [
      img('photo-1508610048659-a06b669e3321'),
    ],
    main_image: img('photo-1508610048659-a06b669e3321'),
    category: mockCategories[0],
    stock: 8,
    sku: 'BKT-004',
    weight: 900,
    height: 42,
    flower_types: ['Пион'],
    colors: ['Розовый', 'Белый'],
    occasions: ['Романтика', 'День рождения'],
    is_featured: false,
    is_new: false,
    is_active: true,
    average_rating: 5.0,
    reviews_count: 8,
    views_count: 650,
    sales_count: 31,
    meta_title: null,
    meta_description: null,
    created_at: '2026-01-20T10:00:00Z',
    updated_at: now,
  },
  {
    id: 5,
    name: 'Букет «Солнечный день»',
    slug: 'buket-solnechnyj-den',
    description: 'Жизнерадостный букет из 11 подсолнухов с зеленью. Яркие подсолнухи символизируют радость и оптимизм. Отличный подарок для поднятия настроения.',
    price: 2490,
    compare_at_price: null,
    discount_percent: null,
    images: [
      img('photo-1548586196-aa5803b77379'),
    ],
    main_image: img('photo-1548586196-aa5803b77379'),
    category: mockCategories[0],
    stock: 15,
    sku: 'BKT-005',
    weight: 700,
    height: 50,
    flower_types: ['Подсолнух'],
    colors: ['Жёлтый'],
    occasions: ['День рождения', 'Выздоравливай'],
    is_featured: false,
    is_new: true,
    is_active: true,
    average_rating: 4.6,
    reviews_count: 11,
    views_count: 520,
    sales_count: 28,
    meta_title: null,
    meta_description: null,
    created_at: '2026-02-05T10:00:00Z',
    updated_at: now,
  },
  {
    id: 6,
    name: 'Букет «Белое облако»',
    slug: 'buket-beloe-oblako',
    description: 'Элегантный монобукет из 19 белых лилий. Лилии источают тонкий аромат и выглядят безупречно. Идеальный выбор для торжественных случаев.',
    price: 4290,
    compare_at_price: 4990,
    discount_percent: 14,
    images: [
      img('photo-1561181286-d3fee7d55364'),
    ],
    main_image: img('photo-1561181286-d3fee7d55364'),
    category: mockCategories[0],
    stock: 7,
    sku: 'BKT-006',
    weight: 1000,
    height: 55,
    flower_types: ['Лилия'],
    colors: ['Белый'],
    occasions: ['Свадьба', 'Юбилей'],
    is_featured: true,
    is_new: false,
    is_active: true,
    average_rating: 4.9,
    reviews_count: 15,
    views_count: 870,
    sales_count: 45,
    meta_title: null,
    meta_description: null,
    created_at: '2026-01-12T10:00:00Z',
    updated_at: now,
  },
  // ── Комнатные растения ──
  {
    id: 7,
    name: 'Орхидея Фаленопсис',
    slug: 'orhideya-falenopsis',
    description: 'Элегантная орхидея Фаленопсис в декоративном кашпо. Два цветоноса с крупными белыми цветками. Неприхотлива в уходе — цветёт до 3 месяцев.',
    price: 2990,
    compare_at_price: null,
    discount_percent: null,
    images: [
      img('photo-1563241527-3004b7be0ffd'),
    ],
    main_image: img('photo-1563241527-3004b7be0ffd'),
    category: mockCategories[1],
    stock: 10,
    sku: 'PLT-001',
    weight: 1200,
    height: 60,
    flower_types: ['Орхидея'],
    colors: ['Белый'],
    occasions: ['Новоселье', 'День рождения'],
    is_featured: true,
    is_new: false,
    is_active: true,
    average_rating: 4.7,
    reviews_count: 19,
    views_count: 1100,
    sales_count: 56,
    meta_title: null,
    meta_description: null,
    created_at: '2026-01-08T10:00:00Z',
    updated_at: now,
  },
  {
    id: 8,
    name: 'Суккулент микс в кашпо',
    slug: 'sukkulent-miks',
    description: 'Композиция из 5 разных суккулентов в стильном бетонном кашпо. Минимальный уход — полив раз в 2 недели. Модный элемент декора для дома и офиса.',
    price: 1790,
    compare_at_price: null,
    discount_percent: null,
    images: [
      img('photo-1459411552884-841db9b3cc2a'),
    ],
    main_image: img('photo-1459411552884-841db9b3cc2a'),
    category: mockCategories[1],
    stock: 18,
    sku: 'PLT-002',
    weight: 800,
    height: 15,
    flower_types: ['Суккулент'],
    colors: ['Зелёный'],
    occasions: ['Новоселье'],
    is_featured: false,
    is_new: true,
    is_active: true,
    average_rating: 4.5,
    reviews_count: 7,
    views_count: 430,
    sales_count: 22,
    meta_title: null,
    meta_description: null,
    created_at: '2026-02-10T10:00:00Z',
    updated_at: now,
  },
  {
    id: 9,
    name: 'Фикус Бенджамина',
    slug: 'fikus-bendzhamina',
    description: 'Роскошный фикус Бенджамина высотой 90 см в плетёной корзине. Очищает воздух и создаёт уют. Идеален для гостиной или офиса.',
    price: 3490,
    compare_at_price: 3990,
    discount_percent: 13,
    images: [
      img('photo-1494336956603-39a3f0e3a180'),
    ],
    main_image: img('photo-1494336956603-39a3f0e3a180'),
    category: mockCategories[1],
    stock: 6,
    sku: 'PLT-003',
    weight: 3500,
    height: 90,
    flower_types: ['Фикус'],
    colors: ['Зелёный'],
    occasions: ['Новоселье'],
    is_featured: false,
    is_new: false,
    is_active: true,
    average_rating: 4.4,
    reviews_count: 5,
    views_count: 310,
    sales_count: 14,
    meta_title: null,
    meta_description: null,
    created_at: '2026-01-18T10:00:00Z',
    updated_at: now,
  },
  // ── Подарки ──
  {
    id: 10,
    name: 'Набор «Сладкая жизнь»',
    slug: 'nabor-sladkaya-zhizn',
    description: 'Подарочный набор: мини-букет из 7 роз, бельгийский шоколад Godiva, свеча с ароматом ванили. Всё упаковано в фирменную коробку с атласным бантом.',
    price: 4990,
    compare_at_price: 5900,
    discount_percent: 15,
    images: [
      img('photo-1549488344-cbb6c34cf08b'),
    ],
    main_image: img('photo-1549488344-cbb6c34cf08b'),
    category: mockCategories[2],
    stock: 9,
    sku: 'GFT-001',
    weight: 1500,
    height: 30,
    flower_types: ['Роза'],
    colors: ['Красный'],
    occasions: ['День рождения', '14 февраля'],
    is_featured: true,
    is_new: false,
    is_active: true,
    average_rating: 4.8,
    reviews_count: 13,
    views_count: 780,
    sales_count: 41,
    meta_title: null,
    meta_description: null,
    created_at: '2026-01-22T10:00:00Z',
    updated_at: now,
  },
  {
    id: 11,
    name: 'Корзина с фруктами и цветами',
    slug: 'korzina-frukty-cvety',
    description: 'Роскошная подарочная корзина: сезонные фрукты (манго, виноград, клубника), мини-букет, бутылка просекко. Идеальный корпоративный подарок.',
    price: 6490,
    compare_at_price: null,
    discount_percent: null,
    images: [
      img('photo-1526047932273-341f2a7631f9'),
    ],
    main_image: img('photo-1526047932273-341f2a7631f9'),
    category: mockCategories[2],
    stock: 4,
    sku: 'GFT-002',
    weight: 3000,
    height: 35,
    flower_types: ['Роза', 'Хризантема'],
    colors: ['Розовый', 'Жёлтый'],
    occasions: ['Юбилей', 'Корпоратив'],
    is_featured: false,
    is_new: true,
    is_active: true,
    average_rating: 4.6,
    reviews_count: 6,
    views_count: 420,
    sales_count: 18,
    meta_title: null,
    meta_description: null,
    created_at: '2026-02-08T10:00:00Z',
    updated_at: now,
  },
  // ── Свадебная флористика ──
  {
    id: 12,
    name: 'Свадебный букет «Классика»',
    slug: 'svadebnyj-buket-klassika',
    description: 'Классический букет невесты из белых роз и пионов с каскадом зелени. Включает бутоньерку жениха. Индивидуальная сборка в день свадьбы.',
    price: 8990,
    compare_at_price: null,
    discount_percent: null,
    images: [
      img('photo-1519741497674-611481863552'),
    ],
    main_image: img('photo-1519741497674-611481863552'),
    category: mockCategories[3],
    stock: 3,
    sku: 'WED-001',
    weight: 600,
    height: 35,
    flower_types: ['Роза', 'Пион', 'Эвкалипт'],
    colors: ['Белый'],
    occasions: ['Свадьба'],
    is_featured: true,
    is_new: false,
    is_active: true,
    average_rating: 5.0,
    reviews_count: 10,
    views_count: 560,
    sales_count: 23,
    meta_title: null,
    meta_description: null,
    created_at: '2026-01-05T10:00:00Z',
    updated_at: now,
  },
  {
    id: 13,
    name: 'Букет невесты «Романтика»',
    slug: 'buket-nevesty-romantika',
    description: 'Воздушный букет невесты из лизиантусов и кустовых роз в пастельных тонах. Лёгкий и элегантный — идеален для летней свадьбы на природе.',
    price: 6990,
    compare_at_price: 7990,
    discount_percent: 13,
    images: [
      img('photo-1455659817273-f96807779a8a'),
    ],
    main_image: img('photo-1455659817273-f96807779a8a'),
    category: mockCategories[3],
    stock: 5,
    sku: 'WED-002',
    weight: 500,
    height: 30,
    flower_types: ['Лизиантус', 'Роза'],
    colors: ['Розовый', 'Белый'],
    occasions: ['Свадьба'],
    is_featured: false,
    is_new: true,
    is_active: true,
    average_rating: 4.9,
    reviews_count: 4,
    views_count: 340,
    sales_count: 12,
    meta_title: null,
    meta_description: null,
    created_at: '2026-02-12T10:00:00Z',
    updated_at: now,
  },
];

// ─── Available Filters ─────────────────────────────────────────

export const mockAvailableFilters: AvailableFilters = {
  flower_types: ['Роза', 'Тюльпан', 'Пион', 'Лилия', 'Подсолнух', 'Орхидея', 'Суккулент', 'Фикус', 'Хризантема', 'Лизиантус', 'Эвкалипт'],
  colors: ['Красный', 'Розовый', 'Белый', 'Жёлтый', 'Зелёный'],
  occasions: ['День рождения', 'Романтика', '14 февраля', '8 марта', 'Свадьба', 'Юбилей', 'Новоселье', 'Выздоравливай', 'Корпоратив'],
};

// ─── Content Pages ─────────────────────────────────────────────

export const mockPages = [
  {
    id: 1,
    title: 'О компании',
    slug: 'about',
    content: `<h2>Цветочный — ваш любимый цветочный магазин</h2>
<p>Мы работаем с 2020 года и за это время доставили более 50 000 букетов по Москве и области. Наша миссия — дарить радость и делать каждый день особенным.</p>
<h3>Почему выбирают нас?</h3>
<ul>
<li><strong>Свежие цветы</strong> — работаем напрямую с плантациями Эквадора, Голландии и Кении</li>
<li><strong>Быстрая доставка</strong> — от 2 часов по Москве, в день заказа</li>
<li><strong>Авторские букеты</strong> — каждый букет собирают профессиональные флористы</li>
<li><strong>Гарантия свежести</strong> — 7 дней или бесплатная замена</li>
</ul>
<h3>Наша команда</h3>
<p>В нашей команде 12 флористов с опытом от 5 лет. Мы постоянно обучаемся и следим за мировыми трендами флористики.</p>`,
    meta_title: 'О компании — Цветочный магазин',
    meta_description: 'Узнайте о цветочном магазине Цветочный — свежие цветы, быстрая доставка по Москве',
    cover_image: null,
    is_published: true,
    published_at: '2026-01-01T00:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 2,
    title: 'Доставка и оплата',
    slug: 'delivery',
    content: `<h2>Условия доставки</h2>
<h3>Москва</h3>
<p><strong>Бесплатная доставка</strong> при заказе от 3 000 ₽. Стоимость доставки при заказе до 3 000 ₽ — 500 ₽.</p>
<ul>
<li>Доставка за 2 часа — от 500 ₽</li>
<li>Доставка к точному времени — от 300 ₽</li>
<li>Стандартная доставка (в течение дня) — бесплатно от 3 000 ₽</li>
</ul>
<h3>Московская область</h3>
<p>Доставка в пределах 30 км от МКАД — от 500 ₽. Рассчитывается индивидуально.</p>
<h2>Способы оплаты</h2>
<ul>
<li><strong>Онлайн</strong> — банковская карта (Visa, Mastercard, МИР)</li>
<li><strong>При получении</strong> — наличными или картой курьеру</li>
<li><strong>СБП</strong> — перевод по номеру телефона</li>
</ul>`,
    meta_title: 'Доставка и оплата — Цветочный',
    meta_description: 'Бесплатная доставка цветов по Москве от 3000₽. Оплата картой или наличными.',
    cover_image: null,
    is_published: true,
    published_at: '2026-01-01T00:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 3,
    title: 'Контакты',
    slug: 'contacts',
    content: `<h2>Свяжитесь с нами</h2>
<p>Мы всегда рады помочь вам выбрать идеальный букет!</p>
<h3>Телефон</h3>
<p><strong>+7 (495) 123-45-67</strong> — ежедневно с 8:00 до 22:00</p>
<h3>Email</h3>
<p><strong>hello@flowershop.ru</strong></p>
<h3>Адрес шоурума</h3>
<p>Москва, ул. Цветочная, д. 1<br/>Ежедневно с 9:00 до 21:00</p>
<h3>Социальные сети</h3>
<ul>
<li>Telegram: @flowershop_msk</li>
<li>Instagram: @flowershop_msk</li>
<li>VK: vk.com/flowershop_msk</li>
</ul>`,
    meta_title: 'Контакты — Цветочный',
    meta_description: 'Телефон, адрес и время работы цветочного магазина',
    cover_image: null,
    is_published: true,
    published_at: '2026-01-01T00:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 4,
    title: 'Уход за цветами',
    slug: 'care',
    content: `<h2>Как продлить жизнь букету</h2>
<h3>Общие рекомендации</h3>
<ol>
<li>Подрежьте стебли на 2-3 см под углом 45°</li>
<li>Используйте чистую воду комнатной температуры</li>
<li>Добавьте пакетик подкормки (идёт в комплекте)</li>
<li>Меняйте воду каждые 2 дня</li>
<li>Держите букет вдали от прямых солнечных лучей и фруктов</li>
</ol>
<h3>Розы</h3>
<p>Розы любят прохладную воду. Удалите нижние листья, которые окажутся в воде. При правильном уходе стоят 7-14 дней.</p>
<h3>Тюльпаны</h3>
<p>Тюльпаны продолжают расти в вазе! Наливайте немного воды (5-7 см). Стоят 5-7 дней.</p>
<h3>Комнатные растения</h3>
<p>Следуйте инструкции по уходу, которая прилагается к каждому растению. Общее правило — лучше недолить, чем перелить.</p>`,
    meta_title: 'Уход за цветами — советы от флористов',
    meta_description: 'Советы по уходу за срезанными цветами и комнатными растениями',
    cover_image: null,
    is_published: true,
    published_at: '2026-01-01T00:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
];
