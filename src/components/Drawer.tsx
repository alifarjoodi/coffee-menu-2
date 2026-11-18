import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { Rosette } from './Brand'

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
      <div className="drawer-shell">
        <div className="drawer-bar" ref={titleAnchor} tabIndex={-1}>
          <span className="drawer-imprint">
            <Rosette />
            <span lang="en" className="eyebrow" dir="ltr">
              DANEH COFFEE HOUSE
            </span>
          </span>
          <button className="icon-btn close-drawer" onClick={onClose} aria-label="بستن پنل">
            <X size={19} />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  )
}
