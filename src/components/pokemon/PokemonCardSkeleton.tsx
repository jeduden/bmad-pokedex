import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

/** Props for PokemonCardSkeleton component */
interface IPokemonCardSkeletonProps {
  /** Optional additional class names */
  className?: string
}

/**
 * Loading skeleton component matching PokemonCard dimensions
 */
export function PokemonCardSkeleton({ className }: IPokemonCardSkeletonProps) {
  return (
    <Card className={cn('w-full max-w-sm overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4">
          {/* Image placeholder */}
          <div className="w-48 h-48 rounded-lg bg-muted animate-pulse" />

          {/* Pokemon number placeholder */}
          <div className="w-16 h-5 rounded bg-muted animate-pulse" />

          {/* Pokemon name placeholder */}
          <div className="w-32 h-8 rounded bg-muted animate-pulse" />

          {/* Type badges placeholder */}
          <div className="flex gap-2">
            <div className="w-16 h-6 rounded-full bg-muted animate-pulse" />
            <div className="w-16 h-6 rounded-full bg-muted animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
