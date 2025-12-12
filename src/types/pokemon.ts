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

/** Named resource helper (common PokeAPI pattern) */
export interface INamedResource {
  name: string
  url: string
}

/** Type damage relations from PokeAPI /type/{id} */
export interface ITypeRelations {
  double_damage_from: INamedResource[]
  double_damage_to: INamedResource[]
  half_damage_from: INamedResource[]
  half_damage_to: INamedResource[]
  no_damage_from: INamedResource[]
  no_damage_to: INamedResource[]
}

/** Type response with damage relations */
export interface ITypeResponse {
  id: number
  name: string
  damage_relations: ITypeRelations
}

/** Calculated effectiveness result */
export interface ITypeEffectiveness {
  weaknesses: { type: string; multiplier: number }[]
  resistances: { type: string; multiplier: number }[]
  immunities: string[]
}

/** Evolution detail from PokeAPI */
export interface IEvolutionDetail {
  trigger: INamedResource
  min_level: number | null
  item: INamedResource | null
}

/** Evolution node in the chain */
export interface IEvolutionNode {
  species: INamedResource
  evolution_details: IEvolutionDetail[]
  evolves_to: IEvolutionNode[]
}

/** Evolution chain from PokeAPI /evolution-chain/{id} */
export interface IEvolutionChain {
  id: number
  chain: IEvolutionNode
}

/** Pokemon species for evolution chain reference */
export interface IPokemonSpecies {
  id: number
  name: string
  evolution_chain: {
    url: string
  }
}
