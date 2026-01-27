# CLAUDE.md: Размеры и структура

> Источники: [Anthropic Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices), [HumanLayer Guide](https://www.humanlayer.dev/blog/writing-a-good-claude-md)

## Рекомендуемые размеры

| Файл | Размер |
|------|--------|
| CLAUDE.md (root) | < 60 строк |
| CLAUDE.md (nested) | < 100 строк |
| CLAUDE.md (максимум) | < 300 строк |
| Skill файлы | < 500 строк |

## Что включать

- Команды сборки/тестов которые Claude не угадает
- Стиль кода отличающийся от стандартного
- Архитектурные решения проекта
- Частые ошибки и gotchas

## Что НЕ включать

- Стандартные конвенции (Claude их знает)
- Детальную API документацию (ссылайся на docs/)
- Code snippets (устаревают)
- Стиль кода если есть линтер
- Описание каждого файла

## Иерархия памяти

```
1. Managed Policy    /etc/claude-code/CLAUDE.md
2. Project Memory    ./CLAUDE.md
3. Project Rules     ./.claude/rules/*.md
4. User Memory       ~/.claude/CLAUDE.md
5. Local Memory      ./CLAUDE.local.md (в .gitignore)
```

## Импорты

```markdown
Смотри @README.md для обзора.
Git workflow: @docs/git-instructions.md
```
