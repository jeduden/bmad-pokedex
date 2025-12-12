# Story 2.5: Pokemon Navigation

Status: review

## Story

As a **user**,
I want **to browse to the next or previous Pokemon using buttons and keyboard shortcuts**,
so that **I can explore Pokemon sequentially without needing to search or type URLs**.

## Acceptance Criteria

1. **AC1:** "Previous" button navigates to previous Pokemon number (AC20 from tech-spec)
2. **AC2:** "Next" button navigates to next Pokemon number (AC21 from tech-spec)
3. **AC3:** Navigation wraps around: 1 → 1010 when clicking Previous, 1010 → 1 when clicking Next (AC22 from tech-spec)
4. **AC4:** Keyboard shortcuts ← (left arrow) and → (right arrow) navigate to previous/next Pokemon (AC23 from tech-spec)

## Tasks / Subtasks

- [x] **Task 1: Add Navigation Buttons to PokemonDetail** (AC: 1, 2)
  - [x] Create navigation button group in `PokemonDetail.tsx`
  - [x] Add "Previous" button with ChevronLeft icon
  - [x] Add "Next" button with ChevronRight icon
  - [x] Style buttons with shadcn/ui Button component
  - [x] Position buttons at bottom or sides of Pokemon detail view

- [x] **Task 2: Implement Navigation Logic** (AC: 1, 2, 3)
  - [x] Calculate previous Pokemon ID: `(id - 2 + 1010) % 1010 + 1`
  - [x] Calculate next Pokemon ID: `(id % 1010) + 1`
  - [x] Use `useNavigate` from react-router-dom for navigation
  - [x] Pass current Pokemon ID from `Pokemon.tsx` to `PokemonDetail.tsx`

- [x] **Task 3: Implement Keyboard Navigation** (AC: 4)
  - [x] Add `useEffect` hook in `Pokemon.tsx` to listen for keydown events
  - [x] Handle ArrowLeft (←) key → navigate to previous Pokemon
  - [x] Handle ArrowRight (→) key → navigate to next Pokemon
  - [x] Clean up event listener on unmount
  - [x] Ensure keyboard events don't fire when input is focused

- [x] **Task 4: Optional - Prefetch Adjacent Pokemon** (AC: 1, 2)
  - [x] Prefetch previous Pokemon on Previous button hover
  - [x] Prefetch next Pokemon on Next button hover
  - [x] Use TanStack Query's `queryClient.prefetchQuery()`

- [x] **Task 5: Verify Implementation** (AC: 1, 2, 3, 4)
  - [x] Verify `npm run build` succeeds
  - [x] Verify TypeScript compilation (`npx tsc --noEmit`)
  - [ ] Visual test: Navigate to `/pokemon/25`, click Next → verify `/pokemon/26`
  - [ ] Visual test: Navigate to `/pokemon/25`, click Previous → verify `/pokemon/24`
  - [ ] Visual test: Navigate to `/pokemon/1`, click Previous → verify `/pokemon/1010`
  - [ ] Visual test: Navigate to `/pokemon/1010`, click Next → verify `/pokemon/1`
  - [ ] Visual test: Press → key → navigates to next Pokemon
  - [ ] Visual test: Press ← key → navigates to previous Pokemon

## Dev Notes

### Architecture Patterns and Constraints

- **Component Pattern:** Props interface + functional component [Source: docs/architecture.md#Component-Pattern]
- **Path Aliases:** Use `@/` prefix for imports [Source: docs/architecture.md#Project-Structure]
- **Hook Pattern:** Use React Router `useNavigate` for programmatic navigation [Source: docs/architecture.md#Routing]
- **Keyboard Events:** Use `useEffect` with cleanup for global event listeners

### Source Tree Components

```
bmad-pokedex/
├── src/
│   ├── components/
│   │   └── pokemon/
│   │       └── PokemonDetail.tsx       # MODIFIED - Add nav buttons
│   └── pages/
│       └── Pokemon.tsx                 # MODIFIED - Add keyboard handler
```

### Navigation Logic

```typescript
// Pokemon ID range: 1-1010
const MAX_POKEMON = 1010;

// Calculate previous ID (wraps 1 → 1010)
const getPreviousId = (id: number): number => {
  return id === 1 ? MAX_POKEMON : id - 1;
};

// Calculate next ID (wraps 1010 → 1)
const getNextId = (id: number): number => {
  return id === MAX_POKEMON ? 1 : id + 1;
};
```

### Keyboard Handler Pattern

```typescript
useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    // Don't navigate if user is typing in an input
    if (event.target instanceof HTMLInputElement) return;

    if (event.key === 'ArrowLeft') {
      navigate(`/pokemon/${getPreviousId(id)}`);
    } else if (event.key === 'ArrowRight') {
      navigate(`/pokemon/${getNextId(id)}`);
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [id, navigate]);
```

### Prefetch Pattern (Optional Enhancement)

```typescript
const queryClient = useQueryClient();

const handlePrefetch = (id: number) => {
  queryClient.prefetchQuery({
    queryKey: ['pokemon', id],
    queryFn: () => fetchPokemon(id),
  });
};
```

### Project Structure Notes

- PokemonDetail component already exists from Story 2.4
- Pokemon page already uses `usePokemon(id)` hook
- shadcn/ui Button component available at `@/components/ui/button`
- Navigation should be accessible and keyboard-friendly

### Learnings from Previous Story

**From Story 2-4-pokemon-detail-page-basic (Status: done)**

- **PokemonDetail Component**: Located at `src/components/pokemon/PokemonDetail.tsx` - add navigation buttons here
- **Pokemon Page**: Located at `src/pages/Pokemon.tsx` - uses `useParams()` to get ID, add keyboard handler here
- **usePokemon Hook**: Exists at `src/hooks/usePokemon.ts` - use for prefetching
- **Styling Pattern**: Uses shadcn/ui Card component with Tailwind classes
- **Error Handling**: Invalid Pokemon ID navigates to NotFound page

[Source: stories/2-4-pokemon-detail-page-basic.md#Dev-Agent-Record]

### References

- [Source: docs/tech-spec-epic-2.md#Story-2.5] - AC20-AC23 specifications
- [Source: docs/epics.md#Story-2.5] - User story and technical notes
- [Source: docs/architecture.md#Hook-Pattern] - TanStack Query patterns
- [Source: docs/PRD.md#FR3.6] - Navigation to previous/next Pokemon by number

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

Claude Opus 4.5

### Debug Log References

- Build succeeded with no errors
- TypeScript compilation passed with no type errors

### Completion Notes List

- Added navigation buttons (Previous/Next) to PokemonDetail component using shadcn/ui Button with ChevronLeft/ChevronRight icons
- Implemented navigation logic with wraparound: 1 → 1010 for Previous, 1010 → 1 for Next
- Added keyboard navigation (← / →) in Pokemon page with useEffect and proper cleanup
- Keyboard events skip when HTMLInputElement is focused
- Added prefetch on hover for smoother navigation UX using TanStack Query's queryClient.prefetchQuery()

### File List

- `src/components/pokemon/PokemonDetail.tsx` - Added navigation buttons, prefetch on hover
- `src/pages/Pokemon.tsx` - Added keyboard navigation with useEffect

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-12 | Story created | SM Agent |
