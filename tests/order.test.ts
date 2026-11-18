import assert from 'node:assert/strict'
import { beforeEach, test } from 'node:test'
import { drinks, normalize } from '../src/menu'
import {
  loadCart,
  saveCart,
  makeReceipt,
  loadReceipt,
  resolveItem,
  itemKey,
  MAX_QUANTITY,
  type CartItem,
} from '../src/order'

// Keep the tests independent of a browser or a particular OS locale.
let storage: Map<string, string>
beforeEach(() => {
  storage = new Map()
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    },
  })
})
const medium: CartItem = { drinkId: 'americano', sizeId: 'M', quantity: 2 }
const special: CartItem = { drinkId: 'peach-oolong', sizeId: 'one', quantity: 1 }

test('search handles Persian and Arabic forms, joiners, and Latin accents', () => {
  assert.equal(normalize('آمریکانو'), normalize('امريكانو'))
  assert.equal(normalize('تازه‌دم'), normalize('تازه دم'))
  assert.equal(normalize('Caffè Latte'), normalize('caffe latte'))
})

test('every orderable size resolves to a distinct drink/size key and a positive price', () => {
  const keys = new Set<string>()
  for (const drink of drinks) {
    assert.ok(drink.sizes.length)
    for (const size of drink.sizes) {
      const line: CartItem = { drinkId: drink.id, sizeId: size.id, quantity: 1 }
      assert.equal(keys.has(itemKey(line)), false)
      keys.add(itemKey(line))
      assert.equal(resolveItem(line).size, size)
      assert.ok(size.price > 0 && Number.isInteger(size.price))
    }
  }
})

test('cart survives a reload with its selected sizes and quantities', () => {
  saveCart([medium, special])
  assert.deepEqual(loadCart(), [medium, special])
})

test('restoring a cart drops removed drinks, unavailable sizes and invalid quantities', () => {
  storage.set(
    'daneh.cart.v1',
    JSON.stringify([
      null,
      { ...medium, drinkId: 'unknown' },
      { ...medium, sizeId: 'one' },
      { ...medium, quantity: 0 },
      { ...special, quantity: 0.5 },
      medium,
    ]),
  )
  assert.deepEqual(loadCart(), [medium])
})

test('duplicate restored lines merge up to the per-size quantity limit', () => {
  storage.set(
    'daneh.cart.v1',
    JSON.stringify([medium, { ...medium, quantity: MAX_QUANTITY }, special]),
  )
  assert.deepEqual(loadCart(), [{ ...medium, quantity: MAX_QUANTITY }, special])
})

test('the saved receipt snapshots each confirmed size and unit price', () => {
  const receipt = makeReceipt([medium, special])
  assert.deepEqual(loadReceipt(), receipt)
  assert.deepEqual(
    receipt.lines.map((l) => [l.sizeId, l.quantity, l.unitPrice]),
    [
      ['M', 2, 285000],
      ['one', 1, 370000],
    ],
  )
  assert.equal(
    receipt.lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0),
    940000,
  )
  saveCart([])
  assert.deepEqual(loadCart(), [])
  assert.deepEqual(loadReceipt(), receipt)
})

test('corrupt storage and invalid receipt dates do not prevent opening the menu', () => {
  storage.set('daneh.cart.v1', 'not JSON')
  storage.set(
    'daneh.receipt.v1',
    JSON.stringify({
      code: '1',
      createdAt: 1e20,
      lines: [{ name: 'لاته', sizeId: 'S', unitPrice: 1, quantity: 1 }],
    }),
  )
  assert.deepEqual(loadCart(), [])
  assert.equal(loadReceipt(), null)
})

test('ordering and confirmation still work without local storage', () => {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get() {
      throw new Error('Storage unavailable')
    },
  })
  assert.deepEqual(loadCart(), [])
  assert.equal(loadReceipt(), null)
  assert.doesNotThrow(() => saveCart([medium]))
  assert.equal(makeReceipt([medium]).lines.length, 1)
})
