import * as React from 'react'
import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-muted/80 selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border border-input bg-cream-100 px-3 py-1 text-sm shadow-xs transition-[color,box-shadow,border-color] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-copper focus-visible:ring-copper/25 focus-visible:ring-[3px]',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
