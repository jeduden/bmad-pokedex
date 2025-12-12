# Epic Technical Specification: Foundation & Setup

Date: 2025-12-12
Author: JE
Epic ID: 1
Status: Draft

---

## Overview

Epic 1 establishes the foundational infrastructure for bmad-pokedex, a Pokemon discovery web application. This epic delivers the project scaffolding with Vite, React 18, and TypeScript, along with core dependencies including Tailwind CSS, shadcn/ui components, React Router for navigation, and TanStack Query for API state management.

The goal is to create a working development environment with consistent patterns, tooling, and architecture that enables all subsequent development. Upon completion, developers will have a functioning local development server, production build pipeline, routing between pages, and a configured PokeAPI client ready for Pokemon data consumption.

## Objectives and Scope

**In Scope:**
- Project scaffolding with Vite + React + TypeScript template
- Tailwind CSS configuration with Pokemon type colors
- shadcn/ui component library setup (button, card, input, badge)
- React Router v6 with route definitions for Home, Pokemon detail, Browse, and 404
- TanStack Query configuration with QueryClientProvider
- PokeAPI client module with type definitions
- Base layout component with header
- Development tooling (ESLint, Prettier)

**Out of Scope:**
- Actual Pokemon display functionality (Epic 2)
- Search implementation (Epic 2)
- Stats visualization (Epic 3)
- Filtering features (Epic 4)
- Performance optimization and caching persistence (Epic 5)

## System Architecture Alignment

This epic implements the architecture foundation defined in `docs/architecture.md`:

**Components Created:**
- `src/components/ui/*` - shadcn/ui base components
- `src/components/layout/Layout.tsx` - App shell with header
- `src/components/layout/Header.tsx` - Navigation header

**Configuration Files:**
- `tailwind.config.js` - Tailwind with Pokemon type colors
- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript strict mode

**Constraints Applied:**
- Vite 5.x, React 18.x, TypeScript 5.x as specified
- TanStack Query v5 for API state management
- Native fetch (no axios dependency)
- Component naming: PascalCase
- Hook naming: camelCase with `use` prefix

## Detailed Design

### Services and Modules

| Module | Responsibility | Inputs | Outputs |
|--------|---------------|--------|---------|
| `src/lib/api.ts` | PokeAPI HTTP client | Pokemon ID/name | Pokemon data objects |
| `src/lib/utils.ts` | Utility functions | Various | `cn()` for class merging |
| `src/lib/constants.ts` | Static configuration | - | Type colors, API URL |
| `src/types/pokemon.ts` | TypeScript interfaces | - | `IPokemon`, `IPokemonType`, etc. |

### Data Models and Contracts

```typescript
// src/types/pokemon.ts

interface IPokemon {
  id: number;
  name: string;
  types: IPokemonType[];
  stats: IPokemonStat[];
  sprites: ISprites;
  height: number;
  weight: number;
}

interface IPokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

interface IPokemonStat {
  base_stat: number;
  stat: {
    name: string;
  };
}

interface ISprites {
  front_default: string;
  other: {
    'official-artwork': {
      front_default: string;
    };
  };
}

interface IPokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string }[];
}
```

### APIs and Interfaces

**PokeAPI Client (`src/lib/api.ts`):**

| Function | Method | Endpoint | Response Type |
|----------|--------|----------|---------------|
| `fetchPokemon(idOrName)` | GET | `/pokemon/{idOrName}` | `IPokemon` |
| `fetchPokemonList(limit, offset)` | GET | `/pokemon?limit={limit}&offset={offset}` | `IPokemonListResponse` |

```typescript
// src/lib/api.ts
const BASE_URL = 'https://pokeapi.co/api/v2';

export async function fetchPokemon(idOrName: string | number): Promise<IPokemon> {
  const response = await fetch(`${BASE_URL}/pokemon/${idOrName}`);
  if (!response.ok) {
    throw new Error(`Pokemon not found: ${idOrName}`);
  }
  return response.json();
}

export async function fetchPokemonList(
  limit: number = 20,
  offset: number = 0
): Promise<IPokemonListResponse> {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!response.ok) {
    throw new Error('Failed to fetch Pokemon list');
  }
  return response.json();
}
```

**Error Handling:**
- HTTP 404 → `Error: Pokemon not found: {id}`
- Network error → Native fetch error propagated
- TanStack Query handles retry logic (3 attempts)

### Workflows and Sequencing

**Story Execution Order:**

```
Story 1.1: Project Initialization
    ↓
Story 1.2: Tailwind & shadcn/ui Setup
    ↓
Story 1.3: Routing Setup
    ↓
Story 1.4: PokeAPI Client Setup
```

**Application Bootstrap Sequence:**

```
1. main.tsx loads
   ├── QueryClientProvider wraps App
   └── App.tsx renders

2. App.tsx initializes
   ├── BrowserRouter wraps routes
   └── Layout component renders

3. Layout renders
   ├── Header with navigation
   └── Outlet for page content

4. Route matched → Page component renders
```

## Non-Functional Requirements

### Performance

| Metric | Target | Source |
|--------|--------|--------|
| Dev server start | < 500ms | Vite default |
| HMR update | < 100ms | Vite default |
| Production build | < 30s | Vite default |
| Bundle size (initial) | < 100KB gzipped | Architecture spec |

- TanStack Query default staleTime: 5 minutes
- No SSR (pure SPA) per ADR-001

### Security

- No authentication required (public API)
- No sensitive data stored
- CSP headers recommended at deployment (not in this epic)
- HTTPS enforced in production deployment

### Reliability/Availability

- Local development: No external dependencies except npm registry
- Production: Relies on PokeAPI.co availability
- Graceful error handling for API failures
- No offline support in this epic (future enhancement)

### Observability

- Console logging in development mode
- React Query DevTools for development debugging
- No production telemetry in MVP

## Dependencies and Integrations

**Production Dependencies:**
| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.x | UI framework |
| react-dom | ^18.x | DOM rendering |
| react-router-dom | ^6.x | Client routing |
| @tanstack/react-query | ^5.x | API state management |

**Dev Dependencies:**
| Package | Version | Purpose |
|---------|---------|---------|
| vite | ^5.x | Build tool |
| typescript | ^5.x | Type checking |
| tailwindcss | ^3.x | Styling |
| postcss | ^8.x | CSS processing |
| autoprefixer | ^10.x | CSS vendor prefixes |
| eslint | ^8.x | Linting |
| prettier | ^3.x | Formatting |

**Integration Points:**
- PokeAPI.co: `https://pokeapi.co/api/v2` (no authentication)

## Acceptance Criteria (Authoritative)

1. **AC1:** Running `npm run dev` starts development server on localhost
2. **AC2:** Running `npm run build` produces production build in `dist/` without errors
3. **AC3:** TypeScript compilation succeeds with no errors (`tsc --noEmit`)
4. **AC4:** Tailwind utility classes apply styles correctly in components
5. **AC5:** shadcn/ui components (button, card, input, badge) are available for import
6. **AC6:** Pokemon type colors are defined in `tailwind.config.js` (fire, water, grass, electric, etc.)
7. **AC7:** `cn()` utility function is available from `@/lib/utils`
8. **AC8:** Navigating to `/` loads Home page component
9. **AC9:** Navigating to `/pokemon/:id` loads Pokemon detail page component
10. **AC10:** Navigating to `/browse` loads Browse page component
11. **AC11:** Navigating to invalid route shows 404 page
12. **AC12:** `fetchPokemon(25)` returns Pikachu data successfully
13. **AC13:** TanStack Query QueryClientProvider wraps the application
14. **AC14:** Default staleTime is configured to 5 minutes
15. **AC15:** API errors are caught and can be handled gracefully

## Traceability Mapping

| AC | Spec Section | Component/API | Test Idea |
|----|--------------|---------------|-----------|
| AC1 | Project Setup | vite.config.ts | Manual: run npm dev |
| AC2 | Project Setup | vite.config.ts | Manual: run npm build |
| AC3 | Project Setup | tsconfig.json | CI: tsc --noEmit |
| AC4 | Styling | tailwind.config.js | Visual: apply `bg-blue-500` |
| AC5 | UI Components | src/components/ui/* | Import test |
| AC6 | Styling | tailwind.config.js | Visual: apply `bg-pokemon-fire` |
| AC7 | Utilities | src/lib/utils.ts | Unit: cn('a', 'b') === 'a b' |
| AC8 | Routing | src/App.tsx, Home.tsx | E2E: navigate to / |
| AC9 | Routing | src/App.tsx, Pokemon.tsx | E2E: navigate to /pokemon/1 |
| AC10 | Routing | src/App.tsx, Browse.tsx | E2E: navigate to /browse |
| AC11 | Routing | src/App.tsx, NotFound.tsx | E2E: navigate to /invalid |
| AC12 | API Client | src/lib/api.ts | Integration: fetchPokemon(25) |
| AC13 | API State | src/main.tsx | Code review |
| AC14 | API State | src/main.tsx | Code review: QueryClient config |
| AC15 | Error Handling | src/lib/api.ts | Unit: fetchPokemon('invalid') |

## Risks, Assumptions, Open Questions

**Risks:**
- **R1:** npm registry unavailable during setup → Mitigation: Use cached packages, retry
- **R2:** shadcn/ui CLI changes → Mitigation: Pin to known working version
- **R3:** PokeAPI rate limiting during development → Mitigation: Cache responses, use staleTime

**Assumptions:**
- **A1:** Developer has Node.js 18+ and npm 9+ installed
- **A2:** PokeAPI.co is available and returns expected schema
- **A3:** Modern browser used for development (Chrome/Firefox/Edge)

**Open Questions:**
- None for Epic 1 (foundation is well-defined)

## Test Strategy Summary

**Unit Tests (Vitest):**
- `cn()` utility function
- API client functions (mock fetch)

**Integration Tests:**
- API client against PokeAPI (can be mocked)
- Route navigation renders correct components

**Manual Verification:**
- Dev server starts and hot reloads
- Production build succeeds
- All routes navigate correctly
- API call returns Pokemon data

**Test Coverage Target:** 80% for utility and API modules

**Test Commands:**
```bash
npm run test        # Run all tests
npm run test:watch  # Watch mode
npm run test:coverage  # Coverage report
```
