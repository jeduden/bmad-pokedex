import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { TypeBadge } from './TypeBadge'
import type { IPokemon } from '@/types/pokemon'

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
  const artwork =
    pokemon.sprites.other['official-artwork'].front_default ??
    pokemon.sprites.front_default

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
        </div>
      </CardContent>
    </Card>
  )
}
