import * as React from 'react'
import * as TogglePrimitive from '@radix-ui/react-toggle'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-xs font-medium text-muted transition-[color,background-color,border-color,box-shadow] outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:ring-ring/40 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default:
          'border border-latte bg-transparent hover:border-latte-dark hover:bg-cream-300 hover:text-espresso-deep',
        filled: 'border border-transparent bg-cream-200 text-espresso hover:bg-cream-300',
      },
      size: {
        default: 'h-9 min-w-0 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 px-5 has-[>svg]:px-4',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
