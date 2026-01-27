# Горячие клавиши и команды

## Клавиши

| Клавиша | Действие |
|---------|----------|
| `Esc` | Остановить Claude |
| `Esc + Esc` | Меню rewind |
| `Shift+Tab×2` | Plan Mode |
| `Ctrl+G` | План в редакторе |
| `#` | Добавить в CLAUDE.md |

## Основные команды

| Команда | Описание |
|---------|----------|
| `/clear` | Сбросить контекст |
| `/compact` | Сжать историю |
| `/memory` | Редактировать CLAUDE.md |
| `/init` | Создать CLAUDE.md |
| `/permissions` | Настроить разрешения |
| `/agents` | Управление subagents |
| `/sandbox` | Включить sandbox |
| `/context` | Показать загруженный контекст |

## CLI флаги

```bash
claude --continue      # Продолжить последнюю сессию
claude --resume        # Выбрать из недавних
claude -p "prompt"     # Headless mode
claude --output-format json
```
