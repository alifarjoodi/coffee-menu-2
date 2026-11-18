import { useState } from 'react'
import {
  ArrowLeft,
  Check,
  Coffee,
  Flame,
  Minus,
  Plus,
  ReceiptText,
  ShoppingBag,
  Snowflake,
  Trash2,
} from 'lucide-react'
import { numberFA, sizeName, type Drink, type DrinkSize } from '../menu'
import { MAX_QUANTITY, itemKey, resolveItem, type CartItem, type Receipt } from '../order'
import { BeanMark } from './Brand'

export function Price({ value }: { value: number }) {
  return (
    <span className="price">
      {numberFA(value)} <small>تومان</small>
    </span>
  )
}
function Stepper({
  quantity,
  onChange,
  max = MAX_QUANTITY,
  name,
}: {
  quantity: number
  onChange: (value: number) => void
  max?: number
  name: string
}) {
  return (
    <div className="stepper" dir="ltr" role="group" aria-label={`تعداد ${name}`}>
      <button
        aria-label={`کم کردن تعداد ${name}`}
        disabled={quantity <= 1}
        onClick={() => onChange(quantity - 1)}
      >
        <Minus size={16} />
      </button>
      <output aria-live="polite" aria-atomic="true" key={quantity}>
        {numberFA(quantity)}
      </output>
      <button
        aria-label={`زیاد کردن تعداد ${name}`}
        disabled={quantity >= max}
        onClick={() => onChange(quantity + 1)}
      >
        <Plus size={16} />
      </button>
    </div>
  )
}

export function ProductView({
  drink,
  initialSize,
  cart,
  onAdd,
  onCart,
}: {
  drink: Drink
  initialSize: DrinkSize
  cart: CartItem[]
  onAdd: (size: DrinkSize, quantity: number) => void
  onCart: () => void
}) {
  const [sizeId, setSizeId] = useState(initialSize)
  const [qty, setQty] = useState(1)
  const size = drink.sizes.find((s) => s.id === sizeId)!
  const remaining =
    MAX_QUANTITY - (cart.find((i) => i.drinkId === drink.id && i.sizeId === sizeId)?.quantity || 0)
  const quantity = Math.min(qty, Math.max(1, remaining))
  return (
    <>
      <div className="drawer-scroll product-view" key={drink.id}>
        <div className="panel-kicker">
          <span className="tiny-dot" />
          جزئیات نوشیدنی
        </div>
        <div className="product-intro">
          <div>
            <h2 id="drawer-title">{drink.name}</h2>
            <p className="english-sub" lang="en" dir="ltr">
              {drink.english}
            </p>
          </div>
          {drink.image && <img src={drink.image} alt="" width="72" height="72" />}
        </div>
        <div className="detail-price">
          <small>قیمت یک فنجان</small>
          <Price value={size.price} />
        </div>
        <div className="product-description">
          <h3>درباره‌ی نوشیدنی</h3>
          <p>{drink.description}</p>
          <div className="detail-tags">
            <span>
              {drink.cold ? <Snowflake size={13} /> : <Flame size={13} />}
              {drink.cold ? 'سرد' : 'گرم'}
            </span>
            <span>{numberFA(size.ml)} میلی‌لیتر</span>
          </div>
        </div>
        {drink.sizes.length > 1 ? (
          <fieldset className="size-picker">
            <legend>اندازه‌ی فنجان</legend>
            <div className="size-options">
              {drink.sizes.map((option) => (
                <label key={option.id} className={sizeId === option.id ? 'chosen' : ''}>
                  <input
                    type="radio"
                    name="drink-size"
                    value={option.id}
                    checked={sizeId === option.id}
                    onChange={() => {
                      setSizeId(option.id)
                      setQty(1)
                    }}
                  />
                  <span lang="en">{option.id}</span>
                  {sizeName[option.id]}
                </label>
              ))}
            </div>
          </fieldset>
        ) : (
          <p className="one-size-note">
            <Coffee size={16} />
            این نوشیدنی در یک اندازه سرو می‌شود.
          </p>
        )}
      </div>
      <div className="drawer-footer">
        <div className="qty-row">
          <span>تعداد سفارش</span>
          <Stepper quantity={quantity} max={remaining} onChange={setQty} name={drink.name} />
        </div>
        {remaining === 0 ? (
          <>
            <p className="limit-note">حداکثر تعداد این نوشیدنی در سفارش انتخاب شده است.</p>
            <button className="primary-action" onClick={onCart}>
              مشاهده سفارش من
              <ArrowLeft size={17} />
            </button>
          </>
        ) : (
          <button className="primary-action" onClick={() => onAdd(sizeId, quantity)}>
            <span>
              <ShoppingBag size={17} />
              افزودن به سفارش
            </span>
            <Price value={size.price * quantity} />
          </button>
        )}
      </div>
    </>
  )
}

export function CartView({
  cart,
  lastReceipt,
  onUpdate,
  onRemove,
  onClose,
  onConfirm,
  onReceipt,
}: {
  cart: CartItem[]
  lastReceipt: boolean
  onUpdate: (key: string, quantity: number) => void
  onRemove: (key: string) => void
  onClose: () => void
  onConfirm: () => void
  onReceipt: () => void
}) {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0)
  const total = cart.reduce((sum, line) => sum + resolveItem(line).size.price * line.quantity, 0)
  return (
    <>
      <div className="drawer-scroll cart-view">
        <div className="panel-kicker">
          <span className="tiny-dot" />
          سبد نوشیدنی‌ها
        </div>
        <div className="cart-title">
          <h2 id="drawer-title">سفارش من</h2>
          <span className="count-pill">{numberFA(count)} فنجان</span>
        </div>
        {cart.length ? (
          <>
            <p className="panel-lead">پیش از تأیید، نوشیدنی‌ها و تعدادشان را بررسی کنید.</p>
            <ul className="cart-lines">
              {cart.map((line) => {
                const { drink, size } = resolveItem(line)
                const key = itemKey(line)
                return (
                  <li className="cart-line" key={key}>
                    <div className="line-header">
                      {drink.image ? (
                        <img src={drink.image} alt="" className="cart-thumb" />
                      ) : (
                        <span className="cart-thumb illustrated">
                          <Coffee size={24} strokeWidth={1.4} />
                        </span>
                      )}
                      <div className="line-name">
                        <h3>{drink.name}</h3>
                        <p>
                          {sizeName[line.sizeId]}
                          <i>·</i>
                          {numberFA(size.ml)} میلی‌لیتر
                        </p>
                      </div>
                      <button
                        className="icon-btn remove-item"
                        onClick={() => onRemove(key)}
                        aria-label={`حذف ${drink.name} ${sizeName[line.sizeId]}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div className="line-total">
                      <Price value={size.price * line.quantity} />
                      <Stepper
                        quantity={line.quantity}
                        onChange={(value) => onUpdate(key, value)}
                        name={`${drink.name} ${sizeName[line.sizeId]}`}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
            <button className="text-action" onClick={onClose}>
              <Plus size={15} />
              انتخاب نوشیدنی دیگر
            </button>
          </>
        ) : (
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <ShoppingBag strokeWidth={1.2} size={38} />
            </div>
            <h3>سفارش شما هنوز خالی است</h3>
            <p>از منو یک نوشیدنی انتخاب کنید و آن را به سفارش خود اضافه کنید.</p>
            <button onClick={onClose} className="outline-button">
              مشاهده‌ی منو
              <ArrowLeft size={15} />
            </button>
            {lastReceipt && (
              <button onClick={onReceipt} className="text-action">
                <ReceiptText size={15} />
                مشاهده‌ی آخرین رسید
              </button>
            )}
          </div>
        )}
      </div>
      {cart.length > 0 && (
        <div className="drawer-footer">
          <div className="checkout-total">
            <span>مجموع سفارش</span>
            <Price value={total} />
          </div>
          <button className="primary-action" onClick={onConfirm}>
            <span>
              <Check size={18} />
              تأیید نهایی سفارش
            </span>
            <ArrowLeft size={17} />
          </button>
          <p className="checkout-note">رسید را برای ثبت در کافه به باریستا نشان دهید.</p>
        </div>
      )}
    </>
  )
}

export function ReceiptView({ receipt, onClose }: { receipt: Receipt; onClose: () => void }) {
  const date = new Intl.DateTimeFormat('fa-IR', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(receipt.createdAt)
  return (
    <>
      <div className="drawer-scroll receipt-view">
        <span className="success-icon">
          <Check size={26} />
        </span>
        <div className="panel-kicker">رسید انتخاب‌های شما</div>
        <h2 id="drawer-title">سفارش تأیید شد</h2>
        <p className="panel-lead">برای آماده‌سازی نوشیدنی‌ها، این رسید را به باریستا نشان دهید.</p>
        <div className="receipt-paper">
          <BeanMark className="receipt-mark" />
          <span className="eyebrow" lang="en">
            DANEH / ORDER RECEIPT
          </span>
          <div className="receipt-meta">
            <span>شماره‌ی رسید</span>
            <b>#{numberFA(Number(receipt.code)).replaceAll('٬', '')}</b>
          </div>
          <div className="receipt-meta">
            <span>زمان</span>
            <b>{date}</b>
          </div>
          <ul>
            {receipt.lines.map((line, i) => (
              <li key={i}>
                <span>
                  {line.name}
                  <small>
                    {sizeName[line.sizeId]} · {numberFA(line.quantity)} عدد
                  </small>
                </span>
                <Price value={line.unitPrice * line.quantity} />
              </li>
            ))}
          </ul>
          <div className="checkout-total">
            <span>مجموع</span>
            <Price
              value={receipt.lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0)}
            />
          </div>
        </div>
        <p className="receipt-local-note">
          این رسید روی همین دستگاه نگهداری می‌شود؛ سفارش به‌صورت آنلاین ارسال نشده است.
        </p>
      </div>
      <div className="drawer-footer">
        <button className="primary-action" onClick={onClose}>
          بازگشت به منو
          <ArrowLeft size={17} />
        </button>
      </div>
    </>
  )
}
