import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowUp,
  BookOpen,
  Check,
  Coffee,
  MousePointer2,
  ShoppingBag,
} from 'lucide-react'
import { Brand, CafeSeal, Rosette } from './components/Brand'
import { Menu } from './components/Menu'
import { Button } from '@/components/ui/button'
import { Drawer } from './components/Drawer'
import { CartView, ProductView, ReceiptView } from './components/Order'
import { useHeroIntro, useMenuInteractions } from './hooks/motion'
import { numberFA, type Drink, type DrinkSize } from './menu'
import {
  MAX_QUANTITY,
  itemKey,
  loadCart,
  loadReceipt,
  makeReceipt,
  saveCart,
  type CartItem,
} from './order'

type Panel = 'cart' | 'product' | 'receipt' | 'about' | 'guide'

function InfoView({ mode, onClose }: { mode: 'about' | 'guide'; onClose: () => void }) {
  return (
    <>
      <div className="drawer-scroll info-view">
        <div className="panel-kicker">
          <span className="tiny-dot" />
          کافه دانه
        </div>
        <h2 id="drawer-title">{mode === 'about' ? 'درباره‌ی دانه' : 'راهنمای سفارش'}</h2>
        {mode === 'about' ? (
          <>
            <img
              className="about-photo"
              src="/assets/house-latte.webp"
              alt="یک فنجان لاته‌ی دانه با طرح برگ روی فوم شیر"
            />
            <h3>یک فنجان، کمی مکث.</h3>
            <p>
              منوی دانه از یک منوی کاغذی شروع می‌شود: قهوه‌های آشنا، نوشیدنی‌های بدون قهوه و چند
              ترکیب ویژه برای وقتی که دلتان طعمی تازه می‌خواهد.
            </p>
            <p>
              در بخش «ویژه‌های دانه» می‌توانید ترکیب‌های باریستا با گلابی، هلو، کنجد سیاه و پرتقال
              را کشف کنید.
            </p>
          </>
        ) : (
          <ol className="guide-list">
            {[
              {
                title: 'نوشیدنی‌تان را پیدا کنید',
                desc: 'منوی کاغذی را ببینید یا از دسته‌بندی و جست‌وجو استفاده کنید. با انتخاب نام، قیمت یا علامت مثبت، جزئیات نوشیدنی باز می‌شود.',
                Icon: BookOpen,
              },
              {
                title: 'اندازه و تعداد را انتخاب کنید',
                desc: 'اندازه‌ی فنجان و تعداد را مشخص کنید؛ سپس «افزودن به سفارش» را بزنید.',
                Icon: MousePointer2,
              },
              {
                title: 'سفارش را تأیید کنید',
                desc: 'از «سفارش من» در بالای صفحه، انتخاب‌ها را بررسی کنید. بعد از تأیید، رسید را به باریستا نشان دهید. پرداخت در کافه انجام می‌شود.',
                Icon: Check,
              },
            ].map(({ title, desc, Icon }, i) => (
              <li key={title}>
                <span className="guide-icon">
                  <Icon size={20} />
                </span>
                <div>
                  <small>مرحله {numberFA(i + 1)}</small>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
      <div className="drawer-footer">
        <Button className="primary-action w-full" size="lg" onClick={onClose}>
          بازگشت به منو
          <ArrowLeft />
        </Button>
      </div>
    </>
  )
}

export default function App() {
  const [cart, setCart] = useState<CartItem[]>(loadCart)
  const [receipt, setReceipt] = useState(loadReceipt)
  const [panel, setPanel] = useState<Panel>('cart')
  const [open, setOpen] = useState(false)
  const [product, setProduct] = useState<{ drink: Drink; size: DrinkSize; pick: number } | null>(
    null,
  )
  const hero = useRef<HTMLElement>(null)
  const page = useRef<HTMLDivElement>(null)
  useHeroIntro(hero)
  useMenuInteractions(page, '[data-magnetic]')
  useEffect(() => saveCart(cart), [cart])
  const count = cart.reduce((sum, line) => sum + line.quantity, 0)
  const show = (view: Panel) => {
    setPanel(view)
    setOpen(true)
  }
  const close = () => setOpen(false)
  function pick(drink: Drink, size?: DrinkSize) {
    setProduct((previous) => ({
      drink,
      size: size || drink.sizes[0].id,
      pick: (previous?.pick || 0) + 1,
    }))
    show('product')
  }
  function add(sizeId: DrinkSize, quantity: number) {
    if (!product) return
    const drinkId = product.drink.id
    setCart((previous) => {
      const existing = previous.find((i) => i.drinkId === drinkId && i.sizeId === sizeId)
      return existing
        ? previous.map((i) =>
            i === existing ? { ...i, quantity: Math.min(MAX_QUANTITY, i.quantity + quantity) } : i,
          )
        : [...previous, { drinkId, sizeId, quantity }]
    })
    show('cart')
  }
  function confirm() {
    if (!cart.length) return
    setReceipt(makeReceipt(cart))
    setCart([])
    show('receipt')
  }
  return (
    <>
      <a className="skip-link" href="#menu">
        رفتن به منوی نوشیدنی‌ها
      </a>
      <header className="site-header">
        <div className="page-width header-inner">
          <a href="#top" className="brand-link" aria-label="کافه دانه، ابتدای صفحه">
            <Brand />
          </a>
          <nav className="main-nav" aria-label="ناوبری اصلی">
            <a href="#menu" className="nav-current" aria-current="page">
              منوی کافه
            </a>
            <button onClick={() => show('about')}>درباره‌ی دانه</button>
            <button onClick={() => show('guide')}>راهنمای سفارش</button>
          </nav>
          <button
            className="order-button"
            data-magnetic
            onClick={() => show('cart')}
            aria-label={`سفارش من، ${numberFA(count)} فنجان`}
            aria-haspopup="dialog"
          >
            <ShoppingBag size={18} strokeWidth={1.65} />
            <span>سفارش من</span>
            <span className="order-count" key={count}>
              {numberFA(count)}
            </span>
          </button>
        </div>
      </header>
      <main id="top" className="page-width main-content" ref={page}>
        <section className="hero" aria-labelledby="menu-title" ref={hero}>
          <img
            className="hero-image"
            src="/assets/house-latte.webp"
            width="1792"
            height="592"
            alt="لاته با طرح برگ در فنجان سفالی، کنار دانه‌های قهوه"
            fetchPriority="high"
          />
          <div className="hero-copy">
            <div className="hero-kicker">
              <span className="short-rule" />
              <span lang="en" dir="ltr">
                THE COFFEE MENU
              </span>
              <Rosette />
            </div>
            <h1 id="menu-title">منوی کافه دانه</h1>
            <p>از قهوه‌های کلاسیک تا ترکیب‌های ویژه‌ی باریستا.</p>
            <div className="hero-note">
              <span className="hero-note-rule" />
              <Coffee size={14} strokeWidth={1.6} />
              <span>تازه‌دم، برای شما</span>
            </div>
          </div>
          <CafeSeal />
          <span className="hero-plate" lang="en" dir="ltr">
            <i />
            FIG. 01 — HOUSE LATTE
          </span>
        </section>
        <Menu onPick={pick} />
      </main>
      <footer className="site-footer page-width">
        <div className="footer-brand">
          <Rosette />
          <span lang="en" className="eyebrow" dir="ltr">
            DANEH COFFEE HOUSE
          </span>
        </div>
        <div className="footer-links">
          <button onClick={() => show('about')}>درباره‌ی دانه</button>
          <button onClick={() => show('guide')}>راهنمای سفارش</button>
        </div>
        <a href="#top">
          بازگشت به بالا
          <ArrowUp size={14} />
        </a>
      </footer>
      <Drawer open={open} onClose={close} section={panel}>
        {panel === 'product' && product && (
          <ProductView
            key={product.pick}
            drink={product.drink}
            initialSize={product.size}
            cart={cart}
            onAdd={add}
            onCart={() => show('cart')}
          />
        )}
        {panel === 'cart' && (
          <CartView
            cart={cart}
            lastReceipt={!!receipt}
            onUpdate={(key, quantity) =>
              setCart((previous) =>
                previous.map((line) =>
                  itemKey(line) === key
                    ? { ...line, quantity: Math.min(MAX_QUANTITY, Math.max(1, quantity)) }
                    : line,
                ),
              )
            }
            onRemove={(key) =>
              setCart((previous) => previous.filter((line) => itemKey(line) !== key))
            }
            onClose={close}
            onReceipt={() => show('receipt')}
            onConfirm={confirm}
          />
        )}
        {panel === 'receipt' && receipt && <ReceiptView receipt={receipt} onClose={close} />}
        {(panel === 'about' || panel === 'guide') && <InfoView mode={panel} onClose={close} />}
      </Drawer>
    </>
  )
}
