# Skills и Subagents

> Источник: [Claude Code Skills Docs](https://code.claude.com/docs/en/skills)

## Структура skill

```
.claude/skills/fix-issue/
├── SKILL.md           # Обязательно
├── template.md        # Опционально
└── scripts/
    └── validate.sh
```

## Frontmatter

```yaml
---
name: fix-issue
description: Исправление GitHub issue
disable-model-invocation: true  # Только ручной вызов
allowed-tools: Read, Grep, Glob
context: fork                    # Изолированный контекст
---
```

## Когда использовать

| Механизм | Когда |
|----------|-------|
| CLAUDE.md | Универсальные правила |
| Skills | Повторяющиеся задачи |
| Subagents | Изолированные задачи |
| Hooks | Автоматика (lint, format) |

## Subagents

Создай `.claude/agents/security-reviewer.md`:

```yaml
---
name: security-reviewer
tools: Read, Grep, Glob
model: opus
---
Проверяй код на уязвимости...
```

Использование:
```
Используй subagent для проверки безопасности
```
