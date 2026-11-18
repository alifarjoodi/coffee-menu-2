import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { Rosette } from './Brand'
import { Button } from '@/components/ui/button'
import { useDrawerMotion } from '../hooks/motion'

export function Drawer({
  open,
  onClose,
  section,
  children,
}: {
  open: boolean
  onClose: () => void
  section: string
  children: ReactNode
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const titleAnchor = useRef<HTMLDivElement>(null)
  const shell = useRef<HTMLDivElement>(null)
  useDrawerMotion(shell, open, section, dialog)
  useLayoutEffect(() => {
    const node = dialog.current
    if (!node) return
    if (open) {
      if (!node.open) node.showModal()
      titleAnchor.current?.focus({ preventScroll: true })
    } else if (node.open) {
      const delay = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 230
      const timer = window.setTimeout(() => node.close(), delay)
      return () => window.clearTimeout(timer)
    }
  }, [open, section])
  return (
    <dialog
      ref={dialog}
      className={`drawer ${open ? 'drawer-in' : 'drawer-out'}`}
      aria-labelledby="drawer-title"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return
        const box = event.currentTarget.getBoundingClientRect()
        if (
          event.clientX < box.left ||
          event.clientX > box.right ||
          event.clientY < box.top ||
          event.clientY > box.bottom
        )
          onClose()
      }}
    >
      <div className="drawer-shell" ref={shell}>
        <div className="drawer-bar" ref={titleAnchor} tabIndex={-1}>
          <span className="drawer-imprint">
            <Rosette />
            <span lang="en" className="eyebrow" dir="ltr">
              DANEH COFFEE HOUSE
            </span>
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="close-drawer rounded-full"
            onClick={onClose}
            aria-label="بستن پنل"
          >
            <X />
          </Button>
        </div>
        {children}
      </div>
    </dialog>
  )
}
