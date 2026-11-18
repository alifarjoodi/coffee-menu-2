import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium leading-relaxed whitespace-nowrap shrink-0 [&>svg]:size-3 [&>svg]:pointer-events-none transition-colors",
  {
    variants: {
      variant: {
        default: 'border-transparent bg-secondary text-espresso',
        outline: 'border-border bg-cream-100/80 text-muted',
        warm: 'border-[#e6d6bf] bg-[#f7efe0]/90 text-[#8d4e28]',
        cold: 'border-[#d6e2e2] bg-[#f4f9f7]/90 text-[#466c79]',
        dot: 'border-transparent bg-primary text-primary-foreground font-mono text-[10px] tracking-wider',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'
  return <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
