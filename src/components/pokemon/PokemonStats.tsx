import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { IPokemonStat } from '@/types/pokemon'

/** Map stat API names to display names */
const STAT_DISPLAY_NAMES: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
}

/** Maximum base stat value (for scaling bars) */
const MAX_STAT = 255

/**
 * Get color class based on stat value
 * - 0-50: red (low)
 * - 51-100: yellow (medium)
 * - 101+: green (high)
 */
function getStatColor(value: number): string {
  if (value <= 50) return 'bg-red-500'
  if (value <= 100) return 'bg-yellow-500'
  return 'bg-green-500'
}

/** Props for PokemonStats component */
interface IPokemonStatsProps {
  /** Array of Pokemon stats from API */
  stats: IPokemonStat[]
  /** Optional additional class names */
  className?: string
}

/**
 * Component to display Pokemon base stats as animated horizontal bar charts
 * with color coding based on stat values
 */
export function PokemonStats({ stats, className }: IPokemonStatsProps) {
  const [animated, setAnimated] = useState(false)

  // Trigger animation after mount
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 50)
    return () => clearTimeout(timer)
  }, [])

  // Calculate total base stats
  const totalStats = stats.reduce((sum, stat) => sum + stat.base_stat, 0)

  return (
    <div className={cn('w-full', className)}>
      <h2 className="text-lg font-semibold mb-4">Base Stats</h2>

      <div className="space-y-3">
        {stats.map((stat) => {
          const displayName = STAT_DISPLAY_NAMES[stat.stat.name] || stat.stat.name
          const percentage = (stat.base_stat / MAX_STAT) * 100

          return (
            <div key={stat.stat.name} className="flex items-center gap-3">
              {/* Stat name label */}
              <span className="w-16 text-sm text-muted-foreground shrink-0">
                {displayName}
              </span>

              {/* Stat value */}
              <span className="w-8 text-sm font-medium text-right shrink-0">
                {stat.base_stat}
              </span>

              {/* Bar container with max reference */}
              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden relative">
                {/* Animated bar fill */}
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500 ease-out',
                    getStatColor(stat.base_stat)
                  )}
                  style={{ width: animated ? `${percentage}%` : '0%' }}
                />
              </div>

              {/* Max stat reference */}
              <span className="w-8 text-xs text-muted-foreground shrink-0 text-right">
                {MAX_STAT}
              </span>
            </div>
          )
        })}
      </div>

      {/* Total base stats */}
      <div className="mt-4 pt-3 border-t flex justify-between items-center">
        <span className="text-sm font-medium">Total</span>
        <span className="text-lg font-bold">{totalStats}</span>
      </div>
    </div>
  )
}
