# Story 3.1: Stats Visualization

Status: done

## Story

As a **user**,
I want **to see a Pokemon's base stats displayed as visual bar charts**,
so that **I can quickly understand its strengths and weaknesses at a glance**.

## Acceptance Criteria

1. **AC1:** Pokemon detail page shows HP, Attack, Defense, Sp.Atk, Sp.Def, Speed as horizontal bars [Source: docs/tech-spec-epic-3.md#Acceptance-Criteria]
2. **AC2:** Bars are colored by stat value (0-50 red, 50-100 yellow, 100+ green) [Source: docs/tech-spec-epic-3.md#Acceptance-Criteria]
3. **AC3:** Numeric stat values are displayed next to each bar [Source: docs/tech-spec-epic-3.md#Acceptance-Criteria]
4. **AC4:** Max stat reference (255) is shown for scale [Source: docs/tech-spec-epic-3.md#Acceptance-Criteria]
5. **AC5:** Total base stats sum is displayed [Source: docs/tech-spec-epic-3.md#Acceptance-Criteria]
6. **AC6:** Bars animate from 0 to stat value on component mount [Source: docs/tech-spec-epic-3.md#Acceptance-Criteria]

## Tasks / Subtasks

- [ ] **Task 1: Create PokemonStats Component** (AC: 1, 3, 4, 5)
  - [ ] Create `src/components/pokemon/PokemonStats.tsx`
  - [ ] Define props interface `IPokemonStatsProps { stats: IPokemonStat[] }`
  - [ ] Map stats array to stat bars (HP, Attack, Defense, Sp.Atk, Sp.Def, Speed)
  - [ ] Display stat name labels
  - [ ] Display numeric stat value next to each bar
  - [ ] Show max stat reference (255) as scale indicator
  - [ ] Calculate and display total base stats sum

- [ ] **Task 2: Implement Stat Bar Visualization** (AC: 1, 4)
  - [ ] Create horizontal bar for each stat
  - [ ] Bar width proportional to stat value (stat/255 * 100%)
  - [ ] Use Tailwind CSS for bar container and fill
  - [ ] Style with rounded corners and consistent spacing

- [ ] **Task 3: Implement Color Coding** (AC: 2)
  - [ ] Define color thresholds: 0-50 red, 51-100 yellow, 101+ green
  - [ ] Create `getStatColor(value: number)` utility function
  - [ ] Apply dynamic background color to bar fill based on stat value
  - [ ] Use Tailwind color classes: `bg-red-500`, `bg-yellow-500`, `bg-green-500`

- [ ] **Task 4: Add Animation on Mount** (AC: 6)
  - [ ] Use CSS `transition` for smooth bar width animation
  - [ ] Set initial bar width to 0%
  - [ ] Animate to final width using `useState` + `useEffect`
  - [ ] Ensure 60fps performance (CSS only, no JS animation loop)

- [ ] **Task 5: Integrate PokemonStats into PokemonDetail** (AC: 1)
  - [ ] Import PokemonStats component in `PokemonDetail.tsx`
  - [ ] Pass `pokemon.stats` array to PokemonStats
  - [ ] Position stats section below Pokemon artwork and info
  - [ ] Add section header "Base Stats"

- [ ] **Task 6: Verify Implementation** (AC: 1-6)
  - [ ] Verify `npm run build` succeeds
  - [ ] Verify TypeScript compilation (`npx tsc --noEmit`)
  - [ ] Visual test: Navigate to `/pokemon/25` (Pikachu) - verify 6 stat bars rendered
  - [ ] Visual test: Verify color coding (low stats red, high stats green)
  - [ ] Visual test: Verify animation plays on page load
  - [ ] Visual test: Check responsive layout on mobile

## Dev Notes

### Architecture Patterns and Constraints

- **Component Pattern:** Props interface + functional component [Source: docs/architecture.md#Component-Pattern]
- **Path Aliases:** Use `@/` prefix for imports [Source: docs/architecture.md#Project-Structure]
- **Stat Data:** Available from existing `usePokemon` hook - `pokemon.stats` array
- **No API Calls:** Stats are already part of Pokemon data, no additional fetching needed
- **Performance:** Use CSS transitions (60fps), not JS animation loops [Source: docs/tech-spec-epic-3.md#Performance]

### Source Tree Components

```
bmad-pokedex/
├── src/
│   ├── components/
│   │   └── pokemon/
│   │       ├── PokemonStats.tsx        # NEW - Stats visualization component
│   │       └── PokemonDetail.tsx       # MODIFIED - Add PokemonStats section
│   └── types/
│       └── pokemon.ts                  # IPokemonStat already defined
```

### Stat Data Structure (from PokeAPI)

```typescript
// Pokemon stats from PokeAPI /pokemon/{id}
interface IPokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;  // "hp", "attack", "defense", "special-attack", "special-defense", "speed"
    url: string;
  };
}
```

### Stat Display Names

| API Name | Display Name |
|----------|--------------|
| hp | HP |
| attack | Attack |
| defense | Defense |
| special-attack | Sp. Atk |
| special-defense | Sp. Def |
| speed | Speed |

### Color Coding Logic

```typescript
function getStatColor(value: number): string {
  if (value <= 50) return 'bg-red-500';
  if (value <= 100) return 'bg-yellow-500';
  return 'bg-green-500';
}
```

### Animation Pattern

```typescript
// Use CSS transition + delayed state update for animation
const [animated, setAnimated] = useState(false);

useEffect(() => {
  // Trigger animation after component mounts
  const timer = setTimeout(() => setAnimated(true), 50);
  return () => clearTimeout(timer);
}, []);

// Bar width: animated ? actualWidth : 0
<div
  className="transition-all duration-500 ease-out"
  style={{ width: animated ? `${(stat.base_stat / 255) * 100}%` : '0%' }}
/>
```

### Project Structure Notes

- PokemonDetail component exists at `src/components/pokemon/PokemonDetail.tsx`
- IPokemonStat type should be available in `src/types/pokemon.ts`
- usePokemon hook returns `pokemon.stats` array
- Tailwind CSS is configured with Pokemon type colors

### Learnings from Previous Story

**From Story 2-5-pokemon-navigation (Status: done)**

- **PokemonDetail Component**: Located at `src/components/pokemon/PokemonDetail.tsx` - add stats section here
- **usePokemon Hook**: Returns full Pokemon data including `stats` array
- **Styling Pattern**: Uses Tailwind classes with shadcn/ui components
- **Code Organization**: Keep utility functions in component file or extract to utils
- **Advisory Note**: Previous review suggested extracting shared utilities like `MAX_POKEMON` - consider doing same for stat utilities

[Source: stories/2-5-pokemon-navigation.md#Dev-Agent-Record]

### References

- [Source: docs/tech-spec-epic-3.md#Story-3.1] - AC1-AC6 specifications
- [Source: docs/tech-spec-epic-3.md#Data-Flow-Stats-Visualization] - Implementation flow
- [Source: docs/epics.md#Story-3.1] - User story and technical notes
- [Source: docs/architecture.md#Component-Pattern] - Component structure
- [Source: docs/PRD.md#FR3.3] - Stats visualization requirement

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

Claude Opus 4.5

### Debug Log References

- Build succeeded with no errors
- TypeScript compilation passed

### Completion Notes List

- Created PokemonStats component with animated horizontal bar charts
- Implemented color-coded stats (red ≤50, yellow 51-100, green 101+)
- Added stat name labels with proper display names (HP, Attack, Defense, Sp. Atk, Sp. Def, Speed)
- Shows numeric stat values next to each bar
- Displays max stat reference (255) for scale
- Shows total base stats sum
- Animation uses CSS transitions for 60fps performance
- Integrated PokemonStats into PokemonDetail component

### File List

- `src/components/pokemon/PokemonStats.tsx` - NEW - Stats visualization component
- `src/components/pokemon/PokemonDetail.tsx` - MODIFIED - Added PokemonStats integration

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-12 | Story created | SM Agent |
