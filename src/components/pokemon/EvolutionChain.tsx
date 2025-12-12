import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEvolutionChain } from '@/hooks/useEvolutionChain'
import { extractIdFromUrl } from '@/lib/api'
import type { IEvolutionNode } from '@/types/pokemon'

/** Props for EvolutionChain component */
interface IEvolutionChainProps {
  /** Pokemon ID to get evolution chain for */
  pokemonId: number
  /** Optional additional class names */
  className?: string
}

/**
 * Capitalize first letter of a string
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Get Pokemon sprite URL from species name
 */
function getSpriteUrl(pokemonId: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`
}

/** Props for EvolutionStage component */
interface IEvolutionStageProps {
  node: IEvolutionNode
  onSelect: (id: number) => void
  currentPokemonId: number
}

/**
 * Single evolution stage with sprite and name
 */
function EvolutionStage({ node, onSelect, currentPokemonId }: IEvolutionStageProps) {
  const pokemonId = extractIdFromUrl(node.species.url)
  const isCurrentPokemon = pokemonId === currentPokemonId

  return (
    <button
      onClick={() => onSelect(pokemonId)}
      className={cn(
        'flex flex-col items-center p-2 rounded-lg transition-all',
        'hover:bg-accent hover:scale-105',
        isCurrentPokemon && 'ring-2 ring-primary bg-accent'
      )}
    >
      <img
        src={getSpriteUrl(pokemonId)}
        alt={node.species.name}
        className="w-16 h-16 object-contain"
        loading="lazy"
      />
      <span className={cn(
        'text-xs mt-1',
        isCurrentPokemon ? 'font-bold' : 'font-medium'
      )}>
        {capitalize(node.species.name)}
      </span>
    </button>
  )
}

/**
 * Recursive component to render evolution chain with branching support
 */
function EvolutionBranch({
  node,
  onSelect,
  currentPokemonId,
  isFirst = false
}: IEvolutionStageProps & { isFirst?: boolean }) {
  const hasBranches = node.evolves_to.length > 1

  return (
    <div className="flex items-center">
      {/* Arrow before this stage (except for first) */}
      {!isFirst && (
        <ChevronRight className="w-4 h-4 text-muted-foreground mx-1 shrink-0" />
      )}

      {/* Current evolution stage */}
      <EvolutionStage
        node={node}
        onSelect={onSelect}
        currentPokemonId={currentPokemonId}
      />

      {/* Evolution branches */}
      {node.evolves_to.length > 0 && (
        <div className={cn(
          'flex',
          hasBranches ? 'flex-col gap-2' : 'items-center'
        )}>
          {node.evolves_to.map((evolution) => (
            <EvolutionBranch
              key={evolution.species.name}
              node={evolution}
              onSelect={onSelect}
              currentPokemonId={currentPokemonId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Component to display Pokemon evolution chain with clickable sprites
 */
export function EvolutionChain({ pokemonId, className }: IEvolutionChainProps) {
  const navigate = useNavigate()
  const { data: chain, isLoading, error } = useEvolutionChain(pokemonId)

  const handleSelect = (id: number) => {
    navigate(`/pokemon/${id}`)
  }

  if (isLoading) {
    return (
      <div className={cn('w-full', className)}>
        <h2 className="text-lg font-semibold mb-4">Evolution Chain</h2>
        <div className="animate-pulse flex items-center gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center">
              {i > 1 && <div className="w-4 h-4 bg-muted rounded mr-2" />}
              <div className="w-16 h-20 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error || !chain) {
    return (
      <div className={cn('w-full', className)}>
        <h2 className="text-lg font-semibold mb-4">Evolution Chain</h2>
        <p className="text-sm text-muted-foreground">Evolution data unavailable</p>
      </div>
    )
  }

  // Check if Pokemon has no evolutions (single stage)
  const hasNoEvolutions = chain.evolves_to.length === 0

  if (hasNoEvolutions) {
    return (
      <div className={cn('w-full', className)}>
        <h2 className="text-lg font-semibold mb-4">Evolution Chain</h2>
        <p className="text-sm text-muted-foreground">Does not evolve</p>
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      <h2 className="text-lg font-semibold mb-4">Evolution Chain</h2>
      <div className="flex flex-wrap items-center justify-center">
        <EvolutionBranch
          node={chain}
          onSelect={handleSelect}
          currentPokemonId={pokemonId}
          isFirst
        />
      </div>
    </div>
  )
}
