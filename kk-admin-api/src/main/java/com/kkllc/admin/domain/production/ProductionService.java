package com.kkllc.admin.domain.production;

import com.kkllc.admin.common.BizException;
import com.kkllc.admin.common.ErrorCode;
import com.kkllc.admin.domain.product.Product;
import com.kkllc.admin.domain.product.ProductMapper;
import com.kkllc.admin.domain.stock.StockService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class ProductionService {

    private static final int DEFAULT_BATCH_QTY = 44;  // 절물 1배치 표준 산출량

    private final ProductionMapper mapper;
    private final ProductMapper productMapper;
    private final StockService stockService;

    public ProductionService(ProductionMapper mapper, ProductMapper productMapper, StockService stockService) {
        this.mapper = mapper;
        this.productMapper = productMapper;
        this.stockService = stockService;
    }

    @Transactional(readOnly = true)
    public ProductionDto.MonthView month(int year, int month) {
        Long total = mapper.monthTotal(year, month);
        return new ProductionDto.MonthView(total == null ? 0 : total, mapper.monthDays(year, month));
    }

    @Transactional(readOnly = true)
    public List<ProductionLog> byDate(LocalDate date) {
        return mapper.findByDate(date);
    }

    @Transactional
    public Long create(ProductionDto.CreateReq req, Long adminId) {
        Product prod = productMapper.findById(req.productId());
        if (prod == null) throw new BizException(ErrorCode.NOT_FOUND, "Бараа олдсонгүй");
        int qty = req.qty() == null ? DEFAULT_BATCH_QTY : req.qty();

        ProductionLog log = new ProductionLog();
        log.setProdDate(req.prodDate());
        log.setProductId(prod.getId());
        log.setProductName(prod.getName());
        log.setQty(qty);
        log.setNote(req.note());
        mapper.insert(log);

        // 생산 → 재고 입고(+)
        stockService.productionIn(prod.getId(), qty, log.getId(), adminId);
        return log.getId();
    }

    @Transactional
    public void delete(Long id, Long adminId) {
        ProductionLog log = mapper.findById(id);
        if (log == null) throw new BizException(ErrorCode.NOT_FOUND);
        stockService.reverseProduction(id, adminId);   // 입고 되돌림(-)
        mapper.deleteById(id);
    }
}
