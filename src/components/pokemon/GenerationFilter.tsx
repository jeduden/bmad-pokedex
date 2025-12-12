import { cn } from '@/lib/utils'
import { GENERATION_RANGES } from '@/lib/constants'

/** Props for GenerationFilter component */
interface IGenerationFilterProps {
  /** Currently selected generation (null for all) */
  selectedGeneration: number | null
  /** Callback when generation selection changes */
  onGenerationChange: (generation: number | null) => void
  /** Optional additional class names */
  className?: string
}

/**
 * Generation filter dropdown component
 */
export function GenerationFilter({
  selectedGeneration,
  onGenerationChange,
  className,
}: IGenerationFilterProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <label
        htmlFor="generation-select"
        className="text-sm font-medium text-foreground"
      >
        Filter by Generation
      </label>
      <select
        id="generation-select"
        value={selectedGeneration ?? ''}
        onChange={(e) => {
          const value = e.target.value
          onGenerationChange(value ? parseInt(value, 10) : null)
        }}
        className={cn(
          'w-full px-3 py-2 rounded-md border border-input bg-background text-sm',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50'
        )}
      >
        <option value="">All Generations</option>
        {Object.entries(GENERATION_RANGES).map(([gen, { name }]) => (
          <option key={gen} value={gen}>
            {name}
          </option>
        ))}
      </select>
    </div>
  )
}
