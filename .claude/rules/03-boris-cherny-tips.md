# Рекомендации Бориса Черного

> Создатель Claude Code. Источник: [howborisusesclaudecode.com](https://howborisusesclaudecode.com/)

## Параллельные сессии

- 5+ Claude Code сессий одновременно
- Каждая сессия — отдельный git checkout
- Используй уведомления для координации

## Модель

> "Opus 4.5 with thinking — лучшая модель. Реже нужно корректировать."

## Plan Mode

1. Shift+Tab дважды → Plan Mode
2. Итерируй план до удовлетворения
3. Переключись в auto-accept mode
4. Claude обычно делает всё за один проход

## Shared CLAUDE.md

> "Каждый раз когда Claude делает что-то неправильно, добавляем в CLAUDE.md"

Команда обновляет несколько раз в неделю.

## Верификация — самое важное

> "Дай Claude способ проверить работу. Качество увеличивается в 2-3 раза."

- Тесты
- Линтеры
- Build commands
- Type checking
- Скриншоты (Chrome extension)

## Hooks

```json
{
  "hooks": {
    "PostToolUse": {
      "match": "Write|Edit",
      "command": "pnpm eslint --fix $FILE"
    }
  }
}
```
