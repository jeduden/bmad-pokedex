import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

/** Props for TypeBadge component */
interface ITypeBadgeProps {
  /** Pokemon type name (e.g., "fire", "water") */
  type: string
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Whether the badge should be clickable to navigate to browse by type */
  interactive?: boolean
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

/** Size variant styles */
const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-0.5',
  lg: 'text-base px-3 py-1',
}

/**
 * Badge component for displaying Pokemon types with appropriate colors
 */
export function TypeBadge({ type, size = 'md', interactive = false, className }: ITypeBadgeProps) {
  const navigate = useNavigate()
  const colorClass = typeColorMap[type] || 'bg-muted'
  const textClass = darkTextTypes.has(type) ? 'text-black' : 'text-white'

  const handleClick = () => {
    if (interactive) {
      navigate(`/browse?type=${type}`)
    }
  }

  return (
    <Badge
      className={cn(
        colorClass,
        textClass,
        sizeClasses[size],
        'capitalize border-0',
        interactive && 'cursor-pointer hover:opacity-80 hover:scale-105 transition-all',
        !interactive && 'hover:opacity-100',
        className
      )}
      onClick={interactive ? handleClick : undefined}
    >
      {type}
    </Badge>
  )
}
