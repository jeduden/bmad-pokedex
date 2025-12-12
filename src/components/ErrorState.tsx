import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

/** Props for ErrorState component */
interface IErrorStateProps {
  /** Error message to display */
  message?: string
  /** Callback for retry action */
  onRetry?: () => void
  /** Optional additional class names */
  className?: string
}

/**
 * Error state component with friendly message and retry option
 */
export function ErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
  className,
}: IErrorStateProps) {
  return (
    <Card className={cn('w-full max-w-sm', className)}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Error icon */}
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Error message */}
          <p className="text-muted-foreground">{message}</p>

          {/* Retry button */}
          {onRetry && (
            <Button onClick={onRetry} variant="outline">
              Try Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
