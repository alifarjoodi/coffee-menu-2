import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import {
  Coffee,
  CupSoda,
  Flame,
  LayoutGrid,
  Leaf,
  NotebookText,
  Plus,
  Search,
  Snowflake,
  Sparkles,
  X,
} from 'lucide-react'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import {
  drinks,
  normalize,
  numberFA,
  sizeName,
  type Category,
  type Drink,
  type DrinkSize,
  type Filter,
} from '../menu'
import { BrassClip, Rosette } from './Brand'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

gsap.registerPlugin(Flip, ScrollTrigger, useGSAP)

export type PickDrink = (drink: Drink, size?: DrinkSize) => void

const filters = [
  { id: 'all', name: 'همه منو', shortName: 'همه', Icon: LayoutGrid },
  { id: 'classic', name: 'قهوه‌های کلاسیک', shortName: 'کلاسیک', Icon: Coffee },
  { id: 'other', name: 'بدون قهوه', shortName: 'بدون قهوه', Icon: Leaf },
  { id: 'signature', name: 'ویژه‌های دانه', shortName: 'ویژه‌ها', Icon: Sparkles },
] as const

const flipTargets = (root: HTMLElement) =>
  root.querySelectorAll<HTMLElement>('.flip-item:not([hidden])')

export function SectionHeading({
  icon,
  title,
  english,
  id,
}: {
  icon: ReactNode
  title: string
  english: string
  id: string
}) {
  return (
    <div className="section-heading" data-reveal>
      <span className="heading-icon">{icon}</span>
      <h2 id={id}>{title}</h2>
      <span className="heading-rule" />
      <span className="eyebrow heading-english" lang="en" dir="ltr">
        {english}
      </span>
    </div>
  )
}

function PriceTable({
  category,
  items,
  onPick,
}: {
  category: Exclude<Category, 'signature'>
  items: Drink[]
  onPick: PickDrink
}) {
  const classic = category === 'classic'
  return (
    <table className="price-table">
      <caption className="sr-only">
        {classic ? 'قهوه‌های کلاسیک' : 'نوشیدنی‌های بدون قهوه'}، قیمت به هزار تومان
      </caption>
      <colgroup>
        <col className="name-col" />
        <col className="price-col" />
        <col className="price-col" />
        <col className="price-col" />
        <col className="action-col" />
      </colgroup>
      <thead>
        <tr>
          <th scope="col" className="table-group-title">
            <span className="table-kicker" lang="en" dir="ltr">
              {classic ? '01 / THE CLASSICS' : '02 / NON-COFFEE'}
            </span>
            <span className="table-title">
              <i aria-hidden="true">/</i>
              {classic ? 'قهوه‌های کلاسیک' : 'بدون قهوه'}
            </span>
          </th>
          {(['S', 'M', 'L'] as const).map((s) => (
            <th key={s} scope="col" className="size-th">
              <span lang="en" className="size-letter">
                {s}
              </span>
              <small>{sizeName[s]}</small>
            </th>
          ))}
          <th scope="col">
            <span className="sr-only">انتخاب</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((drink) => (
          <tr key={drink.id} className="flip-item" data-drink={drink.id}>
            <th scope="row">
              <button className="table-drink" onClick={() => onPick(drink)}>
                <span>{drink.name}</span>
                <small lang="en" dir="ltr">
                  {drink.english}
                </small>
              </button>
            </th>
            {(['S', 'M', 'L'] as const).map((id) => {
              const size = drink.sizes.find((s) => s.id === id)
              return (
                <td key={id}>
                  {size ? (
                    <button
                      className="table-price"
                      onClick={() => onPick(drink, id)}
                      aria-label={`انتخاب ${drink.name}، ${sizeName[id]}، ${numberFA(size.price)} تومان`}
                    >
                      {numberFA(size.price / 1000)}
                    </button>
                  ) : (
                    <span className="unavailable" aria-label="ارائه نمی‌شود">
                      —
                    </span>
                  )}
                </td>
              )
            })}
            <td>
              <button
                className="table-add"
                onClick={() => onPick(drink)}
                aria-label={`سفارش ${drink.name}`}
              >
                <Plus size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function PaperMenu({ items, onPick }: { items: Drink[]; onPick: PickDrink }) {
  const classic = items.filter((d) => d.category === 'classic')
  const other = items.filter((d) => d.category === 'other')
  const paired = classic.length > 0 && other.length > 0
  return (
    <section className="paper-section flip-item" aria-labelledby="paper-heading">
      <SectionHeading
        icon={<NotebookText size={22} strokeWidth={1.6} />}
        title="منوی کاغذی"
        english="THE PAPER MENU"
        id="paper-heading"
      />
      <div className="clipboard">
        <BrassClip />
        <div className="menu-sheet">
          <div className="sheet-meta">
            <span>
              <span className="tiny-dot" />
              قیمت‌ها به هزار تومان
            </span>
            <span className="mono" dir="ltr" lang="en">
              DANEH / Nº 01
            </span>
          </div>
          <div className={`sheet-tables${paired ? ' paired' : ''}`}>
            {classic.length > 0 && (
              <PriceTable category="classic" items={classic} onPick={onPick} />
            )}
            {other.length > 0 && <PriceTable category="other" items={other} onPick={onPick} />}
          </div>
          <div className="sheet-foot">
            <i />
            <Rosette />
            <i />
          </div>
        </div>
      </div>
    </section>
  )
}

function SignatureRow({ drink, index, onPick }: { drink: Drink; index: number; onPick: PickDrink }) {
  const price = drink.sizes[0].price
  return (
    <article className="signature-row flip-item" data-drink={drink.id} data-signature>
      <button
        className="signature-main"
        onClick={() => onPick(drink)}
        aria-label={`انتخاب ${drink.name}، ${numberFA(price)} تومان`}
      >
        <span className="signature-photo">
          {drink.image && (
            <img
              src={drink.image}
              alt={drink.name}
              width="800"
              height="631"
              loading={index < 2 ? 'eager' : 'lazy'}
            />
          )}
        </span>
        <span className="signature-copy">
          <span className="signature-kicker">
            <span className="mono" lang="en" dir="ltr">
              {numberFA(index + 1)} — SIGNATURE
            </span>
            <Badge variant={drink.cold ? 'cold' : 'warm'}>
              {drink.cold ? <Snowflake /> : <Flame />}
              {drink.cold ? 'سرد' : 'گرم'}
            </Badge>
          </span>
          <span className="signature-name">{drink.name}</span>
          <span className="signature-en" lang="en" dir="ltr">
            {drink.english}
          </span>
          <span className="signature-desc">{drink.description}</span>
          <span className="signature-ingredients">{drink.ingredients}</span>
        </span>
      </button>
      <div className="signature-side">
        <span className="signature-price">
          {numberFA(price)} <small>تومان</small>
        </span>
        <Button
          variant="default"
          size="lg"
          data-magnetic
          onClick={() => onPick(drink)}
          aria-label={`سفارش ${drink.name}`}
        >
          <Plus />
          افزودن به سفارش
        </Button>
      </div>
    </article>
  )
}

export function Menu({ onPick }: { onPick: PickDrink }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [mobileSearch, setMobileSearch] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const board = useRef<HTMLDivElement>(null)
  const pendingFlip = useRef<Flip.FlipState | null>(null)
  const needle = normalize(query)
  const matches = drinks.filter(
    (d) =>
      (filter === 'all' || d.category === filter) &&
      (!needle || normalize([d.name, d.english, d.ingredients].join(' ')).includes(needle)),
  )
  const paper = matches.filter((d) => d.category !== 'signature')
  const specials = matches.filter((d) => d.category === 'signature')

  /** Capture the current layout so the next render can be flipped into place. */
  function morph(run: () => void) {
    if (board.current && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      pendingFlip.current = Flip.getState(flipTargets(board.current))
    }
    run()
  }

  useLayoutEffect(() => {
    const state = pendingFlip.current
    pendingFlip.current = null
    if (!state || !board.current) return
    Flip.from(state, {
      duration: 0.6,
      ease: 'power3.inOut',
      absolute: true,
      nested: true,
      scale: true,
      stagger: 0.015,
      onEnter: (elements) =>
        gsap.fromTo(
          elements,
          { opacity: 0, y: 14, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power2.out', stagger: 0.03 },
        ),
      onLeave: (elements) =>
        gsap.to(elements, { opacity: 0, scale: 0.96, duration: 0.25, ease: 'power2.in' }),
    })
  }, [filter])

  // Entrance + scroll choreography runs once; filter changes are handled by Flip above
  // so these "from" tweens are never reverted while the board stays mounted.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-reveal]', {
          y: 26,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.08,
          delay: 0.12,
        })
        gsap.from('.sheet-tables', {
          y: 34,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          delay: 0.2,
        })

        ScrollTrigger.batch('.signature-row', {
          start: 'top 88%',
          once: true,
          onEnter: (batch) =>
            gsap.fromTo(
              batch,
              { y: 48, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out', stagger: 0.12 },
            ),
        })

        // Soft parallax on the bottle shots as the rows travel through the viewport.
        gsap.utils.toArray<HTMLElement>('.signature-row').forEach((row) => {
          const photo = row.querySelector('.signature-photo img')
          if (!photo) return
          gsap.fromTo(
            photo,
            { yPercent: -3 },
            {
              yPercent: 3,
              ease: 'none',
              scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          )
        })
      })
      return () => mm.revert()
    },
    { scope: board },
  )

  function pickFilter(next: string) {
    const value = (next || 'all') as Filter
    if (value === filter) return
    morph(() => setFilter(value))
  }

  function clearAll() {
    morph(() => {
      setFilter('all')
      setQuery('')
    })
    input.current?.focus()
  }

  function toggleSearch() {
    setMobileSearch(!mobileSearch)
    if (!mobileSearch) requestAnimationFrame(() => input.current?.focus())
  }

  return (
    <div id="menu" className="menu-area" ref={board}>
      <div className={'menu-toolbar' + (mobileSearch ? ' mobile-search-open' : '')}>
        <ToggleGroup
          type="single"
          value={filter}
          onValueChange={pickFilter}
          aria-label="دسته‌بندی نوشیدنی‌ها"
          className="filter-list"
        >
          {filters.map(({ id, name, shortName, Icon }) => (
            <ToggleGroupItem
              key={id}
              value={id}
              aria-label={name}
              className="filter-tab data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm"
            >
              <Icon strokeWidth={1.7} />
              <span className="filter-full">{name}</span>
              <span className="filter-short">{shortName}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <div className="toolbar-search">
          <span className="search-field">
            <Search size={19} strokeWidth={1.6} />
            <Input
              ref={input}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="جست‌وجو در منو"
              placeholder="جست‌وجو در منو..."
              autoComplete="off"
            />
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="search-clear"
                onClick={() => {
                  setQuery('')
                  input.current?.focus()
                }}
                aria-label="پاک کردن جست‌وجو"
              >
                <X />
              </Button>
            )}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="mobile-search-toggle"
            aria-expanded={mobileSearch}
            aria-label="باز و بسته کردن جست‌وجو"
            onClick={toggleSearch}
          >
            {mobileSearch ? <X /> : <Search />}
          </Button>
        </div>
      </div>
      <p className="sr-only" aria-live="polite" role="status">
        {numberFA(matches.length)} نوشیدنی نمایش داده می‌شود.
      </p>
      <div className="catalog">
        {paper.length > 0 && <PaperMenu items={paper} onPick={onPick} />}
        {specials.length > 0 && (
          <section className="signatures flip-item" aria-labelledby="specials-heading">
            <SectionHeading
              icon={<Sparkles size={22} strokeWidth={1.6} />}
              title="ویژه‌های دانه"
              english="SIGNATURE DRINKS"
              id="specials-heading"
            />
            <div className="signature-list">
              {specials.map((drink) => {
                const index = drinks.filter((d) => d.category === 'signature').indexOf(drink)
                return (
                  <SignatureRow key={drink.id} drink={drink} index={index} onPick={onPick} />
                )
              })}
            </div>
          </section>
        )}
        {matches.length === 0 && (
          <section className="empty-search">
            <CupSoda size={40} strokeWidth={1.3} />
            <h2>نوشیدنی‌ای پیدا نشد</h2>
            <p>نام نوشیدنی یا یکی از ترکیباتش را جست‌وجو کنید.</p>
            <Button variant="outline" size="lg" className="rounded-full" onClick={clearAll}>
              نمایش همه‌ی منو
            </Button>
          </section>
        )}
      </div>
    </div>
  )
}
