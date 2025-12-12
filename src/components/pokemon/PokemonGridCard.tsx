import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { TypeBadge } from './TypeBadge'
import type { IPokemon } from '@/types/pokemon'

/** Props for PokemonGridCard component */
interface IPokemonGridCardProps {
  /** Pokemon data to display */
  pokemon: IPokemon
  /** Click handler for navigation */
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
 * Compact card component for displaying Pokemon in a grid layout
 */
export function PokemonGridCard({
  pokemon,
  onClick,
  className,
}: IPokemonGridCardProps) {
  // Use smaller sprite for grid view
  const sprite =
    pokemon.sprites.other['official-artwork'].front_default ??
    pokemon.sprites.front_default

  return (
    <Card
      className={cn(
        'overflow-hidden transition-all hover:shadow-lg hover:scale-105',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex flex-col items-center gap-2">
          {/* Pokemon sprite */}
          {sprite && (
            <img
              src={sprite}
              alt={pokemon.name}
              className="w-24 h-24 object-contain"
              loading="lazy"
            />
          )}

          {/* Pokemon number */}
          <span className="text-xs text-muted-foreground font-mono">
            {formatPokemonNumber(pokemon.id)}
          </span>

          {/* Pokemon name */}
          <h3 className="text-sm font-semibold text-foreground truncate w-full text-center">
            {capitalize(pokemon.name)}
          </h3>

          {/* Type badges - smaller */}
          <div className="flex gap-1 flex-wrap justify-center">
            {pokemon.types.map((typeSlot) => (
              <TypeBadge
                key={typeSlot.slot}
                type={typeSlot.type.name}
                className="text-xs px-2 py-0"
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
