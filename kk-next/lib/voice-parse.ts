// BR-8: 음성 트랜스크립트 → 주문 필드 파싱 (이름·전화·지역구·품목×수량)
// 파싱은 폼을 채울 뿐, 저장은 항상 관리자 확인 버튼으로만 한다.

export interface VoiceProduct { id: string; name_mn: string }
export interface ParsedVoice {
  name?: string;
  phone?: string;
  district?: string;
  items: { product_id: string; qty: number }[];
}

// 지역구 전체 이름 → 약어 (02 문서 상수와 동일 체계)
const DISTRICT_MAP: [RegExp, string][] = [
  [/баянзүрх|бзд/i, 'БЗД'],
  [/сонгино\s*хайрхан|схд/i, 'СХД'],
  [/хан[-\s]?уул|худ/i, 'ХУД'],
  [/баянгол|бгд/i, 'БГД'],
  [/чингэлтэй|чд/i, 'ЧД'],
  [/сүхбаатар|сбд/i, 'СБД'],
  [/багануур|бнд/i, 'БНД'],
  [/налайх|нд/i, 'НД'],
];

// 제품 식별 토큰: 이름의 구별되는 첫 단어(들)
function productTokens(name: string): string[] {
  return name.toLowerCase().split(/\s+/).filter((w) => w.length >= 3);
}

/** 텍스트에서 전화번호(몽골 8자리) 추출 */
export function parsePhone(text: string): string | undefined {
  const m = text.match(/(\d[\d\s-]{6,}\d)/g);
  if (!m) return undefined;
  for (const cand of m) {
    const digits = cand.replace(/\D/g, '');
    if (digits.length === 8) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }
  return undefined;
}

/** 트랜스크립트 파싱 — 매칭 실패한 필드는 undefined (수기 입력) */
export function parseVoiceOrder(text: string, products: VoiceProduct[]): ParsedVoice {
  const result: ParsedVoice = { items: [] };

  result.phone = parsePhone(text);

  // 전화번호 구간은 수량으로 오인되지 않게 마스킹
  let lower = text.toLowerCase();
  const phoneRaw = text.match(/(\d[\d\s-]{6,}\d)/g);
  for (const raw of phoneRaw ?? []) {
    if (raw.replace(/\D/g, '').length === 8) lower = lower.replace(raw.toLowerCase(), ' '.repeat(raw.length));
  }

  for (const [re, code] of DISTRICT_MAP) {
    if (re.test(lower)) { result.district = code; break; }
  }

  // 공유 토큰('цавуу'·'замаск' 등)은 제외하고 제품별 고유 토큰으로만 매칭
  const tokenCount = new Map<string, number>();
  for (const p of products) {
    for (const t of new Set(productTokens(p.name_mn))) {
      tokenCount.set(t, (tokenCount.get(t) ?? 0) + 1);
    }
  }

  // 품목 × 수량: 제품 토큰 뒤쪽 첫 숫자 우선, 없으면 바로 앞 숫자 ("120 цагаан" 형태)
  for (const p of products) {
    const tokens = productTokens(p.name_mn).filter((t) => tokenCount.get(t) === 1);
    let idx = -1, tokLen = 0;
    for (const t of tokens) {
      idx = lower.indexOf(t);
      if (idx >= 0) { tokLen = t.length; break; }
    }
    if (idx < 0) continue;
    const pickNum = (s: string, last = false) => {
      const nums = [...s.matchAll(/\d{1,4}/g)].map((m) => Number(m[0])).filter((n) => n > 0 && n < 10000);
      return nums.length ? nums[last ? nums.length - 1 : 0] : undefined;
    };
    const qty = pickNum(lower.slice(idx + tokLen, idx + tokLen + 45))
      ?? pickNum(lower.slice(Math.max(0, idx - 25), idx), true);
    if (qty) result.items.push({ product_id: p.id, qty });
  }

  // 이름: "X гэдэг / нэртэй / захиалагч X" 패턴 → 없으면 제품·지역이 아닌 첫 고유명사형 단어
  const nameMatch =
    text.match(/([А-ЯЁӨҮ][а-яёөү]{2,})\s+(?:гэдэг|нэртэй)/) ??
    text.match(/(?:захиалагч|нэр нь)\s+([А-ЯЁӨҮ][а-яёөү]{2,})/);
  if (nameMatch) result.name = nameMatch[1];
  else {
    const productWords = new Set(products.flatMap((p) => productTokens(p.name_mn)));
    const cand = [...text.matchAll(/(?:^|[\s,.])([А-ЯЁӨҮ][а-яёөү]{2,})/g)]
      .map((m) => m[1])
      .find((w) => {
        const lw = w.toLowerCase();
        return !productWords.has(lw) && !DISTRICT_MAP.some(([re]) => re.test(lw));
      });
    if (cand) result.name = cand;
  }

  return result;
}
