import { useSearchParams } from 'react-router-dom'
import { useCallback, useMemo } from 'react'
import { POKEMON_TYPES, GENERATION_RANGES, type PokemonType } from '@/lib/constants'

/**
 * Hook for managing filter state via URL search params
 * Provides type and generation filters that persist in the URL
 */
export function useFilterParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Parse types from URL (comma-separated)
  const selectedTypes = useMemo(() => {
    const typeParam = searchParams.get('type')
    if (!typeParam) return []

    return typeParam
      .split(',')
      .filter((t): t is PokemonType =>
        POKEMON_TYPES.includes(t as PokemonType)
      )
  }, [searchParams])

  // Parse generation from URL
  const selectedGeneration = useMemo(() => {
    const genParam = searchParams.get('gen')
    if (!genParam) return null

    const gen = parseInt(genParam, 10)
    return GENERATION_RANGES[gen] ? gen : null
  }, [searchParams])

  // Update types in URL
  const setTypes = useCallback(
    (types: string[]) => {
      setSearchParams(
        (prev) => {
          const newParams = new URLSearchParams(prev)
          if (types.length > 0) {
            newParams.set('type', types.join(','))
          } else {
            newParams.delete('type')
          }
          return newParams
        },
        { replace: true }
      )
    },
    [setSearchParams]
  )

  // Update generation in URL
  const setGeneration = useCallback(
    (generation: number | null) => {
      setSearchParams(
        (prev) => {
          const newParams = new URLSearchParams(prev)
          if (generation !== null) {
            newParams.set('gen', generation.toString())
          } else {
            newParams.delete('gen')
          }
          return newParams
        },
        { replace: true }
      )
    },
    [setSearchParams]
  )

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchParams({}, { replace: true })
  }, [setSearchParams])

  // Check if any filters are active
  const hasActiveFilters = selectedTypes.length > 0 || selectedGeneration !== null

  return {
    selectedTypes,
    selectedGeneration,
    setTypes,
    setGeneration,
    clearFilters,
    hasActiveFilters,
  }
}
