import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { usePokemon } from '@/hooks'

export default function Home() {
  // Demo: Fetch Pikachu to verify API client works
  const { data: pikachu, isLoading, error } = usePokemon(25)

  return (
    <div className="flex flex-col items-center justify-center p-4 gap-6">
      <h1 className="text-4xl font-bold text-foreground mb-4">bmad-pokedex</h1>

      {/* API Demo Card */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>API Demo: Pikachu</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && (
            <p className="text-destructive">Error: {error.message}</p>
          )}
          {pikachu && (
            <div className="flex items-center gap-4">
              <img
                src={pikachu.sprites.other['official-artwork'].front_default ?? pikachu.sprites.front_default ?? ''}
                alt={pikachu.name}
                className="w-24 h-24"
              />
              <div>
                <p className="font-semibold capitalize">{pikachu.name}</p>
                <p className="text-sm text-muted-foreground">ID: {pikachu.id}</p>
                <div className="flex gap-1 mt-1">
                  {pikachu.types.map((t) => (
                    <Badge key={t.slot} variant="outline" className="capitalize">
                      {t.type.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Search Pokemon</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Enter Pokemon name..." />
          <Button className="w-full">Search</Button>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2 justify-center">
        <Badge className={cn('bg-pokemon-fire text-white')}>Fire</Badge>
        <Badge className={cn('bg-pokemon-water text-white')}>Water</Badge>
        <Badge className={cn('bg-pokemon-grass text-white')}>Grass</Badge>
        <Badge className={cn('bg-pokemon-electric text-black')}>Electric</Badge>
        <Badge className={cn('bg-pokemon-psychic text-white')}>Psychic</Badge>
        <Badge className={cn('bg-pokemon-dragon text-white')}>Dragon</Badge>
      </div>

      <div className="flex gap-4">
        <Button asChild variant="outline">
          <Link to="/browse">Browse All Pokemon</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/pokemon/25">View Pikachu</Link>
        </Button>
      </div>

      <p className="text-muted-foreground text-sm">
        Pokemon discovery website - Powered by PokeAPI
      </p>
    </div>
  )
}
