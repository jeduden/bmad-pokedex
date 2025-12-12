import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { TypeBadge } from './TypeBadge'
import { usePokemon } from '@/hooks'
import { cn } from '@/lib/utils'

interface IPokemonGridCardProps {
  /** Pokemon name or ID */
  nameOrId: string | number
  className?: string
}

/**
 * Compact Pokemon card for grid view with lazy loading
 */
export function PokemonGridCard({ nameOrId, className }: IPokemonGridCardProps) {
  const { data: pokemon, isLoading, error } = usePokemon(nameOrId)

  // Extract ID from name/url if needed
  const pokemonId = pokemon?.id

  // Format Pokemon ID with leading zeros
  const formatId = (num: number) => `#${String(num).padStart(3, '0')}`

  // Skeleton while loading
  if (isLoading) {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <CardContent className="p-4">
          <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-24 rounded bg-muted animate-pulse" />
            <div className="w-10 h-4 rounded bg-muted animate-pulse" />
            <div className="w-20 h-5 rounded bg-muted animate-pulse" />
            <div className="flex gap-1">
              <div className="w-12 h-5 rounded-full bg-muted animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (error || !pokemon) {
    return (
      <Card className={cn('overflow-hidden opacity-50', className)}>
        <CardContent className="p-4">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <div className="w-24 h-24 rounded bg-muted flex items-center justify-center">
              <span className="text-2xl">?</span>
            </div>
            <span className="text-xs">Failed to load</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Link to={`/pokemon/${pokemonId}`}>
      <Card className={cn(
        'overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:scale-105 active:scale-100',
        'min-h-[180px]',
        className
      )}>
        <CardContent className="p-4">
          <div className="flex flex-col items-center gap-2">
            {/* Pokemon sprite */}
            <img
              src={pokemon.sprites.front_default || pokemon.sprites.other['official-artwork'].front_default || ''}
              alt={pokemon.name}
              className="w-24 h-24 object-contain"
              loading="lazy"
            />

            {/* Pokemon number */}
            <span className="text-xs text-muted-foreground">
              {formatId(pokemon.id)}
            </span>

            {/* Pokemon name */}
            <span className="font-medium capitalize text-sm text-center">
              {pokemon.name.replace('-', ' ')}
            </span>

            {/* Type badges */}
            <div className="flex gap-1 flex-wrap justify-center">
              {pokemon.types.map((type) => (
                <TypeBadge
                  key={type.type.name}
                  type={type.type.name}
                  size="sm"
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
