import { Button } from '@/components/ui/button'
import { useRandomPokemon } from '@/hooks'
import { PokemonCard } from '@/components/pokemon/PokemonCard'
import { PokemonCardSkeleton } from '@/components/pokemon/PokemonCardSkeleton'
import { ErrorState } from '@/components/ErrorState'

export default function Home() {
  const { data: pokemon, isLoading, error, refetch, getNewRandom } = useRandomPokemon()

  return (
    <div className="flex flex-col items-center justify-center p-4 gap-6">
      <h1 className="text-4xl font-bold text-foreground mb-4">bmad-pokedex</h1>

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
      >
        Discover Another
      </Button>

      <p className="text-muted-foreground text-sm">
        Pokemon discovery website - Powered by PokeAPI
      </p>
    </div>
  )
}
