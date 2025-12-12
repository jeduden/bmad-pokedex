import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'

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
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-foreground">
          bmad-pokedex
        </Link>
        <nav className="flex gap-2">
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
    </header>
  )
}
