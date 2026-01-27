# Инструкция по запуску проекта Flower Shop

## Архитектура

- **Frontend**: Next.js 16 + React 19 + Tailwind CSS (папка `app/`)
- **Backend**: Laravel 11 + PHP 8.3 (папка `backend/`)
- **Database**: PostgreSQL 16
- **Cache**: Redis 7

## Предварительные требования

- Docker и Docker Compose
- Или: PostgreSQL 16, PHP 8.3, Node.js 22, pnpm

## Быстрый старт (Docker)

### 1. Запуск окружения

```bash
# Запустить все сервисы
docker-compose up -d

# Проверить статус
docker-compose ps
```

### 2. Настройка Laravel

```bash
# Войти в контейнер Laravel
docker-compose exec laravel bash

# Выполнить миграции
php artisan migrate

# Создать тестовые данные (после создания Seeders)
php artisan db:seed
```

### 3. Доступ к приложению

- **Frontend (Next.js)**: http://localhost:3000
- **Backend API (Laravel)**: http://localhost:8000
- **API Health Check**: http://localhost:8000/api/health

## Локальный запуск (без Docker)

### 1. Установка PostgreSQL

```bash
# Ubuntu/Debian
sudo apt install postgresql-16

# Создать базу данных
sudo -u postgres psql
CREATE DATABASE flowershop;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE flowershop TO postgres;
\q
```

### 2. Настройка Backend (Laravel)

```bash
cd backend

# Установить зависимости
composer install

# Скопировать .env
cp .env.example .env

# Сгенерировать ключ приложения
php artisan key:generate

# Выполнить миграции
php artisan migrate

# Запустить dev сервер
php artisan serve
```

Backend будет доступен на http://localhost:8000

### 3. Настройка Frontend (Next.js)

```bash
cd app

# Установить зависимости
pnpm install

# Запустить dev сервер
pnpm dev
```

Frontend будет доступен на http://localhost:3000

## Структура проекта

```
prototype-flower-shop/
├── backend/                    # Laravel 11 API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/   # API Controllers
│   │   │   ├── Requests/      # Form Requests
│   │   │   └── Resources/     # API Resources
│   │   ├── Models/            # Eloquent Models
│   │   └── Services/          # Business Logic
│   ├── database/
│   │   ├── migrations/        # 12 таблиц БД
│   │   └── seeders/           # Тестовые данные
│   ├── routes/
│   │   ├── api.php            # API роуты
│   │   └── web.php
│   └── .env                   # Конфигурация
│
├── app/                       # Next.js 16 Frontend
│   ├── app/                   # App Router
│   │   ├── page.tsx           # Главная
│   │   ├── catalog/           # Каталог
│   │   ├── product/[id]/      # Карточка товара
│   │   └── cart/              # Корзина
│   ├── public/
│   └── package.json
│
├── docker-compose.yml         # Docker окружение
└── README.md                  # Документация
```

## База данных (12 таблиц)

1. **users** - Пользователи (клиенты, админы, менеджеры)
2. **categories** - Категории товаров (древовидная структура)
3. **products** - Товары (букеты, растения)
4. **orders** - Заказы
5. **order_items** - Позиции заказа
6. **order_history** - История изменения статусов
7. **addresses** - Адреса доставки
8. **reviews** - Отзывы на товары
9. **promo_codes** - Промокоды
10. **pages** - CMS страницы
11. **blog_posts** - Новости/блог
12. **promotions** - Акции и баннеры

## API Endpoints

### Публичные

- `GET /api/health` - Health check
- `GET /api/v1/products` - Список товаров
- `GET /api/v1/products/{id}` - Детали товара
- `GET /api/v1/categories` - Категории
- `GET /api/v1/reviews` - Отзывы

### Защищенные (требуют авторизации)

- `GET /api/user` - Текущий пользователь
- `POST /api/orders` - Создать заказ
- `GET /api/orders` - Мои заказы

## Следующие шаги

1. ✅ Laravel backend настроен
2. ✅ База данных (12 миграций) создана
3. ✅ Docker окружение готово
4. ⏳ Создать Eloquent Models и Relations
5. ⏳ Создать Seeders для тестовых данных
6. ⏳ Реализовать API Controllers
7. ⏳ Интегрировать Next.js с API

## Полезные команды

### Docker

```bash
# Просмотр логов
docker-compose logs -f

# Остановить все сервисы
docker-compose down

# Пересобрать контейнеры
docker-compose up -d --build

# Очистить volumes
docker-compose down -v
```

### Laravel

```bash
# Откатить миграции
php artisan migrate:rollback

# Пересоздать БД
php artisan migrate:fresh --seed

# Очистить кеш
php artisan cache:clear
php artisan config:clear

# Создать контроллер
php artisan make:controller Api/ProductController --api

# Создать модель
php artisan make:model Product
```

### Next.js

```bash
# Сборка production
pnpm build

# Запуск production
pnpm start

# Проверка типов
pnpm type-check
```

## Проблемы и решения

### PostgreSQL не подключается

```bash
# Проверить статус сервиса
docker-compose ps postgres

# Посмотреть логи
docker-compose logs postgres

# Пересоздать контейнер
docker-compose restart postgres
```

### Laravel ошибки миграций

```bash
# Проверить подключение к БД
php artisan tinker
>>> DB::connection()->getPdo();

# Откатить и пересоздать
php artisan migrate:fresh
```

## Контакты

Проект создан согласно плану реализации (8 недель).
Текущая фаза: **Фаза 0 - Setup & Infrastructure** ✅ 95%
