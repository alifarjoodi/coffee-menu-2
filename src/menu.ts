export type Category = 'classic' | 'other' | 'signature'
export type Filter = 'all' | Category
export type DrinkSize = 'S' | 'M' | 'L' | 'one'
export type SizeOption = { id: DrinkSize; ml: number; price: number }
export type Drink = {
  id: string
  name: string
  english: string
  category: Category
  ingredients: string
  description: string
  cold: boolean
  sizes: SizeOption[]
  image?: string
}

const sizeOrder: DrinkSize[] = ['S', 'M', 'L']
const sizes = (prices: (number | null)[], volumes = [180, 250, 350]): SizeOption[] =>
  prices.flatMap((price, i) =>
    price === null ? [] : [{ id: sizeOrder[i], ml: volumes[i], price: price * 1000 }],
  )
const signatureSize: SizeOption[] = [{ id: 'one', ml: 250, price: 370000 }]
export const sizeName: Record<DrinkSize, string> = {
  S: 'کوچک',
  M: 'متوسط',
  L: 'بزرگ',
  one: 'تک‌سایز',
}
export const drinks: Drink[] = [
  {
    id: 'americano',
    name: 'آمریکانو',
    english: 'Americano',
    category: 'classic',
    ingredients: 'اسپرسو، آب داغ',
    description:
      'اسپرسوی تازه روی آب داغ؛ یک فنجان ساده و خوش‌عطر که طعم واقعی دانه‌ها را نشان می‌دهد.',
    cold: false,
    sizes: sizes([265, 285, 295]),
  },
  {
    id: 'cappuccino',
    name: 'کاپوچینو',
    english: 'Cappuccino',
    category: 'classic',
    ingredients: 'اسپرسو، شیر، میکروفوم',
    description: 'تعادل اسپرسوی پرعطر و شیر بخارداده، زیر لایه‌ای نرم و مخملی از فوم شیر.',
    cold: false,
    sizes: sizes([315, 325, 355]),
  },
  {
    id: 'latte',
    name: 'لاته',
    english: 'Caffè Latte',
    category: 'classic',
    ingredients: 'اسپرسو، شیر بخارداده',
    description:
      'اسپرسو با شیر گرم و لایه‌ای نازک از میکروفوم؛ قهوه‌ای نرم و شیری برای یک مکث آرام.',
    cold: false,
    sizes: sizes([320, 330, 360]),
  },
  {
    id: 'flat-white',
    name: 'فلت وایت',
    english: 'Flat White',
    category: 'classic',
    ingredients: 'اسپرسوی دبل، میکروفوم شیر',
    description: 'اسپرسوی دبل با کمی شیر مخملی. طعم قهوه در این فنجان کوچک، پررنگ‌تر از لاته است.',
    cold: false,
    sizes: sizes([330]),
  },
  {
    id: 'mocha',
    name: 'موکا',
    english: 'Mocha',
    category: 'classic',
    ingredients: 'اسپرسو، شکلات، شیر',
    description:
      'شکلات تلخ در اسپرسوی داغ حل می‌شود و با شیر بخارداده، یک فنجان شکلاتی و متعادل می‌سازد.',
    cold: false,
    sizes: sizes([345, 365, 395]),
  },
  {
    id: 'filter',
    name: 'قهوه دمی',
    english: 'Filter Coffee',
    category: 'classic',
    ingredients: 'قهوه‌ی تازه‌آسیاب، آب داغ',
    description: 'قهوه‌ای که با حوصله از فیلتر می‌گذرد؛ سبک، شفاف و پر از عطر دانه‌ی تازه‌آسیاب.',
    cold: false,
    sizes: sizes([190, 195, 220]),
  },
  {
    id: 'espresso',
    name: 'اسپرسو',
    english: 'Espresso',
    category: 'classic',
    ingredients: 'قهوه‌ی تازه‌آسیاب',
    description: 'یک شات عصاره‌ی خالص قهوه با کرمای طلایی؛ کوتاه، غلیظ و ماندگار.',
    cold: false,
    sizes: sizes([165], [40]),
  },
  {
    id: 'tea',
    name: 'چای سیاه',
    english: 'Black Tea',
    category: 'other',
    ingredients: 'برگ چای سیاه، آب داغ',
    description: 'چای سیاه دم‌کشیده با رنگ کهربایی و عطر آشنای برگ چای.',
    cold: false,
    sizes: sizes([330], [220]),
  },
  {
    id: 'cocoa',
    name: 'شیر کاکائو',
    english: 'Cocoa',
    category: 'other',
    ingredients: 'پودر کاکائو، شیر گرم',
    description: 'کاکائوی خالص و شیر گرم برای یک نوشیدنی ملایم و لطیف، بدون اسپرسو.',
    cold: false,
    sizes: sizes([315, 285, 295]),
  },
  {
    id: 'matcha',
    name: 'ماچا لاته',
    english: 'Matcha Latte',
    category: 'other',
    ingredients: 'چای ماچا، شیر',
    description: 'ماچای سبز هم‌زده با شیر گرم؛ ترکیبی خامه‌ای با طعم گیاهی و شیرینی ملایم.',
    cold: false,
    sizes: sizes([265, 330, 360]),
  },
  {
    id: 'hot-chocolate',
    name: 'هات چاکلت',
    english: 'Hot Chocolate',
    category: 'other',
    ingredients: 'شکلات تلخ، شیر',
    description: 'شکلات تلخ ذوب‌شده در شیر داغ؛ غلیظ و خوش‌عطر برای دوست‌داران شکلات.',
    cold: false,
    sizes: sizes([320, 330, 360]),
  },
  {
    id: 'lemonade',
    name: 'لیموناد',
    english: 'Lemonade',
    category: 'other',
    ingredients: 'لیموترش تازه، یخ، آب',
    description: 'آب لیموترش تازه با شیرینی ملایم و تکه‌های یخ؛ خنک و سرحال‌کننده.',
    cold: true,
    sizes: sizes([null, 180]),
  },
  {
    id: 'pear-latte',
    name: 'لاته گلابی و نمک',
    english: 'Salted Pear Latte',
    category: 'signature',
    ingredients: 'اسپرسو، گلابی، وانیل و فوم نمکی',
    description:
      'اسپرسوی دانه با شیرینی گلابی و عطر وانیل، زیر فوم نرم شیر با نوک‌نمکی از نمک دریایی.',
    cold: false,
    sizes: signatureSize,
    image: '/assets/drinks/pear-latte.webp',
  },
  {
    id: 'peach-oolong',
    name: 'اولانگ هلو',
    english: 'Peach Oolong',
    category: 'signature',
    ingredients: 'اسپرسو، چای اولانگ، هلو و یاس',
    description: 'چای اولانگ سرد با هلوی رسیده، رایحه‌ی یاس و یک شات اسپرسو؛ میوه‌ای و سبک روی یخ.',
    cold: true,
    sizes: signatureSize,
    image: '/assets/drinks/peach-oolong.webp',
  },
  {
    id: 'sesame-mocha',
    name: 'موکا کنجد سیاه',
    english: 'Black Sesame Mocha',
    category: 'signature',
    ingredients: 'اسپرسو، شکلات تلخ، کنجد سیاه و شیر',
    description: 'شکلات تلخ و کنجد سیاه برشته با اسپرسو و شیر گرم؛ ترکیبی عمیق با پایانی آجیلی.',
    cold: false,
    sizes: signatureSize,
    image: '/assets/drinks/sesame-mocha.webp',
  },
  {
    id: 'orange-tonic',
    name: 'پرتقال و کاکائو',
    english: 'Orange Cacao Tonic',
    category: 'signature',
    ingredients: 'اسپرسو، پرتقال، کاکائو و تونیک',
    description: 'تونیک خنک و پرتقال تازه با اسپرسو و عطر کاکائو؛ جرعه‌ای مرکباتی و کمی تلخ.',
    cold: true,
    sizes: signatureSize,
    image: '/assets/drinks/orange-tonic.webp',
  },
]
export const numberFA = (value: number) => new Intl.NumberFormat('fa-IR').format(value)
export const byId = new Map(drinks.map((drink) => [drink.id, drink]))
export const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f\u064b-\u065f\u0670]/g, '')
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[\u200c\sـ-]+/g, '')
