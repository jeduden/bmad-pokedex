/**
 * Pokemon TypeScript interfaces for PokeAPI responses
 * @see https://pokeapi.co/docs/v2#pokemon
 */

/** Pokemon type slot with type information */
export interface IPokemonType {
  slot: number
  type: {
    name: string
    url: string
  }
}

/** Pokemon stat with base value and stat information */
export interface IPokemonStat {
  base_stat: number
  effort: number
  stat: {
    name: string
    url: string
  }
}

/** Pokemon sprite URLs */
export interface ISprites {
  front_default: string | null
  back_default: string | null
  front_shiny: string | null
  back_shiny: string | null
  other: {
    'official-artwork': {
      front_default: string | null
      front_shiny: string | null
    }
  }
}

/** Main Pokemon response interface */
export interface IPokemon {
  id: number
  name: string
  height: number
  weight: number
  types: IPokemonType[]
  stats: IPokemonStat[]
  sprites: ISprites
}

/** Pokemon list item (minimal info) */
export interface IPokemonListItem {
  name: string
  url: string
}

/** Paginated Pokemon list response */
export interface IPokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: IPokemonListItem[]
}
