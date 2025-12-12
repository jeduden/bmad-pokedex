import { useState, useRef, useEffect, useId } from 'react'
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
 * Search bar component with dropdown results and keyboard navigation
 */
export function SearchBar({ className }: ISearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const { results, isLoading } = usePokemonSearch(searchTerm)
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const listboxId = useId()

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
    // Reset highlight when search term changes
    setHighlightedIndex(-1)
  }, [searchTerm])

  const handleSelect = (pokemonId: number) => {
    navigate(`/pokemon/${pokemonId}`)
    setSearchTerm('')
    setIsOpen(false)
    setHighlightedIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || !results.length) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : results.length - 1
        )
        break
      case 'Enter':
        if (highlightedIndex >= 0 && highlightedIndex < results.length) {
          e.preventDefault()
          handleSelect(results[highlightedIndex].id)
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setHighlightedIndex(-1)
        break
    }
  }

  const getOptionId = (index: number) => `${listboxId}-option-${index}`

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <Input
        type="search"
        placeholder="Search Pokemon..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-48 md:w-64"
        role="combobox"
        aria-expanded={isOpen && results.length > 0}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-activedescendant={
          highlightedIndex >= 0 ? getOptionId(highlightedIndex) : undefined
        }
        aria-autocomplete="list"
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
            <ul id={listboxId} role="listbox" className="py-1">
              {results.map((pokemon, index) => (
                <li
                  key={pokemon.id}
                  id={getOptionId(index)}
                  role="option"
                  aria-selected={index === highlightedIndex}
                >
                  <button
                    type="button"
                    onClick={() => handleSelect(pokemon.id)}
                    className={cn(
                      'w-full px-3 py-2 text-left flex items-center justify-between',
                      index === highlightedIndex
                        ? 'bg-accent'
                        : 'hover:bg-accent'
                    )}
                    tabIndex={-1}
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
