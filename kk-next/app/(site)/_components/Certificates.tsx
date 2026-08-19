// "ЧАНАР · ГЭРЧИЛГЭЭ" — 인증서·시험성적서 카드 그리드 (Нүүр C 톤, 서버 컴포넌트)
// 데이터는 관리자 Гэрчилгээ 페이지에서 업로드한 활성 항목.

export interface CertItem {
  id: string;
  title_mn: string;
  type: 'certificate' | 'test_report';
  issued_by: string | null;
  issued_at: string | null;
  product_name: string | null;
  url: string;
  isImage: boolean;
}

const TYPE_MN: Record<CertItem['type'], { label: string; color: string }> = {
  certificate: { label: 'ГЭРЧИЛГЭЭ', color: '#1D4ED8' },
  test_report: { label: 'ШИНЖИЛГЭЭНИЙ ДҮН', color: '#2E7D4F' },
};

export function Certificates({ certs }: { certs: CertItem[] }) {
  if (!certs.length) return null;
  return (
    <section id="certificates" style={{ maxWidth: 1240, margin: '52px auto 0', padding: '0 20px' }}>
      <h2 className="disp" style={{ fontSize: 'clamp(21px, 4vw, 28px)', textTransform: 'uppercase', color: 'var(--site-text)', margin: '0 0 8px' }}>
        Чанар · Гэрчилгээ
      </h2>
      <p style={{ fontSize: 13.5, color: '#5E6C80', margin: '0 0 22px', maxWidth: 560, lineHeight: 1.6 }}>
        Бүтээгдэхүүн бүр стандартын шаардлагад нийцсэн гэрчилгээ, лабораторийн
        шинжилгээний дүнтэй. Баримт дээр дарж эх хувийг нь үзнэ үү.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 18 }}>
        {certs.map((c) => {
          const t = TYPE_MN[c.type];
          return (
            <a key={c.id} href={c.url} target="_blank" rel="noopener noreferrer"
              style={{ background: '#fff', border: '1px solid var(--site-line)', display: 'flex', flexDirection: 'column', color: 'var(--site-text)' }}>
              <div style={{ height: 150, background: '#EDEBE6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {c.isImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.url} alt={c.title_mn} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: 40 }}>📄</span>
                )}
              </div>
              <div style={{ padding: '13px 15px 15px', display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                <span style={{ alignSelf: 'flex-start', fontSize: 9.5, fontWeight: 800, letterSpacing: '.07em', color: t.color, border: `1px solid color-mix(in srgb, ${t.color} 40%, transparent)`, padding: '3px 7px' }}>
                  {t.label}
                </span>
                <span style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.35 }}>{c.title_mn}</span>
                <span style={{ fontSize: 11.5, color: '#626B76', marginTop: 'auto' }}>
                  {[c.issued_by, c.issued_at, c.product_name].filter(Boolean).join(' · ')}
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
