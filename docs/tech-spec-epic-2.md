# Epic Technical Specification: Pokemon Discovery

Date: 2025-12-12
Author: JE
Epic ID: 2
Status: Draft

---

## Overview

Epic 2 delivers the core Pokemon discovery experience - the MVP magic where users can immediately start exploring Pokemon. This epic transforms the foundation from Epic 1 into a functional Pokemon discovery application with random Pokemon display, live search, and detailed Pokemon views.

Upon completion, users will land on a homepage featuring a random Pokemon, search for any Pokemon by name or number with live results, navigate to detailed Pokemon pages, and browse sequentially through all 1000+ Pokemon.

## Objectives and Scope

**In Scope:**
- Random Pokemon display on homepage with "Discover Another" functionality
- Search bar with live filtering as user types (debounced 300ms)
- Search results dropdown with top 10 matches
- Pokemon detail page with name, number, types, artwork, height, weight
- Previous/Next navigation between Pokemon
- Loading skeletons and error states
- Keyboard navigation support for search and Pokemon navigation

**Out of Scope:**
- Stats visualization (Epic 3)
- Type effectiveness display (Epic 3)
- Evolution chain visualization (Epic 3)
- Grid/browse view with filtering (Epic 4)
- Caching persistence (Epic 5)

## System Architecture Alignment

This epic builds on Epic 1's foundation and implements components defined in `docs/architecture.md`:

**Components Created:**
- `src/components/pokemon/PokemonCard.tsx` - Pokemon display card
- `src/components/pokemon/PokemonCardSkeleton.tsx` - Loading skeleton
- `src/components/pokemon/PokemonDetail.tsx` - Detail view component
- `src/components/pokemon/TypeBadge.tsx` - Type badge with colors
- `src/components/pokemon/SearchBar.tsx` - Search with dropdown

**Hooks Created:**
- `src/hooks/useRandomPokemon.ts` - Random Pokemon fetching
- `src/hooks/usePokemonSearch.ts` - Debounced search hook

**Pages Modified:**
- `src/pages/Home.tsx` - Random Pokemon + search
- `src/pages/Pokemon.tsx` - Full detail view

**Patterns Applied:**
- Component pattern from architecture.md (Props interface, functional component)
- Hook pattern with TanStack Query (queryKey, queryFn, staleTime)
- Error handling with ErrorState component and retry

## Detailed Design

### Services and Modules

| Module | Responsibility | Inputs | Outputs |
|--------|---------------|--------|---------|
| `src/hooks/useRandomPokemon.ts` | Fetch random Pokemon (ID 1-1010) | - | `{ data, isLoading, error, refetch }` |
| `src/hooks/usePokemonSearch.ts` | Debounced search with filtering | search term | `{ results, isLoading }` |
| `src/components/pokemon/SearchBar.tsx` | Search UI with dropdown | - | Navigation to Pokemon |
| `src/components/pokemon/PokemonCard.tsx` | Display Pokemon summary | IPokemon | JSX card |
| `src/components/pokemon/PokemonDetail.tsx` | Full Pokemon display | IPokemon | JSX detail view |
| `src/components/pokemon/TypeBadge.tsx` | Type badge styling | type name | JSX badge |

### Data Models and Contracts

```typescript
// Already defined in src/types/pokemon.ts from Epic 1
// No new types needed - using IPokemon, IPokemonType, ISprites

// Search result item (subset of full Pokemon)
interface ISearchResult {
  id: number;
  name: string;
}
```

### APIs and Interfaces

**Existing API Functions (from Epic 1):**
| Function | Endpoint | Used In |
|----------|----------|---------|
| `fetchPokemon(id)` | `/pokemon/{id}` | useRandomPokemon, usePokemon |
| `fetchPokemonList(limit, offset)` | `/pokemon?limit=&offset=` | usePokemonSearch (prefetch) |

**New Hooks:**

```typescript
// src/hooks/useRandomPokemon.ts
export function useRandomPokemon() {
  const [pokemonId, setPokemonId] = useState(() =>
    Math.floor(Math.random() * 1010) + 1
  );

  const query = usePokemon(pokemonId);

  const getNewRandom = useCallback(() => {
    setPokemonId(Math.floor(Math.random() * 1010) + 1);
  }, []);

  return { ...query, getNewRandom };
}

// src/hooks/usePokemonSearch.ts
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

### Workflows and Sequencing

**Story Execution Order:**

```
Story 2.1: Random Pokemon Display
    ↓ (provides PokemonCard, useRandomPokemon)
Story 2.2: Pokemon Search Input
    ↓ (provides SearchBar, usePokemonSearch)
Story 2.3: Search Result Navigation
    ↓ (connects search to routing)
Story 2.4: Pokemon Detail Page - Basic
    ↓ (provides PokemonDetail, TypeBadge)
Story 2.5: Pokemon Navigation
    (provides prev/next navigation)
```

**User Flow - Homepage:**

```
1. User lands on /
2. useRandomPokemon fetches random Pokemon
3. PokemonCardSkeleton shows while loading
4. PokemonCard renders with Pokemon data
5. User clicks "Discover Another" → getNewRandom()
```

**User Flow - Search:**

```
1. User types in SearchBar
2. usePokemonSearch debounces input (300ms)
3. Client-side filter on prefetched Pokemon list
4. Results dropdown shows max 10 matches
5. User clicks result → navigate to /pokemon/:id
6. Dropdown closes, search clears
```

**User Flow - Detail Page:**

```
1. User navigates to /pokemon/25
2. usePokemon(25) fetches Pikachu
3. PokemonDetail renders with all info
4. User clicks "Next" → navigate to /pokemon/26
5. User presses → arrow key → navigate to /pokemon/26
```

## Non-Functional Requirements

### Performance

| Metric | Target | Implementation |
|--------|--------|----------------|
| Search response | < 500ms | Client-side filtering on prefetched list |
| Pokemon detail load | < 1s | TanStack Query caching (5 min staleTime) |
| Debounce delay | 300ms | Prevent excessive filtering |
| Skeleton display | Immediate | Show before data loads |

**Prefetching Strategy:**
- Prefetch Pokemon name list (1010 items) on app load
- Prefetch adjacent Pokemon on hover (prev/next buttons)

### Security

- No new security concerns for this epic
- All data is read-only from public PokeAPI
- No user input persisted or sent to servers

### Reliability/Availability

- Error states with retry buttons for failed fetches
- Skeleton loaders prevent blank screens
- Graceful 404 handling for invalid Pokemon IDs
- TanStack Query automatic retry (3 attempts)

### Observability

- Console.log for search queries in development
- TanStack Query DevTools shows cache state
- No production telemetry in MVP

## Dependencies and Integrations

**No New Dependencies Required**

All dependencies installed in Epic 1:
- @tanstack/react-query - API state
- react-router-dom - Navigation
- Tailwind CSS - Styling
- shadcn/ui - UI components (Button, Card, Input, Badge)

**Integration Points:**
- PokeAPI.co endpoints (already configured in Epic 1)
  - `/pokemon/{id}` - Pokemon details
  - `/pokemon?limit=1010` - Full Pokemon list for search

## Acceptance Criteria (Authoritative)

**Story 2.1: Random Pokemon Display**
1. **AC1:** Homepage displays a random Pokemon with name, number, types, and artwork on load
2. **AC2:** Clicking "Discover Another" loads a different random Pokemon
3. **AC3:** Loading skeleton displays while fetching
4. **AC4:** Error message with retry option displays on fetch failure

**Story 2.2: Pokemon Search Input**
5. **AC5:** Search bar appears in header on all pages
6. **AC6:** Typing shows matching Pokemon in dropdown within 500ms
7. **AC7:** Search is debounced (300ms)
8. **AC8:** Partial name matching works (e.g., "pika" matches Pikachu)
9. **AC9:** Number search works (e.g., "25" shows Pikachu)
10. **AC10:** Maximum 10 results shown in dropdown

**Story 2.3: Search Result Navigation**
11. **AC11:** Clicking search result navigates to `/pokemon/:id`
12. **AC12:** Dropdown closes after selection
13. **AC13:** Keyboard navigation works (arrow keys, enter)
14. **AC14:** Clicking outside dropdown closes it

**Story 2.4: Pokemon Detail Page - Basic**
15. **AC15:** `/pokemon/25` displays Pikachu's name, number (#025), types
16. **AC16:** Official artwork is prominently displayed
17. **AC17:** Height and weight are shown
18. **AC18:** Loading skeleton displays while fetching
19. **AC19:** Invalid Pokemon ID shows 404 page

**Story 2.5: Pokemon Navigation**
20. **AC20:** "Previous" button navigates to previous Pokemon number
21. **AC21:** "Next" button navigates to next Pokemon number
22. **AC22:** Navigation wraps (1 → 1010, 1010 → 1)
23. **AC23:** Keyboard shortcuts work (← →)

## Traceability Mapping

| AC | Spec Section | Component/API | Test Idea |
|----|--------------|---------------|-----------|
| AC1 | Random Display | useRandomPokemon, PokemonCard | E2E: verify Pokemon shown on load |
| AC2 | Random Display | useRandomPokemon.getNewRandom | E2E: click button, verify different Pokemon |
| AC3 | Loading States | PokemonCardSkeleton | Visual: skeleton visible during load |
| AC4 | Error Handling | ErrorState component | Unit: mock error, verify retry |
| AC5 | Search UI | SearchBar, Header | Visual: search bar in header |
| AC6 | Search | usePokemonSearch | Integration: type, verify results |
| AC7 | Search | useDebounce | Unit: verify 300ms delay |
| AC8 | Search | usePokemonSearch filter | Unit: filter logic |
| AC9 | Search | usePokemonSearch filter | Unit: number matching |
| AC10 | Search | usePokemonSearch | Unit: slice(0, 10) |
| AC11 | Navigation | SearchBar onClick | E2E: click result, verify URL |
| AC12 | Search UX | SearchBar state | E2E: selection closes dropdown |
| AC13 | Accessibility | SearchBar keyboard | E2E: keyboard navigation |
| AC14 | Search UX | SearchBar onBlur | E2E: click outside closes |
| AC15 | Detail Page | PokemonDetail | E2E: verify content |
| AC16 | Detail Page | PokemonDetail | Visual: artwork displayed |
| AC17 | Detail Page | PokemonDetail | E2E: verify height/weight |
| AC18 | Loading States | PokemonDetailSkeleton | Visual: skeleton |
| AC19 | Error Handling | NotFound page | E2E: invalid ID shows 404 |
| AC20 | Navigation | Pokemon page buttons | E2E: click prev |
| AC21 | Navigation | Pokemon page buttons | E2E: click next |
| AC22 | Navigation | Pokemon page logic | Unit: wrap logic |
| AC23 | Accessibility | Pokemon page keyboard | E2E: arrow keys |

## Risks, Assumptions, Open Questions

**Risks:**
- **R1:** Prefetching 1010 Pokemon names may be slow on first load → Mitigation: Cache in TanStack Query, show search skeleton
- **R2:** Mobile keyboard may cover search results → Mitigation: Position dropdown above input on mobile (future)

**Assumptions:**
- **A1:** PokeAPI returns consistent data structure for all 1010 Pokemon
- **A2:** Official artwork URL is available for all Pokemon
- **A3:** Users have JavaScript enabled (no SSR)

**Open Questions:**
- None - requirements are well-defined in PRD and epics

## Test Strategy Summary

**Unit Tests (Vitest):**
- `useRandomPokemon` - random ID generation, refetch
- `usePokemonSearch` - filtering logic, debounce
- `useDebounce` - timing verification
- Pokemon ID wrap logic (1 → 1010, 1010 → 1)

**Component Tests (RTL):**
- `PokemonCard` - renders name, number, types, artwork
- `TypeBadge` - correct color for each type
- `SearchBar` - dropdown behavior, keyboard events
- `PokemonDetail` - renders all Pokemon info

**Integration Tests:**
- Search flow: type → results → click → navigate
- Random Pokemon: load → display → click discover → new Pokemon
- Pokemon navigation: detail → next → verify ID increment

**E2E Tests (if added later):**
- Homepage random Pokemon flow
- Search and navigate flow
- Pokemon detail with navigation

**Test Commands:**
```bash
npm run test           # Run all tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

**Coverage Target:** 80% for hooks and components
