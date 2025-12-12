import { useParams, Link, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { usePokemon } from '@/hooks/usePokemon'
import { PokemonDetail } from '@/components/pokemon/PokemonDetail'
import { PokemonDetailSkeleton } from '@/components/pokemon/PokemonDetailSkeleton'

export default function Pokemon() {
  const { id } = useParams<{ id: string }>()
  const { data: pokemon, isLoading, error } = usePokemon(id ?? '')

  // Redirect to NotFound page if Pokemon doesn't exist
  if (error) {
    return <Navigate to="/404" replace state={{ from: 'pokemon' }} />
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 gap-6">
      {isLoading ? (
        <PokemonDetailSkeleton />
      ) : pokemon ? (
        <PokemonDetail pokemon={pokemon} />
      ) : null}

      <Button asChild variant="outline">
        <Link to="/">Back to Home</Link>
      </Button>
    </div>
  )
}
