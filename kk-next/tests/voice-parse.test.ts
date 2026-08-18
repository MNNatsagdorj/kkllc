// BR-8 음성 파서 단위 테스트 — 05 문서의 목업 예시 기준
import { describe, it, expect } from 'vitest';
import { parseVoiceOrder, parsePhone } from '../lib/voice-parse';

const PRODUCTS = [
  { id: 'w', name_mn: 'Цагаан замаск' },
  { id: 'b', name_mn: 'Хар замаск' },
  { id: 'g', name_mn: 'Блокны цавуу' },
  { id: 't', name_mn: 'Плитаны цавуу' },
  { id: 'k', name_mn: 'Knauf гипс' },
];

describe('parsePhone', () => {
  it('공백/하이픈 포함 8자리 인식', () => {
    expect(parsePhone('дугаар нь 9911 8899 байгаа')).toBe('9911-8899');
    expect(parsePhone('99-11-88-99')).toBe('9911-8899');
  });
  it('8자리 아니면 undefined', () => {
    expect(parsePhone('өнөөдөр 120 ширхэг')).toBeUndefined();
  });
});

describe('parseVoiceOrder — 05 문서 목업 예시', () => {
  it('Болд, 9911-8899, БЗД, Цагаан ×120 + Блокны ×50', () => {
    const r = parseVoiceOrder(
      'Болд гэдэг хүн 9911 8899 дугаартай Баянзүрх дүүрэгт цагаан замаск 120 ширхэг блокны цавуу 50 ширхэг захиалъя',
      PRODUCTS,
    );
    expect(r.name).toBe('Болд');
    expect(r.phone).toBe('9911-8899');
    expect(r.district).toBe('БЗД');
    expect(r.items).toContainEqual({ product_id: 'w', qty: 120 });
    expect(r.items).toContainEqual({ product_id: 'g', qty: 50 });
  });

  it('약어 지역구 + 단일 품목', () => {
    const r = parseVoiceOrder('СХД рүү плитаны цавуу 15 ширхэг, утас 8811 9900', PRODUCTS);
    expect(r.district).toBe('СХД');
    expect(r.items).toEqual([{ product_id: 't', qty: 15 }]);
    expect(r.phone).toBe('8811-9900');
  });

  it('전화번호 8자리가 수량으로 오인되지 않음', () => {
    const r = parseVoiceOrder('99118899 цагаан замаск 100', PRODUCTS);
    expect(r.items).toEqual([{ product_id: 'w', qty: 100 }]);
  });

  it('매칭 실패 필드는 undefined, items는 빈 배열', () => {
    const r = parseVoiceOrder('сайн байна уу', PRODUCTS);
    expect(r.items).toEqual([]);
    expect(r.phone).toBeUndefined();
    expect(r.district).toBeUndefined();
  });

  it('Knauf 라틴 표기 매칭', () => {
    const r = parseVoiceOrder('knauf гипс 20 ширхэг авъя', PRODUCTS);
    expect(r.items).toEqual([{ product_id: 'k', qty: 20 }]);
  });
});
