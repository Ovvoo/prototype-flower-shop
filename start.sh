#!/bin/bash
# Flower Shop — запуск всех сервисов
# Использование: ./start.sh

set -e

PROJECT="/root/projects/prototype-flower-shop"
BACKEND="$PROJECT/backend"
FRONTEND="$PROJECT/app"

echo "🌸 Flower Shop — запуск сервисов"
echo "================================="

# 1. PostgreSQL
if pg_ctlcluster 16 main status 2>/dev/null | grep -q "online"; then
  echo "✅ PostgreSQL уже запущен"
else
  pg_ctlcluster 16 main start
  echo "✅ PostgreSQL запущен"
fi

# 2. Mailpit (перехватчик email, UI: http://localhost:8025)
if curl -s http://localhost:8025/api/v1/info > /dev/null 2>&1; then
  echo "✅ Mailpit уже запущен"
else
  mailpit &>/tmp/mailpit.log &
  sleep 1
  echo "✅ Mailpit запущен  →  http://localhost:8025"
fi

# 3. Laravel API
if curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
  echo "✅ Laravel API уже запущен"
else
  cd "$BACKEND"
  php artisan config:clear > /dev/null
  php artisan serve --port=8000 &>/tmp/laravel.log &
  sleep 2
  echo "✅ Laravel API запущен  →  http://localhost:8000"
fi

# 4. Queue worker
if ps aux | grep -q "[p]hp artisan queue:work"; then
  echo "✅ Queue worker уже запущен"
else
  cd "$BACKEND"
  php artisan queue:work --sleep=3 --tries=3 --max-time=3600 &>/tmp/queue.log &
  sleep 1
  echo "✅ Queue worker запущен"
fi

# 5. Next.js Frontend
if curl -s http://localhost:3001 > /dev/null 2>&1 || curl -s http://localhost:3000 > /dev/null 2>&1; then
  echo "✅ Next.js уже запущен"
else
  cd "$FRONTEND"
  pnpm dev &>/tmp/nextjs.log &
  sleep 3
  echo "✅ Next.js запущен  →  http://localhost:3001"
fi

echo ""
echo "================================="
echo "🌸 Всё запущено!"
echo ""
echo "  Магазин:   http://localhost:3001"
echo "  API:       http://localhost:8000/api/health"
echo "  Email UI:  http://localhost:8025"
echo ""
echo "📋 Логи:"
echo "  Laravel:  tail -f /tmp/laravel.log"
echo "  Queue:    tail -f /tmp/queue.log"
echo "  Mailpit:  tail -f /tmp/mailpit.log"
echo "  Next.js:  tail -f /tmp/nextjs.log"
