# Story 3.2: Type Effectiveness Display

Status: done

## Story

As a **user**,
I want **to see what types a Pokemon is weak or strong against**,
so that **I can understand battle matchups and plan strategies**.

## Acceptance Criteria

1. **AC7:** "Weak To" section shows attacking types with 2x or 4x damage multiplier [Source: docs/tech-spec-epic-3.md#Acceptance-Criteria]
2. **AC8:** "Resistant To" section shows types with 0.5x or 0.25x damage multiplier [Source: docs/tech-spec-epic-3.md#Acceptance-Criteria]
3. **AC9:** "Immune To" section shows types with 0x damage (if any) [Source: docs/tech-spec-epic-3.md#Acceptance-Criteria]
4. **AC10:** Dual-type Pokemon show combined effectiveness (4x, 2x, 1x, 0.5x, 0.25x, 0x) [Source: docs/tech-spec-epic-3.md#Acceptance-Criteria]
5. **AC11:** Type badges in effectiveness display use consistent Pokemon type colors [Source: docs/tech-spec-epic-3.md#Acceptance-Criteria]

## Tasks / Subtasks

- [ ] **Task 1: Add API function for type data** (AC: 7-11)
  - [ ] Add `fetchType(name)` to `src/lib/api.ts`
  - [ ] Fetches `/type/{name}` endpoint from PokeAPI

- [ ] **Task 2: Add type definitions** (AC: 7-11)
  - [ ] Add `ITypeRelations` interface to `src/types/pokemon.ts`
  - [ ] Add `ITypeResponse` interface
  - [ ] Add `ITypeEffectiveness` interface for calculated results

- [ ] **Task 3: Create useTypeEffectiveness hook** (AC: 7-11)
  - [ ] Create `src/hooks/useTypeEffectiveness.ts`
  - [ ] Use `useQueries` for parallel type fetches
  - [ ] Implement `calculateEffectiveness` function
  - [ ] Handle dual-type calculation (multiply modifiers)
  - [ ] Return { weaknesses, resistances, immunities }

- [ ] **Task 4: Create TypeEffectiveness component** (AC: 7-11)
  - [ ] Create `src/components/pokemon/TypeEffectiveness.tsx`
  - [ ] Display "Weak To" section with 2x/4x types
  - [ ] Display "Resistant To" section with 0.5x/0.25x types
  - [ ] Display "Immune To" section with 0x types (if any)
  - [ ] Use TypeBadge component for type display
  - [ ] Show multiplier values (×2, ×4, ×0.5, etc.)

- [ ] **Task 5: Integrate into PokemonDetail** (AC: 7-11)
  - [ ] Import TypeEffectiveness in PokemonDetail.tsx
  - [ ] Pass pokemon.types to component
  - [ ] Position after stats section

- [ ] **Task 6: Verify Implementation** (AC: 7-11)
  - [ ] Verify `npm run build` succeeds
  - [ ] Visual test: Check Pikachu (single type - Electric)
  - [ ] Visual test: Check Charizard (dual type - Fire/Flying)
  - [ ] Visual test: Check Sableye (Ghost/Dark - has immunities)

## Dev Notes

### Type Effectiveness Algorithm

```typescript
function calculateEffectiveness(types: ITypeResponse[]): ITypeEffectiveness {
  const multipliers: Record<string, number> = {};

  // Initialize all types at 1x
  ALL_TYPES.forEach(t => multipliers[t] = 1);

  // Multiply damage modifiers for each Pokemon type
  for (const type of types) {
    type.damage_relations.double_damage_from.forEach(t => multipliers[t.name] *= 2);
    type.damage_relations.half_damage_from.forEach(t => multipliers[t.name] *= 0.5);
    type.damage_relations.no_damage_from.forEach(t => multipliers[t.name] *= 0);
  }

  // Categorize results
  return {
    weaknesses: Object.entries(multipliers).filter(([_, m]) => m > 1),
    resistances: Object.entries(multipliers).filter(([_, m]) => m > 0 && m < 1),
    immunities: Object.entries(multipliers).filter(([_, m]) => m === 0).map(([t]) => t),
  };
}
```

### References

- [Source: docs/tech-spec-epic-3.md#Type-Effectiveness-Calculation-Algorithm]
- [Source: docs/tech-spec-epic-3.md#APIs-and-Interfaces]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5

### Debug Log References

- Build succeeded with no errors
- TypeScript compilation passed

### Completion Notes List

- Added type interfaces to pokemon.ts (ITypeRelations, ITypeResponse, ITypeEffectiveness, INamedResource)
- Added fetchType function to api.ts for fetching type damage relations
- Created useTypeEffectiveness hook using useQueries for parallel type fetches
- Implemented calculateEffectiveness algorithm for dual-type calculation
- Created TypeEffectiveness component with Weak To, Resistant To, and Immune To sections
- Shows multipliers (×2, ×4, ×½, ×¼, ×0) next to type badges
- Color-coded multipliers (red for weaknesses, green for resistances, blue for immunities)
- Loading skeleton while fetching type data
- Error state with fallback message
- Integrated TypeEffectiveness into PokemonDetail component

### File List

- `src/types/pokemon.ts` - MODIFIED - Added type effectiveness interfaces
- `src/lib/api.ts` - MODIFIED - Added fetchType function
- `src/hooks/useTypeEffectiveness.ts` - NEW - Hook for calculating type effectiveness
- `src/components/pokemon/TypeEffectiveness.tsx` - NEW - Type effectiveness display component
- `src/components/pokemon/PokemonDetail.tsx` - MODIFIED - Integrated TypeEffectiveness

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-12 | Story created | SM Agent |
