# Story 2.3: Search Result Navigation

Status: done

## Story

As a **user**,
I want **to navigate to a Pokemon's detail page from search results using click or keyboard**,
so that **I can quickly access the Pokemon I searched for with my preferred input method**.

## Acceptance Criteria

1. **AC1:** Clicking a search result navigates to `/pokemon/:id` (AC11 from tech-spec)
2. **AC2:** Dropdown closes after selection (AC12 from tech-spec)
3. **AC3:** Keyboard navigation works - arrow keys move selection highlight (AC13 from tech-spec)
4. **AC4:** Pressing Enter on highlighted result navigates to that Pokemon (AC13 from tech-spec)
5. **AC5:** Clicking outside dropdown closes it (AC14 from tech-spec)

## Tasks / Subtasks

- [x] **Task 1: Verify Existing Click Navigation** (AC: 1, 2, 5)
  - [x] Confirm SearchBar already navigates on result click (from Story 2.2)
  - [x] Confirm dropdown closes after selection
  - [x] Confirm click-outside-to-close works
  - [x] Document any missing functionality

- [x] **Task 2: Add Keyboard Navigation State** (AC: 3, 4)
  - [x] Add `highlightedIndex` state to SearchBar (default -1, no selection)
  - [x] Track highlighted result for keyboard navigation
  - [x] Reset highlight when search term changes or dropdown opens

- [x] **Task 3: Implement Arrow Key Navigation** (AC: 3)
  - [x] Add `onKeyDown` handler to search input
  - [x] ArrowDown: increment highlightedIndex (wrap at end)
  - [x] ArrowUp: decrement highlightedIndex (wrap at start)
  - [x] Prevent default scroll behavior when navigating
  - [x] Add visual highlight (bg-accent) to selected result

- [x] **Task 4: Implement Enter Key Selection** (AC: 4)
  - [x] On Enter keypress with valid highlightedIndex, navigate to that Pokemon
  - [x] Clear search term and close dropdown after navigation
  - [x] If no result highlighted, do nothing or select first result

- [x] **Task 5: Accessibility Enhancements** (AC: 3, 4)
  - [x] Add `role="listbox"` to results container
  - [x] Add `role="option"` to each result item
  - [x] Add `aria-selected` to highlighted item
  - [x] Add `aria-activedescendant` to input referencing highlighted item
  - [x] Ensure focus remains on input during keyboard navigation

- [x] **Task 6: Verify Implementation** (AC: 1, 2, 3, 4, 5)
  - [x] Verify `npm run build` succeeds
  - [x] Verify TypeScript compilation (`tsc --noEmit`)
  - [x] Visual test: arrow keys navigate through results
  - [x] Visual test: Enter selects highlighted result
  - [x] Visual test: click on result navigates correctly

## Dev Notes

### Architecture Patterns and Constraints

- **Component Pattern:** Props interface + functional component [Source: docs/architecture.md#Component-Pattern]
- **Path Aliases:** Use `@/` prefix for imports [Source: docs/architecture.md#Project-Structure]
- **Keyboard Handling:** Use `onKeyDown` event on input element
- **Accessibility:** Follow WAI-ARIA Combobox pattern [Source: docs/epics.md#Story-2.2]

### Source Tree Components

```
bmad-pokedex/
├── src/
│   ├── components/
│   │   └── pokemon/
│   │       └── SearchBar.tsx          # MODIFIED - Add keyboard navigation
```

### Existing SearchBar Implementation

From Story 2.2, SearchBar already has:
- Controlled input with searchTerm state
- Dropdown with search results
- Click handler navigating to `/pokemon/:id`
- Click-outside-to-close behavior using event listener
- Search term clearing after selection

### Keyboard Navigation Pattern

```typescript
const [highlightedIndex, setHighlightedIndex] = useState(-1);

const handleKeyDown = (e: React.KeyboardEvent) => {
  if (!results.length) return;

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      setHighlightedIndex(prev =>
        prev < results.length - 1 ? prev + 1 : 0
      );
      break;
    case 'ArrowUp':
      e.preventDefault();
      setHighlightedIndex(prev =>
        prev > 0 ? prev - 1 : results.length - 1
      );
      break;
    case 'Enter':
      if (highlightedIndex >= 0) {
        const selected = results[highlightedIndex];
        navigate(`/pokemon/${selected.id}`);
        setSearchTerm('');
      }
      break;
    case 'Escape':
      setSearchTerm('');
      break;
  }
};
```

### Learnings from Previous Story

**From Story 2-2-pokemon-search-input (Status: done)**

- **SearchBar Foundation:** `src/components/pokemon/SearchBar.tsx` provides complete click-based navigation - extend with keyboard support
- **Navigation Pattern:** Uses `useNavigate()` from react-router-dom, clears searchTerm after navigation
- **Result Structure:** `ISearchResult` interface with `id` and `name` properties available
- **usePokemonSearch Hook:** Returns `{ results, isLoading }` - results array used for navigation
- **Click-Outside Pattern:** Uses `useRef` and document click listener for closing dropdown
- **Advisory Note:** "Keyboard navigation (arrow keys, enter) will be added in Story 2.3" - this is the primary scope

[Source: stories/2-2-pokemon-search-input.md#Dev-Agent-Record]

### References

- [Source: docs/tech-spec-epic-2.md#Story-2.3] - AC11-AC14 specifications
- [Source: docs/epics.md#Story-2.3] - User story and technical notes
- [Source: docs/architecture.md#Component-Pattern] - Component structure
- [Source: docs/PRD.md#FR2] - Pokemon search feature requirements
- [Source: stories/2-2-pokemon-search-input.md] - Previous story implementation

## Dev Agent Record

### Context Reference

No context file generated - proceeded with story file only.

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Verified existing click navigation from Story 2.2 implementation
- Added keyboard navigation following WAI-ARIA Combobox pattern

### Completion Notes List

- Implemented full keyboard navigation for search results dropdown
- Arrow keys (Up/Down) navigate through results with wrapping
- Enter key selects highlighted result and navigates to Pokemon detail page
- Escape key closes dropdown
- Added comprehensive ARIA attributes for accessibility (combobox, listbox, option roles)
- Visual highlight (bg-accent) shows currently selected item
- All existing click functionality preserved

### File List

- `src/components/pokemon/SearchBar.tsx` - MODIFIED: Added keyboard navigation and accessibility

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-12 | Story created | SM Agent |
| 2025-12-12 | Implementation complete - keyboard navigation added | Dev Agent |
| 2025-12-12 | Senior Developer Review - APPROVED | Review Agent |

## Senior Developer Review (AI)

### Reviewer
JE

### Date
2025-12-12

### Outcome
**APPROVE** - All acceptance criteria implemented with evidence. All tasks verified complete. Code follows project architecture patterns and accessibility standards.

### Summary
Story 2.3 adds keyboard navigation to the Pokemon search dropdown. Implementation is clean, follows WAI-ARIA Combobox accessibility patterns, and all acceptance criteria are satisfied with verifiable evidence in the code.

### Key Findings
No issues found. Implementation is solid.

### Acceptance Criteria Coverage

| AC# | Description | Status | Evidence |
|-----|-------------|--------|----------|
| AC1 | Click result navigates to `/pokemon/:id` | IMPLEMENTED | `SearchBar.tsx:62-67,146` |
| AC2 | Dropdown closes after selection | IMPLEMENTED | `SearchBar.tsx:65` |
| AC3 | Arrow keys move selection highlight | IMPLEMENTED | `SearchBar.tsx:73-83,147-151` |
| AC4 | Enter navigates to highlighted Pokemon | IMPLEMENTED | `SearchBar.tsx:85-89` |
| AC5 | Click outside closes dropdown | IMPLEMENTED | `SearchBar.tsx:39-48` |

**Summary: 5 of 5 acceptance criteria fully implemented**

### Task Completion Validation

| Task | Marked As | Verified As | Evidence |
|------|-----------|-------------|----------|
| Task 1: Verify Existing Click Navigation | [x] | VERIFIED | Click nav confirmed from Story 2.2 |
| Task 2: Add Keyboard Navigation State | [x] | VERIFIED | `SearchBar.tsx:33,59` |
| Task 3: Implement Arrow Key Navigation | [x] | VERIFIED | `SearchBar.tsx:69-97,108` |
| Task 4: Implement Enter Key Selection | [x] | VERIFIED | `SearchBar.tsx:85-89` |
| Task 5: Accessibility Enhancements | [x] | VERIFIED | `SearchBar.tsx:110-117,136,141-142` |
| Task 6: Verify Implementation | [x] | VERIFIED | Build and TypeScript passed |

**Summary: 6 of 6 completed tasks verified, 0 questionable, 0 falsely marked complete**

### Test Coverage and Gaps
- No unit tests added for keyboard navigation (advisory - consider adding in future)
- Visual testing performed during implementation

### Architectural Alignment
- Follows component pattern from architecture.md
- Uses proper React hooks (useState, useEffect, useRef, useId)
- WAI-ARIA Combobox pattern correctly implemented
- TypeScript strict typing maintained

### Security Notes
No security concerns - read-only public API data, no user input persisted.

### Best-Practices and References
- [WAI-ARIA Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- React keyboard event handling best practices followed

### Action Items

**Advisory Notes:**
- Note: Consider adding unit tests for keyboard navigation in a future story (not blocking)
