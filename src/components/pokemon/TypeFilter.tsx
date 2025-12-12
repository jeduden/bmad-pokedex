import { cn } from '@/lib/utils'
import { POKEMON_TYPES, type PokemonType } from '@/lib/constants'

/** Props for TypeFilter component */
interface ITypeFilterProps {
  /** Currently selected types */
  selectedTypes: string[]
  /** Callback when types selection changes */
  onTypesChange: (types: string[]) => void
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
const darkTextTypes = new Set([
  'electric',
  'normal',
  'ground',
  'ice',
  'steel',
  'fairy',
])

/**
 * Type filter component with 18 type pills
 */
export function TypeFilter({
  selectedTypes,
  onTypesChange,
  className,
}: ITypeFilterProps) {
  const toggleType = (type: PokemonType) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter((t) => t !== type))
    } else {
      onTypesChange([...selectedTypes, type])
    }
  }

  const clearFilters = () => {
    onTypesChange([])
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Filter by Type</h3>
        {selectedTypes.length > 0 && (
          <button
            onClick={clearFilters}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear all
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {POKEMON_TYPES.map((type) => {
          const isSelected = selectedTypes.includes(type)
          const colorClass = typeColorMap[type] || 'bg-muted'
          const textClass = darkTextTypes.has(type)
            ? 'text-black'
            : 'text-white'

          return (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium capitalize transition-all',
                isSelected
                  ? cn(colorClass, textClass, 'ring-2 ring-offset-2 ring-ring')
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {type}
            </button>
          )
        })}
      </div>
    </div>
  )
}
