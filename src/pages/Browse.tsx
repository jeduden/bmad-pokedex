import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Browse() {
  return (
    <div className="flex flex-col items-center justify-center p-4 gap-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Browse Pokemon</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Pokemon grid view will be displayed here. Browse and filter through
            all Pokemon from the PokeAPI.
          </p>
          <Button asChild variant="outline">
            <Link to="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
