# Story 2.2: Pokemon Search Input

Status: review

## Story

As a **user**,
I want **to search for Pokemon by typing their name**,
so that **I can quickly find specific Pokemon**.

## Acceptance Criteria

1. **AC1:** Search bar appears in header on all pages
2. **AC2:** Typing shows matching Pokemon in dropdown within 500ms
3. **AC3:** Search is debounced (300ms delay)
4. **AC4:** Partial name matching works (e.g., "pika" matches Pikachu)
5. **AC5:** Number search works (e.g., "25" shows Pikachu)
6. **AC6:** Maximum 10 results shown in dropdown

## Tasks / Subtasks

- [x] **Task 1: Create useDebounce Hook** (AC: 3)
  - [x] Create `src/hooks/useDebounce.ts`
  - [x] Accept value and delay (default 300ms)
  - [x] Return debounced value using useEffect and setTimeout
  - [x] Re-export from `src/hooks/index.ts`

- [x] **Task 2: Create usePokemonSearch Hook** (AC: 2, 3, 4, 5, 6)
  - [x] Create `src/hooks/usePokemonSearch.ts`
  - [x] Use useDebounce for 300ms debounce
  - [x] Use existing `usePokemonList(1010, 0)` to prefetch all Pokemon names
  - [x] Filter client-side by name (includes) or ID (exact match)
  - [x] Limit results to 10 items
  - [x] Return `{ results, isLoading }` where isLoading = !pokemonList
  - [x] Re-export from `src/hooks/index.ts`

- [x] **Task 3: Create SearchBar Component** (AC: 1, 2, 4, 5, 6)
  - [x] Create `src/components/pokemon/SearchBar.tsx`
  - [x] Use Input component from shadcn/ui
  - [x] Controlled input with searchTerm state
  - [x] Dropdown for results (absolute positioned)
  - [x] Display Pokemon name and number in results
  - [x] Show loading state when prefetching names
  - [x] Show "No results" when no matches found

- [x] **Task 4: Update Header Component** (AC: 1)
  - [x] Add SearchBar to Header component
  - [x] Position search bar appropriately (centered or right)
  - [x] Ensure responsive layout

- [x] **Task 5: Verify Implementation** (AC: 1, 2, 3, 4, 5, 6)
  - [x] Verify `npm run build` succeeds
  - [x] Verify TypeScript compilation (`tsc --noEmit`)
  - [ ] Visual test: search bar visible in header on all pages
  - [ ] Visual test: typing "pika" shows Pikachu in results
  - [ ] Visual test: typing "25" shows Pikachu in results
  - [ ] Visual test: results limited to 10 items

## Dev Notes

### Architecture Patterns and Constraints

- **Component Pattern:** Props interface + functional component [Source: docs/architecture.md#Component-Pattern]
- **Hook Pattern:** TanStack Query with queryKey, queryFn, staleTime [Source: docs/architecture.md#Hook-Pattern]
- **Path Aliases:** Use `@/` prefix for imports [Source: docs/architecture.md#Project-Structure]
- **Type Naming:** `I` prefix for interfaces [Source: docs/architecture.md#Naming-Conventions]

### Source Tree Components

```
bmad-pokedex/
├── src/
│   ├── components/
│   │   ├── pokemon/
│   │   │   └── SearchBar.tsx          # NEW - Search with dropdown
│   │   └── layout/
│   │       └── Header.tsx             # MODIFIED - Add SearchBar
│   ├── hooks/
│   │   ├── useDebounce.ts             # NEW - Debounce utility
│   │   ├── usePokemonSearch.ts        # NEW - Search hook
│   │   └── index.ts                   # MODIFIED - re-exports
```

### usePokemonSearch Hook Pattern

From tech-spec-epic-2.md:

```typescript
export function usePokemonSearch(searchTerm: string) {
  const debouncedTerm = useDebounce(searchTerm, 300);

  // Pre-fetched Pokemon name list for client-side filtering
  const { data: pokemonList } = usePokemonList(1010, 0);

  const results = useMemo(() => {
    if (!debouncedTerm || !pokemonList) return [];
    return pokemonList.results
      .filter(p =>
        p.name.includes(debouncedTerm.toLowerCase()) ||
        extractId(p.url).toString() === debouncedTerm
      )
      .slice(0, 10);
  }, [debouncedTerm, pokemonList]);

  return { results, isLoading: !pokemonList };
}
```

### Learnings from Previous Story

**From Story 2-1-random-pokemon-display (Status: done)**

- **usePokemonList Available:** `src/hooks/usePokemonList.ts` already exists - use `usePokemonList(1010, 0)` to prefetch all Pokemon names for client-side filtering
- **TypeBadge Component:** Available at `src/components/pokemon/TypeBadge.tsx` - can reuse in search results if needed
- **ErrorState Component:** Available at `src/components/ErrorState.tsx` - can reuse for search error handling
- **Architecture Patterns Established:** Props interface + functional component pattern, TanStack Query hooks with staleTime
- **Path Aliases Working:** `@/*` imports configured - use `@/hooks/usePokemonList`, `@/components/ui/input`
- **Pokemon Types Defined:** `src/types/pokemon.ts` has `IPokemonListItem` interface with name and url properties
- **Build Passing:** `npm run build` and `tsc --noEmit` verified working

[Source: stories/2-1-random-pokemon-display.md#Dev-Agent-Record]

### URL Extraction Helper

Need to extract Pokemon ID from URL (e.g., "https://pokeapi.co/api/v2/pokemon/25/" → 25):

```typescript
function extractId(url: string): number {
  const parts = url.split('/').filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
}
```

### References

- [Source: docs/tech-spec-epic-2.md#Story-2.2] - AC5-AC10 specifications
- [Source: docs/tech-spec-epic-2.md#Detailed-Design] - usePokemonSearch hook design
- [Source: docs/epics.md#Story-2.2] - User story and technical notes
- [Source: docs/architecture.md#Component-Pattern] - Component structure
- [Source: docs/architecture.md#Hook-Pattern] - TanStack Query patterns
- [Source: docs/PRD.md#FR2] - Pokemon search feature requirements

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Build passed: `npm run build` - 113 modules transformed, no errors
- TypeScript passed: `npx tsc --noEmit` - no type errors

### Completion Notes List

- Implemented generic `useDebounce` hook with configurable delay (default 300ms) using useState/useEffect pattern
- Created `usePokemonSearch` hook that prefetches all 1010 Pokemon names via `usePokemonList(1010, 0)` and filters client-side
- Added `ISearchResult` interface extending `IPokemonListItem` with extracted Pokemon ID
- Created `extractId` utility function to parse Pokemon ID from PokeAPI URL
- Built `SearchBar` component with Input from shadcn/ui, absolute-positioned dropdown, and click-outside-to-close behavior
- Updated Header component with responsive layout: centered search on desktop (hidden sm:block), full-width below header on mobile
- Implemented navigation to `/pokemon/:id` on result selection with search term clearing

### File List

**New Files:**
- src/hooks/useDebounce.ts
- src/hooks/usePokemonSearch.ts
- src/components/pokemon/SearchBar.tsx

**Modified Files:**
- src/hooks/index.ts (added useDebounce, usePokemonSearch exports)
- src/components/layout/Header.tsx (added SearchBar integration)

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-12 | Story created | SM Agent |
| 2025-12-12 | Implementation complete - all tasks done, ready for review | DEV Agent (Opus 4.5) |
