import { useParams, useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TypeBadge } from '@/components/pokemon/TypeBadge'
import { PokemonDetailSkeleton } from '@/components/pokemon/PokemonDetailSkeleton'
import { ErrorState } from '@/components/ErrorState'
import { usePokemon } from '@/hooks'
import { ChevronLeft, ChevronRight, Home } from 'lucide-react'

// Total number of Pokemon (Gen 1-9)
const MAX_POKEMON_ID = 1025

export default function Pokemon() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const pokemonId = id ? parseInt(id, 10) || id : ''

  const { data: pokemon, isLoading, error, refetch } = usePokemon(pokemonId)

  // Calculate previous and next Pokemon IDs with wrapping
  const currentId = typeof pokemonId === 'number' ? pokemonId : pokemon?.id || 1
  const prevId = currentId <= 1 ? MAX_POKEMON_ID : currentId - 1
  const nextId = currentId >= MAX_POKEMON_ID ? 1 : currentId + 1

  // Format Pokemon ID with leading zeros
  const formatId = (num: number) => `#${String(num).padStart(3, '0')}`

  // Get official artwork URL
  const getArtworkUrl = (pokemonId: number) =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`

  // Convert height (decimeters) to feet/inches and meters
  const formatHeight = (dm: number) => {
    const meters = dm / 10
    const totalInches = Math.round(meters * 39.37)
    const feet = Math.floor(totalInches / 12)
    const inches = totalInches % 12
    return `${feet}'${inches}" (${meters.toFixed(1)}m)`
  }

  // Convert weight (hectograms) to lbs and kg
  const formatWeight = (hg: number) => {
    const kg = hg / 10
    const lbs = Math.round(kg * 2.205)
    return `${lbs} lbs (${kg.toFixed(1)} kg)`
  }

  // Stat bar color based on value
  const getStatColor = (value: number) => {
    if (value < 50) return 'bg-red-500'
    if (value < 80) return 'bg-yellow-500'
    if (value < 100) return 'bg-green-500'
    return 'bg-emerald-500'
  }

  // Stat name mapping
  const statNames: Record<string, string> = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    speed: 'Speed',
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <PokemonDetailSkeleton />
      </div>
    )
  }

  if (error || !pokemon) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh]">
        <ErrorState
          message={error?.message || 'Pokemon not found'}
          onRetry={() => refetch()}
        />
        <Button asChild variant="outline" className="mt-4">
          <Link to="/">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
    )
  }

  const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)

  return (
    <div className="container mx-auto p-4">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        {/* Main Pokemon card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Image section */}
              <div className="flex-shrink-0 flex justify-center">
                <img
                  src={getArtworkUrl(pokemon.id)}
                  alt={pokemon.name}
                  className="w-48 h-48 md:w-64 md:h-64 object-contain"
                  loading="eager"
                />
              </div>

              {/* Info section */}
              <div className="flex-1 space-y-4">
                {/* Pokemon number */}
                <p className="text-muted-foreground font-medium">
                  {formatId(pokemon.id)}
                </p>

                {/* Pokemon name */}
                <h1 className="text-3xl md:text-4xl font-bold capitalize">
                  {pokemon.name.replace('-', ' ')}
                </h1>

                {/* Type badges */}
                <div className="flex gap-2 flex-wrap">
                  {pokemon.types.map((type) => (
                    <TypeBadge
                      key={type.type.name}
                      type={type.type.name}
                      size="lg"
                      interactive
                    />
                  ))}
                </div>

                {/* Physical stats */}
                <div className="flex gap-6 mt-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Height</p>
                    <p className="font-medium">{formatHeight(pokemon.height)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="font-medium">{formatWeight(pokemon.weight)}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats section */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Base Stats</h2>
            <div className="space-y-3">
              {pokemon.stats.map((stat) => (
                <div key={stat.stat.name} className="flex items-center gap-4">
                  <span className="w-20 text-sm text-muted-foreground">
                    {statNames[stat.stat.name] || stat.stat.name}
                  </span>
                  <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getStatColor(stat.base_stat)} transition-all duration-500`}
                      style={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
                    />
                  </div>
                  <span className="w-10 text-right font-medium">{stat.base_stat}</span>
                </div>
              ))}
              <div className="flex items-center gap-4 pt-2 border-t">
                <span className="w-20 text-sm font-medium">Total</span>
                <div className="flex-1" />
                <span className="w-10 text-right font-bold">{totalStats}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate(`/pokemon/${prevId}`)}
            className="min-h-[44px] min-w-[44px]"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          <Button asChild variant="outline" className="min-h-[44px]">
            <Link to="/">
              <Home className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate(`/pokemon/${nextId}`)}
            className="min-h-[44px] min-w-[44px]"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
