package com.kkllc.admin.domain.stock;

import com.kkllc.admin.common.BizException;
import com.kkllc.admin.common.ErrorCode;
import com.kkllc.admin.domain.product.ProductMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 재고 원장(stock_movement) + 캐시(product.stock) 동기화 서비스.
 * 재고-매출 상세설계.md Part 1 권장안: 모든 증감은 원장 1건 + 캐시 갱신을 한 트랜잭션으로.
 */
@Service
public class StockService {

    private final ProductMapper productMapper;
    private final StockMovementMapper smMapper;

    public StockService(ProductMapper productMapper, StockMovementMapper smMapper) {
        this.productMapper = productMapper;
        this.smMapper = smMapper;
    }

    /** 입고(+): 생산/조정+/되돌림. 음수 검증 없음. */
    @Transactional
    public void stockIn(Long productId, int qty, String reason, String refType, Long refId,
                        Long adminId, String note) {
        if (qty <= 0) throw new BizException(ErrorCode.BAD_REQUEST, "qty > 0 байх ёстой");
        productMapper.increaseStock(productId, qty);
        insert(productId, qty, reason, refType, refId, adminId, note, null);
    }

    /** 출고(-): 판매. 조건부 차감으로 음수/과판매 방지(§1.8). */
    @Transactional
    public void stockOut(Long productId, int qty, String productName, String reason,
                         String refType, Long refId, Long adminId) {
        if (qty <= 0) throw new BizException(ErrorCode.BAD_REQUEST, "qty > 0 байх ёстой");
        int affected = productMapper.decreaseStock(productId, qty);
        if (affected == 0) {
            throw new BizException(ErrorCode.OUT_OF_STOCK,
                    (productName == null ? "Бараа" : productName) + " — нөөц хүрэлцэхгүй байна");
        }
        insert(productId, -qty, reason, refType, refId, adminId, null, null);
    }

    /** 특정 문서(refType/refId)의 출고 이동을 되돌림(+). 멱등. */
    @Transactional
    public void reverseRef(String refType, Long refId, Long adminId) {
        List<StockMovement> moves = smMapper.findByRef(refType, refId, "sale");
        for (StockMovement m : moves) {
            if (smMapper.existsReversal(m.getId())) continue;   // 멱등
            int restoreQty = -m.getQty();                       // -(-qty) = +qty
            productMapper.increaseStock(m.getProductId(), restoreQty);
            StockMovement r = new StockMovement();
            r.setProductId(m.getProductId());
            r.setQty(restoreQty);
            r.setReason("reversal");
            r.setRefType(refType);
            r.setRefId(refId);
            r.setReversalOf(m.getId());
            r.setCreatedBy(adminId);
            smMapper.insert(r);
        }
    }

    /** 수동 조정(절대값 설정). delta는 +/- 가능. */
    @Transactional
    public void adjustTo(Long productId, int currentStock, int setTo, Long adminId, String note) {
        int delta = setTo - currentStock;
        if (delta == 0) return;
        productMapper.setStock(productId, setTo);
        insert(productId, delta, "adjust", "manual", null, adminId, note, setTo);
    }

    /** 생산 등록 시 재고 입고(reversal 가능하도록 ref 연결). */
    @Transactional
    public void productionIn(Long productId, int qty, Long productionLogId, Long adminId) {
        stockIn(productId, qty, "production", "production_log", productionLogId, adminId, null);
    }

    /** 생산 기록 삭제 시 입고 되돌림(-). */
    @Transactional
    public void reverseProduction(Long productionLogId, Long adminId) {
        List<StockMovement> moves = smMapper.findByRef("production_log", productionLogId, "production");
        for (StockMovement m : moves) {
            if (smMapper.existsReversal(m.getId())) continue;
            int restoreQty = -m.getQty();   // 입고였으므로 -qty
            productMapper.increaseStock(m.getProductId(), restoreQty);
            StockMovement r = new StockMovement();
            r.setProductId(m.getProductId());
            r.setQty(restoreQty);
            r.setReason("reversal");
            r.setRefType("production_log");
            r.setRefId(productionLogId);
            r.setReversalOf(m.getId());
            r.setCreatedBy(adminId);
            smMapper.insert(r);
        }
    }

    private void insert(Long productId, int qty, String reason, String refType, Long refId,
                        Long adminId, String note, Integer balanceAfter) {
        StockMovement m = new StockMovement();
        m.setProductId(productId);
        m.setQty(qty);
        m.setReason(reason);
        m.setRefType(refType);
        m.setRefId(refId);
        m.setCreatedBy(adminId);
        m.setNote(note);
        m.setBalanceAfter(balanceAfter);
        smMapper.insert(m);
    }
}
