import { Button } from '@/components/ui/button'
import { useRandomPokemon } from '@/hooks'
import { PokemonCard } from '@/components/pokemon/PokemonCard'
import { PokemonCardSkeleton } from '@/components/pokemon/PokemonCardSkeleton'
import { ErrorState } from '@/components/ErrorState'

export default function Home() {
  const { data: pokemon, isLoading, error, refetch, getNewRandom } = useRandomPokemon()

  return (
    <div className="flex flex-col items-center justify-center p-4 gap-6 min-h-[80vh]">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">
        bmad-pokedex
      </h1>

      {/* Random Pokemon Display */}
      {isLoading && <PokemonCardSkeleton />}

      {error && (
        <ErrorState
          message="Failed to load Pokemon. Please try again."
          onRetry={() => refetch()}
        />
      )}

      {pokemon && !isLoading && !error && <PokemonCard pokemon={pokemon} />}

      {/* Discover Another Button */}
      <Button
        onClick={getNewRandom}
        size="lg"
        disabled={isLoading}
        className="min-h-[44px] px-8 touch-active"
      >
        Discover Another
      </Button>

      <p className="text-muted-foreground text-sm text-center px-4">
        Pokemon discovery website - Powered by PokeAPI
      </p>
    </div>
  )
}
