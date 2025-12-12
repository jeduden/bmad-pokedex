/**
 * PokeAPI client for fetching Pokemon data
 * @see https://pokeapi.co/docs/v2
 */

import type { IPokemon, IPokemonListResponse } from '@/types/pokemon'

const BASE_URL = 'https://pokeapi.co/api/v2'

/**
 * Fetch a single Pokemon by ID or name
 * @param idOrName - Pokemon ID (number) or name (string)
 * @returns Promise resolving to Pokemon data
 * @throws Error if Pokemon not found or network error
 */
export async function fetchPokemon(
  idOrName: string | number
): Promise<IPokemon> {
  const response = await fetch(`${BASE_URL}/pokemon/${idOrName}`)

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Pokemon not found: ${idOrName}`)
    }
    throw new Error(`Failed to fetch Pokemon: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Fetch a paginated list of Pokemon
 * @param limit - Number of Pokemon to fetch (default: 20)
 * @param offset - Starting position (default: 0)
 * @returns Promise resolving to paginated Pokemon list
 * @throws Error on network error
 */
export async function fetchPokemonList(
  limit: number = 20,
  offset: number = 0
): Promise<IPokemonListResponse> {
  const response = await fetch(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon list: ${response.statusText}`)
  }

  return response.json()
}
