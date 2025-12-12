# bmad-pokedex - Epic Breakdown

**Author:** JE
**Date:** 2025-12-12
**Source:** [PRD](./PRD.md) | [Architecture](./architecture.md)

---

## Overview

This document decomposes the PRD requirements into 9 epics with bite-sized stories for dev agent implementation. Each story is vertically sliced and completable in a single focused session.

### Epic Summary

| Epic | Title | Stories | Focus | Status |
|------|-------|---------|-------|--------|
| 1 | Foundation & Setup | 4 | Project infrastructure | ✅ Complete |
| 2 | Pokemon Discovery | 5 | Core MVP features | ✅ Complete |
| 3 | Visual Enhancements | 4 | Stats, types, evolution | ✅ Complete |
| 4 | Browse & Filter | 4 | Grid view, filtering | ✅ Complete |
| 5 | Polish & Performance | 3 | Caching, UX, mobile | ✅ Complete |
| **6** | **Testing Foundation** | **4** | **Vitest, hook tests, patterns** | **Backlog** |
| **7** | **Comparison & Guided Paths** | **5** | **Compare UI, curated collections** | **Backlog** |
| **8** | **Team Builder** | **4** | **6-slot team, weakness analyzer** | **Backlog** |
| **9** | **Share & Social** | **3** | **URLs, copy/share, Open Graph** | **Backlog** |

**MVP Stories (1-5):** 20 ✅
**Growth Stories (6-9):** 16
**Total Stories:** 36

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

## Epic 6: Testing Foundation

**Goal:** Establish test infrastructure and cover critical untested hooks to enable confident development of new features.

**Value:** Pays down 5 epics of technical debt, prevents regressions, enables safe refactoring.

**PRD Coverage:** NFR (Quality), Retrospective Action Items

**Gate:** MUST complete before Epic 7 begins.

---

### Story 6.1: Vitest Infrastructure Setup

As a **developer**,
I want **Vitest and React Testing Library configured**,
So that **I can write and run tests for components and hooks**.

**Acceptance Criteria:**

**Given** the existing project
**When** I run `npm run test`
**Then** Vitest executes and reports results

**And** React Testing Library is available for component tests
**And** Hook testing utilities work for custom hooks
**And** Coverage reporting is configured (`npm run test:coverage`)
**And** Tests run in CI-compatible mode
**And** VSCode test explorer integration works

**Prerequisites:** None (first story of epic)

**Technical Notes:**
- Install: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`
- Configure `vitest.config.ts` with jsdom environment
- Add test scripts to package.json
- Create `src/test/setup.ts` for global test configuration
- Add example test to verify setup works

---

### Story 6.2: Type Effectiveness Hook Tests

As a **developer**,
I want **unit tests for `useTypeEffectiveness`**,
So that **type calculation logic is verified and protected from regressions**.

**Acceptance Criteria:**

**Given** the test infrastructure from Story 6.1
**When** I run tests for `useTypeEffectiveness`
**Then** all type calculation scenarios pass

**And** single-type Pokemon effectiveness is tested (Fire weak to Water)
**And** dual-type 4x weakness is tested (Grass/Flying 4x weak to Ice)
**And** dual-type 0.25x resistance is tested
**And** immunity scenarios are tested (Ground immune to Electric)
**And** edge cases covered (no weaknesses, all immunities)

**Prerequisites:** Story 6.1

**Technical Notes:**
- Test file: `src/hooks/__tests__/useTypeEffectiveness.test.ts`
- Mock PokeAPI type data responses
- Test pure calculation functions separately from hook
- Minimum 10 test cases covering the type matrix

---

### Story 6.3: Filter Hooks Tests

As a **developer**,
I want **unit tests for `useFilterParams` and `useBrowsePokemon`**,
So that **filter logic is verified and URL state is reliable**.

**Acceptance Criteria:**

**Given** test infrastructure is set up
**When** I run tests for filter hooks
**Then** all filter scenarios pass

**And** URL param parsing is tested (single type, multiple types, generation)
**And** URL param serialization is tested
**And** Type OR logic is verified
**And** Type + Generation AND combination is tested
**And** Empty/invalid params handled gracefully
**And** Filter clearing resets to defaults

**Prerequisites:** Story 6.2

**Technical Notes:**
- Test files: `src/hooks/__tests__/useFilterParams.test.ts`, `useBrowsePokemon.test.ts`
- Mock `useSearchParams` from React Router
- Test filter combination logic thoroughly
- Include edge cases: no filters, all filters, invalid values

---

### Story 6.4: Testing Patterns Documentation

As a **developer**,
I want **documented testing patterns and updated Story DoD**,
So that **all future stories include tests consistently**.

**Acceptance Criteria:**

**Given** tests exist for hooks
**When** I reference the testing documentation
**Then** I understand how to write tests for new code

**And** `docs/testing-patterns.md` documents hook testing approach
**And** Component testing patterns are documented
**And** Mocking patterns for PokeAPI are documented
**And** Story DoD template includes "Unit tests pass" criterion
**And** Code review checklist includes test verification

**Prerequisites:** Story 6.3

**Technical Notes:**
- Create `docs/testing-patterns.md` with examples
- Update story template to include test requirements
- Document mock data location and patterns
- Include coverage expectations (aim for 80%+ on new code)

---

## Epic 7: Comparison & Guided Paths

**Goal:** Enable users to compare Pokemon side-by-side and discover curated collections for faster engagement.

**Value:** Transforms passive browsing into active analysis; reduces time-to-first-meaningful-interaction for newcomers.

**PRD Coverage:** Growth Features - "Side-by-side Pokemon comparison tool", "Guided paths for newcomers"

---

### Story 7.1: Comparison Selection UI

As a **user**,
I want **to select two Pokemon for comparison**,
So that **I can analyze them side-by-side**.

**Acceptance Criteria:**

**Given** I am browsing Pokemon
**When** I click "Compare" on a Pokemon card
**Then** that Pokemon is added to a comparison tray

**And** comparison tray shows up to 2 selected Pokemon
**And** tray is visible across all pages (persistent)
**And** I can remove Pokemon from the tray
**And** "Compare Now" button activates when 2 Pokemon selected
**And** tray collapses when empty

**Prerequisites:** Epic 6 complete (tests required)

**Technical Notes:**
- Create `ComparisonTray` component (fixed bottom bar)
- Create `useComparisonSelection` hook with Context
- Add "Add to Compare" button to PokemonCard and PokemonDetail
- Persist selection in sessionStorage
- **Tests:** Selection add/remove, max 2 limit, persistence

---

### Story 7.2: Side-by-Side Comparison View

As a **user**,
I want **to see two Pokemon compared side-by-side**,
So that **I can evaluate their differences**.

**Acceptance Criteria:**

**Given** I have 2 Pokemon in comparison tray
**When** I click "Compare Now"
**Then** I navigate to `/compare?pokemon=25,6`

**And** both Pokemon display side-by-side
**And** stats show as parallel bar charts (easy visual comparison)
**And** types displayed for both
**And** height/weight compared
**And** stat differences highlighted (green=higher, red=lower)
**And** mobile view stacks vertically

**Prerequisites:** Story 7.1

**Technical Notes:**
- Create `/compare` route and `ComparePage` component
- Create `ComparisonStats` component with dual bars
- URL contains both Pokemon IDs for shareability
- Reuse `PokemonStats` visualization with comparison mode
- **Tests:** Stat difference calculation, highlight logic

---

### Story 7.3: Type Matchup Comparison

As a **user**,
I want **to see how two Pokemon match up against each other**,
So that **I understand battle dynamics**.

**Acceptance Criteria:**

**Given** I am on the comparison page
**When** viewing Pikachu vs Charizard
**Then** I see "Pikachu vs Charizard" effectiveness

**And** "Pikachu attacking Charizard: 1x (neutral)"
**And** "Charizard attacking Pikachu: 2x (super effective)"
**And** mutual weaknesses highlighted
**And** type advantages clearly visualized
**And** dual-type calculations accurate

**Prerequisites:** Story 7.2

**Technical Notes:**
- Create `TypeMatchupComparison` component
- Reuse `useTypeEffectiveness` hook
- Calculate both directions of type matchup
- Visual indicator for advantage (arrows, colors)
- **Tests:** Matchup calculation for various type combinations

---

### Story 7.4: Curated Collection Data

As a **user**,
I want **predefined Pokemon collections**,
So that **I can explore themed groups easily**.

**Acceptance Criteria:**

**Given** curated collections are defined
**When** I access a collection
**Then** I see a focused list of Pokemon

**And** "Starter Pokemon" includes all gen starters (27 Pokemon)
**And** "Legendary Pokemon" includes all legendaries
**And** "By Region" groups by game region
**And** "Fan Favorites" includes popular Pokemon
**And** Collections are easily extensible (JSON config)

**Prerequisites:** Story 7.3

**Technical Notes:**
- Create `src/data/curated-collections.json`
- Define collection schema: `{ id, name, description, pokemonIds[] }`
- Collections: starters, legendaries, mythicals, pseudo-legendaries, regional
- **Tests:** Collection data validation, ID ranges valid

---

### Story 7.5: Guided Paths UI

As a **user**,
I want **to browse curated collections from a discovery page**,
So that **I can explore Pokemon without being overwhelmed**.

**Acceptance Criteria:**

**Given** I navigate to `/discover` or see discovery section on home
**When** the page loads
**Then** I see collection cards: "Starter Pokemon", "Legendaries", etc.

**And** clicking a collection shows those Pokemon in grid
**And** "Compare two from this collection" CTA is prominent
**And** collection page URL is shareable (`/discover/starters`)
**And** breadcrumb navigation back to collections
**And** each collection shows Pokemon count

**Prerequisites:** Story 7.4

**Technical Notes:**
- Create `/discover` route and `DiscoverPage`
- Create `CollectionCard` and `CollectionGrid` components
- Integrate with comparison selection
- Add "Discover" link to main navigation
- **Tests:** Collection loading, navigation, count display

---

## Epic 8: Team Builder

**Goal:** Enable users to create 6-Pokemon teams and analyze their collective strengths and weaknesses.

**Value:** Deepens emotional investment - users transition from browsing to creating. Team analysis provides practical value for game players.

**PRD Coverage:** Growth Features - "Team builder with weakness analyzer"

---

### Story 8.1: Team Slot UI

As a **user**,
I want **to add Pokemon to a 6-slot team**,
So that **I can build my dream team**.

**Acceptance Criteria:**

**Given** I am viewing any Pokemon
**When** I click "Add to Team"
**Then** that Pokemon is added to my team

**And** team panel shows 6 slots (filled and empty)
**And** team panel is accessible from all pages (sidebar or modal)
**And** I can remove Pokemon from team slots
**And** I can reorder Pokemon via drag-and-drop
**And** duplicate Pokemon not allowed (same species)
**And** team persists in localStorage

**Prerequisites:** Epic 7 complete

**Technical Notes:**
- Create `TeamBuilder` component (collapsible sidebar)
- Create `useTeam` hook with Context + localStorage
- Create `TeamSlot` component (empty/filled states)
- Add "Add to Team" button to Pokemon cards/detail
- Use `@dnd-kit` or native drag-and-drop for reorder
- **Tests:** Add/remove/reorder, duplicate prevention, persistence

---

### Story 8.2: Team Weakness Analyzer

As a **user**,
I want **to see my team's collective weaknesses**,
So that **I can identify coverage gaps**.

**Acceptance Criteria:**

**Given** I have Pokemon in my team
**When** I view team analysis
**Then** I see aggregated type weaknesses

**And** "Team weak to: Fire (3 Pokemon)" shows vulnerable types
**And** "Team resists: Water (4 Pokemon)" shows covered types
**And** Critical gaps highlighted (4+ Pokemon weak to same type)
**And** Severity indicated by color (red=danger, yellow=caution)
**And** Analysis updates live as team changes

**Prerequisites:** Story 8.1

**Technical Notes:**
- Create `TeamWeaknessAnalyzer` component
- Create `useTeamAnalysis` hook
- Aggregate individual `useTypeEffectiveness` results
- Count Pokemon weak/resistant to each type
- Threshold for "critical": 3+ Pokemon weak to same type
- **Tests:** Aggregation logic, threshold calculations, empty team

---

### Story 8.3: Type Coverage Calculator

As a **user**,
I want **to see what types my team can hit super-effectively**,
So that **I can ensure offensive coverage**.

**Acceptance Criteria:**

**Given** I have Pokemon in my team
**When** I view coverage analysis
**Then** I see offensive type coverage

**And** "Super effective against: 14/18 types" summary shown
**And** Uncovered types listed explicitly
**And** Which team member covers which types shown
**And** STAB (Same Type Attack Bonus) considered
**And** Visual coverage chart (18 types, green=covered)

**Prerequisites:** Story 8.2

**Technical Notes:**
- Create `TypeCoverageChart` component
- Extend `useTeamAnalysis` with offensive coverage
- Consider Pokemon types as proxy for movesets (simplification)
- Show coverage matrix: rows=team members, cols=enemy types
- **Tests:** Coverage calculation, STAB logic, uncovered type detection

---

### Story 8.4: Team Management

As a **user**,
I want **to save, name, and manage multiple teams**,
So that **I can keep different team compositions**.

**Acceptance Criteria:**

**Given** I have built a team
**When** I click "Save Team"
**Then** team is saved with a custom name

**And** I can have up to 5 saved teams
**And** team list shows all saved teams
**And** I can load a saved team into the builder
**And** I can delete saved teams
**And** "New Team" clears current and starts fresh
**And** Teams persist in localStorage

**Prerequisites:** Story 8.3

**Technical Notes:**
- Extend `useTeam` hook with multi-team support
- Create `TeamList` component for saved teams
- LocalStorage schema: `{ teams: [{ id, name, pokemonIds, createdAt }] }`
- Add team name input with default ("Team 1", "Team 2")
- **Tests:** Save/load/delete, max teams limit, name validation

---

## Epic 9: Share & Social

**Goal:** Make teams, comparisons, and Pokemon shareable to drive viral growth and social engagement.

**Value:** Turns users into promoters - every shared team is organic marketing. Rich previews encourage clicks.

**PRD Coverage:** Growth Features - "Share Pokemon/teams via link"

---

### Story 9.1: Shareable URLs

As a **user**,
I want **to share my team or comparison via URL**,
So that **my friends can see what I created**.

**Acceptance Criteria:**

**Given** I have a team or comparison
**When** I click "Share"
**Then** a shareable URL is generated

**And** team URL format: `/team?pokemon=25,6,94,149,143,131`
**And** comparison URL format: `/compare?pokemon=25,6`
**And** Pokemon detail remains at `/pokemon/:id`
**And** URL is short enough for social sharing (<100 chars)
**And** Invalid URLs show graceful error

**Prerequisites:** Epic 8 complete

**Technical Notes:**
- Team serialization: comma-separated Pokemon IDs
- Consider base64 encoding if more data needed later
- Validate Pokemon IDs on load (1-1010 range)
- Graceful handling of missing/invalid Pokemon
- **Tests:** Serialization/deserialization, invalid URL handling

---

### Story 9.2: One-Click Copy & Share Actions

As a **user**,
I want **easy ways to copy and share links**,
So that **sharing is frictionless**.

**Acceptance Criteria:**

**Given** I am viewing a shareable item (team, comparison, Pokemon)
**When** I click the share button
**Then** I see share options

**And** "Copy Link" copies URL to clipboard with confirmation toast
**And** "Share to Twitter" opens Twitter with pre-filled text
**And** "Share to Reddit" opens Reddit submit
**And** Native share sheet on mobile (Web Share API)
**And** Share button visible on team builder, compare page, Pokemon detail

**Prerequisites:** Story 9.1

**Technical Notes:**
- Create `ShareButton` component with dropdown
- Use `navigator.clipboard.writeText()` for copy
- Use `navigator.share()` for native mobile sharing (with fallback)
- Pre-filled share text: "Check out my Pokemon team on bmad-pokedex!"
- Twitter/Reddit URLs with encoded parameters
- **Tests:** Copy functionality, share URL generation

---

### Story 9.3: Open Graph Previews

As a **user**,
I want **rich previews when I share links**,
So that **my shares look attractive on social media**.

**Acceptance Criteria:**

**Given** I share a team URL on Twitter/Discord
**When** the link preview loads
**Then** a rich card appears with Pokemon imagery

**And** Team preview shows team member sprites in grid
**And** Comparison preview shows both Pokemon
**And** Pokemon detail shows that Pokemon's artwork
**And** Title, description meta tags are dynamic
**And** Preview image is at least 1200x630px (Twitter card size)

**Prerequisites:** Story 9.2

**Technical Notes:**
- Use `react-helmet-async` for dynamic meta tags
- Open Graph tags: `og:title`, `og:description`, `og:image`, `og:url`
- Twitter card tags: `twitter:card`, `twitter:image`
- For team images: Consider client-side canvas generation or static fallback
- Fallback: Generic bmad-pokedex preview image
- **Tests:** Meta tag generation for each shareable type

---

## Requirement Traceability (Updated)

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
| **Growth: Comparison** | 7.1, 7.2, 7.3 |
| **Growth: Guided Paths** | 7.4, 7.5 |
| **Growth: Team Builder** | 8.1, 8.2, 8.3, 8.4 |
| **Growth: Share** | 9.1, 9.2, 9.3 |
| **Retro: Testing Debt** | 6.1, 6.2, 6.3, 6.4 |

---

## Implementation Sequence (Updated)

```
Epic 1-5 (Complete - MVP)
  └── 20 stories delivered, 0 tests

Epic 6 (Testing Foundation) ─── GATE ───┐
  └── 6.1 → 6.2 → 6.3 → 6.4             │
                                         │
Epic 7 (Comparison & Guided Paths) ◄────┘
  └── 7.1 → 7.2 → 7.3 → 7.4 → 7.5
                                  │
                                  ▼
Epic 8 (Team Builder)
  └── 8.1 → 8.2 → 8.3 → 8.4
                            │
                            ▼
Epic 9 (Share & Social)
  └── 9.1 → 9.2 → 9.3
```

**Process Commitments:**
- Story DoD includes passing tests (starting Epic 7)
- Follow BMAD workflow - no single-commit epics
- Track retro action items in sprint-status.yaml
- Advisory notes escalate after 2 occurrences

---

_For implementation: Use `/bmad:bmm:workflows:create-story` to generate individual story implementation plans._
