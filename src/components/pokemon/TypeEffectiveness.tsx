import { cn } from '@/lib/utils'
import { TypeBadge } from './TypeBadge'
import { useTypeEffectiveness } from '@/hooks/useTypeEffectiveness'

/** Props for TypeEffectiveness component */
interface ITypeEffectivenessProps {
  /** Array of type names (e.g., ["electric"] or ["fire", "flying"]) */
  types: string[]
  /** Optional additional class names */
  className?: string
}

/**
 * Format multiplier for display (e.g., 2 -> "×2", 0.5 -> "×½")
 */
function formatMultiplier(multiplier: number): string {
  if (multiplier === 4) return '×4'
  if (multiplier === 2) return '×2'
  if (multiplier === 0.5) return '×½'
  if (multiplier === 0.25) return '×¼'
  return `×${multiplier}`
}

/**
 * Component to display Pokemon type effectiveness (weaknesses, resistances, immunities)
 */
export function TypeEffectiveness({ types, className }: ITypeEffectivenessProps) {
  const { data, isLoading, error } = useTypeEffectiveness(types)

  if (isLoading) {
    return (
      <div className={cn('w-full', className)}>
        <h2 className="text-lg font-semibold mb-4">Type Effectiveness</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-24" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-6 w-16 bg-muted rounded-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className={cn('w-full', className)}>
        <h2 className="text-lg font-semibold mb-4">Type Effectiveness</h2>
        <p className="text-sm text-muted-foreground">Unable to load type matchups</p>
      </div>
    )
  }

  return (
    <div className={cn('w-full space-y-4', className)}>
      <h2 className="text-lg font-semibold">Type Effectiveness</h2>

      {/* Weak To section */}
      {data.weaknesses.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Weak To</h3>
          <div className="flex flex-wrap gap-2">
            {data.weaknesses.map(({ type, multiplier }) => (
              <div key={type} className="flex items-center gap-1">
                <TypeBadge type={type} />
                <span className="text-xs text-red-600 font-medium">
                  {formatMultiplier(multiplier)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resistant To section */}
      {data.resistances.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Resistant To</h3>
          <div className="flex flex-wrap gap-2">
            {data.resistances.map(({ type, multiplier }) => (
              <div key={type} className="flex items-center gap-1">
                <TypeBadge type={type} />
                <span className="text-xs text-green-600 font-medium">
                  {formatMultiplier(multiplier)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Immune To section */}
      {data.immunities.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Immune To</h3>
          <div className="flex flex-wrap gap-2">
            {data.immunities.map(type => (
              <div key={type} className="flex items-center gap-1">
                <TypeBadge type={type} />
                <span className="text-xs text-blue-600 font-medium">×0</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
