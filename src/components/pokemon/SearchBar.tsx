import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { usePokemonSearch } from '@/hooks/usePokemonSearch'
import { cn } from '@/lib/utils'

/** Props for SearchBar component */
interface ISearchBarProps {
  /** Optional additional class names */
  className?: string
}

/**
 * Format Pokemon ID to #XXX format
 */
function formatPokemonNumber(id: number): string {
  return `#${id.toString().padStart(3, '0')}`
}

/**
 * Capitalize first letter of a string
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Search bar component with dropdown results
 */
export function SearchBar({ className }: ISearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const { results, isLoading } = usePokemonSearch(searchTerm)
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Show dropdown when there are results or loading
  useEffect(() => {
    if (searchTerm.trim()) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [searchTerm])

  const handleSelect = (pokemonId: number) => {
    navigate(`/pokemon/${pokemonId}`)
    setSearchTerm('')
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <Input
        type="search"
        placeholder="Search Pokemon..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-48 md:w-64"
      />

      {/* Dropdown */}
      {isOpen && searchTerm.trim() && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-80 overflow-auto">
          {isLoading && (
            <div className="p-3 text-sm text-muted-foreground">
              Loading Pokemon list...
            </div>
          )}

          {!isLoading && results.length === 0 && (
            <div className="p-3 text-sm text-muted-foreground">
              No Pokemon found
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <ul className="py-1">
              {results.map((pokemon) => (
                <li key={pokemon.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(pokemon.id)}
                    className="w-full px-3 py-2 text-left hover:bg-accent flex items-center justify-between"
                  >
                    <span className="font-medium capitalize">
                      {capitalize(pokemon.name)}
                    </span>
                    <span className="text-sm text-muted-foreground font-mono">
                      {formatPokemonNumber(pokemon.id)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
