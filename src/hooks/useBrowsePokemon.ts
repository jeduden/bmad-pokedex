import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import {
  fetchPokemonByType,
  fetchPokemonBatch,
  extractPokemonIdFromUrl,
} from '@/lib/api'
import { GENERATION_RANGES, TOTAL_POKEMON } from '@/lib/constants'
import type { IPokemon } from '@/types/pokemon'

/** Filter options for browsing Pokemon */
export interface IBrowseFilters {
  /** Selected types (OR logic - matches any) */
  types: string[]
  /** Selected generation (null for all) */
  generation: number | null
}

/** Page size for infinite scroll */
const PAGE_SIZE = 20

/**
 * Get Pokemon IDs that match the generation filter
 */
function getGenerationRange(generation: number | null): {
  start: number
  end: number
} {
  if (generation === null) {
    return { start: 1, end: TOTAL_POKEMON }
  }
  const range = GENERATION_RANGES[generation]
  return range || { start: 1, end: TOTAL_POKEMON }
}

/**
 * Hook for fetching all Pokemon of selected types
 * Used when type filter is active
 */
function useTypePokemonIds(types: string[]) {
  return useQuery({
    queryKey: ['pokemon-by-types', types.sort()],
    queryFn: async () => {
      if (types.length === 0) return null

      // Fetch all types in parallel
      const typeResults = await Promise.all(
        types.map((type) => fetchPokemonByType(type))
      )

      // Combine all Pokemon IDs (OR logic - any type matches)
      const idSet = new Set<number>()
      for (const typeData of typeResults) {
        for (const entry of typeData.pokemon) {
          const id = extractPokemonIdFromUrl(entry.pokemon.url)
          if (id > 0 && id <= TOTAL_POKEMON) {
            idSet.add(id)
          }
        }
      }

      return Array.from(idSet).sort((a, b) => a - b)
    },
    enabled: types.length > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes - type data rarely changes
  })
}

/**
 * Hook for browsing Pokemon with filtering and infinite scroll
 * @param filters - Type and generation filters
 * @returns Infinite query result with Pokemon data
 */
export function useBrowsePokemon(filters: IBrowseFilters) {
  const { types, generation } = filters
  const hasTypeFilter = types.length > 0

  // Get Pokemon IDs matching type filter (if any)
  const {
    data: typePokemonIds,
    isLoading: isLoadingTypes,
  } = useTypePokemonIds(types)

  // Get generation range
  const genRange = getGenerationRange(generation)

  // Compute the filtered list of Pokemon IDs
  const filteredIds = hasTypeFilter
    ? (typePokemonIds || []).filter(
        (id) => id >= genRange.start && id <= genRange.end
      )
    : Array.from(
        { length: genRange.end - genRange.start + 1 },
        (_, i) => genRange.start + i
      )

  const totalCount = filteredIds.length

  // Infinite query for paginated data
  const infiniteQuery = useInfiniteQuery({
    queryKey: ['browse-pokemon', types.sort(), generation, filteredIds.length],
    queryFn: async ({ pageParam = 0 }) => {
      const start = pageParam * PAGE_SIZE
      const end = Math.min(start + PAGE_SIZE, filteredIds.length)
      const idsToFetch = filteredIds.slice(start, end)

      if (idsToFetch.length === 0) {
        return { pokemon: [] as IPokemon[], nextPage: null }
      }

      const pokemon = await fetchPokemonBatch(idsToFetch)
      // Sort by ID to maintain order
      pokemon.sort((a, b) => a.id - b.id)

      const hasMore = end < filteredIds.length
      return {
        pokemon,
        nextPage: hasMore ? pageParam + 1 : null,
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    enabled: !hasTypeFilter || !isLoadingTypes,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Flatten all pages into a single array
  const allPokemon =
    infiniteQuery.data?.pages.flatMap((page) => page.pokemon) || []

  return {
    pokemon: allPokemon,
    totalCount,
    isLoading: infiniteQuery.isLoading || isLoadingTypes,
    isFetchingNextPage: infiniteQuery.isFetchingNextPage,
    hasNextPage: infiniteQuery.hasNextPage,
    fetchNextPage: infiniteQuery.fetchNextPage,
    error: infiniteQuery.error,
    refetch: infiniteQuery.refetch,
  }
}
