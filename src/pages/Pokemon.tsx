import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Pokemon() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="flex flex-col items-center justify-center p-4 gap-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Pokemon Detail</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            Viewing Pokemon with ID: <span className="font-bold">{id}</span>
          </p>
          <p className="text-muted-foreground">
            Pokemon details will be loaded here from PokeAPI.
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link to="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
