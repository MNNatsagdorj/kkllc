package com.kkllc.admin.domain.product;

import com.kkllc.admin.common.BizException;
import com.kkllc.admin.common.ErrorCode;
import com.kkllc.admin.common.PageResult;
import com.kkllc.admin.common.Pageable;
import com.kkllc.admin.domain.stock.StockService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {

    private final ProductMapper mapper;
    private final StockService stockService;

    public ProductService(ProductMapper mapper, StockService stockService) {
        this.mapper = mapper;
        this.stockService = stockService;
    }

    @Transactional(readOnly = true)
    public PageResult<Product> page(Long categoryId, String q, Integer page, Integer size) {
        int p = Pageable.page(page);
        int s = Pageable.size(size);
        var items = mapper.findPage(categoryId, q, Pageable.offset(p, s), s);
        long total = mapper.countPage(categoryId, q);
        return new PageResult<>(items, total, p, s);
    }

    @Transactional(readOnly = true)
    public Product get(Long id) {
        Product p = mapper.findById(id);
        if (p == null) throw new BizException(ErrorCode.NOT_FOUND);
        return p;
    }

    @Transactional
    public Long create(ProductDto.SaveReq req) {
        Product p = new Product();
        p.setSku(req.sku() == null || req.sku().isBlank() ? nextSku() : req.sku());
        p.setName(req.name());
        p.setBrand(req.brand());
        p.setCategoryId(req.categoryId());
        p.setPrice(req.price());
        p.setPack(req.pack());
        p.setStock(req.stock() == null ? 0 : req.stock());
        mapper.insert(p);    // status는 트리거가 stock에서 동기화
        return p.getId();
    }

    @Transactional
    public void update(Long id, ProductDto.SaveReq req) {
        Product p = get(id);
        p.setName(req.name());
        p.setBrand(req.brand());
        p.setCategoryId(req.categoryId());
        p.setPrice(req.price());
        p.setPack(req.pack());
        if (req.sku() != null && !req.sku().isBlank()) p.setSku(req.sku());
        mapper.update(p);    // stock은 update에서 건드리지 않음(재고 조정 API 사용)
    }

    /** 재고 조정 — delta 또는 setTo. 원장 기록. */
    @Transactional
    public void adjustStock(Long id, ProductDto.StockAdjustReq req, Long adminId) {
        Product p = get(id);
        if (req.setTo() != null) {
            stockService.adjustTo(id, p.getStock(), req.setTo(), adminId, req.note());
        } else if (req.delta() != null && req.delta() != 0) {
            if (req.delta() > 0) {
                stockService.stockIn(id, req.delta(), "adjust", "manual", null, adminId, req.note());
            } else {
                // 조정 감소는 음수 허용(실사·파손) — 직접 increase로 음수 가능
                stockService.adjustTo(id, p.getStock(), p.getStock() + req.delta(), adminId, req.note());
            }
        } else {
            throw new BizException(ErrorCode.BAD_REQUEST, "delta эсвэл setTo шаардлагатай");
        }
    }

    @Transactional
    public void delete(Long id) {
        get(id);
        mapper.deleteById(id);
    }

    private String nextSku() {
        String max = mapper.findMaxSku();   // e.g. SKU-1009
        int next = 1001;
        if (max != null && max.startsWith("SKU-")) {
            try { next = Integer.parseInt(max.substring(4)) + 1; } catch (NumberFormatException ignored) {}
        }
        return "SKU-" + next;
    }
}
