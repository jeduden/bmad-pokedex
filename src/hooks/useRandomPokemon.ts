import { useState, useCallback } from 'react'
import { usePokemon } from './usePokemon'

/** Maximum Pokemon ID in the PokeAPI (Gen 1-9) */
const MAX_POKEMON_ID = 1010

/**
 * Generate a random Pokemon ID between 1 and MAX_POKEMON_ID
 */
function generateRandomId(): number {
  return Math.floor(Math.random() * MAX_POKEMON_ID) + 1
}

/**
 * Hook for fetching a random Pokemon with ability to get a new random one
 * @returns TanStack Query result with Pokemon data plus getNewRandom callback
 */
export function useRandomPokemon() {
  const [pokemonId, setPokemonId] = useState(() => generateRandomId())

  const query = usePokemon(pokemonId)

  const getNewRandom = useCallback(() => {
    setPokemonId(generateRandomId())
  }, [])

  return { ...query, getNewRandom }
}
