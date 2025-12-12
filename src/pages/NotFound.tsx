import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function NotFound() {
  const location = useLocation()
  const state = location.state as { from?: string } | null
  const isPokemonRoute = state?.from === 'pokemon'

  return (
    <div className="flex flex-col items-center justify-center p-4 gap-6">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-6xl font-bold text-muted-foreground">
            404
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h2 className="text-2xl font-semibold">
            {isPokemonRoute ? 'Pokemon Not Found' : 'Page Not Found'}
          </h2>
          <p className="text-muted-foreground">
            {isPokemonRoute
              ? "The Pokemon you're looking for doesn't exist or the ID is invalid."
              : "The page you're looking for doesn't exist or has been moved."}
          </p>
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
