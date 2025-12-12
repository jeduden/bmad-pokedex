import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { TypeBadge } from './TypeBadge'
import type { IPokemon } from '@/types/pokemon'

/** Props for PokemonCard component */
interface IPokemonCardProps {
  /** Pokemon data to display */
  pokemon: IPokemon
  /** Optional click handler for future navigation */
  onClick?: () => void
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
 * Card component for displaying Pokemon information
 */
export function PokemonCard({ pokemon, onClick, className }: IPokemonCardProps) {
  const artwork =
    pokemon.sprites.other['official-artwork'].front_default ??
    pokemon.sprites.front_default

  return (
    <Card
      className={cn(
        'w-full max-w-sm overflow-hidden transition-shadow hover:shadow-lg',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4">
          {/* Pokemon artwork */}
          {artwork && (
            <img
              src={artwork}
              alt={pokemon.name}
              className="w-48 h-48 object-contain"
            />
          )}

          {/* Pokemon number */}
          <span className="text-sm text-muted-foreground font-mono">
            {formatPokemonNumber(pokemon.id)}
          </span>

          {/* Pokemon name */}
          <h2 className="text-2xl font-bold text-foreground">
            {capitalize(pokemon.name)}
          </h2>

          {/* Type badges */}
          <div className="flex gap-2">
            {pokemon.types.map((typeSlot) => (
              <TypeBadge key={typeSlot.slot} type={typeSlot.type.name} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
