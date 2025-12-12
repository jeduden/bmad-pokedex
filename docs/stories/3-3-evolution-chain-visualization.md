# Story 3.3: Evolution Chain Visualization

Status: done

## Story

As a **user**,
I want **to see a Pokemon's evolution chain with clickable sprites**,
so that **I can understand how it evolves and easily navigate to related Pokemon**.

## Acceptance Criteria

1. **AC12:** Evolution chain displays all stages with sprites and names [Source: docs/tech-spec-epic-3.md#Acceptance-Criteria]
2. **AC13:** Clicking any evolution sprite navigates to that Pokemon's detail page [Source: docs/tech-spec-epic-3.md#Acceptance-Criteria]
3. **AC14:** Branching evolutions (e.g., Eevee) display all branches correctly [Source: docs/tech-spec-epic-3.md#Acceptance-Criteria]
4. **AC15:** Pokemon with no evolutions show "Does not evolve" message [Source: docs/tech-spec-epic-3.md#Acceptance-Criteria]
5. **AC16:** Arrow or connector shows evolution direction [Source: docs/tech-spec-epic-3.md#Acceptance-Criteria]

## Tasks / Subtasks

- [ ] **Task 1: Add API functions for evolution data** (AC: 12-16)
  - [ ] Add `fetchPokemonSpecies(id)` to api.ts
  - [ ] Add `fetchEvolutionChain(id)` to api.ts
  - [ ] Add `extractIdFromUrl(url)` utility

- [ ] **Task 2: Add type definitions** (AC: 12-16)
  - [ ] Add `IPokemonSpecies` interface
  - [ ] Add `IEvolutionChain` interface
  - [ ] Add `IEvolutionNode` interface

- [ ] **Task 3: Create useEvolutionChain hook** (AC: 12-16)
  - [ ] Create `src/hooks/useEvolutionChain.ts`
  - [ ] First fetch species to get evolution_chain URL
  - [ ] Then fetch evolution chain data
  - [ ] Handle chained queries with enabled flag

- [ ] **Task 4: Create EvolutionChain component** (AC: 12-16)
  - [ ] Create `src/components/pokemon/EvolutionChain.tsx`
  - [ ] Display evolution stages with sprites
  - [ ] Show Pokemon names under sprites
  - [ ] Add arrows between evolution stages
  - [ ] Handle branching evolutions (recursive)
  - [ ] Show "Does not evolve" for single-stage Pokemon

- [ ] **Task 5: Integrate into PokemonDetail** (AC: 12-16)
  - [ ] Import EvolutionChain in PokemonDetail.tsx
  - [ ] Pass pokemon.id to component
  - [ ] Position after type effectiveness section

- [ ] **Task 6: Verify Implementation** (AC: 12-16)
  - [ ] Verify `npm run build` succeeds
  - [ ] Visual test: Pikachu (Pichu → Pikachu → Raichu)
  - [ ] Visual test: Eevee (8 branching evolutions)
  - [ ] Visual test: Ditto (no evolutions)

## Dev Notes

### References

- [Source: docs/tech-spec-epic-3.md#Evolution-Chain-Data-Flow]
- [Source: docs/tech-spec-epic-3.md#APIs-and-Interfaces]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5

### Debug Log References

- Build succeeded with no errors
- TypeScript compilation passed

### Completion Notes List

- Added type definitions for evolution chain (IPokemonSpecies, IEvolutionChain, IEvolutionNode, IEvolutionDetail)
- Added fetchPokemonSpecies and fetchEvolutionChain API functions
- Added extractIdFromUrl utility function
- Created useEvolutionChain hook with chained queries (species → chain)
- Created EvolutionChain component with recursive EvolutionBranch for branching support
- Shows clickable sprites that navigate to Pokemon detail pages
- Highlights current Pokemon in the chain
- Shows "Does not evolve" for single-stage Pokemon
- Loading skeleton while fetching
- Error fallback message
- Supports complex branching evolutions (like Eevee)
- Integrated into PokemonDetail component

### File List

- `src/types/pokemon.ts` - MODIFIED - Added evolution chain interfaces
- `src/lib/api.ts` - MODIFIED - Added species, evolution chain APIs, extractIdFromUrl
- `src/hooks/useEvolutionChain.ts` - NEW - Hook for fetching evolution chain data
- `src/components/pokemon/EvolutionChain.tsx` - NEW - Evolution chain visualization
- `src/components/pokemon/PokemonDetail.tsx` - MODIFIED - Integrated EvolutionChain

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-12 | Story created | SM Agent |
