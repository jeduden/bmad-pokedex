import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

/** Props for PokemonDetailSkeleton component */
interface IPokemonDetailSkeletonProps {
  /** Optional additional class names */
  className?: string
}

/**
 * Loading skeleton component matching PokemonDetail dimensions
 */
export function PokemonDetailSkeleton({ className }: IPokemonDetailSkeletonProps) {
  return (
    <Card className={cn('w-full max-w-md overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4">
          {/* Image placeholder */}
          <div className="w-64 h-64 rounded-lg bg-muted animate-pulse" />

          {/* Pokemon number placeholder */}
          <div className="w-16 h-5 rounded bg-muted animate-pulse" />

          {/* Pokemon name placeholder */}
          <div className="w-40 h-9 rounded bg-muted animate-pulse" />

          {/* Type badges placeholder */}
          <div className="flex gap-2">
            <div className="w-16 h-6 rounded-full bg-muted animate-pulse" />
            <div className="w-16 h-6 rounded-full bg-muted animate-pulse" />
          </div>

          {/* Physical characteristics placeholder */}
          <div className="flex gap-8 mt-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-4 rounded bg-muted animate-pulse" />
              <div className="w-16 h-6 rounded bg-muted animate-pulse" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-4 rounded bg-muted animate-pulse" />
              <div className="w-16 h-6 rounded bg-muted animate-pulse" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
