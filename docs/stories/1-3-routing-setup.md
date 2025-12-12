# Story 1.3: Routing Setup

Status: drafted

## Story

As a **user**,
I want **to navigate between pages via URLs**,
so that **I can bookmark and share Pokemon pages**.

## Acceptance Criteria

1. **AC1:** Navigating to `/` loads the Home page component
2. **AC2:** Navigating to `/pokemon/:id` loads the Pokemon detail page component (placeholder)
3. **AC3:** Navigating to `/browse` loads the Browse page component (placeholder)
4. **AC4:** Navigating to an invalid route (e.g., `/invalid`) shows a 404 Not Found page
5. **AC5:** A persistent Layout component with Header renders on all pages
6. **AC6:** Navigation links in Header allow switching between pages without full reload

## Tasks / Subtasks

- [ ] **Task 1: Install React Router** (AC: 1-4)
  - [ ] Install react-router-dom: `npm install react-router-dom`
  - [ ] Verify package added to package.json

- [ ] **Task 2: Create Page Components** (AC: 1-4)
  - [ ] Create `src/pages/Home.tsx` - placeholder with page title
  - [ ] Create `src/pages/Pokemon.tsx` - placeholder showing `:id` param
  - [ ] Create `src/pages/Browse.tsx` - placeholder with page title
  - [ ] Create `src/pages/NotFound.tsx` - 404 message with link to home

- [ ] **Task 3: Create Layout Components** (AC: 5, 6)
  - [ ] Create `src/components/layout/Layout.tsx` - wrapper with Header and Outlet
  - [ ] Create `src/components/layout/Header.tsx` - navigation with links to Home, Browse
  - [ ] Use shadcn/ui Button component for navigation styling
  - [ ] Include app title/logo in Header

- [ ] **Task 4: Configure Router in App.tsx** (AC: 1-6)
  - [ ] Import BrowserRouter, Routes, Route from react-router-dom
  - [ ] Wrap app with BrowserRouter
  - [ ] Define routes: `/`, `/pokemon/:id`, `/browse`, `*` (catch-all)
  - [ ] Use Layout as parent route with nested children
  - [ ] Remove existing test component content from App.tsx

- [ ] **Task 5: Verify Navigation** (AC: 1-6)
  - [ ] Test `/` route loads Home page
  - [ ] Test `/pokemon/25` route loads Pokemon page with id param
  - [ ] Test `/browse` route loads Browse page
  - [ ] Test `/invalid-route` shows 404 page
  - [ ] Test Header links navigate correctly
  - [ ] Verify `npm run build` succeeds without errors
  - [ ] Verify TypeScript compilation (`tsc --noEmit`)

## Dev Notes

### Architecture Patterns and Constraints

- **Routing:** React Router v6 with BrowserRouter [Source: docs/architecture.md#Decision-Summary]
- **Route naming:** kebab-case for URLs (e.g., `/pokemon/:id`) [Source: docs/architecture.md#Naming-Conventions]
- **Component naming:** PascalCase for components (e.g., `PokemonDetail.tsx`) [Source: docs/architecture.md#Naming-Conventions]
- **Layout pattern:** Shared Layout component with Outlet for nested routes [Source: docs/architecture.md#Project-Structure]
- **Path aliases:** Use `@/` prefix for imports [Source: docs/architecture.md#Project-Structure]

### Source Tree Components

```
bmad-pokedex/
├── src/
│   ├── components/
│   │   └── layout/           # Layout components (NEW)
│   │       ├── Layout.tsx    # App shell with Header
│   │       └── Header.tsx    # Navigation header
│   ├── pages/                # Page components (NEW)
│   │   ├── Home.tsx          # Landing page
│   │   ├── Pokemon.tsx       # Detail page /pokemon/:id
│   │   ├── Browse.tsx        # Grid view /browse
│   │   └── NotFound.tsx      # 404 page
│   └── App.tsx               # Router configuration (MODIFIED)
├── package.json              # react-router-dom added (MODIFIED)
```

### Router Configuration Pattern

```tsx
// Expected App.tsx structure
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="pokemon/:id" element={<Pokemon />} />
      <Route path="browse" element={<Browse />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
</BrowserRouter>
```

### Testing Standards

- Manual navigation testing via browser
- TypeScript compilation check (`tsc --noEmit`)
- Production build verification (`npm run build`)
- Test all routes render correct components
- Test navigation links work correctly

### Project Structure Notes

- Follows unified project structure from architecture.md
- `src/pages/` directory for page components
- `src/components/layout/` for layout-specific components
- Path aliases already configured from Story 1.2

### Learnings from Previous Story

**From Story 1-2-tailwind-shadcn-ui-setup (Status: done)**

- **Path Aliases Ready:** `@/*` imports configured in tsconfig.json and vite.config.ts - use `@/components/ui`, `@/lib/utils`
- **shadcn/ui Components Available:** Button, Card, Input, Badge at `@/components/ui/` - use Button for nav links
- **cn() Utility:** Available at `@/lib/utils` for conditional class merging
- **Tailwind Configured:** Full setup with Pokemon type colors
- **Current App.tsx:** Has test component demonstrating UI setup - will be replaced with router configuration
- **ESLint Note:** ESLint warnings about fast refresh in shadcn/ui components are expected behavior

[Source: stories/1-2-tailwind-shadcn-ui-setup.md#Dev-Agent-Record]

### References

- [Source: docs/architecture.md#Project-Structure] - Directory structure for pages and layout
- [Source: docs/architecture.md#Decision-Summary] - React Router v6 decision
- [Source: docs/architecture.md#Naming-Conventions] - Route and component naming
- [Source: docs/tech-spec-epic-1.md#Acceptance-Criteria] - AC8-AC11 specifications
- [Source: docs/epics.md#Story-1.3] - Story definition and acceptance criteria

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-12 | Story created | SM Agent |
