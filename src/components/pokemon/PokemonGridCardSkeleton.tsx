import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

/** Props for PokemonGridCardSkeleton component */
interface IPokemonGridCardSkeletonProps {
  /** Optional additional class names */
  className?: string
}

/**
 * Loading skeleton component matching PokemonGridCard dimensions
 */
export function PokemonGridCardSkeleton({
  className,
}: IPokemonGridCardSkeletonProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-4">
        <div className="flex flex-col items-center gap-2">
          {/* Image placeholder */}
          <div className="w-24 h-24 rounded-lg bg-muted animate-pulse" />

          {/* Pokemon number placeholder */}
          <div className="w-12 h-4 rounded bg-muted animate-pulse" />

          {/* Pokemon name placeholder */}
          <div className="w-20 h-5 rounded bg-muted animate-pulse" />

          {/* Type badges placeholder */}
          <div className="flex gap-1">
            <div className="w-12 h-5 rounded-full bg-muted animate-pulse" />
            <div className="w-12 h-5 rounded-full bg-muted animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
