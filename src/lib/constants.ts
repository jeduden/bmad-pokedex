/**
 * Pokemon constants for types and generations
 */

/** All Pokemon types */
export const POKEMON_TYPES = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
] as const

export type PokemonType = (typeof POKEMON_TYPES)[number]

/** Generation ranges with inclusive start and end Pokemon IDs */
export const GENERATION_RANGES: Record<number, { start: number; end: number; name: string }> = {
  1: { start: 1, end: 151, name: 'Generation I (Kanto)' },
  2: { start: 152, end: 251, name: 'Generation II (Johto)' },
  3: { start: 252, end: 386, name: 'Generation III (Hoenn)' },
  4: { start: 387, end: 493, name: 'Generation IV (Sinnoh)' },
  5: { start: 494, end: 649, name: 'Generation V (Unova)' },
  6: { start: 650, end: 721, name: 'Generation VI (Kalos)' },
  7: { start: 722, end: 809, name: 'Generation VII (Alola)' },
  8: { start: 810, end: 905, name: 'Generation VIII (Galar)' },
  9: { start: 906, end: 1025, name: 'Generation IX (Paldea)' },
}

/** Total number of Pokemon (up to Gen 9) */
export const TOTAL_POKEMON = 1025

/** Number of generations */
export const TOTAL_GENERATIONS = Object.keys(GENERATION_RANGES).length
