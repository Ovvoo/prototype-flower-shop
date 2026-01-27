# Разрешения и безопасность

## Настройка разрешений

```
/permissions

# Разрешить
Bash(pnpm run *)
Bash(git commit *)

# Запретить
- Bash(rm -rf *)
- Bash(git push --force)
```

## Sandbox режим

```
/sandbox
```

OS-level изоляция для автономной работы.

## Опасный режим

```bash
claude --dangerously-skip-permissions
```

**ТОЛЬКО** в контейнере без интернета!

## Permissions в skills

```yaml
---
name: safe-reader
allowed-tools: Read, Grep, Glob
---
```

## Блокировка skills

В `/permissions`:
```
# Запретить конкретный skill
Skill(deploy *)

# Разрешить только определённые
Skill(commit)
Skill(review-pr *)
```
