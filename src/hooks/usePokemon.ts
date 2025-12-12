import { useQuery } from '@tanstack/react-query'
import { fetchPokemon } from '@/lib/api'
import type { IPokemon } from '@/types/pokemon'

/**
 * Hook for fetching a single Pokemon by ID or name
 * @param idOrName - Pokemon ID (number) or name (string)
 * @returns TanStack Query result with Pokemon data
 */
export function usePokemon(idOrName: string | number) {
  return useQuery<IPokemon, Error>({
    queryKey: ['pokemon', idOrName],
    queryFn: () => fetchPokemon(idOrName),
    enabled: idOrName !== undefined && idOrName !== '',
  })
}
