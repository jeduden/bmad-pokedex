import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface IPokemonDetailSkeletonProps {
  className?: string
}

/**
 * Loading skeleton for the Pokemon detail page
 */
export function PokemonDetailSkeleton({ className }: IPokemonDetailSkeletonProps) {
  return (
    <div className={cn('w-full max-w-2xl mx-auto space-y-6', className)}>
      {/* Main Pokemon card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image section */}
            <div className="flex-shrink-0 flex justify-center">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-lg bg-muted animate-pulse" />
            </div>

            {/* Info section */}
            <div className="flex-1 space-y-4">
              {/* Pokemon number */}
              <div className="w-16 h-5 rounded bg-muted animate-pulse" />

              {/* Pokemon name */}
              <div className="w-48 h-10 rounded bg-muted animate-pulse" />

              {/* Type badges */}
              <div className="flex gap-2">
                <div className="w-20 h-7 rounded-full bg-muted animate-pulse" />
                <div className="w-20 h-7 rounded-full bg-muted animate-pulse" />
              </div>

              {/* Physical stats */}
              <div className="flex gap-6 mt-4">
                <div className="space-y-1">
                  <div className="w-12 h-4 rounded bg-muted animate-pulse" />
                  <div className="w-16 h-6 rounded bg-muted animate-pulse" />
                </div>
                <div className="space-y-1">
                  <div className="w-12 h-4 rounded bg-muted animate-pulse" />
                  <div className="w-16 h-6 rounded bg-muted animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats section */}
      <Card>
        <CardContent className="p-6">
          <div className="w-32 h-6 rounded bg-muted animate-pulse mb-4" />
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-24 h-4 rounded bg-muted animate-pulse" />
                <div className="flex-1 h-4 rounded-full bg-muted animate-pulse" />
                <div className="w-10 h-4 rounded bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <div className="w-24 h-10 rounded bg-muted animate-pulse" />
        <div className="w-24 h-10 rounded bg-muted animate-pulse" />
      </div>
    </div>
  )
}
