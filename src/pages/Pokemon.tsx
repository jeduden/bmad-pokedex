import { useEffect } from 'react'
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { usePokemon } from '@/hooks/usePokemon'
import { PokemonDetail } from '@/components/pokemon/PokemonDetail'
import { PokemonDetailSkeleton } from '@/components/pokemon/PokemonDetailSkeleton'

const MAX_POKEMON = 1010

/** Calculate previous Pokemon ID (wraps 1 → 1010) */
function getPreviousId(id: number): number {
  return id === 1 ? MAX_POKEMON : id - 1
}

/** Calculate next Pokemon ID (wraps 1010 → 1) */
function getNextId(id: number): number {
  return id === MAX_POKEMON ? 1 : id + 1
}

export default function Pokemon() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: pokemon, isLoading, error } = usePokemon(id ?? '')
  const pokemonId = pokemon?.id ?? parseInt(id ?? '0', 10)

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't navigate if user is typing in an input
      if (event.target instanceof HTMLInputElement) return

      if (event.key === 'ArrowLeft') {
        navigate(`/pokemon/${getPreviousId(pokemonId)}`)
      } else if (event.key === 'ArrowRight') {
        navigate(`/pokemon/${getNextId(pokemonId)}`)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [pokemonId, navigate])

  // Redirect to NotFound page if Pokemon doesn't exist
  if (error) {
    return <Navigate to="/404" replace state={{ from: 'pokemon' }} />
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 gap-6 min-h-[60vh]">
      {isLoading ? (
        <PokemonDetailSkeleton />
      ) : pokemon ? (
        <PokemonDetail pokemon={pokemon} />
      ) : null}

      <Button asChild variant="outline" className="min-h-[44px]">
        <Link to="/">Back to Home</Link>
      </Button>
    </div>
  )
}
