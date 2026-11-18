import { useRef, useState, type ReactNode } from 'react'
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

export type PickDrink = (drink: Drink, size?: DrinkSize) => void
const filters = [
  { id: 'all', name: 'همه منو', shortName: 'همه منو', Icon: LayoutGrid },
  { id: 'classic', name: 'قهوه‌های کلاسیک', shortName: 'کلاسیک', Icon: Coffee },
  { id: 'other', name: 'بدون قهوه', shortName: 'بدون قهوه', Icon: Leaf },
  { id: 'signature', name: 'ویژه‌های دانه', shortName: 'ویژه‌های دانه', Icon: Sparkles },
] as const

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
    <div className="section-heading">
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
          <tr key={drink.id}>
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
                <Plus size={14} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function PaperMenu({ items, onPick }: { items: Drink[]; onPick: PickDrink }) {
  return (
    <section className="paper-section" aria-labelledby="paper-heading">
      <SectionHeading
        icon={<NotebookText size={21} strokeWidth={1.6} />}
        title="منوی کاغذی"
        english="PAPER MENU"
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
          {(['classic', 'other'] as const).map((category) => {
            const matches = items.filter((d) => d.category === category)
            return (
              matches.length > 0 && (
                <PriceTable key={category} category={category} items={matches} onPick={onPick} />
              )
            )
          })}
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

function SignatureCard({ drink, onPick }: { drink: Drink; onPick: PickDrink }) {
  return (
    <article className="drink-article">
      <button
        className="drink-card"
        onClick={() => onPick(drink)}
        aria-label={`انتخاب ${drink.name}، ${numberFA(drink.sizes[0].price)} تومان`}
      >
        <span className="drink-photo">
          <img
            src={drink.image}
            alt={drink.name}
            width="800"
            height="631"
            loading={['pear-latte', 'peach-oolong'].includes(drink.id) ? 'eager' : 'lazy'}
          />
          <span className={`temp-tag ${drink.cold ? 'cold' : 'hot'}`}>
            {drink.cold ? <Snowflake size={12} /> : <Flame size={12} />}
            {drink.cold ? 'سرد' : 'گرم'}
          </span>
        </span>
        <span className="drink-info">
          <span className="drink-en" lang="en" dir="ltr">
            {drink.english}
          </span>
          <span className="drink-name">{drink.name}</span>
          <span className="drink-ingredients">{drink.ingredients}</span>
          <span className="drink-bottom">
            <span className="card-price">
              {numberFA(drink.sizes[0].price)} <small>تومان</small>
            </span>
            <span className="card-add" aria-hidden="true">
              <Plus size={17} />
            </span>
          </span>
        </span>
      </button>
    </article>
  )
}

export function Menu({ onPick }: { onPick: PickDrink }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [mobileSearch, setMobileSearch] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const needle = normalize(query)
  const matches = drinks.filter(
    (d) =>
      (filter === 'all' || d.category === filter) &&
      (!needle || normalize([d.name, d.english, d.ingredients].join(' ')).includes(needle)),
  )
  const paper = matches.filter((d) => d.category !== 'signature')
  const specials = matches.filter((d) => d.category === 'signature')
  function toggleSearch() {
    setMobileSearch(!mobileSearch)
    if (!mobileSearch) requestAnimationFrame(() => input.current?.focus())
  }
  return (
    <div id="menu" className="menu-area">
      <div className={'menu-toolbar' + (mobileSearch ? ' mobile-search-open' : '')}>
        <div role="group" aria-label="دسته‌بندی نوشیدنی‌ها" className="filter-list">
          {filters.map(({ id, name, shortName, Icon }) => (
            <button
              className={`filter-tab${filter === id ? ' selected' : ''}`}
              key={id}
              aria-label={name}
              aria-pressed={filter === id}
              onClick={() => setFilter(id)}
            >
              <Icon size={16} strokeWidth={1.6} />
              <span className="filter-full">{name}</span>
              <span className="filter-short">{shortName}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className="mobile-search-toggle icon-btn"
          aria-expanded={mobileSearch}
          aria-label="باز و بسته کردن جست‌وجو"
          onClick={toggleSearch}
        >
          {mobileSearch ? <X size={18} /> : <Search size={18} />}
        </button>
        <div className="search-field" onClick={() => input.current?.focus()}>
          <Search size={17} strokeWidth={1.6} />
          <input
            ref={input}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="جست‌وجو در منو"
            placeholder="جست‌وجو در منو..."
            autoComplete="off"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('')
                input.current?.focus()
              }}
              type="button"
              aria-label="پاک کردن جست‌وجو"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
      <p className="sr-only" aria-live="polite" role="status">
        {numberFA(matches.length)} نوشیدنی نمایش داده می‌شود.
      </p>
      <div
        className={`catalog ${!paper.length ? 'only-signatures' : !specials.length ? 'only-paper' : ''}`}
      >
        {paper.length > 0 && <PaperMenu items={paper} onPick={onPick} />}
        {specials.length > 0 && (
          <section className="signatures" aria-labelledby="specials-heading">
            <SectionHeading
              icon={<Sparkles size={21} strokeWidth={1.6} />}
              title="ویژه‌های دانه"
              english="SIGNATURE DRINKS"
              id="specials-heading"
            />
            <div className="signature-grid">
              {specials.map((drink) => (
                <SignatureCard key={drink.id} drink={drink} onPick={onPick} />
              ))}
            </div>
          </section>
        )}
        {matches.length === 0 && (
          <section className="empty-search">
            <CupSoda size={36} strokeWidth={1.3} />
            <h2>نوشیدنی‌ای پیدا نشد</h2>
            <p>نام نوشیدنی یا یکی از ترکیباتش را جست‌وجو کنید.</p>
            <button
              className="outline-button"
              onClick={() => {
                setFilter('all')
                setQuery('')
                input.current?.focus()
              }}
            >
              نمایش همه‌ی منو
            </button>
          </section>
        )}
      </div>
    </div>
  )
}
