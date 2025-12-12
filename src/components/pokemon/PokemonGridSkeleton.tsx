import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface IPokemonGridSkeletonProps {
  /** Number of skeleton cards to display */
  count?: number
  className?: string
}

/**
 * Single Pokemon card skeleton for grid view
 */
function PokemonGridCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col items-center gap-2">
          {/* Sprite placeholder */}
          <div className="w-24 h-24 rounded bg-muted animate-pulse" />

          {/* Pokemon number */}
          <div className="w-10 h-4 rounded bg-muted animate-pulse" />

          {/* Pokemon name */}
          <div className="w-20 h-5 rounded bg-muted animate-pulse" />

          {/* Type badges */}
          <div className="flex gap-1">
            <div className="w-12 h-5 rounded-full bg-muted animate-pulse" />
            <div className="w-12 h-5 rounded-full bg-muted animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Loading skeleton for the Pokemon browse grid
 */
export function PokemonGridSkeleton({ count = 20, className }: IPokemonGridSkeletonProps) {
  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4', className)}>
      {[...Array(count)].map((_, i) => (
        <PokemonGridCardSkeleton key={i} />
      ))}
    </div>
  )
}
