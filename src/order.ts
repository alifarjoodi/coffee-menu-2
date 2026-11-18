import { byId, type Drink, type DrinkSize, type SizeOption } from './menu'

export type CartItem = { drinkId: string; sizeId: DrinkSize; quantity: number }
export type ReceiptLine = { name: string; sizeId: DrinkSize; quantity: number; unitPrice: number }
export type Receipt = { code: string; createdAt: number; lines: ReceiptLine[] }
const CART_KEY = 'daneh.cart.v1'
const RECEIPT_KEY = 'daneh.receipt.v1'
export const MAX_QUANTITY = 99
export const itemKey = (line: CartItem) => `${line.drinkId}:${line.sizeId}`
export function resolveItem(line: CartItem): { drink: Drink; size: SizeOption } {
  const drink = byId.get(line.drinkId)!
  return { drink, size: drink.sizes.find((s) => s.id === line.sizeId)! }
}
export function loadCart(): CartItem[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
    if (!Array.isArray(raw)) return []
    const clean = new Map<string, CartItem>()
    for (const entry of raw) {
      if (
        !entry ||
        !byId.get(entry.drinkId)?.sizes.some((s) => s.id === entry.sizeId) ||
        !Number.isInteger(entry.quantity) ||
        entry.quantity < 1
      )
        continue
      const key = itemKey(entry)
      clean.set(key, {
        drinkId: entry.drinkId,
        sizeId: entry.sizeId,
        quantity: Math.min(MAX_QUANTITY, (clean.get(key)?.quantity || 0) + entry.quantity),
      })
    }
    return [...clean.values()]
  } catch {
    return []
  }
}
export function loadReceipt(): Receipt | null {
  try {
    const raw = JSON.parse(localStorage.getItem(RECEIPT_KEY) || 'null')
    if (
      !raw ||
      typeof raw.code !== 'string' ||
      !Number.isFinite(raw.createdAt) ||
      Number.isNaN(new Date(raw.createdAt).getTime()) ||
      !Array.isArray(raw.lines) ||
      !raw.lines.length
    )
      return null
    if (
      !raw.lines.every(
        (l: ReceiptLine) =>
          l &&
          typeof l.name === 'string' &&
          ['S', 'M', 'L', 'one'].includes(l.sizeId) &&
          Number.isInteger(l.quantity) &&
          l.quantity > 0 &&
          l.quantity <= MAX_QUANTITY &&
          Number.isFinite(l.unitPrice) &&
          l.unitPrice > 0,
      )
    )
      return null
    return raw
  } catch {
    return null
  }
}
export function saveCart(cart: CartItem[]) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  } catch {
    /* Ordering still works when browser storage is unavailable. */
  }
}
export function makeReceipt(cart: CartItem[]): Receipt {
  const receipt: Receipt = {
    code: String(Math.floor(10000 + Math.random() * 90000)),
    createdAt: Date.now(),
    lines: cart.map((line) => {
      const { drink, size } = resolveItem(line)
      return { name: drink.name, sizeId: size.id, quantity: line.quantity, unitPrice: size.price }
    }),
  }
  try {
    localStorage.setItem(RECEIPT_KEY, JSON.stringify(receipt))
  } catch {
    /* The current receipt remains available in memory. */
  }
  return receipt
}
