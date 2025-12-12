# Story 1.4: PokeAPI Client Setup

Status: review

## Story

As a **developer**,
I want **a configured API client for PokeAPI**,
so that **all components can fetch Pokemon data consistently**.

## Acceptance Criteria

1. **AC1:** Importing the API client allows calling `fetchPokemon(idOrName)` and receiving Pokemon data
2. **AC2:** `fetchPokemon(25)` returns Pikachu data successfully with correct structure
3. **AC3:** `fetchPokemonList(limit, offset)` returns a paginated list of Pokemon
4. **AC4:** TanStack Query is installed and QueryClientProvider wraps the application in main.tsx
5. **AC5:** Default staleTime is configured to 5 minutes (300,000ms)
6. **AC6:** API errors (e.g., 404 for invalid Pokemon) throw errors that can be caught and handled gracefully
7. **AC7:** TypeScript interfaces (`IPokemon`, `IPokemonType`, `IPokemonStat`, `ISprites`, `IPokemonListResponse`) are defined in `src/types/pokemon.ts`
8. **AC8:** `npm run build` succeeds without TypeScript errors

## Tasks / Subtasks

- [x] **Task 1: Install TanStack Query** (AC: 4)
  - [x] Run `npm install @tanstack/react-query`
  - [x] Verify package added to package.json

- [x] **Task 2: Create TypeScript Interfaces** (AC: 7)
  - [x] Create `src/types/pokemon.ts`
  - [x] Define `IPokemon` interface with id, name, types, stats, sprites, height, weight
  - [x] Define `IPokemonType` interface with slot and type object
  - [x] Define `IPokemonStat` interface with base_stat and stat object
  - [x] Define `ISprites` interface with front_default and official-artwork
  - [x] Define `IPokemonListResponse` interface with count, next, previous, results

- [x] **Task 3: Create API Client** (AC: 1, 2, 3, 6)
  - [x] Create `src/lib/api.ts`
  - [x] Define `BASE_URL` constant (`https://pokeapi.co/api/v2`)
  - [x] Implement `fetchPokemon(idOrName: string | number): Promise<IPokemon>`
  - [x] Implement `fetchPokemonList(limit?: number, offset?: number): Promise<IPokemonListResponse>`
  - [x] Handle HTTP errors (throw Error with descriptive message)
  - [x] Export all functions

- [x] **Task 4: Configure QueryClient** (AC: 4, 5)
  - [x] Create QueryClient instance with defaultOptions
  - [x] Set staleTime to 5 minutes (5 * 60 * 1000)
  - [x] Wrap App with QueryClientProvider in main.tsx
  - [x] Import and configure properly

- [x] **Task 5: Create Pokemon Hooks** (AC: 1, 2, 3)
  - [x] Create `src/hooks/usePokemon.ts` - hook for fetching single Pokemon
  - [x] Create `src/hooks/usePokemonList.ts` - hook for fetching Pokemon list
  - [x] Use useQuery with proper queryKey patterns
  - [x] Re-export from `src/hooks/index.ts` (create if needed)

- [x] **Task 6: Verify Implementation** (AC: 2, 6, 8)
  - [x] Verify `npm run build` succeeds
  - [x] Verify TypeScript compilation (`tsc --noEmit`)
  - [x] Test API client manually (can add console.log in a component temporarily)
  - [x] Verify error handling works for invalid Pokemon

## Dev Notes

### Architecture Patterns and Constraints

- **API State Management:** TanStack Query v5 for all API calls [Source: docs/architecture.md#Decision-Summary]
- **HTTP Client:** Native fetch, no axios [Source: docs/architecture.md#Decision-Summary]
- **Caching:** staleTime 5 minutes for Pokemon data [Source: docs/architecture.md#Caching-Strategy]
- **Base URL:** `https://pokeapi.co/api/v2` [Source: docs/architecture.md#Integration-Points]
- **Type naming:** PascalCase with `I` prefix for interfaces [Source: docs/architecture.md#Naming-Conventions]
- **Hook naming:** camelCase with `use` prefix [Source: docs/architecture.md#Naming-Conventions]
- **Path aliases:** Use `@/` prefix for imports [Source: docs/architecture.md#Project-Structure]

### Source Tree Components

```
bmad-pokedex/
├── src/
│   ├── types/
│   │   └── pokemon.ts         # TypeScript interfaces (NEW)
│   ├── lib/
│   │   └── api.ts             # PokeAPI client (NEW)
│   ├── hooks/
│   │   ├── usePokemon.ts      # Single Pokemon hook (NEW)
│   │   ├── usePokemonList.ts  # List Pokemon hook (NEW)
│   │   └── index.ts           # Re-exports (NEW)
│   └── main.tsx               # QueryClientProvider wrapper (MODIFIED)
├── package.json               # @tanstack/react-query added (MODIFIED)
```

### API Client Pattern

```typescript
// Expected src/lib/api.ts structure
const BASE_URL = 'https://pokeapi.co/api/v2';

export async function fetchPokemon(idOrName: string | number): Promise<IPokemon> {
  const response = await fetch(`${BASE_URL}/pokemon/${idOrName}`);
  if (!response.ok) {
    throw new Error(`Pokemon not found: ${idOrName}`);
  }
  return response.json();
}
```

### Hook Pattern

```typescript
// Expected hook structure
export function usePokemon(idOrName: string | number) {
  return useQuery({
    queryKey: ['pokemon', idOrName],
    queryFn: () => fetchPokemon(idOrName),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### Testing Standards

- TypeScript compilation check (`tsc --noEmit`)
- Production build verification (`npm run build`)
- Manual API verification (temporary console.log)
- Error handling verification (fetch invalid Pokemon ID)

### Project Structure Notes

- `src/types/` directory for TypeScript interfaces (new)
- `src/hooks/` directory for custom hooks (new)
- `src/lib/api.ts` for API client (new, alongside existing utils.ts)
- Path aliases already configured from Story 1.2

### Learnings from Previous Story

**From Story 1-3-routing-setup (Status: done)**

- **React Router v7 Installed:** `react-router-dom@7.10.1` - routing fully functional
- **Pages Created:** Home.tsx, Pokemon.tsx, Browse.tsx, NotFound.tsx at `src/pages/`
- **Layout Components:** Layout.tsx, Header.tsx at `src/components/layout/`
- **Path Aliases Ready:** `@/*` imports configured - use `@/lib/api`, `@/types/pokemon`, `@/hooks/usePokemon`
- **shadcn/ui Components:** Button, Card, Input, Badge available at `@/components/ui/`
- **Build Verification:** `npm run build` and `tsc --noEmit` both passing
- **Active Route Highlighting:** Header has active state for current route

[Source: stories/1-3-routing-setup.md#Dev-Agent-Record]

### References

- [Source: docs/architecture.md#Technology-Stack-Details] - TanStack Query configuration
- [Source: docs/architecture.md#Implementation-Patterns] - Hook and API patterns
- [Source: docs/architecture.md#Data-Architecture] - TypeScript interfaces
- [Source: docs/tech-spec-epic-1.md#Detailed-Design] - API client specifications
- [Source: docs/tech-spec-epic-1.md#Acceptance-Criteria] - AC12-AC15 specifications
- [Source: docs/epics.md#Story-1.4] - Story definition and acceptance criteria

## Dev Agent Record

### Context Reference

- `docs/stories/1-4-pokeapi-client-setup.context.xml`

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Plan: Install TanStack Query, create TypeScript interfaces, API client, hooks, configure QueryClient, verify build
- Followed architecture patterns for type naming (I prefix), hook naming (use prefix), path aliases (@/)
- Used native fetch per architecture constraint (no axios)

### Completion Notes List

- Installed @tanstack/react-query v5.90.12
- Created comprehensive TypeScript interfaces in src/types/pokemon.ts with IPokemon, IPokemonType, IPokemonStat, ISprites, IPokemonListResponse, IPokemonListItem
- Implemented API client with fetchPokemon() and fetchPokemonList() in src/lib/api.ts
- API error handling: 404 throws "Pokemon not found: {id}", other errors throw status text
- Configured QueryClient with 5-minute staleTime in main.tsx
- Created usePokemon and usePokemonList hooks with proper queryKey patterns
- Added API demo to Home.tsx showing Pikachu data to visually verify integration
- All builds pass: npm run build, tsc --noEmit, npm run lint (only pre-existing shadcn warnings)

### File List

**New Files:**
- src/types/pokemon.ts
- src/lib/api.ts
- src/hooks/usePokemon.ts
- src/hooks/usePokemonList.ts
- src/hooks/index.ts

**Modified Files:**
- src/main.tsx (added QueryClientProvider)
- src/pages/Home.tsx (added API demo with usePokemon hook)
- package.json (added @tanstack/react-query)
- package-lock.json (dependency updates)
- docs/sprint-status.yaml (status: in-progress -> review)

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-12 | Story created | SM Agent |
| 2025-12-12 | Implemented all tasks, API client fully functional | Dev Agent (Claude Opus 4.5) |
