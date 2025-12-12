import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/pokemon/SearchBar'

export default function Header() {
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="text-xl font-bold text-foreground shrink-0">
          bmad-pokedex
        </Link>

        {/* Search Bar - centered */}
        <SearchBar className="hidden sm:block" />

        <nav className="flex gap-2 shrink-0">
          <Button
            asChild
            variant={isActive('/') ? 'default' : 'ghost'}
            size="sm"
          >
            <Link to="/">Home</Link>
          </Button>
          <Button
            asChild
            variant={isActive('/browse') ? 'default' : 'ghost'}
            size="sm"
          >
            <Link to="/browse">Browse</Link>
          </Button>
        </nav>
      </div>

      {/* Mobile search bar - below header */}
      <div className="container mx-auto px-4 pb-3 sm:hidden">
        <SearchBar className="w-full" />
      </div>
    </header>
  )
}
