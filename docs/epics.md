# bmad-pokedex - Epic Breakdown

**Author:** JE
**Date:** 2025-12-12
**Source:** [PRD](./PRD.md) | [Architecture](./architecture.md)

---

## Overview

This document decomposes the PRD requirements into 5 epics with bite-sized stories for dev agent implementation. Each story is vertically sliced and completable in a single focused session.

### Epic Summary

| Epic | Title | Stories | Focus |
|------|-------|---------|-------|
| 1 | Foundation & Setup | 4 | Project infrastructure |
| 2 | Pokemon Discovery | 5 | Core MVP features |
| 3 | Visual Enhancements | 4 | Stats, types, evolution |
| 4 | Browse & Filter | 4 | Grid view, filtering |
| 5 | Polish & Performance | 3 | Caching, UX, mobile |

**Total Stories:** 20

---

## Epic 1: Foundation & Setup

**Goal:** Establish project infrastructure, core dependencies, and API integration foundation.

**Value:** Enables all subsequent development with consistent patterns and tooling.

**PRD Coverage:** Infrastructure for all FRs

---

### Story 1.1: Project Initialization

As a **developer**,
I want **the project scaffolded with Vite, React, and TypeScript**,
So that **I have a working development environment**.

**Acceptance Criteria:**

**Given** no project exists
**When** I run the setup commands from architecture.md
**Then** a working Vite + React + TypeScript project is created

**And** `npm run dev` starts the development server
**And** `npm run build` produces a production build
**And** TypeScript compilation succeeds with no errors

**Prerequisites:** None (first story)

**Technical Notes:**
```bash
npm create vite@latest bmad-pokedex -- --template react-ts
cd bmad-pokedex
npm install
```

---

### Story 1.2: Tailwind & shadcn/ui Setup

As a **developer**,
I want **Tailwind CSS and shadcn/ui configured**,
So that **I can build UI components with consistent styling**.

**Acceptance Criteria:**

**Given** the project from Story 1.1
**When** I add Tailwind and shadcn/ui
**Then** Tailwind utilities work in components

**And** `npx shadcn@latest init` completes successfully
**And** Pokemon type colors are defined in tailwind.config.js
**And** cn() utility function is available

**Prerequisites:** Story 1.1

**Technical Notes:**
- Add type colors: fire (#F08030), water (#6890F0), grass (#78C850), etc.
- Configure shadcn with default theme
- Install initial components: button, card, input, badge

---

### Story 1.3: Routing Setup

As a **user**,
I want **to navigate between pages via URLs**,
So that **I can bookmark and share Pokemon pages**.

**Acceptance Criteria:**

**Given** the app is running
**When** I navigate to `/`
**Then** the Home page loads

**And** `/pokemon/:id` loads the Pokemon detail page
**And** `/browse` loads the Browse page
**And** invalid routes show a 404 page

**Prerequisites:** Story 1.2

**Technical Notes:**
- Use React Router v6
- Create pages: Home.tsx, Pokemon.tsx, Browse.tsx, NotFound.tsx
- Create Layout component with Header

---

### Story 1.4: PokeAPI Client Setup

As a **developer**,
I want **a configured API client for PokeAPI**,
So that **all components can fetch Pokemon data consistently**.

**Acceptance Criteria:**

**Given** the routing is set up
**When** I import the API client
**Then** I can call `fetchPokemon(id)` and get Pokemon data

**And** TanStack Query is configured with QueryClientProvider
**And** default staleTime is 5 minutes
**And** API errors are handled gracefully

**Prerequisites:** Story 1.3

**Technical Notes:**
- Create `src/lib/api.ts` with fetch functions
- Configure QueryClient in main.tsx
- Create type definitions in `src/types/pokemon.ts`
- Base URL: `https://pokeapi.co/api/v2`

---

## Epic 2: Pokemon Discovery

**Goal:** Deliver the core discovery experience - random Pokemon, search, and detail view.

**Value:** This is the MVP magic - users can discover Pokemon instantly.

**PRD Coverage:** FR1 (Random), FR2 (Search), FR3 (Detail basics)

---

### Story 2.1: Random Pokemon Display

As a **user**,
I want **to see a random Pokemon when I land on the homepage**,
So that **I can immediately start exploring**.

**Acceptance Criteria:**

**Given** I visit the homepage
**When** the page loads
**Then** a random Pokemon is displayed with name, number, types, and artwork

**And** clicking "Discover Another" loads a different random Pokemon
**And** a loading skeleton shows while fetching
**And** errors display a friendly message with retry option

**Prerequisites:** Story 1.4

**Technical Notes:**
- Create `useRandomPokemon` hook (random ID 1-1010)
- Create `PokemonCard` component
- Create `PokemonCardSkeleton` for loading state
- Use official artwork from sprites.other['official-artwork']

---

### Story 2.2: Pokemon Search Input

As a **user**,
I want **to search for Pokemon by typing their name**,
So that **I can quickly find specific Pokemon**.

**Acceptance Criteria:**

**Given** I am on any page with the search bar
**When** I type "pika"
**Then** matching Pokemon appear in a dropdown within 500ms

**And** results are debounced (300ms)
**And** search works with partial names
**And** search by number works (e.g., "25")
**And** maximum 10 results shown

**Prerequisites:** Story 2.1

**Technical Notes:**
- Create `SearchBar` component in Header
- Create `usePokemonSearch` hook with debounce
- Pre-fetch Pokemon name list for client-side filtering
- Use Combobox pattern from shadcn/ui

---

### Story 2.3: Search Result Navigation

As a **user**,
I want **to click a search result and see that Pokemon**,
So that **I can view details of the Pokemon I searched for**.

**Acceptance Criteria:**

**Given** search results are displayed
**When** I click on a result
**Then** I navigate to `/pokemon/:id`

**And** the search dropdown closes
**And** keyboard navigation works (arrow keys, enter)
**And** clicking outside closes dropdown

**Prerequisites:** Story 2.2

**Technical Notes:**
- Use React Router's `useNavigate`
- Handle keyboard events for accessibility
- Clear search input after selection

---

### Story 2.4: Pokemon Detail Page - Basic

As a **user**,
I want **to see a Pokemon's basic information**,
So that **I can learn about that Pokemon**.

**Acceptance Criteria:**

**Given** I navigate to `/pokemon/25`
**When** the page loads
**Then** I see Pikachu's name, number (#025), and types

**And** official artwork is prominently displayed
**And** height and weight are shown
**And** loading skeleton displays while fetching
**And** 404 page shows for invalid Pokemon

**Prerequisites:** Story 2.3

**Technical Notes:**
- Create `PokemonDetail` component
- Create `TypeBadge` component with type colors
- Create `usePokemon(id)` hook
- Format number with leading zeros

---

### Story 2.5: Pokemon Navigation

As a **user**,
I want **to browse to the next or previous Pokemon**,
So that **I can explore Pokemon sequentially**.

**Acceptance Criteria:**

**Given** I am on `/pokemon/25` (Pikachu)
**When** I click "Next"
**Then** I navigate to `/pokemon/26` (Raichu)

**And** "Previous" navigates to `/pokemon/24`
**And** navigation wraps (1 → 1010, 1010 → 1)
**And** keyboard shortcuts work (← →)

**Prerequisites:** Story 2.4

**Technical Notes:**
- Add prev/next buttons to PokemonDetail
- Prefetch adjacent Pokemon on hover
- Handle edge cases (first/last Pokemon)

---

## Epic 3: Visual Enhancements

**Goal:** Add visual polish to Pokemon detail view - stats, type effectiveness, evolution chain.

**Value:** Makes the detail view informative and visually engaging.

**PRD Coverage:** FR3.3 (Stats), FR3.4 (Type effectiveness), FR3.5 (Evolution)

---

### Story 3.1: Stats Visualization

As a **user**,
I want **to see a Pokemon's stats as a visual chart**,
So that **I can quickly understand its strengths**.

**Acceptance Criteria:**

**Given** I am on a Pokemon detail page
**When** the stats section loads
**Then** I see HP, Attack, Defense, Sp.Atk, Sp.Def, Speed as bars

**And** bars are colored by stat value (green=high, red=low)
**And** numeric values are displayed
**And** max stat (255) shown as reference
**And** total base stats displayed

**Prerequisites:** Story 2.4

**Technical Notes:**
- Create `PokemonStats` component
- Use horizontal bar chart (simpler than radar)
- Animate bars on load
- Color scale: 0-50 red, 50-100 yellow, 100+ green

---

### Story 3.2: Type Effectiveness Display

As a **user**,
I want **to see what types a Pokemon is weak or strong against**,
So that **I can understand battle matchups**.

**Acceptance Criteria:**

**Given** I am viewing a Pokemon detail page
**When** the type section loads
**Then** I see "2x Weak To" with attacking type badges

**And** "2x Strong Against" shows defending weaknesses
**And** "Immune To" shows 0x damage types
**And** dual-type Pokemon show combined effectiveness

**Prerequisites:** Story 3.1

**Technical Notes:**
- Create `TypeEffectiveness` component
- Fetch `/type/{id}` for damage relations
- Create `useTypeEffectiveness` hook
- Handle dual-type calculation (4x, 0.25x)

---

### Story 3.3: Evolution Chain Visualization

As a **user**,
I want **to see a Pokemon's evolution chain**,
So that **I can understand how it evolves**.

**Acceptance Criteria:**

**Given** I am viewing Pikachu's detail page
**When** the evolution section loads
**Then** I see: Pichu → Pikachu → Raichu with sprites

**And** clicking a sprite navigates to that Pokemon
**And** branching evolutions display correctly (Eevee)
**And** Pokemon with no evolutions show "Does not evolve"

**Prerequisites:** Story 3.2

**Technical Notes:**
- Create `EvolutionChain` component
- Fetch `/pokemon-species/{id}` then `/evolution-chain/{id}`
- Create `useEvolutionChain` hook
- Handle complex chains (Eevee has 8 branches)

---

### Story 3.4: Type Badge Interaction

As a **user**,
I want **to click a type badge to see all Pokemon of that type**,
So that **I can explore Pokemon by type**.

**Acceptance Criteria:**

**Given** I see a type badge (e.g., "Electric" on Pikachu)
**When** I click the badge
**Then** I navigate to `/browse?type=electric`

**And** the browse page filters by that type
**And** badge shows hover state indicating clickability

**Prerequisites:** Story 3.3, Story 4.2 (type filtering)

**Technical Notes:**
- Add onClick to TypeBadge component
- Pass type as URL query parameter
- Read query params in Browse page

---

## Epic 4: Browse & Filter

**Goal:** Enable browsing all Pokemon with filtering by type and generation.

**Value:** Complete exploration experience - users can discover all 1000+ Pokemon.

**PRD Coverage:** FR4 (Type Filter), FR5 (Gen Filter), FR6 (Browse)

---

### Story 4.1: Pokemon Grid View

As a **user**,
I want **to browse Pokemon in a grid layout**,
So that **I can see many Pokemon at once**.

**Acceptance Criteria:**

**Given** I navigate to `/browse`
**When** the page loads
**Then** I see Pokemon displayed in a responsive grid

**And** each card shows sprite, name, number, types
**And** clicking a card navigates to detail view
**And** grid adapts to screen size (2-4 columns)
**And** pagination or infinite scroll loads more

**Prerequisites:** Story 2.4

**Technical Notes:**
- Create Browse page with grid layout
- Reuse PokemonCard component (smaller variant)
- Use `usePokemonList` hook with pagination
- Start with first 20, load more on scroll

---

### Story 4.2: Type Filter

As a **user**,
I want **to filter Pokemon by type**,
So that **I can find Pokemon of a specific type**.

**Acceptance Criteria:**

**Given** I am on the Browse page
**When** I click the "Fire" type filter
**Then** only Fire-type Pokemon are displayed

**And** multiple types can be selected (OR logic)
**And** selected filters show as active pills
**And** "Clear filters" resets to all Pokemon
**And** URL updates with filter state (?type=fire)

**Prerequisites:** Story 4.1

**Technical Notes:**
- Create `TypeFilter` component with 18 type pills
- Filter client-side from cached list
- Sync filter state with URL params
- Show count of matching Pokemon

---

### Story 4.3: Generation Filter

As a **user**,
I want **to filter Pokemon by game generation**,
So that **I can explore Pokemon from specific games**.

**Acceptance Criteria:**

**Given** I am on the Browse page
**When** I select "Gen 1" from the dropdown
**Then** only Pokemon #1-151 are displayed

**And** generation filter combines with type filter
**And** URL updates (?gen=1&type=fire)
**And** all 9 generations are available

**Prerequisites:** Story 4.2

**Technical Notes:**
- Create generation dropdown/select
- Define generation ranges (Gen 1: 1-151, Gen 2: 152-251, etc.)
- Combine filters with AND logic
- Fetch `/generation/{id}` for accurate ranges

---

### Story 4.4: Filter State Persistence

As a **user**,
I want **my filters to persist when navigating**,
So that **I don't lose my place when viewing a Pokemon**.

**Acceptance Criteria:**

**Given** I have filters applied on Browse page
**When** I click a Pokemon and then go back
**Then** my filters are still applied

**And** filters are stored in URL (shareable)
**And** direct link to filtered view works
**And** clear filters returns to default state

**Prerequisites:** Story 4.3

**Technical Notes:**
- Use URL search params for all filter state
- Use React Router's useSearchParams hook
- Back button preserves filter state naturally

---

## Epic 5: Polish & Performance

**Goal:** Production-ready polish - caching, loading states, mobile optimization.

**Value:** Smooth, fast experience that meets NFR targets.

**PRD Coverage:** Performance NFRs, Accessibility NFRs

---

### Story 5.1: Caching Layer

As a **user**,
I want **Pokemon data to load instantly when revisiting**,
So that **I don't wait for repeated API calls**.

**Acceptance Criteria:**

**Given** I have viewed Pikachu previously
**When** I navigate to Pikachu again
**Then** data displays instantly from cache

**And** cache persists across page refreshes (localStorage)
**And** stale data shows while revalidating
**And** cache can be cleared manually (dev tools)

**Prerequisites:** Story 2.4

**Technical Notes:**
- Configure TanStack Query persistor
- Use localStorage for query cache
- Set appropriate staleTime (5 min) and gcTime (24 hr)
- Install @tanstack/query-sync-storage-persister

---

### Story 5.2: Loading & Error States

As a **user**,
I want **clear feedback during loading and errors**,
So that **I know what's happening**.

**Acceptance Criteria:**

**Given** data is loading
**When** I view any page
**Then** skeleton loaders show content shape

**And** error states show friendly message
**And** retry button is available on errors
**And** no blank screens ever appear

**Prerequisites:** Story 5.1

**Technical Notes:**
- Create skeleton components for all views
- Create ErrorState component with retry
- Use Suspense boundaries where appropriate
- Test with slow network throttling

---

### Story 5.3: Mobile Optimization

As a **mobile user**,
I want **the app to work great on my phone**,
So that **I can browse Pokemon anywhere**.

**Acceptance Criteria:**

**Given** I am on a mobile device
**When** I use the app
**Then** all interactions work with touch

**And** text is readable without zooming
**And** buttons are touch-friendly (44px min)
**And** navigation is thumb-reachable
**And** images load appropriately for screen size

**Prerequisites:** Story 5.2

**Technical Notes:**
- Test all breakpoints (mobile, tablet, desktop)
- Ensure touch targets meet accessibility guidelines
- Optimize images for mobile (smaller sprites)
- Test on real devices or emulators

---

## Requirement Traceability

| PRD Requirement | Stories |
|-----------------|---------|
| FR1: Random Pokemon | 2.1 |
| FR2: Pokemon Search | 2.2, 2.3 |
| FR3: Pokemon Detail | 2.4, 2.5, 3.1, 3.2, 3.3, 3.4 |
| FR4: Type Filtering | 4.2, 3.4 |
| FR5: Generation Filtering | 4.3 |
| FR6: Pokemon Browse | 4.1, 4.4 |
| NFR: Performance | 5.1, 5.2 |
| NFR: Accessibility | 5.3 |

---

## Implementation Sequence

```
Epic 1 (Foundation)
  └── 1.1 → 1.2 → 1.3 → 1.4

Epic 2 (Discovery) - can start after 1.4
  └── 2.1 → 2.2 → 2.3 → 2.4 → 2.5

Epic 3 (Visual) - can start after 2.4
  └── 3.1 → 3.2 → 3.3 → 3.4

Epic 4 (Browse) - can start after 2.4
  └── 4.1 → 4.2 → 4.3 → 4.4

Epic 5 (Polish) - can start after 2.4
  └── 5.1 → 5.2 → 5.3
```

**Note:** Epics 3, 4, 5 can run in parallel after Epic 2.4 is complete.

---

_For implementation: Use `/bmad:bmm:workflows:create-story` to generate individual story implementation plans._
