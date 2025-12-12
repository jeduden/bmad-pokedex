import { useQuery } from '@tanstack/react-query'
import { fetchPokemonSpecies, fetchEvolutionChain, extractIdFromUrl } from '@/lib/api'

/**
 * Hook to fetch evolution chain data for a Pokemon
 * First fetches species to get evolution_chain URL, then fetches chain
 * @param pokemonId - Pokemon ID to get evolution chain for
 * @returns Evolution chain data with loading and error states
 */
export function useEvolutionChain(pokemonId: number) {
  // First fetch species to get evolution chain URL
  const speciesQuery = useQuery({
    queryKey: ['pokemon-species', pokemonId],
    queryFn: () => fetchPokemonSpecies(pokemonId),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  // Extract chain ID from URL
  const chainId = speciesQuery.data?.evolution_chain.url
    ? extractIdFromUrl(speciesQuery.data.evolution_chain.url)
    : null

  // Then fetch evolution chain (only when we have chainId)
  const chainQuery = useQuery({
    queryKey: ['evolution-chain', chainId],
    queryFn: () => fetchEvolutionChain(chainId!),
    enabled: !!chainId,
    staleTime: 10 * 60 * 1000,
  })

  return {
    data: chainQuery.data?.chain,
    isLoading: speciesQuery.isLoading || chainQuery.isLoading,
    error: speciesQuery.error || chainQuery.error,
  }
}
