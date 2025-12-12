import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { TypeBadge } from './TypeBadge'
import { PokemonStats } from './PokemonStats'
import { TypeEffectiveness } from './TypeEffectiveness'
import { EvolutionChain } from './EvolutionChain'
import { fetchPokemon } from '@/lib/api'
import type { IPokemon } from '@/types/pokemon'

const MAX_POKEMON = 1010

/** Calculate previous Pokemon ID (wraps 1 → 1010) */
function getPreviousId(id: number): number {
  return id === 1 ? MAX_POKEMON : id - 1
}

/** Calculate next Pokemon ID (wraps 1010 → 1) */
function getNextId(id: number): number {
  return id === MAX_POKEMON ? 1 : id + 1
}

/** Props for PokemonDetail component */
interface IPokemonDetailProps {
  /** Pokemon data to display */
  pokemon: IPokemon
  /** Optional additional class names */
  className?: string
}

/**
 * Format Pokemon ID to #XXX format (e.g., #025)
 */
function formatPokemonNumber(id: number): string {
  return `#${id.toString().padStart(3, '0')}`
}

/**
 * Capitalize first letter of a string
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Convert height from decimeters to meters
 */
function formatHeight(decimeters: number): string {
  return `${(decimeters / 10).toFixed(1)} m`
}

/**
 * Convert weight from hectograms to kilograms
 */
function formatWeight(hectograms: number): string {
  return `${(hectograms / 10).toFixed(1)} kg`
}

/**
 * Detail component for displaying full Pokemon information
 */
export function PokemonDetail({ pokemon, className }: IPokemonDetailProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const artwork =
    pokemon.sprites.other['official-artwork'].front_default ??
    pokemon.sprites.front_default

  const previousId = getPreviousId(pokemon.id)
  const nextId = getNextId(pokemon.id)

  const handlePrevious = () => {
    navigate(`/pokemon/${previousId}`)
  }

  const handleNext = () => {
    navigate(`/pokemon/${nextId}`)
  }

  const handlePrefetch = (id: number) => {
    queryClient.prefetchQuery({
      queryKey: ['pokemon', id],
      queryFn: () => fetchPokemon(id),
    })
  }

  return (
    <Card className={cn('w-full max-w-md overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4">
          {/* Pokemon artwork */}
          {artwork && (
            <img
              src={artwork}
              alt={pokemon.name}
              className="w-64 h-64 object-contain"
            />
          )}

          {/* Pokemon number */}
          <span className="text-sm text-muted-foreground font-mono">
            {formatPokemonNumber(pokemon.id)}
          </span>

          {/* Pokemon name */}
          <h1 className="text-3xl font-bold text-foreground">
            {capitalize(pokemon.name)}
          </h1>

          {/* Type badges */}
          <div className="flex gap-2">
            {pokemon.types.map((typeSlot) => (
              <TypeBadge key={typeSlot.slot} type={typeSlot.type.name} />
            ))}
          </div>

          {/* Physical characteristics */}
          <div className="flex gap-8 mt-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Height</p>
              <p className="text-lg font-semibold">{formatHeight(pokemon.height)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Weight</p>
              <p className="text-lg font-semibold">{formatWeight(pokemon.weight)}</p>
            </div>
          </div>

          {/* Base Stats */}
          <PokemonStats stats={pokemon.stats} className="mt-6" />

          {/* Type Effectiveness */}
          <TypeEffectiveness
            types={pokemon.types.map((t) => t.type.name)}
            className="mt-6"
          />

          {/* Evolution Chain */}
          <EvolutionChain pokemonId={pokemon.id} className="mt-6" />

          {/* Navigation buttons */}
          <div className="flex gap-4 mt-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              onMouseEnter={() => handlePrefetch(previousId)}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous Pokemon</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              onMouseEnter={() => handlePrefetch(nextId)}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next Pokemon</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
