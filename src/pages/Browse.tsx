import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PokemonGridCard } from '@/components/pokemon/PokemonGridCard'
import { PokemonGridSkeleton } from '@/components/pokemon/PokemonGridSkeleton'
import { TypeBadge } from '@/components/pokemon/TypeBadge'
import { ErrorState } from '@/components/ErrorState'
import { usePokemonList } from '@/hooks'
import { cn } from '@/lib/utils'

// All Pokemon types
const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
]

// Pokemon count per page
const PAGE_SIZE = 20

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState(0)

  // Get type filter from URL
  const selectedType = searchParams.get('type') || ''

  // Fetch Pokemon list
  const { data, isLoading, error, refetch } = usePokemonList(PAGE_SIZE, page * PAGE_SIZE)

  // Reset page when type filter changes
  useEffect(() => {
    setPage(0)
  }, [selectedType])

  // Handle type filter click
  const handleTypeClick = (type: string) => {
    if (selectedType === type) {
      // Clear filter if clicking same type
      searchParams.delete('type')
    } else {
      searchParams.set('type', type)
    }
    setSearchParams(searchParams)
  }

  // Clear all filters
  const clearFilters = () => {
    searchParams.delete('type')
    setSearchParams(searchParams)
  }

  // Calculate pagination
  const totalPages = data ? Math.ceil(data.count / PAGE_SIZE) : 0
  const hasNextPage = data?.next !== null
  const hasPrevPage = data?.previous !== null

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Filters section */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filter by Type</h2>
              {selectedType && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground"
                >
                  Clear filters
                </Button>
              )}
            </div>

            {/* Type filter pills */}
            <div className="flex flex-wrap gap-2">
              {POKEMON_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeClick(type)}
                  className={cn(
                    'transition-all rounded-full',
                    selectedType === type && 'ring-2 ring-offset-2 ring-primary'
                  )}
                >
                  <TypeBadge type={type} size="md" />
                </button>
              ))}
            </div>

            {/* Filter info */}
            {selectedType && (
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium capitalize">{selectedType}</span> type Pokemon
                {data && ` (filtering from ${data.count} total)`}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results section */}
      {error ? (
        <div className="flex justify-center py-12">
          <ErrorState
            message="Failed to load Pokemon. Please try again."
            onRetry={() => refetch()}
          />
        </div>
      ) : isLoading ? (
        <PokemonGridSkeleton count={PAGE_SIZE} />
      ) : data?.results.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No Pokemon found.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Pokemon grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {data?.results.map((pokemon) => (
              <PokemonGridCard
                key={pokemon.name}
                nameOrId={pokemon.name}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 py-4">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={!hasPrevPage || isLoading}
              className="min-h-[44px] min-w-[100px]"
            >
              Previous
            </Button>

            <span className="text-sm text-muted-foreground">
              Page {page + 1} of {totalPages}
            </span>

            <Button
              variant="outline"
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasNextPage || isLoading}
              className="min-h-[44px] min-w-[100px]"
            >
              Next
            </Button>
          </div>

          {/* Total count */}
          <p className="text-center text-sm text-muted-foreground">
            {data?.count.toLocaleString()} Pokemon available
          </p>
        </>
      )}
    </div>
  )
}
