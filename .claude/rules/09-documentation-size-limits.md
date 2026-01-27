# Ограничения размера документации

> Основано на [Claude Code Best Practices](https://code.claude.com/docs/en/best-practices) от Anthropic

## Жесткие лимиты

| Тип документа | Максимум строк | Действие при превышении |
|---------------|----------------|------------------------|
| CLAUDE.md (root) | 80 | Вынести детали в @imports или skills |
| CLAUDE.md (nested) | 120 | Разбить на части |
| .claude/rules/*.md | 150 | Разбить на логические части |
| docs/API_*.md | 300 | Разбить по группам эндпоинтов |
| docs/DATABASE_*.md | 300 | Разбить по группам таблиц |
| docs/BACKLOG*.md | 300 | Создать новый файл с номером/датой |
| docs/COMPLETED_*.md | 300 | Создать новый файл с номером/датой |
| .claude/skills/*/SKILL.md | 500 | Вынести примеры в отдельные файлы |

## Принципы

### 1. Context Window Performance

**Проблема:** Claude's performance degrades as context fills
**Решение:** Keep all documentation concise and focused

### 2. Instruction Following

**Проблема:** Длинные файлы приводят к игнорированию инструкций
**Решение:** Если Claude игнорирует правило → файл слишком длинный

### 3. Only Non-Inferable Content

**Включать:**
- ✅ Команды, которые Claude не угадает
- ✅ Нестандартные архитектурные решения
- ✅ Специфичные для проекта gotchas

**Не включать:**
- ❌ Стандартные конвенции (Claude знает)
- ❌ Детальную API документацию (ссылка → docs/)
- ❌ Code snippets (устаревают)
- ❌ Описание каждого файла

## Стратегии разбиения

### BACKLOG и COMPLETED_TASKS

```
docs/
├── backlog/
│   ├── INDEX.md              # < 100 строк, оглавление
│   ├── BACKLOG_CRITICAL.md   # < 300 строк
│   ├── BACKLOG_HIGH.md       # < 300 строк
│   ├── BACKLOG_MEDIUM.md     # < 300 строк
│   └── BACKLOG_LOW.md        # < 300 строк
│
└── completed/
    ├── INDEX.md              # < 100 строк, оглавление
    ├── COMPLETED_2026-01.md  # < 300 строк (январь 2026)
    ├── COMPLETED_2026-02.md  # < 300 строк (февраль 2026)
    └── ...
```

### API Specification

```
docs/api/
├── API_INDEX.md              # < 100 строк, оглавление
├── API_PRODUCTS.md           # < 300 строк
├── API_ORDERS.md             # < 300 строк
├── API_CART.md               # < 300 строк
├── API_AUTH.md               # < 300 строк
├── API_ADMIN.md              # < 300 строк
└── API_WEBHOOKS.md           # < 300 строк
```

### Database Schema

```
docs/database/
├── DATABASE_INDEX.md         # < 100 строк, ER-diagram
├── DATABASE_USERS.md         # < 300 строк (users, addresses)
├── DATABASE_CATALOG.md       # < 300 строк (categories, products)
├── DATABASE_ORDERS.md        # < 300 строк (orders, order_items, history)
├── DATABASE_CONTENT.md       # < 300 строк (reviews, pages, blog, promos)
└── DATABASE_PROMO.md         # < 300 строк (promo_codes)
```

## Автоматическая ротация

### Правило для BACKLOG

Когда `docs/backlog/BACKLOG_*.md` превышает 280 строк:
1. Создать новый файл с следующим номером/категорией
2. Переместить низкоприоритетные задачи в новый файл
3. Обновить INDEX.md со ссылкой на новый файл

### Правило для COMPLETED_TASKS

Когда `docs/completed/COMPLETED_*.md` превышает 280 строк:
1. Создать новый файл с следующим месяцем
2. Обновить INDEX.md со ссылкой

## Импорты вместо копирования

```markdown
# CLAUDE.md

## Архитектура
См. @docs/api/API_INDEX.md для API спецификации
См. @docs/database/DATABASE_INDEX.md для схемы БД

## Правила
@.claude/rules/08-typescript-gotchas.md
@.claude/rules/07-modularity-components.md
```

## Проверка перед коммитом

```bash
# Проверить размеры документов
find docs/ .claude/ -name "*.md" -type f | while read f; do
  lines=$(wc -l < "$f")
  if [ "$lines" -gt 300 ]; then
    echo "⚠️  $f: $lines строк (лимит 300)"
  fi
done
```

## Когда нарушать правила

**Можно превысить лимит если:**
- Документ редко используется (архивы)
- Это автоматически генерируемый changelog
- Это один раз написанная спецификация, которая не меняется

**Но НИКОГДА для:**
- CLAUDE.md
- Активно используемые rules
- Текущие BACKLOG/COMPLETED_TASKS
