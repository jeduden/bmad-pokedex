import { useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBrowsePokemon, useFilterParams } from '@/hooks'
import { PokemonGridCard } from '@/components/pokemon/PokemonGridCard'
import { PokemonGridCardSkeleton } from '@/components/pokemon/PokemonGridCardSkeleton'
import { TypeFilter } from '@/components/pokemon/TypeFilter'
import { GenerationFilter } from '@/components/pokemon/GenerationFilter'
import { ErrorState } from '@/components/ErrorState'
import { Button } from '@/components/ui/button'

/**
 * Browse page with Pokemon grid, infinite scroll, and filtering
 */
export default function Browse() {
  const navigate = useNavigate()
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Filter state from URL params
  const {
    selectedTypes,
    selectedGeneration,
    setTypes,
    setGeneration,
    clearFilters,
    hasActiveFilters,
  } = useFilterParams()

  // Fetch Pokemon with filters
  const {
    pokemon,
    totalCount,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    refetch,
  } = useBrowsePokemon({
    types: selectedTypes,
    generation: selectedGeneration,
  })

  // Navigate to Pokemon detail page
  const handlePokemonClick = useCallback(
    (id: number) => {
      navigate(`/pokemon/${id}`)
    },
    [navigate]
  )

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    const currentRef = loadMoreRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  // Show error state
  if (error && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          message="Failed to load Pokemon"
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Browse Pokemon
        </h1>
        <p className="text-muted-foreground">
          Explore all Pokemon with filters by type and generation
        </p>
      </div>

      {/* Filters Section */}
      <div className="mb-8 space-y-6 p-4 rounded-lg border bg-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TypeFilter
            selectedTypes={selectedTypes}
            onTypesChange={setTypes}
          />
          <GenerationFilter
            selectedGeneration={selectedGeneration}
            onGenerationChange={setGeneration}
          />
        </div>

        {/* Filter summary */}
        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            {isLoading ? (
              'Loading...'
            ) : (
              <>
                Showing <span className="font-medium">{pokemon.length}</span> of{' '}
                <span className="font-medium">{totalCount}</span> Pokemon
              </>
            )}
          </p>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="min-h-[44px]">
              Clear all filters
            </Button>
          )}
        </div>
      </div>

      {/* Pokemon Grid */}
      {isLoading && pokemon.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <PokemonGridCardSkeleton key={i} />
          ))}
        </div>
      ) : pokemon.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">
            No Pokemon found matching your filters
          </p>
          <Button variant="outline" onClick={clearFilters} className="min-h-[44px]">
            Clear filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {pokemon.map((p) => (
              <PokemonGridCard
                key={p.id}
                pokemon={p}
                onClick={() => handlePokemonClick(p.id)}
              />
            ))}
          </div>

          {/* Load more trigger / Loading indicator */}
          <div
            ref={loadMoreRef}
            className="mt-8 flex justify-center"
          >
            {isFetchingNextPage ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
                {Array.from({ length: 5 }).map((_, i) => (
                  <PokemonGridCardSkeleton key={`loading-${i}`} />
                ))}
              </div>
            ) : hasNextPage ? (
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                className="px-8 min-h-[44px]"
              >
                Load More
              </Button>
            ) : pokemon.length > 0 ? (
              <p className="text-muted-foreground text-sm">
                You've reached the end!
              </p>
            ) : null}
          </div>
        </>
      )}
    </div>
  )
}
