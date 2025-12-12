import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

/** Props for TypeBadge component */
interface ITypeBadgeProps {
  /** Pokemon type name (e.g., "fire", "water") */
  type: string
  /** Optional additional class names */
  className?: string
}

/** Map of Pokemon types to their background color classes */
const typeColorMap: Record<string, string> = {
  normal: 'bg-pokemon-normal',
  fire: 'bg-pokemon-fire',
  water: 'bg-pokemon-water',
  electric: 'bg-pokemon-electric',
  grass: 'bg-pokemon-grass',
  ice: 'bg-pokemon-ice',
  fighting: 'bg-pokemon-fighting',
  poison: 'bg-pokemon-poison',
  ground: 'bg-pokemon-ground',
  flying: 'bg-pokemon-flying',
  psychic: 'bg-pokemon-psychic',
  bug: 'bg-pokemon-bug',
  rock: 'bg-pokemon-rock',
  ghost: 'bg-pokemon-ghost',
  dragon: 'bg-pokemon-dragon',
  dark: 'bg-pokemon-dark',
  steel: 'bg-pokemon-steel',
  fairy: 'bg-pokemon-fairy',
}

/** Types that need dark text for contrast */
const darkTextTypes = new Set(['electric', 'normal', 'ground', 'ice', 'steel', 'fairy'])

/**
 * Badge component for displaying Pokemon types with appropriate colors
 */
export function TypeBadge({ type, className }: ITypeBadgeProps) {
  const colorClass = typeColorMap[type] || 'bg-muted'
  const textClass = darkTextTypes.has(type) ? 'text-black' : 'text-white'

  return (
    <Badge
      className={cn(
        colorClass,
        textClass,
        'capitalize border-0 hover:opacity-80',
        className
      )}
    >
      {type}
    </Badge>
  )
}
