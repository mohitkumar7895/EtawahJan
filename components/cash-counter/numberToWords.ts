// Indian numbering system (lakh, crore) → words.
// Supports English ("One Lakh Twenty Three Thousand Four Hundred")
// and Hindi  ("Ek Lakh Tetees Hazaar Chaar Sau") in romanised script
// so it renders cleanly even when the system has no Devanagari font.

const EN_ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen',
  'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen',
];
const EN_TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

const HI_ONES = [
  '', 'Ek', 'Do', 'Teen', 'Chaar', 'Paanch', 'Cheh', 'Saat', 'Aath', 'Nau',
  'Das', 'Gyarah', 'Barah', 'Terah', 'Chaudah', 'Pandrah',
  'Solah', 'Satrah', 'Atharah', 'Unnees',
];
// 20..99 — Hindi has unique words for each, easiest to keep a lookup table.
const HI_2_99: Record<number, string> = {
  20: 'Bees',          21: 'Ikkees',       22: 'Baees',        23: 'Teyees',       24: 'Chaubees',
  25: 'Pachees',       26: 'Chhabbees',    27: 'Sattaees',     28: 'Atthaees',     29: 'Untees',
  30: 'Tees',          31: 'Ikatees',      32: 'Battees',      33: 'Tetees',       34: 'Chautees',
  35: 'Paintees',      36: 'Chhattees',    37: 'Saintees',     38: 'Adtees',       39: 'Untaalees',
  40: 'Chalees',       41: 'Iktaalees',    42: 'Bayaalees',    43: 'Taintaalees',  44: 'Chavalees',
  45: 'Paintaalees',   46: 'Chhayaalees',  47: 'Saintaalees',  48: 'Adtaalees',    49: 'Unchaas',
  50: 'Pachaas',       51: 'Ikyavan',      52: 'Bavan',        53: 'Tirpan',       54: 'Chauwan',
  55: 'Pachpan',       56: 'Chhappan',     57: 'Sattavan',     58: 'Atthaavan',    59: 'Unsath',
  60: 'Saath',         61: 'Iksath',       62: 'Baasath',      63: 'Tirsath',      64: 'Chausath',
  65: 'Painsath',      66: 'Chhiyaasath',  67: 'Sadsath',      68: 'Adsath',       69: 'Unhattar',
  70: 'Sattar',        71: 'Ikhattar',     72: 'Bahattar',     73: 'Tihattar',     74: 'Chauhattar',
  75: 'Pachhattar',    76: 'Chhihattar',   77: 'Satahattar',   78: 'Athhattar',    79: 'Unaasee',
  80: 'Assee',         81: 'Ikyaasee',     82: 'Bayaasee',     83: 'Tirasee',      84: 'Chauraasee',
  85: 'Pachaasee',     86: 'Chhiyaasee',   87: 'Sataasee',     88: 'Athaasee',     89: 'Navaasee',
  90: 'Nabbe',         91: 'Ikyaanve',     92: 'Bayaanve',     93: 'Tiraanve',     94: 'Chauraanve',
  95: 'Pachaanve',     96: 'Chhiyaanve',   97: 'Sataanve',     98: 'Athaanve',     99: 'Ninyaanve',
};

function below100En(n: number): string {
  if (n < 20) return EN_ONES[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return EN_TENS[t] + (o ? ' ' + EN_ONES[o] : '');
}

function below1000En(n: number): string {
  const h = Math.floor(n / 100);
  const r = n % 100;
  const parts: string[] = [];
  if (h) parts.push(EN_ONES[h] + ' Hundred');
  if (r) parts.push(below100En(r));
  return parts.join(' ');
}

function below100Hi(n: number): string {
  if (n < 20) return HI_ONES[n];
  return HI_2_99[n] || '';
}

function below1000Hi(n: number): string {
  const h = Math.floor(n / 100);
  const r = n % 100;
  const parts: string[] = [];
  if (h) parts.push(HI_ONES[h] + ' Sau');
  if (r) parts.push(below100Hi(r));
  return parts.join(' ');
}

export function toIndianWordsEn(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return 'Zero';
  const num = Math.floor(n);

  const crore = Math.floor(num / 1_00_00_000);
  const lakh = Math.floor((num % 1_00_00_000) / 1_00_000);
  const thousand = Math.floor((num % 1_00_000) / 1_000);
  const rest = num % 1_000;

  const parts: string[] = [];
  if (crore) parts.push(below1000En(crore) + ' Crore');
  if (lakh) parts.push(below100En(lakh) + ' Lakh');
  if (thousand) parts.push(below100En(thousand) + ' Thousand');
  if (rest) parts.push(below1000En(rest));

  return parts.join(' ').trim();
}

export function toIndianWordsHi(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return 'Shoonya';
  const num = Math.floor(n);

  const crore = Math.floor(num / 1_00_00_000);
  const lakh = Math.floor((num % 1_00_00_000) / 1_00_000);
  const thousand = Math.floor((num % 1_00_000) / 1_000);
  const rest = num % 1_000;

  const parts: string[] = [];
  if (crore) parts.push(below1000Hi(crore) + ' Crore');
  if (lakh) parts.push(below100Hi(lakh) + ' Lakh');
  if (thousand) parts.push(below100Hi(thousand) + ' Hazaar');
  if (rest) parts.push(below1000Hi(rest));

  return parts.join(' ').trim();
}

export function formatIndianRupees(n: number): string {
  // Indian style grouping: 12,34,567
  const num = Math.floor(n);
  const str = num.toString();
  if (str.length <= 3) return str;
  const last3 = str.slice(-3);
  const rest = str.slice(0, -3);
  const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return grouped + ',' + last3;
}
