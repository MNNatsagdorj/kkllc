# 07 · 디자인 시스템

브랜드 축: 네이비(기존 사이트 #0E1B2E) × 크라프트 포대 × 석고 화이트 × 안전 주황. 목업 CSS 토큰 그대로 옮기면 됩니다.

## 색상 토큰 (`globals.css :root`)

```css
:root{
  /* 브랜드 */
  --ink:  #0E1B2E;   /* 네이비 베이스 (기존 사이트) */
  --ink2: #13253F;   /* 네이비 표면 */
  --ink3: #1B3355;   /* 네이비 hover/상단바 */
  --paper:#EFECE3;   /* 석고/플라스터 화이트 */
  --kraft:#C89B5E;   /* 크라프트 포대 (주 액센트) */
  --kraft-deep:#A57938;
  --line: rgba(230,226,214,.14);  /* 다크면 보더 */
  --mut:  #8FA0B5;   /* 다크면 보조 텍스트 */

  /* 상태 색 (semantic — 세 화면 공통, 02 문서 매핑) */
  --st-new:   #5CA8FF;  /* Шинэ */
  --st-asg:   #E3A63B;  /* Хуваарилсан */
  --st-load:  #C89B5E;  /* Ачиж байна */
  --st-way:   #F07135;  /* Замд — 안전 주황 */
  --st-done:  #4CAF7D;  /* Хүргэгдсэн */
  --st-cancel:#E05252;  /* Цуцлагдсан */
}
```

원칙: kraft는 브랜드 액센트 전용, 주황·초록은 **상태 의미로만** 사용(장식 금지).

## 폰트 (모두 키릴 지원 — Google Fonts)

```css
--disp: 'Russo One', 'Arial Black', sans-serif;      /* 디스플레이/제목 — 산업 스텐실 느낌 */
--body: 'Golos Text', 'Inter', 'Segoe UI', sans-serif; /* 본문 UI */
--mono: 'JetBrains Mono', ui-monospace, monospace;   /* 금액·전화·주문번호·배치번호 */
```

```html
<link href="https://fonts.googleapis.com/css2?family=Russo+One&family=Golos+Text:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
```

숫자 데이터(₮, кг, ш, #번호, 전화)는 반드시 mono — 공장 코드 느낌 + 가독성.

## 화면별 테마

| 화면 | 배경 | 성격 |
|---|---|---|
| 웹사이트 | `#F2EFE7` 밝은 플라스터, 카드 `#FBFAF5`/보더 `#E3DECF`, 텍스트 `#14263E` | 종이·석고 질감, 신뢰감 |
| 관리자 | `--ink` 다크 네이비 + 블루프린트 그리드 배경 | 관제실 — 정보 밀도 높게 |
| 기사 | `#F4F2EB` 밝은 고대비, 헤더만 네이비 | 햇빛·장갑 — 큰 버튼, 강한 대비 |

블루프린트 그리드(다크 배경 장식):

```css
background-image:
  linear-gradient(rgba(239,236,227,.045) 1px, transparent 1px),
  linear-gradient(90deg, rgba(239,236,227,.045) 1px, transparent 1px);
background-size: 26px 26px;
```

## 제품 포대 아이콘 (SVG symbol)

하나의 `<symbol id="sack">`을 재사용, `--band` CSS 변수로 제품별 라벨 띠 색만 교체. (전체 path는 목업 HTML의 `#sack` 심볼 복사)

| 제품 | `--band` |
|---|---|
| Цагаан замаск | `#F4F1E8` |
| Хар замаск | `#2A2A2E` |
| Блокны цавуу | `#3E9B6B` |
| Плитаны цавуу | `#3D7DD8` |
| Knauf гипс | `#0A9BDC` (Knauf 블루) |

```html
<svg class="sack"><use href="#sack" style="--band:#3E9B6B"/></svg>
```

## 공통 컴포넌트 스타일 요점

- **100ш 미터**: 높이 12–14px 라운드 바, 목표선(우측 끝) + `100ш` mono 라벨. 미달 kraft 그라데이션, 달성 초록 그라데이션.
- **상태 태그/칩**: pill, 대문자 9–10px bold, 상태 색 15% 배경 + 45% 보더.
- **컨베이어**: 원형 스텝(완료 초록 ✓ / 현재 주황 + `box-shadow` 펄스 / 미래 회색) + 레일 선.
- **버튼**: 사이트/관리자 primary = 네이비 or kraft 솔리드, radius 8–9px. 기사 대형 버튼 = 풀폭, radius 14px, padding 16px, 상태별 색(비활성 `#B9AF93` / 출발 주황 / 완료 초록).
- 접근성: `:focus-visible` kraft 아웃라인, `prefers-reduced-motion` 시 애니메이션 제거, 터치 타겟 44px+(기사 앱 48px+).

## 문자 표기 규칙

- 통화: `1,837,500₮` (₮ 뒤붙임, 콤마)
- 수량: `×120`, 단위 `ш`(개) / `кг` / `т`
- 주문번호: `#1027` · 배치: `Б-2608-14` · 차량: `Майти · 01-23 УБА`
