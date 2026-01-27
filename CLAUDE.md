# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Flower shop e-commerce. Next.js 16 + React 19 + TypeScript + Tailwind CSS v4.
Backend: Laravel 11 + PostgreSQL 16.
UI language: Russian. Currency: ₽.

Production architecture:
- API Spec: @docs/api/NAVIGATION.md
- Database Schema: @docs/database/DATABASE_INDEX.md
- Backlog: @docs/backlog/INDEX.md
- Completed: @docs/completed/INDEX.md

## Commands

```bash
cd /root/projects/prototype-flower-shop/app
pnpm dev          # Dev server :3000
pnpm build        # Production build
pnpm lint         # ESLint
npx tsc --noEmit  # Type check
```

## Architecture

- Frontend: `app/app/` — Next.js App Router pages
- Components: `app/components/` — Reusable UI components
- Hooks: `app/lib/hooks/` — Data fetching (useProducts, useCategories, useAuth)
- Types: `app/lib/types/` — TypeScript definitions (Product, Order, Cart, etc.)
- API: `app/lib/api/` — API client and service functions
- Context: `app/contexts/` — React Context (CartContext)

## Modularity Rules

- Extract reusable components to `app/components/`
- Every UI element used 2+ times MUST be a component
- Use existing hooks from `lib/hooks/` for data fetching
- Types centralized in `lib/types/`
- API calls only through `lib/api/` services

## Component Rules

- Buttons: use `<Button variant="primary|secondary|ghost">`
- Product cards: use `<ProductCard product={...} onAddToCart={...}/>`
- Quantity: use `<QuantitySelector value={} onChange={} max={}/>`
- Prices: use `<PriceDisplay price={} compareAtPrice={}/>`
- Loading: use `<Skeleton variant="card|text|image"/>`

## Code Style

- Primary color: `pink-600`, `hover:bg-pink-700`
- Tailwind utility classes, no CSS modules
- `"use client"` only for useState/handlers
- All UI text in Russian

## Rules

- Simple solutions, no over-engineering
- Keep the pink color scheme
- **Always run `pnpm build` before committing** — catches type errors
- TypeScript gotchas: @.claude/rules/08-typescript-gotchas.md
- Component patterns: @.claude/rules/07-modularity-components.md
- Docs size limits: @.claude/rules/09-documentation-size-limits.md

## Navigation for Claude

- Pages: `app/app/*/page.tsx` (6 pages)
- Components: `app/components/` (Navigation, UI, Checkout, ProductCard, etc.)
- Hooks: `app/lib/hooks/` (useProducts, useCategories, useAuth, etc.)
- Types: `app/lib/types/` (Product, Order, Cart, etc.)
- API services: `app/lib/api/` (products, orders, promo, etc.)
- Use Glob/Read directly for this structure
