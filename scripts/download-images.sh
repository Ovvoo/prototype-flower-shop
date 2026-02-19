#!/usr/bin/env bash
# =============================================================================
# download-images.sh — Скачивание и оптимизация изображений продуктов
#
# Использование:
#   ./scripts/download-images.sh           # Пропустить существующие
#   ./scripts/download-images.sh --force   # Перезаписать все
#   ./scripts/download-images.sh --dry-run # Показать план без скачивания
#
# Источник конфигурации: scripts/images-config.json
# Назначение:           app/public/images/products/
#
# Требования: curl, jq, cwebp (apt install jq webp)
#
# 2026 Pipeline оптимизации:
#   1. Скачать JPEG 1200x1200 с Unsplash
#   2. Конвертировать в WebP q=82 (≈60% меньше JPEG)
#   3. Next.js Image конвертирует в AVIF (ещё ≈30%) в рантайме
#   Итог: пользователь получает AVIF ~80-120KB вместо JPEG ~500KB
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CONFIG="$SCRIPT_DIR/images-config.json"
OUTPUT_DIR="$PROJECT_ROOT/app/public/images/products"
TEMP_DIR="/tmp/flower-shop-images"

# Параметры Unsplash запроса
IMG_WIDTH=1200
IMG_HEIGHT=1200
UNSPLASH_QUALITY=90   # Высокое качество для скачивания (оптимизируем сами)

# Параметры WebP конвертации (2026 best practices)
WEBP_QUALITY=82       # 82% = отличное качество, ~60% размер от JPEG
WEBP_METHOD=6         # Максимальное сжатие (медленнее, но один раз)

FORCE=false
DRY_RUN=false

for arg in "$@"; do
  case $arg in
    --force)   FORCE=true ;;
    --dry-run) DRY_RUN=true ;;
    *)
      echo "Неизвестный аргумент: $arg"
      echo "Использование: $0 [--force] [--dry-run]"
      exit 1
      ;;
  esac
done

# ─── Проверка зависимостей ─────────────────────────────────────────────────
check_dep() {
  if ! command -v "$1" &>/dev/null; then
    echo "❌ Требуется $1. Установите: apt-get install -y $2"
    exit 1
  fi
}
check_dep jq jq
check_dep curl curl
check_dep cwebp webp

mkdir -p "$OUTPUT_DIR" "$TEMP_DIR"

echo "════════════════════════════════════════════════════════════"
echo "  🌸 Загрузка и оптимизация изображений"
echo "  Конфиг:  $CONFIG"
echo "  Папка:   $OUTPUT_DIR"
echo "  Pipeline: Unsplash JPEG → WebP q${WEBP_QUALITY} → [Next.js → AVIF]"
echo "  Режим:   $([ "$FORCE" = true ] && echo "Принудительная перезапись" || echo "Пропуск существующих")"
echo "════════════════════════════════════════════════════════════"

TOTAL=0
DOWNLOADED=0
SKIPPED=0
FAILED=0

PRODUCT_COUNT=$(jq '.products | length' "$CONFIG")

for i in $(seq 0 $((PRODUCT_COUNT - 1))); do
  SLUG=$(jq -r ".products[$i].slug" "$CONFIG")
  IMAGE_COUNT=$(jq ".products[$i].images | length" "$CONFIG")

  echo ""
  echo "📦 $SLUG"

  for j in $(seq 0 $((IMAGE_COUNT - 1))); do
    PHOTO_ID=$(jq -r ".products[$i].images[$j].id" "$CONFIG")
    FILENAME=$(jq -r ".products[$i].images[$j].file" "$CONFIG")
    OUTPUT_FILE="$OUTPUT_DIR/$FILENAME"
    TEMP_JPEG="$TEMP_DIR/${FILENAME%.webp}.jpg"
    TOTAL=$((TOTAL + 1))

    UNSPLASH_URL="https://images.unsplash.com/${PHOTO_ID}?w=${IMG_WIDTH}&h=${IMG_HEIGHT}&fit=crop&auto=format&q=${UNSPLASH_QUALITY}"

    if [ "$DRY_RUN" = true ]; then
      echo "  [DRY-RUN] $FILENAME ← $PHOTO_ID"
      continue
    fi

    if [ -f "$OUTPUT_FILE" ] && [ "$FORCE" = false ]; then
      SIZE=$(du -k "$OUTPUT_FILE" | cut -f1)
      echo "  ⏭  $FILENAME (${SIZE}KB — пропущен)"
      SKIPPED=$((SKIPPED + 1))
      continue
    fi

    # Шаг 1: Скачать JPEG с Unsplash
    echo -n "  ⬇  Скачиваю $PHOTO_ID... "

    HTTP_CODE=$(curl \
      --silent \
      --location \
      --retry 3 \
      --retry-delay 2 \
      --connect-timeout 15 \
      --max-time 45 \
      --output "$TEMP_JPEG" \
      --write-out "%{http_code}" \
      --user-agent "FlowerShop/1.0 (product catalog images)" \
      "$UNSPLASH_URL")

    if [ "$HTTP_CODE" != "200" ] || [ ! -s "$TEMP_JPEG" ]; then
      echo "❌ HTTP $HTTP_CODE"
      rm -f "$TEMP_JPEG"
      FAILED=$((FAILED + 1))
      continue
    fi

    ORIG_SIZE=$(du -k "$TEMP_JPEG" | cut -f1)
    echo -n "${ORIG_SIZE}KB → WebP... "

    # Шаг 2: Конвертировать в WebP
    if cwebp \
        -q "$WEBP_QUALITY" \
        -m "$WEBP_METHOD" \
        -mt \
        -resize "$IMG_WIDTH" "$IMG_HEIGHT" \
        "$TEMP_JPEG" \
        -o "$OUTPUT_FILE" \
        2>/dev/null; then

      WEBP_SIZE=$(du -k "$OUTPUT_FILE" | cut -f1)
      RATIO=$(( (ORIG_SIZE - WEBP_SIZE) * 100 / ORIG_SIZE ))
      echo "✅ ${WEBP_SIZE}KB (-${RATIO}%)"
      DOWNLOADED=$((DOWNLOADED + 1))
    else
      # Fallback: если cwebp упал — сохранить JPEG как есть
      cp "$TEMP_JPEG" "$OUTPUT_FILE"
      echo "⚠️  WebP failed, сохранён JPEG"
      DOWNLOADED=$((DOWNLOADED + 1))
    fi

    rm -f "$TEMP_JPEG"

    # Пауза между запросами (rate limit Unsplash)
    sleep 0.3
  done
done

rm -rf "$TEMP_DIR"

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  Итого: $TOTAL изображений"
echo "  ✅ Обработано: $DOWNLOADED"
echo "  ⏭  Пропущено:  $SKIPPED"
echo "  ❌ Ошибки:     $FAILED"
TOTAL_SIZE=$(du -sh "$OUTPUT_DIR" 2>/dev/null | cut -f1 || echo "?")
echo "  💾 Размер папки: $TOTAL_SIZE"
echo "════════════════════════════════════════════════════════════"

if [ "$FAILED" -gt 0 ]; then
  echo "⚠️  Не удалось загрузить $FAILED изображений. Запустите с --force."
  exit 1
fi

echo "✨ Готово! Изображения в: $OUTPUT_DIR"
