# Правила работы с Claude Code

> Основано на официальной документации Anthropic, рекомендациях Бориса Черного (создателя Claude Code) и лучших практиках 2025-2026.

## Официальные источники

- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices) - Anthropic
- [Best Practices - Claude Code Docs](https://code.claude.com/docs/en/best-practices)
- [Memory Management](https://code.claude.com/docs/en/memory)
- [Skills Documentation](https://code.claude.com/docs/en/skills)
- [HumanLayer CLAUDE.md Guide](https://www.humanlayer.dev/blog/writing-a-good-claude-md)
- [How Boris Cherny Uses Claude Code](https://howborisusesclaudecode.com/)

---

## 1. CLAUDE.md: Размеры и структура

### Официальные рекомендации по размеру

| Тип файла | Рекомендуемый размер | Источник |
|-----------|---------------------|----------|
| **CLAUDE.md (root)** | < 60 строк | HumanLayer / Anthropic |
| **CLAUDE.md (nested)** | < 100 строк | Общая практика |
| **CLAUDE.md (максимум)** | < 300 строк | HumanLayer |
| **Skill файлы** | < 500 строк | Claude Code Docs |

### Почему короче = лучше

1. **Context window degradation**: Производительность Claude падает при заполнении контекста
2. **Instruction following**: Чем длиннее файл, тем чаще Claude игнорирует инструкции
3. **Relevance filtering**: Claude может решить, что длинный файл не релевантен текущей задаче

### Что ВКЛЮЧАТЬ в CLAUDE.md

```markdown
# Пример минимального CLAUDE.md (< 60 строк)

## Команды
- `pnpm dev` - dev server
- `pnpm build` - production build
- `pnpm test` - run tests

## Код стиль
- Named exports для всех компонентов
- Explicit return types для функций
- Никакого `any`, использовать `unknown`

## Workflow
- Использовать Plan Mode для сложных задач
- Запускать тесты после изменений
```

### Что НЕ ВКЛЮЧАТЬ

| Исключить | Почему | Альтернатива |
|-----------|--------|--------------|
| Стандартные конвенции | Claude их знает | - |
| Детальную API документацию | Слишком объемно | Ссылка на docs/ |
| Code snippets | Устаревают | Ссылки file:line |
| Описание каждого файла | Избыточно | Используй `@` импорты |
| Стиль кода (если есть линтер) | Дублирование | ESLint/Prettier |

---

## 2. Иерархия памяти Claude Code

### Официальная структура (по приоритету)

```
1. Managed Policy     /etc/claude-code/CLAUDE.md (Linux)
                      Для организации (IT/DevOps)

2. Project Memory     ./CLAUDE.md или ./.claude/CLAUDE.md
                      Для команды (в git)

3. Project Rules      ./.claude/rules/*.md
                      Модульные правила по темам

4. User Memory        ~/.claude/CLAUDE.md
                      Личные настройки

5. Local Memory       ./CLAUDE.local.md
                      Личное для проекта (в .gitignore)
```

### Модульная организация правил

```
.claude/
├── CLAUDE.md              # Основные инструкции (< 60 строк)
└── rules/
    ├── code-style.md      # Стиль кода
    ├── testing.md         # Тестирование
    ├── security.md        # Безопасность
    └── frontend/
        ├── react.md
        └── tailwind.md
```

### Path-specific правила

```markdown
---
paths:
  - "src/api/**/*.ts"
---

# API правила
- Всегда валидация входных данных
- Стандартный формат ошибок
```

---

## 3. Импорты и Progressive Disclosure

### Синтаксис импортов

```markdown
# CLAUDE.md
Смотри @README.md для обзора проекта.
Смотри @package.json для npm команд.

# Дополнительные инструкции
- Git workflow: @docs/git-instructions.md
- Личные настройки: @~/.claude/my-project.md
```

### Принцип Progressive Disclosure

Вместо огромного CLAUDE.md используй отдельные файлы:

```
docs/
├── building.md           # Сборка проекта
├── testing.md            # Тестирование
├── architecture.md       # Архитектура
└── agent_docs/           # Для Claude
    ├── api-conventions.md
    └── code-review.md
```

Направляй Claude читать нужный файл:
```
Перед началом работы прочитай @docs/agent_docs/api-conventions.md
```

---

## 4. Skills: Создание и организация

### Структура skill

```
.claude/skills/
└── fix-issue/
    ├── SKILL.md           # Основные инструкции (обязательно)
    ├── template.md        # Шаблон для заполнения
    ├── examples/
    │   └── sample.md
    └── scripts/
        └── validate.sh
```

### Frontmatter для SKILL.md

```yaml
---
name: fix-issue
description: Исправление GitHub issue
disable-model-invocation: true  # Только ручной вызов
allowed-tools: Read, Grep, Glob, Bash
context: fork                    # Изолированный контекст
---

Исправь GitHub issue $ARGUMENTS:

1. Прочитай описание issue: `gh issue view $0`
2. Найди релевантные файлы
3. Реализуй исправление
4. Напиши тесты
5. Создай коммит
```

### Когда использовать что

| Механизм | Когда использовать |
|----------|-------------------|
| **CLAUDE.md** | Универсальные правила для каждой сессии |
| **Skills** | Повторяющиеся задачи, workflow |
| **Subagents** | Изолированные задачи, параллельная работа |
| **Hooks** | Автоматические действия (lint, format) |
| **Commands** | Устаревший способ, мигрировать на Skills |

---

## 5. Рекомендации Бориса Черного

### Параллельные сессии

- Запускать 5+ Claude Code сессий одновременно
- Каждая сессия — отдельный git checkout
- Нумеровать вкладки 1-5, использовать уведомления

### Выбор модели

> "Opus 4.5 with thinking — лучшая модель для кода. Хотя она медленнее Sonnet, её реже нужно корректировать, и она лучше работает с инструментами."

### Plan Mode

1. Начинать сложные задачи в Plan Mode (Shift+Tab дважды)
2. Итерировать план до удовлетворения
3. Переключиться в auto-accept edits mode
4. Claude обычно делает всё за один проход

### Shared CLAUDE.md

> "Каждый раз когда Claude делает что-то неправильно, мы добавляем это в CLAUDE.md, чтобы в следующий раз он знал."

Команда Anthropic обновляет CLAUDE.md несколько раз в неделю.

### Slash Commands

```
.claude/commands/
├── commit.md            # /commit
├── push-pr.md           # /push-pr
└── review.md            # /review
```

Используйте inline Bash для предварительной обработки:
```markdown
# commit.md
!`git status`
!`git diff --staged`

Создай осмысленный коммит...
```

### Hooks для форматирования

```json
// .claude/settings.json
{
  "hooks": {
    "PostToolUse": {
      "match": "Write|Edit",
      "command": "pnpm eslint --fix $FILE"
    }
  }
}
```

### Верификация — самое важное

> "Дай Claude способ проверить свою работу. Если у Claude есть обратная связь, качество результата увеличивается в 2-3 раза."

Способы верификации:
- Тесты
- Линтеры
- Скриншоты (Chrome extension)
- Build commands
- Type checking

---

## 6. Управление контекстом

### Ограничения контекста

- Context window заполняется быстро
- Производительность падает при заполнении
- `/clear` между несвязанными задачами
- `/compact` для сжатия истории

### Subagents для исследований

```
Используй subagent для исследования как работает
аутентификация в этом проекте.
```

Subagent исследует в отдельном контексте и возвращает краткий результат.

### Auto-compaction

Claude автоматически сжимает историю. Можно настроить:

```markdown
# CLAUDE.md
При compaction всегда сохранять:
- Список измененных файлов
- Команды для тестов
- Ключевые решения
```

---

## 7. Типичные ошибки

### Kitchen Sink Session
**Проблема**: Начать одну задачу, переключиться на другую, вернуться.
**Решение**: `/clear` между несвязанными задачами.

### Многократные коррекции
**Проблема**: Claude ошибается → коррекция → снова ошибается.
**Решение**: После 2 неудачных попыток — `/clear` и новый промпт.

### Раздутый CLAUDE.md
**Проблема**: Слишком длинный файл, Claude игнорирует правила.
**Решение**: Оставить только то, что влияет на ошибки Claude.

### Отсутствие верификации
**Проблема**: Claude создаёт код, который выглядит правильным, но не работает.
**Решение**: Всегда предоставлять тесты, скрипты проверки.

---

## 8. Команды и горячие клавиши

| Команда/Клавиша | Действие |
|-----------------|----------|
| `Esc` | Остановить Claude |
| `Esc + Esc` | Открыть меню rewind |
| `/clear` | Сбросить контекст |
| `/compact` | Сжать историю |
| `/memory` | Редактировать CLAUDE.md |
| `/init` | Создать начальный CLAUDE.md |
| `/permissions` | Настроить разрешения |
| `/agents` | Управление subagents |
| `#` | Добавить инструкцию в CLAUDE.md |
| `Shift+Tab×2` | Plan Mode |
| `Ctrl+G` | Открыть план в редакторе |

---

## 9. Безопасность и разрешения

### Настройка разрешений

```
/permissions

# Разрешить безопасные команды
Bash(pnpm run *)
Bash(git commit *)
Bash(git push *)

# Запретить опасные
- Bash(rm -rf *)
- Bash(git push --force)
```

### Sandbox режим

```
/sandbox
```

OS-level изоляция для безопасной автономной работы.

### Опасный режим

```bash
claude --dangerously-skip-permissions
```

**ТОЛЬКО** в изолированном контейнере без интернета!

---

## 10. Документация проекта

### Структура документации

```
docs/
├── INDEX.md              # Оглавление
├── SUMMARY.md            # Краткое резюме (5 мин)
├── architecture/
│   ├── overview.md
│   └── decisions/
│       └── ADR-001.md    # Architecture Decision Records
├── api/
│   └── spec.md
├── database/
│   └── schema.md
└── agent_docs/           # Для Claude Code
    ├── CONTEXT.md        # Контекст проекта
    ├── CONVENTIONS.md    # Конвенции кода
    └── WORKFLOWS.md      # Рабочие процессы
```

### Поддержание актуальности

1. **CLAUDE.md в коммитах**: Включать изменения CLAUDE.md в PR
2. **@.claude в code review**: Тегать Claude для добавления правил
3. **Регулярный аудит**: Удалять устаревшие инструкции
4. **Тестирование**: Проверять, изменилось ли поведение Claude

### Размеры документов

| Документ | Максимум |
|----------|----------|
| CLAUDE.md | 60-100 строк |
| Skill файлы | 500 строк |
| API docs | Разбивать по эндпоинтам |
| Architecture docs | Разбивать по модулям |

---

## Контрольный список

### Перед началом работы
- [ ] CLAUDE.md < 60 строк
- [ ] Только универсально применимые правила
- [ ] Есть способ верификации (тесты, lint)
- [ ] Skills для повторяющихся задач

### Во время работы
- [ ] Plan Mode для сложных задач
- [ ] `/clear` между разными задачами
- [ ] Subagents для исследований
- [ ] Ранняя и частая коррекция

### После завершения
- [ ] Добавить ошибки Claude в CLAUDE.md
- [ ] Обновить документацию
- [ ] Удалить устаревшие правила
- [ ] Commit CLAUDE.md изменения

---

*Версия: 1.0*
*Дата: 28 января 2026*
*Основано на: Anthropic Official Docs, Boris Cherny Tips, HumanLayer Guide*
