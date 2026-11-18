import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

/** Cinematic entrance for the hero: masked title, drifting photo, staggered copy. */
export function useHeroIntro(scope: React.RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const title = scope.current?.querySelector('h1')
        // Persian is a connected script: split into words, never characters.
        const split = title ? SplitText.create(title, { type: 'words', mask: 'words' }) : null
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        tl.from('.hero-kicker', { y: -14, opacity: 0, duration: 0.7 })
          .from('.hero-copy > p', { y: 18, opacity: 0, duration: 0.8 }, '-=0.35')
          .from('.hero-note', { y: 12, opacity: 0, duration: 0.6 }, '-=0.45')
          .from('.hero-image', { scale: 1.12, xPercent: -6, opacity: 0.72, duration: 1.6 }, 0)
          .from('.cafe-seal', { rotate: -60, scale: 0.6, opacity: 0, duration: 1.1 }, 0.15)
          .from('.hero-plate', { opacity: 0, y: 8, duration: 0.5 }, 0.9)
        if (split)
          tl.from(split.words, { yPercent: 118, opacity: 0, stagger: 0.06, duration: 0.95 }, 0.1)

        // Gentle parallax while scrolling away from the hero.
        gsap.to('.hero-image', {
          yPercent: 9,
          ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
        })
        gsap.to('.hero-copy', {
          yPercent: -8,
          opacity: 0.65,
          ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
        })

        // Header condenses and the sticky toolbar animates in.
        const header = document.querySelector('.site-header')
        if (header)
          ScrollTrigger.create({
            start: 'top -40',
            end: 99999,
            onUpdate: (self) =>
              gsap.to(header, {
                boxShadow: self.scroll() > 40 ? '0 14px 34px -30px #38221899' : 'none',
                duration: 0.3,
                overwrite: true,
              }),
          })
      })
      return () => mm.revert()
    },
    { scope },
  )
}

/** Magnetic, press-and-release feel on every drink affordance + hover lift on rows. */
export function useMenuInteractions(
  scope: React.RefObject<HTMLElement | null>,
  magneticSelector = '[data-magnetic]',
) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(hover: hover) and (prefers-reduced-motion: no-preference)', () => {
        const removers: (() => void)[] = []

        document.querySelectorAll<HTMLElement>(magneticSelector).forEach((el) => {
          const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' })
          const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' })
          const enter = () =>
            gsap.to(el, { scale: 1.04, duration: 0.35, ease: 'back.out(2)', overwrite: true })
          const move = (event: PointerEvent) => {
            const box = el.getBoundingClientRect()
            xTo((event.clientX - box.left - box.width / 2) * 0.22)
            yTo((event.clientY - box.top - box.height / 2) * 0.22)
          }
          const leave = () => {
            xTo(0)
            yTo(0)
            gsap.to(el, { scale: 1, duration: 0.45, ease: 'elastic.out(1, 0.5)' })
          }
          el.addEventListener('pointerenter', enter)
          el.addEventListener('pointermove', move)
          el.addEventListener('pointerleave', leave)
          removers.push(() => {
            el.removeEventListener('pointerenter', enter)
            el.removeEventListener('pointermove', move)
            el.removeEventListener('pointerleave', leave)
          })
        })

        scope.current?.querySelectorAll<HTMLElement>('.signature-row').forEach((row) => {
          const img = row.querySelector('img')
          if (!img) return
          const enter = () => gsap.to(img, { scale: 1.06, duration: 0.9, ease: 'power3.out' })
          const leave = () => gsap.to(img, { scale: 1, duration: 0.7, ease: 'power2.out' })
          row.addEventListener('pointerenter', enter)
          row.addEventListener('pointerleave', leave)
          removers.push(() => {
            row.removeEventListener('pointerenter', enter)
            row.removeEventListener('pointerleave', leave)
          })
        })
        return () => removers.forEach((remove) => remove())
      })
      return () => mm.revert()
    },
    { scope },
  )
}

/**
 * Drawer choreography: the physical desk slides in, the panel body unrolls,
 * and rows/controls cascade. Flip is used to animate size/quantity changes.
 */
export function useDrawerMotion(
  shell: React.RefObject<HTMLDivElement | null>,
  open: boolean,
  panel: string,
  dialog: React.RefObject<HTMLDialogElement | null>,
) {
  // Open: the desk slides in, then its contents cascade. Runs after the native
  // drawer animation each time the panel mounts.
  useGSAP(
    () => {
      if (!open || matchMedia('(prefers-reduced-motion: reduce)').matches) return
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.drawer-bar', { y: -18, opacity: 0, duration: 0.4 })
        .from('.drawer-scroll > *', { y: 22, opacity: 0, duration: 0.55, stagger: 0.06 }, '-=0.24')
        .from('.drawer-footer', { y: 26, opacity: 0, duration: 0.45 }, '-=0.38')
    },
    { dependencies: [open], scope: shell },
  )

  // Switching between order steps (product → cart → receipt) flips the panel body.
  const first = useRef(true)
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const root = dialog.current
    if (!root || !open) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const from = root.querySelector('.drawer-bar')
    const rows = root.querySelectorAll('.drawer-scroll > *')
    gsap.fromTo(
      rows,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out', stagger: 0.05, overwrite: true },
    )
    if (from) gsap.fromTo(from, { opacity: 0.55 }, { opacity: 1, duration: 0.3, overwrite: true })
  }, [panel, open, dialog])
}
