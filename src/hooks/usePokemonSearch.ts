import { useMemo } from 'react'
import { useDebounce } from './useDebounce'
import { usePokemonList } from './usePokemonList'
import type { IPokemonListItem } from '@/types/pokemon'

/** Search result with ID extracted from URL */
export interface ISearchResult extends IPokemonListItem {
  id: number
}

/**
 * Extract Pokemon ID from PokeAPI URL
 * e.g., "https://pokeapi.co/api/v2/pokemon/25/" → 25
 */
function extractId(url: string): number {
  const parts = url.split('/').filter(Boolean)
  return parseInt(parts[parts.length - 1], 10)
}

/**
 * Hook for searching Pokemon with debounced input
 * @param searchTerm - The search term to filter by
 * @returns Search results and loading state
 */
export function usePokemonSearch(searchTerm: string) {
  const debouncedTerm = useDebounce(searchTerm, 300)

  // Pre-fetch all Pokemon names for client-side filtering
  const { data: pokemonList } = usePokemonList(1010, 0)

  const results = useMemo<ISearchResult[]>(() => {
    if (!debouncedTerm || !pokemonList) return []

    const term = debouncedTerm.toLowerCase().trim()
    if (!term) return []

    return pokemonList.results
      .filter((p) => {
        const id = extractId(p.url)
        return (
          p.name.includes(term) || id.toString() === term
        )
      })
      .slice(0, 10)
      .map((p) => ({
        ...p,
        id: extractId(p.url),
      }))
  }, [debouncedTerm, pokemonList])

  return {
    results,
    isLoading: !pokemonList,
    searchTerm: debouncedTerm,
  }
}
