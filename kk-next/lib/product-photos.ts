// 제품 사진 매핑 — public/products/ 에 파일을 넣고 여기 SKU로 등록하면
// 홈 카탈로그 카드에 포대 SVG 대신 실제 사진이 표시된다.
// 현재 사진: Bander(제조사) made-in-china 쇼룸 제품컷 — Alibaba 스토어는 봇 차단으로 수집 불가.
export const PRODUCT_PHOTOS: Record<string, string> = {
  TILE_GLUE: '/products/TILE_GLUE.jpg',
  BLOCK_GLUE: '/products/BLOCK_GLUE.jpg',
};
