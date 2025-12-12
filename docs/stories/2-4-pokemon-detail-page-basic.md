# Story 2.4: Pokemon Detail Page - Basic

Status: review

## Story

As a **user**,
I want **to see a Pokemon's basic information when I visit its detail page**,
so that **I can learn about that Pokemon's name, number, types, and physical characteristics**.

## Acceptance Criteria

1. **AC1:** Navigating to `/pokemon/25` displays Pikachu's name, number (#025), and types (AC15 from tech-spec)
2. **AC2:** Official artwork is prominently displayed (AC16 from tech-spec)
3. **AC3:** Height and weight are shown (AC17 from tech-spec)
4. **AC4:** Loading skeleton displays while fetching (AC18 from tech-spec)
5. **AC5:** Invalid Pokemon ID shows 404 page (AC19 from tech-spec)

## Tasks / Subtasks

- [x] **Task 1: Create PokemonDetail Component** (AC: 1, 2, 3)
  - [x] Create `src/components/pokemon/PokemonDetail.tsx`
  - [x] Define `PokemonDetailProps` interface accepting `IPokemon` data
  - [x] Display Pokemon name prominently (capitalize first letter)
  - [x] Display Pokemon number with leading zeros (e.g., #025)
  - [x] Display official artwork from `sprites.other['official-artwork'].front_default`
  - [x] Display height (convert from decimeters to meters)
  - [x] Display weight (convert from hectograms to kilograms)

- [x] **Task 2: Create TypeBadge Component** (AC: 1)
  - [x] TypeBadge already exists from previous stories
  - [x] Located at `src/components/pokemon/TypeBadge.tsx`
  - [x] Uses type-specific background colors from `tailwind.config.js`
  - [x] Built on shadcn/ui Badge component

- [x] **Task 3: Update Pokemon Page with usePokemon Hook** (AC: 1, 4, 5)
  - [x] Update `src/pages/Pokemon.tsx` to use `usePokemon(id)` hook
  - [x] Extract Pokemon ID from route params using `useParams()`
  - [x] Handle loading state with skeleton
  - [x] Handle error state (Pokemon not found) → navigate to NotFound
  - [x] Pass Pokemon data to PokemonDetail component

- [x] **Task 4: Create PokemonDetailSkeleton Component** (AC: 4)
  - [x] Create `src/components/pokemon/PokemonDetailSkeleton.tsx`
  - [x] Match layout of PokemonDetail with animated skeleton placeholders
  - [x] Use Tailwind animate-pulse for loading effect
  - [x] Show while Pokemon data is fetching

- [x] **Task 5: Enhance NotFound Page for Invalid Pokemon** (AC: 5)
  - [x] Ensure `/pokemon/99999` (invalid ID) shows 404 page
  - [x] Add friendly message "Pokemon not found"
  - [x] Provide "Go Home" button
  - [x] Uses React Router state to detect Pokemon route context

- [x] **Task 6: Verify Implementation** (AC: 1, 2, 3, 4, 5)
  - [x] Verify `npm run build` succeeds
  - [x] Verify TypeScript compilation (`npx tsc --noEmit`)
  - [ ] Visual test: Navigate to `/pokemon/25` - verify Pikachu displays correctly
  - [ ] Visual test: Verify type badges show with correct colors
  - [ ] Visual test: Loading skeleton appears during fetch
  - [ ] Visual test: Invalid ID (e.g., `/pokemon/99999`) shows 404

## Dev Notes

### Architecture Patterns and Constraints

- **Component Pattern:** Props interface + functional component [Source: docs/architecture.md#Component-Pattern]
- **Path Aliases:** Use `@/` prefix for imports [Source: docs/architecture.md#Project-Structure]
- **Type Interface:** Use `IPokemon` from `src/types/pokemon.ts` [Source: docs/architecture.md#Key-Types]
- **Hook Pattern:** `usePokemon(id)` returns `{ data, isLoading, error }` from TanStack Query [Source: docs/architecture.md#Hook-Pattern]

### Source Tree Components

```
bmad-pokedex/
├── src/
│   ├── components/
│   │   └── pokemon/
│   │       ├── PokemonDetail.tsx       # NEW - Main detail view
│   │       ├── PokemonDetailSkeleton.tsx # NEW - Loading skeleton
│   │       └── TypeBadge.tsx           # NEW - Type badge component
│   └── pages/
│       └── Pokemon.tsx                 # MODIFIED - Use usePokemon hook
```

### Data Transformations

```typescript
// Format Pokemon number with leading zeros
const formatPokemonNumber = (id: number): string => {
  return `#${id.toString().padStart(3, '0')}`;
};

// Convert height from decimeters to meters
const formatHeight = (decimeters: number): string => {
  return `${(decimeters / 10).toFixed(1)} m`;
};

// Convert weight from hectograms to kilograms
const formatWeight = (hectograms: number): string => {
  return `${(hectograms / 10).toFixed(1)} kg`;
};
```

### Type Colors Reference

From `tailwind.config.js` pokemon type colors:
- fire: #F08030, water: #6890F0, grass: #78C850, electric: #F8D030
- ice: #98D8D8, fighting: #C03028, poison: #A040A0, ground: #E0C068
- flying: #A890F0, psychic: #F85888, bug: #A8B820, rock: #B8A038
- ghost: #705898, dragon: #7038F8, dark: #705848, steel: #B8B8D0
- fairy: #EE99AC, normal: #A8A878

### Learnings from Previous Story

**From Story 2-3-search-result-navigation (Status: done)**

- **Navigation Pattern:** Routes to `/pokemon/:id` already work from SearchBar click/keyboard selection
- **Route Structure:** Pokemon page receives ID via `useParams()` from react-router-dom
- **Existing Hook:** `usePokemon` hook exists in `src/hooks/usePokemon.ts` from Story 1.4
- **404 Handling:** NotFound page exists at `src/pages/NotFound.tsx` from Story 1.3

[Source: stories/2-3-search-result-navigation.md#Dev-Agent-Record]

### References

- [Source: docs/tech-spec-epic-2.md#Story-2.4] - AC15-AC19 specifications
- [Source: docs/epics.md#Story-2.4] - User story and technical notes
- [Source: docs/architecture.md#Component-Pattern] - Component structure
- [Source: docs/architecture.md#Key-Types] - IPokemon type definition
- [Source: docs/PRD.md#FR3] - Pokemon detail view requirements

## Dev Agent Record

### Context Reference

- `docs/stories/2-4-pokemon-detail-page-basic.context.xml`

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

None

### Completion Notes List

- TypeBadge component already existed from previous story implementations
- PokemonDetail component follows same pattern as PokemonCard but with larger artwork (256px) and height/weight display
- NotFound page enhanced to show Pokemon-specific message when navigated from Pokemon page using React Router state
- All TypeScript compilation and build verification passed
- Visual tests require manual verification

### File List

- `src/components/pokemon/PokemonDetail.tsx` (NEW)
- `src/components/pokemon/PokemonDetailSkeleton.tsx` (NEW)
- `src/pages/Pokemon.tsx` (MODIFIED)
- `src/pages/NotFound.tsx` (MODIFIED)

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-12 | Story created | SM Agent |
| 2025-12-12 | Implementation complete, ready for review | Dev Agent |
