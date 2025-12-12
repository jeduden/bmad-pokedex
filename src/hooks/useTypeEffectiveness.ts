import { useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import { fetchType } from '@/lib/api'
import type { ITypeResponse, ITypeEffectiveness } from '@/types/pokemon'

/** All Pokemon types for effectiveness calculation */
const ALL_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
]

/**
 * Calculate combined type effectiveness for one or more Pokemon types
 * For dual types, multipliers are combined (e.g., 2x × 2x = 4x)
 */
function calculateEffectiveness(types: ITypeResponse[]): ITypeEffectiveness {
  const multipliers: Record<string, number> = {}

  // Initialize all types at 1x
  ALL_TYPES.forEach(t => { multipliers[t] = 1 })

  // Multiply damage modifiers for each Pokemon type
  for (const type of types) {
    type.damage_relations.double_damage_from.forEach(t => {
      multipliers[t.name] *= 2
    })
    type.damage_relations.half_damage_from.forEach(t => {
      multipliers[t.name] *= 0.5
    })
    type.damage_relations.no_damage_from.forEach(t => {
      multipliers[t.name] = 0
    })
  }

  // Categorize results
  const weaknesses: { type: string; multiplier: number }[] = []
  const resistances: { type: string; multiplier: number }[] = []
  const immunities: string[] = []

  Object.entries(multipliers).forEach(([type, multiplier]) => {
    if (multiplier === 0) {
      immunities.push(type)
    } else if (multiplier > 1) {
      weaknesses.push({ type, multiplier })
    } else if (multiplier < 1) {
      resistances.push({ type, multiplier })
    }
  })

  // Sort by multiplier (highest weakness first, lowest resistance first)
  weaknesses.sort((a, b) => b.multiplier - a.multiplier)
  resistances.sort((a, b) => a.multiplier - b.multiplier)

  return { weaknesses, resistances, immunities }
}

/**
 * Hook to fetch and calculate type effectiveness for Pokemon types
 * @param types - Array of type names (e.g., ["electric"] or ["fire", "flying"])
 * @returns Type effectiveness data with loading and error states
 */
export function useTypeEffectiveness(types: string[]) {
  const typeQueries = useQueries({
    queries: types.map(type => ({
      queryKey: ['type', type],
      queryFn: () => fetchType(type),
      staleTime: 10 * 60 * 1000, // 10 minutes (type data rarely changes)
    })),
  })

  const effectiveness = useMemo(() => {
    // Check if all queries are complete
    if (typeQueries.some(q => q.isLoading || !q.data)) return null
    return calculateEffectiveness(typeQueries.map(q => q.data!))
  }, [typeQueries])

  return {
    data: effectiveness,
    isLoading: typeQueries.some(q => q.isLoading),
    error: typeQueries.find(q => q.error)?.error,
  }
}
