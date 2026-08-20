// Бидний тухай — 구 사이트(kkllc.vercel.app/about)의 회사 소개·미션·가치·연혁·유통망을
// Нүүр C 디자인(잉크 블랙 + 옐로 + Oswald, 직각)으로 이식.
import Link from 'next/link';

export const metadata = {
  title: 'Бидний тухай · KK LLC',
  description: '10+ жилийн түүхтэй итгэлт түнш — Kokorozashi Kibou ХХК',
};

const wrap: React.CSSProperties = { maxWidth: 1240, margin: '0 auto', padding: '0 20px' };

const VALUES = [
  {
    title: 'Чанар',
    desc: 'Бүх бүтээгдэхүүн MNS стандартын шаардлага хангасан.',
    icon: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /></>,
  },
  {
    title: 'Итгэл',
    desc: 'Уут бүрийн жин үнэн зөв, нуугдмал зардалгүй шударга худалдаа.',
    icon: <path d="M20.8 8.6a4.6 4.6 0 0 0-7.8-2.4L12 7.2l-1-1A4.6 4.6 0 0 0 3.2 8.6c0 3.9 4.6 7.2 8.8 11 4.2-3.8 8.8-7.1 8.8-11z" />,
  },
  {
    title: 'Үйлчилгээ',
    desc: 'Мэргэжлийн зөвлөгөө, хурдан хүргэлт.',
    icon: <path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12z" />,
  },
];

const TIMELINE = [
  { year: '2014', title: 'Компани үүсгэн байгуулагдав', desc: 'Kokorozashi Kibou ХХК Улаанбаатар хотод үүсгэн байгуулагдав.' },
  { year: '2016', title: 'Үйлдвэрлэл эхлүүлэв', desc: 'Өөрийн үйлдвэрлэлийн шугам байгуулж, замаск үйлдвэрлэж эхлэв.' },
  { year: '2018', title: 'Түгээлтийн сүлжээ өргөжив', desc: '50 гаруй жижиглэнгийн цэгтэй хамтран ажиллаж эхлэв.' },
  { year: '2020', title: 'Knauf бүтээгдэхүүн нэмэгдэв', desc: 'Knauf брэндийн албан ёсны борлуулагч болов.' },
  { year: '2024', title: '10 жилийн ой', desc: '10+ жилийн амжилттай үйл ажиллагаа, 500+ сэтгэл ханамжтай үйлчлүүлэгч.' },
];

const STATS = [
  { value: '50+', label: 'Жижиглэнгийн цэг', sub: 'Улаанбаатар даяар' },
  { value: '100+', label: 'Орон сууц, томоохон барилга', sub: 'материал нийлүүлсэн' },
  { value: '500+', label: 'Үйлчлүүлэгч', sub: 'давтан захиалгатай' },
];

// 프로젝트 유형 — 실제 건물명·발주처를 넣으려면 title을 그 이름으로 교체
const PROJECTS = [
  { title: 'Орон сууцны цогцолбор', desc: 'Дотор ханын замаск, плитаны цавууг үе шаттайгаар, барилгын графикт нийцүүлэн нийлүүлдэг.' },
  { title: 'Оффис, худалдааны төв', desc: 'Их эзэлхүүний тогтмол нийлүүлэлт — нэг өдрийн дотор паллетаар хүргэнэ.' },
  { title: 'Сургууль, цэцэрлэг', desc: 'Стандартын шаардлага хангасан, гэрчилгээтэй материалыг хугацаанд нь.' },
];

export default function AboutPage() {
  return (
    <div style={{ paddingBottom: 64 }}>
      {/* 헤더 밴드 */}
      <section style={{ background: '#EDEBE6' }}>
        <div style={{ ...wrap, padding: '48px 20px 46px' }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.16em', color: '#626B76', marginBottom: 14 }}>
            БИДНИЙ ТУХАЙ
          </div>
          <h1 className="disp" style={{ fontSize: 'clamp(28px, 4.5vw, 44px)', lineHeight: 1.1, margin: '0 0 14px', textTransform: 'uppercase', color: 'var(--site-text)', maxWidth: 720 }}>
            10+ жилийн түүхтэй итгэлт түнш
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.65, color: '#4A525C', margin: 0, maxWidth: 640 }}>
            Kokorozashi Kibou ХХК нь 2014 онд үүсгэн байгуулагдсан бөгөөд Монголын
            барилгын материалын зах зээлд тэргүүлэгч компанийн нэг болсон.
          </p>
        </div>
      </section>

      {/* 미션 — 잉크 스플릿 밴드 */}
      <section style={{ ...wrap, marginTop: 44 }}>
        <div style={{ background: '#14181D', display: 'grid', alignItems: 'stretch' }} className="md:grid-cols-2">
          <div style={{ padding: '38px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.14em', color: 'var(--accent)', marginBottom: 11 }}>
              БИДНИЙ ЗОРИЛГО
            </span>
            <h2 className="disp" style={{ fontSize: 'clamp(21px, 3.4vw, 29px)', lineHeight: 1.15, color: '#fff', margin: 0, textTransform: 'uppercase' }}>
              Барилгын мастеруудын найдвартай түнш
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.65, color: 'rgba(255,255,255,.65)', margin: '14px 0 0', maxWidth: 440 }}>
              Чанартай барилгын материалыг шударга үнээр хүргэж, Монголын барилгын
              салбарын хөгжилд хувь нэмэр оруулах.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '22px 0 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['MNS стандартын бүтээгдэхүүн', 'Мэргэжлийн баг', 'Найдвартай түнш'].map((item) => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 11, fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,.85)' }}>
                  <span style={{ width: 20, height: 20, background: 'var(--accent)', color: 'var(--accent-ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {/* 타이포 패널 — 志 워터마크 */}
          <div style={{ position: 'relative', minHeight: 240, background: '#0F1216', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span aria-hidden style={{ position: 'absolute', fontFamily: 'serif', fontSize: 260, lineHeight: 1, color: 'rgba(255,196,0,.07)', userSelect: 'none' }}>志</span>
            <span className="mono" style={{ position: 'relative', fontSize: 12.5, fontWeight: 700, letterSpacing: '.18em', color: 'rgba(255,255,255,.5)', textAlign: 'center', padding: '0 20px' }}>
              EST. 2014 · ULAANBAATAR
            </span>
          </div>
        </div>
      </section>

      {/* 핵심 가치 */}
      <section style={{ ...wrap, marginTop: 52 }}>
        <h2 className="disp" style={{ fontSize: 'clamp(21px, 4vw, 28px)', textTransform: 'uppercase', color: 'var(--site-text)', margin: '0 0 22px' }}>
          Үндсэн үнэт зүйлс
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
          {VALUES.map((v) => (
            <div key={v.title} style={{ background: '#fff', border: '1px solid var(--site-line)', padding: '24px 22px' }}>
              <span style={{ display: 'inline-flex', width: 46, height: 46, background: 'var(--accent)', alignItems: 'center', justifyContent: 'center', marginBottom: 15 }}>
                <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="var(--accent-ink)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {v.icon}
                </svg>
              </span>
              <div className="disp" style={{ fontSize: 20, color: 'var(--site-text)' }}>{v.title}</div>
              <p style={{ fontSize: 13.5, color: '#626B76', lineHeight: 1.6, margin: '6px 0 0' }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 연혁 */}
      <section style={{ ...wrap, marginTop: 56 }}>
        <h2 className="disp" style={{ fontSize: 'clamp(21px, 4vw, 28px)', textTransform: 'uppercase', color: 'var(--site-text)', margin: '0 0 24px' }}>
          Бидний түүх
        </h2>
        <div style={{ position: 'relative', paddingLeft: 28, maxWidth: 720 }}>
          <span style={{ position: 'absolute', left: 5, top: 6, bottom: 6, width: 2, background: 'var(--site-line)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
            {TIMELINE.map((t) => (
              <div key={t.year} style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: -28, top: 6, width: 12, height: 12, background: 'var(--accent)', border: '3px solid var(--site-bg)', boxSizing: 'content-box' }} />
                <div className="disp mono" style={{ fontSize: 19, color: 'var(--site-text)' }}>{t.year}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--site-text)', marginTop: 2 }}>{t.title}</div>
                <p style={{ fontSize: 13.5, color: '#626B76', lineHeight: 1.6, margin: '4px 0 0' }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 유통망 · 프로젝트 실적 — 잉크 밴드 */}
      <section style={{ background: '#14181D', color: '#fff', marginTop: 56 }}>
        <div style={{ ...wrap, padding: '44px 20px' }}>
          <h2 className="disp" style={{ fontSize: 'clamp(21px, 4vw, 28px)', textTransform: 'uppercase', margin: '0 0 8px' }}>
            Түгээлт ба төслүүд
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.65, color: 'rgba(255,255,255,.6)', margin: '0 0 24px', maxWidth: 560 }}>
            Улаанбаатарын орон сууцны цогцолбор, оффис, олон нийтийн барилгад
            материал нийлүүлж, ихэнх нь давтан захиалгаар үргэлжлэн ажилладаг.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 18 }}>
            {STATS.map((s) => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.14)', padding: '22px 24px' }}>
                <div className="disp" style={{ fontSize: 42, lineHeight: 1, color: 'var(--accent)' }}>{s.value}</div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'rgba(255,255,255,.85)', marginTop: 8 }}>{s.label}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', marginTop: 2 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* 프로젝트 유형별 실적 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18, marginTop: 18 }}>
            {PROJECTS.map((p) => (
              <div key={p.title} style={{ borderLeft: '4px solid var(--accent)', padding: '4px 0 4px 15px' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{p.title}</div>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(255,255,255,.6)', margin: '5px 0 0' }}>{p.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.45)', marginTop: 22, borderTop: '1px solid rgba(255,255,255,.14)', paddingTop: 16 }}>
            Хийгдсэн төслийн жагсаалт, зураг болон ашигласан материалын тооцоог хүсэлтээр танилцуулна — ☎ 8820-4057
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ ...wrap, marginTop: 40 }}>
        <div style={{ background: '#fff', border: '1px solid var(--site-line)', padding: '22px 24px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div>
            <div className="disp" style={{ fontSize: 18, color: 'var(--site-text)', textTransform: 'uppercase' }}>
              Хамтран ажиллах уу?
            </div>
            <div style={{ fontSize: 13, color: '#5E6C80', marginTop: 4 }}>
              Бөөний үнэ, тогтмол нийлүүлэлтийн талаар ярилцъя — ☎ 8820-4057
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="/#products" style={{ padding: '12px 22px', background: 'var(--accent)', color: 'var(--accent-ink)', fontWeight: 700, fontSize: 13.5 }}>
              Бүтээгдэхүүн үзэх →
            </Link>
            <a href="tel:88204057" style={{ padding: '12px 22px', border: '1.5px solid #14181D', color: '#14181D', fontWeight: 700, fontSize: 13.5 }}>
              Холбоо барих
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
