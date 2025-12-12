# bmad-pokedex Architecture

## Executive Summary

A lightweight React SPA built with Vite, consuming PokeAPI.co for Pokemon data. Client-side only architecture with no backend. Focus on fast load times, clean UI, and instant search experience.

## Project Initialization

**First implementation story should execute:**

```bash
npm create vite@latest bmad-pokedex -- --template react-ts
cd bmad-pokedex
npm install
```

**Then add core dependencies:**

```bash
# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# shadcn/ui setup
npx shadcn@latest init

# Routing
npm install react-router-dom

# API State Management
npm install @tanstack/react-query

# Dev tooling
npm install -D prettier eslint-config-prettier
```

## Decision Summary

| Category | Decision | Version | Affects Epics | Rationale |
|----------|----------|---------|---------------|-----------|
| Framework | Vite + React | Vite 5.x, React 18.x | All | Fast dev server, simple SPA |
| Language | TypeScript | 5.x | All | Type safety, better DX |
| Styling | Tailwind CSS | 3.x | All | Utility-first, rapid UI development |
| Components | shadcn/ui | Latest | All UI | Accessible, customizable, Radix-based |
| Routing | React Router | v6 | Navigation | Standard React routing |
| API State | TanStack Query | v5 | API calls | Caching, loading states, refetch |
| HTTP Client | Native fetch | - | API calls | Simple, no extra dependency |
| Testing | Vitest + RTL | Latest | All | Fast, Vite-native |
| Linting | ESLint + Prettier | Latest | All | Code consistency |

## Project Structure

```
bmad-pokedex/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── badge.tsx
│   │   ├── pokemon/               # Pokemon-specific components
│   │   │   ├── PokemonCard.tsx
│   │   │   ├── PokemonDetail.tsx
│   │   │   ├── PokemonStats.tsx
│   │   │   ├── TypeBadge.tsx
│   │   │   ├── EvolutionChain.tsx
│   │   │   └── SearchBar.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── Layout.tsx
│   ├── hooks/
│   │   ├── usePokemon.ts          # Single Pokemon fetch
│   │   ├── usePokemonList.ts      # List/search fetch
│   │   ├── useRandomPokemon.ts    # Random Pokemon
│   │   └── useTypeEffectiveness.ts
│   ├── lib/
│   │   ├── api.ts                 # PokeAPI client
│   │   ├── utils.ts               # Utility functions (cn, etc.)
│   │   └── constants.ts           # Pokemon types, colors, etc.
│   ├── pages/
│   │   ├── Home.tsx               # Landing with random Pokemon
│   │   ├── Pokemon.tsx            # Detail view /pokemon/:id
│   │   └── Browse.tsx             # Grid view with filters
│   ├── types/
│   │   └── pokemon.ts             # TypeScript interfaces
│   ├── App.tsx                    # Router setup
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Tailwind imports
├── tests/
│   ├── components/
│   └── hooks/
├── .eslintrc.cjs
├── .prettierrc
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── package.json
```

## Epic to Architecture Mapping

| Epic | Components | Hooks | Pages |
|------|------------|-------|-------|
| Epic 1: Core Infrastructure | ui/*, Layout | - | App.tsx |
| Epic 2: Pokemon Discovery | PokemonCard, SearchBar | usePokemon, useRandomPokemon | Home |
| Epic 3: Visual Enhancements | PokemonStats, TypeBadge, EvolutionChain | useTypeEffectiveness | - |
| Epic 4: Browse & Filter | PokemonCard (grid) | usePokemonList | Browse |
| Epic 5: Polish & Performance | - (caching, loading states) | All hooks | All |

## Technology Stack Details

### Core Technologies

**Vite + React**
- Vite for fast HMR and optimized builds
- React 18 with functional components and hooks
- Strict TypeScript for type safety

**Tailwind CSS + shadcn/ui**
- Tailwind for utility-first styling
- shadcn/ui components copied into `src/components/ui/`
- Custom Pokemon type colors in `tailwind.config.js`

**TanStack Query**
- All PokeAPI calls wrapped in custom hooks
- Automatic caching (staleTime: 5 minutes for Pokemon data)
- Loading/error states handled consistently

### Integration Points

**PokeAPI.co**
- Base URL: `https://pokeapi.co/api/v2`
- No authentication required
- Rate limiting: Fair use (no hard limit, be reasonable)
- Endpoints used:
  - `GET /pokemon/{id|name}` - Pokemon details
  - `GET /pokemon?limit=20&offset=0` - List Pokemon
  - `GET /pokemon-species/{id}` - Species/evolution info
  - `GET /evolution-chain/{id}` - Evolution chain
  - `GET /type/{id}` - Type effectiveness

## Implementation Patterns

These patterns ensure consistent implementation across all AI agents:

### Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `PokemonCard.tsx` |
| Hooks | camelCase with `use` prefix | `usePokemon.ts` |
| Utilities | camelCase | `formatPokemonName.ts` |
| Types | PascalCase with `I` prefix for interfaces | `IPokemon` |
| CSS classes | Tailwind utilities | `className="flex items-center gap-2"` |
| Routes | kebab-case | `/pokemon/:id` |

### Component Pattern

```tsx
// All components follow this structure
interface PokemonCardProps {
  pokemon: IPokemon;
  onClick?: () => void;
}

export function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-lg" onClick={onClick}>
      {/* content */}
    </Card>
  );
}
```

### Hook Pattern (TanStack Query)

```tsx
// All API hooks follow this structure
export function usePokemon(idOrName: string | number) {
  return useQuery({
    queryKey: ['pokemon', idOrName],
    queryFn: () => fetchPokemon(idOrName),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### API Client Pattern

```tsx
// src/lib/api.ts
const BASE_URL = 'https://pokeapi.co/api/v2';

export async function fetchPokemon(idOrName: string | number): Promise<IPokemon> {
  const response = await fetch(`${BASE_URL}/pokemon/${idOrName}`);
  if (!response.ok) {
    throw new Error(`Pokemon not found: ${idOrName}`);
  }
  return response.json();
}
```

### Error Handling

- All API errors caught in TanStack Query
- Display user-friendly error messages
- Provide retry action for failed requests
- Log errors to console in development

```tsx
if (error) {
  return <ErrorState message="Could not load Pokemon" onRetry={refetch} />;
}
```

### Loading States

- Use skeleton components for loading
- Never show blank screens
- Consistent loading pattern across all pages

```tsx
if (isLoading) {
  return <PokemonCardSkeleton />;
}
```

## Consistency Rules

### Code Organization

- One component per file
- Co-locate tests with components: `PokemonCard.test.tsx`
- Shared types in `src/types/`
- All API logic in `src/lib/api.ts`
- All hooks in `src/hooks/`

### Styling

- Use Tailwind utilities, avoid custom CSS
- Pokemon type colors defined in `tailwind.config.js`:
  ```js
  colors: {
    pokemon: {
      fire: '#F08030',
      water: '#6890F0',
      grass: '#78C850',
      electric: '#F8D030',
      // ... all 18 types
    }
  }
  ```
- Use `cn()` utility for conditional classes

### Data Flow

```
User Action → Component → Hook (useQuery) → API Client → PokeAPI
                ↓
            UI Update ← Query Cache ← Response
```

## Data Architecture

### Key Types

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

interface IEvolutionChain {
  chain: IEvolutionNode;
}

interface IEvolutionNode {
  species: { name: string; url: string };
  evolves_to: IEvolutionNode[];
}
```

### Caching Strategy

- **Pokemon data**: 5 minute staleTime (rarely changes)
- **Pokemon list**: 10 minute staleTime
- **Search results**: No cache (always fresh)
- Use localStorage for persistent favorites (future feature)

## Security Architecture

- No sensitive data (public API, no auth)
- No user data stored
- CSP headers recommended for deployment
- HTTPS only in production

## Performance Considerations

- **Lazy load routes** with React.lazy()
- **Image optimization**: Use Pokemon sprite URLs, lazy load below fold
- **Bundle splitting**: Vite handles automatically
- **Query prefetching**: Prefetch on hover for detail pages
- **Debounced search**: 300ms debounce on search input

## Deployment Architecture

**Recommended: Vercel or Netlify (static hosting)**

```bash
npm run build  # Outputs to dist/
```

- Deploy `dist/` folder to any static host
- No server required
- CDN for assets

## Development Environment

### Prerequisites

- Node.js 18+
- npm 9+

### Setup Commands

```bash
git clone <repo>
cd bmad-pokedex
npm install
npm run dev     # Start dev server
npm run build   # Production build
npm run test    # Run tests
npm run lint    # Lint code
```

### VS Code Extensions (Recommended)

- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- Prettier
- ESLint

## Architecture Decision Records (ADRs)

### ADR-001: Vite over Next.js

**Decision:** Use Vite + React instead of Next.js

**Context:** Project is a pure SPA consuming external API, no SSR needed

**Rationale:**
- Simpler architecture for client-only app
- Faster development server
- Smaller bundle size
- No backend complexity

### ADR-002: TanStack Query for API State

**Decision:** Use TanStack Query instead of Redux/Zustand for API state

**Context:** Primary state is server data from PokeAPI

**Rationale:**
- Built-in caching and refetching
- Loading/error states handled
- Less boilerplate than Redux
- Perfect fit for API-heavy apps

### ADR-003: shadcn/ui Components

**Decision:** Use shadcn/ui over Material UI or Chakra

**Context:** Need accessible, customizable components

**Rationale:**
- Full code ownership (copy, don't install)
- Built on Radix (accessibility)
- Works seamlessly with Tailwind
- Smaller bundle (only import what you use)

---

_Generated by BMAD Decision Architecture Workflow v1.0_
_Date: 2025-12-12_
_For: JE_
