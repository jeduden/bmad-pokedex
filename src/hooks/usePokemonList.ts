import { useQuery } from '@tanstack/react-query'
import { fetchPokemonList } from '@/lib/api'
import type { IPokemonListResponse } from '@/types/pokemon'

/**
 * Hook for fetching a paginated list of Pokemon
 * @param limit - Number of Pokemon to fetch (default: 20)
 * @param offset - Starting position (default: 0)
 * @returns TanStack Query result with Pokemon list data
 */
export function usePokemonList(limit: number = 20, offset: number = 0) {
  return useQuery<IPokemonListResponse, Error>({
    queryKey: ['pokemon-list', limit, offset],
    queryFn: () => fetchPokemonList(limit, offset),
  })
}
