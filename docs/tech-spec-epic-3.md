# Epic Technical Specification: Visual Enhancements

Date: 2025-12-12
Author: JE
Epic ID: 3
Status: Draft

---

## Overview

Epic 3 delivers the visual polish that transforms the Pokemon detail view from basic information display into an engaging, informative experience. This epic adds three key visual elements: animated stat bars that let users quickly assess a Pokemon's strengths, type effectiveness displays showing battle matchups (weaknesses, resistances, immunities), and evolution chain visualizations that connect Pokemon to their evolutionary relatives.

Building on Epic 2's functional Pokemon detail page, this epic enriches the user experience with data visualization that makes Pokemon stats and relationships immediately understandable at a glance. Upon completion, users will see animated stat bars with color coding, comprehensive type matchup information for battle strategy, clickable evolution chains for navigation, and interactive type badges that link to filtered browse views.

## Objectives and Scope

**In Scope:**
- Stats visualization with animated horizontal bar charts (HP, Attack, Defense, Sp.Atk, Sp.Def, Speed)
- Color-coded stat bars (red=low, yellow=medium, green=high)
- Numeric stat values and total base stats display
- Type effectiveness calculation for single and dual-type Pokemon
- Display of 2x weaknesses, 2x resistances, and immunities
- Handling of 4x weaknesses and 0.25x resistances for dual-types
- Evolution chain visualization with Pokemon sprites
- Branching evolution support (e.g., Eevee's 8 evolutions)
- Clickable evolution sprites for navigation
- Interactive type badges linking to `/browse?type={type}`

**Out of Scope:**
- Radar/spider chart alternative for stats (using bar chart only)
- Detailed move effectiveness (only type effectiveness)
- Mega evolution or regional form displays
- Animated sprites (using static sprites)
- Sound/cries
- Comparison tool between Pokemon

## System Architecture Alignment

This epic builds on Epic 2's Pokemon detail page and implements components defined in `docs/architecture.md`:

**Components Created:**
- `src/components/pokemon/PokemonStats.tsx` - Animated stat bar visualization
- `src/components/pokemon/TypeEffectiveness.tsx` - Type matchup display
- `src/components/pokemon/EvolutionChain.tsx` - Evolution visualization

**Hooks Created:**
- `src/hooks/useTypeEffectiveness.ts` - Fetch and calculate type effectiveness
- `src/hooks/useEvolutionChain.ts` - Fetch species and evolution data

**Components Modified:**
- `src/components/pokemon/TypeBadge.tsx` - Add onClick navigation
- `src/components/pokemon/PokemonDetail.tsx` - Integrate new sections

**Patterns Applied:**
- Component pattern from architecture.md (Props interface, functional component)
- Hook pattern with TanStack Query (queryKey, queryFn, staleTime)
- Type colors from `tailwind.config.js` for consistency

## Detailed Design

### Services and Modules

| Module | Responsibility | Inputs | Outputs |
|--------|---------------|--------|---------|
| `src/components/pokemon/PokemonStats.tsx` | Render animated stat bars with colors | `stats: IPokemonStat[]` | JSX stat visualization |
| `src/components/pokemon/TypeEffectiveness.tsx` | Display type matchups | `types: IPokemonType[]` | JSX weakness/resistance grid |
| `src/components/pokemon/EvolutionChain.tsx` | Visualize evolution tree | `speciesId: number` | JSX evolution flow |
| `src/hooks/useTypeEffectiveness.ts` | Calculate combined type effectiveness | `types: string[]` | `{ weaknesses, resistances, immunities }` |
| `src/hooks/useEvolutionChain.ts` | Fetch evolution chain data | `speciesId: number` | `{ chain, isLoading, error }` |

### Data Models and Contracts

```typescript
// src/types/pokemon.ts (additions)

// Type damage relations from PokeAPI /type/{id}
interface ITypeRelations {
  double_damage_from: INamedResource[];
  double_damage_to: INamedResource[];
  half_damage_from: INamedResource[];
  half_damage_to: INamedResource[];
  no_damage_from: INamedResource[];
  no_damage_to: INamedResource[];
}

interface ITypeResponse {
  id: number;
  name: string;
  damage_relations: ITypeRelations;
}

// Evolution chain from PokeAPI /evolution-chain/{id}
interface IEvolutionChain {
  id: number;
  chain: IEvolutionNode;
}

interface IEvolutionNode {
  species: INamedResource;
  evolution_details: IEvolutionDetail[];
  evolves_to: IEvolutionNode[];
}

interface IEvolutionDetail {
  trigger: INamedResource;
  min_level: number | null;
  item: INamedResource | null;
}

// Pokemon species for evolution chain reference
interface IPokemonSpecies {
  id: number;
  name: string;
  evolution_chain: {
    url: string;
  };
}

// Calculated effectiveness result
interface ITypeEffectiveness {
  weaknesses: { type: string; multiplier: number }[];   // 2x or 4x
  resistances: { type: string; multiplier: number }[];  // 0.5x or 0.25x
  immunities: string[];                                  // 0x
}

// Named resource helper (common PokeAPI pattern)
interface INamedResource {
  name: string;
  url: string;
}
```

### APIs and Interfaces

**New API Functions (`src/lib/api.ts`):**

| Function | Method | Endpoint | Response Type |
|----------|--------|----------|---------------|
| `fetchType(name)` | GET | `/type/{name}` | `ITypeResponse` |
| `fetchPokemonSpecies(id)` | GET | `/pokemon-species/{id}` | `IPokemonSpecies` |
| `fetchEvolutionChain(id)` | GET | `/evolution-chain/{id}` | `IEvolutionChain` |

```typescript
// src/lib/api.ts (additions)

export async function fetchType(name: string): Promise<ITypeResponse> {
  const response = await fetch(`${BASE_URL}/type/${name}`);
  if (!response.ok) {
    throw new Error(`Type not found: ${name}`);
  }
  return response.json();
}

export async function fetchPokemonSpecies(id: number): Promise<IPokemonSpecies> {
  const response = await fetch(`${BASE_URL}/pokemon-species/${id}`);
  if (!response.ok) {
    throw new Error(`Species not found: ${id}`);
  }
  return response.json();
}

export async function fetchEvolutionChain(id: number): Promise<IEvolutionChain> {
  const response = await fetch(`${BASE_URL}/evolution-chain/${id}`);
  if (!response.ok) {
    throw new Error(`Evolution chain not found: ${id}`);
  }
  return response.json();
}
```

**New Hooks:**

```typescript
// src/hooks/useTypeEffectiveness.ts
export function useTypeEffectiveness(types: string[]) {
  const typeQueries = useQueries({
    queries: types.map(type => ({
      queryKey: ['type', type],
      queryFn: () => fetchType(type),
      staleTime: 10 * 60 * 1000, // 10 minutes (type data rarely changes)
    })),
  });

  const effectiveness = useMemo(() => {
    if (typeQueries.some(q => q.isLoading || !q.data)) return null;
    return calculateEffectiveness(typeQueries.map(q => q.data!));
  }, [typeQueries]);

  return {
    data: effectiveness,
    isLoading: typeQueries.some(q => q.isLoading),
    error: typeQueries.find(q => q.error)?.error,
  };
}

// src/hooks/useEvolutionChain.ts
export function useEvolutionChain(pokemonId: number) {
  // First fetch species to get evolution chain URL
  const speciesQuery = useQuery({
    queryKey: ['pokemon-species', pokemonId],
    queryFn: () => fetchPokemonSpecies(pokemonId),
    staleTime: 10 * 60 * 1000,
  });

  // Extract chain ID from URL
  const chainId = speciesQuery.data?.evolution_chain.url
    ? extractIdFromUrl(speciesQuery.data.evolution_chain.url)
    : null;

  // Then fetch evolution chain
  const chainQuery = useQuery({
    queryKey: ['evolution-chain', chainId],
    queryFn: () => fetchEvolutionChain(chainId!),
    enabled: !!chainId,
    staleTime: 10 * 60 * 1000,
  });

  return {
    data: chainQuery.data?.chain,
    isLoading: speciesQuery.isLoading || chainQuery.isLoading,
    error: speciesQuery.error || chainQuery.error,
  };
}
```

### Workflows and Sequencing

**Story Execution Order:**

```
Story 3.1: Stats Visualization
    ↓ (provides PokemonStats component)
Story 3.2: Type Effectiveness Display
    ↓ (provides TypeEffectiveness, useTypeEffectiveness)
Story 3.3: Evolution Chain Visualization
    ↓ (provides EvolutionChain, useEvolutionChain)
Story 3.4: Type Badge Interaction
    (modifies TypeBadge, requires Browse page filter support from Epic 4.2)
```

**Data Flow - Stats Visualization:**

```
1. PokemonDetail receives IPokemon
2. Extract stats array from Pokemon data
3. PokemonStats maps stats to bar components
4. Each bar animates from 0 to stat value on mount
5. Color determined by stat value threshold
```

**Data Flow - Type Effectiveness:**

```
1. PokemonDetail extracts type names from Pokemon
2. useTypeEffectiveness fetches /type/{name} for each type
3. calculateEffectiveness combines damage relations
   - Dual types: multiply modifiers (2x × 2x = 4x, 2x × 0.5x = 1x)
4. TypeEffectiveness displays categorized results
```

**Data Flow - Evolution Chain:**

```
1. PokemonDetail passes Pokemon ID
2. useEvolutionChain fetches /pokemon-species/{id}
3. Extract evolution_chain URL → fetch /evolution-chain/{id}
4. EvolutionChain recursively renders chain nodes
5. Each node shows sprite, name; click navigates to Pokemon
```

**Type Effectiveness Calculation Algorithm:**

```typescript
function calculateEffectiveness(types: ITypeResponse[]): ITypeEffectiveness {
  const multipliers: Record<string, number> = {};

  // Initialize all types at 1x
  ALL_TYPES.forEach(t => multipliers[t] = 1);

  // Multiply damage modifiers for each Pokemon type
  for (const type of types) {
    type.damage_relations.double_damage_from.forEach(t =>
      multipliers[t.name] *= 2
    );
    type.damage_relations.half_damage_from.forEach(t =>
      multipliers[t.name] *= 0.5
    );
    type.damage_relations.no_damage_from.forEach(t =>
      multipliers[t.name] *= 0
    );
  }

  // Categorize results
  return {
    weaknesses: Object.entries(multipliers)
      .filter(([_, m]) => m > 1)
      .map(([type, multiplier]) => ({ type, multiplier })),
    resistances: Object.entries(multipliers)
      .filter(([_, m]) => m > 0 && m < 1)
      .map(([type, multiplier]) => ({ type, multiplier })),
    immunities: Object.entries(multipliers)
      .filter(([_, m]) => m === 0)
      .map(([type]) => type),
  };
}
```

## Non-Functional Requirements

### Performance

| Metric | Target | Implementation |
|--------|--------|----------------|
| Stat bar animation | 60fps | CSS transitions, no JS animation loop |
| Type effectiveness calculation | < 100ms | Client-side calculation after API fetch |
| Evolution chain render | < 500ms | Parallel sprite loading with placeholders |
| API response caching | 10 min staleTime | Type and species data rarely changes |

**Optimization Strategies:**
- Stat bars use CSS `transition` property for smooth 60fps animation
- Type data cached aggressively (10 minute staleTime) since type relations never change
- Evolution chain sprites lazy-loaded with skeleton placeholders
- useQueries for parallel type fetches (dual-type Pokemon)

### Security

- No new security concerns for this epic
- All data is read-only from public PokeAPI
- No user input stored or transmitted
- Type badge navigation uses React Router (no raw URL manipulation)

### Reliability/Availability

- **Graceful degradation:** If type effectiveness fetch fails, show "Unable to load type matchups" with retry
- **Evolution chain fallback:** If evolution data unavailable, show "Evolution data unavailable"
- **Stat visualization:** Stats come from existing Pokemon data (already fetched), no additional failure points
- **TanStack Query retry:** 3 automatic retries on API failures

### Observability

- Console logging for type effectiveness calculation in development
- TanStack Query DevTools shows cache state for type/species/evolution queries
- No production telemetry in MVP
- Error boundaries catch rendering failures in visualization components

## Dependencies and Integrations

**No New Dependencies Required**

All dependencies already installed in Epic 1:

| Package | Version | Used For |
|---------|---------|----------|
| @tanstack/react-query | ^5.90.12 | useQueries for parallel type fetches, useQuery for evolution |
| react-router-dom | ^7.10.1 | Navigation from evolution sprites and type badges |
| tailwindcss | ^3.4.19 | Stat bar styling, type colors |
| lucide-react | ^0.561.0 | Arrow icons for evolution chain |
| clsx + tailwind-merge | ^2.1.1 / ^3.4.0 | Conditional class styling |

**PokeAPI.co Integration Points:**

| Endpoint | Purpose | Called By |
|----------|---------|-----------|
| `GET /type/{name}` | Type damage relations | `useTypeEffectiveness` |
| `GET /pokemon-species/{id}` | Evolution chain URL | `useEvolutionChain` |
| `GET /evolution-chain/{id}` | Evolution tree data | `useEvolutionChain` |

**Internal Dependencies (from previous epics):**

| Module | Dependency | Purpose |
|--------|------------|---------|
| PokemonStats | IPokemonStat[] from usePokemon | Stats data already fetched |
| TypeEffectiveness | IPokemonType[] from usePokemon | Type names for API calls |
| EvolutionChain | Pokemon ID from route params | Starting point for chain |
| TypeBadge (modified) | react-router-dom useNavigate | Navigate to browse with filter |

**Story 3.4 Cross-Epic Dependency:**

Story 3.4 (Type Badge Interaction) links to `/browse?type={type}`. This URL works immediately (Browse page exists), but full filtering functionality requires Epic 4 Story 4.2 (Type Filter). Until then, clicking a type badge navigates to Browse but won't filter results.

**Recommended approach:** Implement Story 3.4 to navigate to `/browse?type={type}`. The Browse page can read the query param and display a "Type filtering coming soon" message until Epic 4.2 is complete.

## Acceptance Criteria (Authoritative)

**Story 3.1: Stats Visualization**
1. **AC1:** Pokemon detail page shows HP, Attack, Defense, Sp.Atk, Sp.Def, Speed as horizontal bars
2. **AC2:** Bars are colored by stat value (0-50 red, 50-100 yellow, 100+ green)
3. **AC3:** Numeric stat values are displayed next to each bar
4. **AC4:** Max stat reference (255) is shown for scale
5. **AC5:** Total base stats sum is displayed
6. **AC6:** Bars animate from 0 to stat value on component mount

**Story 3.2: Type Effectiveness Display**
7. **AC7:** "Weak To" section shows attacking types with 2x or 4x damage multiplier
8. **AC8:** "Resistant To" section shows types with 0.5x or 0.25x damage multiplier
9. **AC9:** "Immune To" section shows types with 0x damage (if any)
10. **AC10:** Dual-type Pokemon show combined effectiveness (4x, 2x, 1x, 0.5x, 0.25x, 0x)
11. **AC11:** Type badges in effectiveness display use consistent Pokemon type colors

**Story 3.3: Evolution Chain Visualization**
12. **AC12:** Evolution chain displays all stages with sprites and names
13. **AC13:** Clicking any evolution sprite navigates to that Pokemon's detail page
14. **AC14:** Branching evolutions (e.g., Eevee) display all branches correctly
15. **AC15:** Pokemon with no evolutions show "Does not evolve" message
16. **AC16:** Arrow or connector shows evolution direction

**Story 3.4: Type Badge Interaction**
17. **AC17:** Type badges show hover state indicating clickability
18. **AC18:** Clicking a type badge navigates to `/browse?type={type}`
19. **AC19:** Navigation preserves browser history (back button works)

## Traceability Mapping

| AC | Spec Section | Component/API | Test Idea |
|----|--------------|---------------|-----------|
| AC1 | Stats Visualization | PokemonStats | Visual: 6 stat bars rendered |
| AC2 | Stats Visualization | PokemonStats | Unit: color thresholds |
| AC3 | Stats Visualization | PokemonStats | Visual: numbers visible |
| AC4 | Stats Visualization | PokemonStats | Visual: max reference shown |
| AC5 | Stats Visualization | PokemonStats | Unit: sum calculation |
| AC6 | Stats Visualization | PokemonStats | Visual: animation on mount |
| AC7 | Type Effectiveness | TypeEffectiveness | Unit: weakness display |
| AC8 | Type Effectiveness | TypeEffectiveness | Unit: resistance display |
| AC9 | Type Effectiveness | TypeEffectiveness | Unit: immunity display |
| AC10 | Type Effectiveness | calculateEffectiveness | Unit: dual-type math |
| AC11 | Type Effectiveness | TypeBadge | Visual: colors match |
| AC12 | Evolution Chain | EvolutionChain | Visual: chain renders |
| AC13 | Evolution Chain | EvolutionChain | E2E: click navigates |
| AC14 | Evolution Chain | EvolutionChain | Unit: branching logic |
| AC15 | Evolution Chain | EvolutionChain | Unit: no-evolution case |
| AC16 | Evolution Chain | EvolutionChain | Visual: arrows visible |
| AC17 | Type Badge | TypeBadge | Visual: hover state |
| AC18 | Type Badge | TypeBadge onClick | E2E: navigation |
| AC19 | Type Badge | React Router | E2E: back button |

## Risks, Assumptions, Open Questions

**Risks:**
- **R1:** Type effectiveness calculation complexity for dual-types → Mitigation: Thorough unit tests for edge cases (4x weakness, immunity override)
- **R2:** Evolution chain data may have complex branching (Eevee has 8) → Mitigation: Recursive component with tested branching logic
- **R3:** PokeAPI rate limits during parallel type fetches → Mitigation: Cache type data aggressively (10 min staleTime)

**Assumptions:**
- **A1:** All Pokemon have stats data available from `/pokemon/{id}` endpoint
- **A2:** Type damage relations are consistent and complete in PokeAPI
- **A3:** Evolution chain structure is consistent across all Pokemon
- **A4:** Sprites are available for all Pokemon in evolution chains

**Open Questions:**
- None - Epic 4 type filtering is already implemented, so Story 3.4 can fully integrate

## Test Strategy Summary

**Unit Tests (Vitest):**
- `calculateEffectiveness` - single type, dual type, immunity cases
- `PokemonStats` - color threshold logic, stat sum
- `extractIdFromUrl` - URL parsing utility

**Component Tests (RTL):**
- `PokemonStats` - renders 6 bars with correct values
- `TypeEffectiveness` - displays weaknesses, resistances, immunities
- `EvolutionChain` - renders linear chain, handles branching
- `TypeBadge` - onClick triggers navigation

**Integration Tests:**
- Type effectiveness flow: Pokemon loads → types extracted → effectiveness calculated → displayed
- Evolution chain flow: Pokemon ID → species fetch → chain fetch → render
- Type badge navigation: click → URL change → browse page

**Test Commands:**
```bash
npm run test           # Run all tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

**Coverage Target:** 80% for hooks and components in this epic
