package com.kkllc.admin.domain.purchase;

import com.kkllc.admin.common.BizException;
import com.kkllc.admin.common.ErrorCode;
import com.kkllc.admin.common.PageResult;
import com.kkllc.admin.common.Pageable;
import com.kkllc.admin.domain.material.Material;
import com.kkllc.admin.domain.material.MaterialMapper;
import com.kkllc.admin.domain.supplier.Supplier;
import com.kkllc.admin.domain.supplier.SupplierMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class PurchaseService {

    private final PurchaseMapper mapper;
    private final MaterialMapper materialMapper;
    private final SupplierMapper supplierMapper;

    public PurchaseService(PurchaseMapper mapper, MaterialMapper materialMapper, SupplierMapper supplierMapper) {
        this.mapper = mapper;
        this.materialMapper = materialMapper;
        this.supplierMapper = supplierMapper;
    }

    @Transactional(readOnly = true)
    public PageResult<Purchase> page(String month, String payStatus, Integer page, Integer size) {
        int p = Pageable.page(page);
        int s = Pageable.size(size);
        var items = mapper.findPage(month, payStatus, Pageable.offset(p, s), s);
        long total = mapper.countPage(month, payStatus);
        return new PageResult<>(items, total, p, s);
    }

    @Transactional(readOnly = true)
    public PurchaseDto.Summary summary(String month) {
        return mapper.summary(month);
    }

    /** total = round(qty * unitPrice) — 서버 계산. 자재/공급처 이름 스냅샷. */
    @Transactional
    public Long create(PurchaseDto.CreateReq req) {
        Material material = materialMapper.findById(req.materialId());
        if (material == null) throw new BizException(ErrorCode.NOT_FOUND, "Түүхий эд олдсонгүй");

        Purchase p = new Purchase();
        p.setPurchaseDate(req.purchaseDate());
        p.setMaterialId(material.getId());
        p.setMaterialName(material.getName());
        p.setUnit(material.getUnit());
        p.setQty(req.qty());
        p.setUnitPrice(req.unitPrice());
        p.setTotal(req.qty().multiply(BigDecimal.valueOf(req.unitPrice()))
                .setScale(0, RoundingMode.HALF_UP).longValueExact());
        p.setPayStatus(req.payStatus() == null ? "paid" : req.payStatus());

        // 공급처: id 우선, 없으면 이름으로 upsert
        if (req.supplierId() != null) {
            Supplier sup = supplierMapper.findAll().stream()
                    .filter(x -> x.getId().equals(req.supplierId())).findFirst().orElse(null);
            if (sup != null) {
                p.setSupplierId(sup.getId());
                p.setSupplierName(sup.getName());
            }
        } else if (req.supplierName() != null && !req.supplierName().isBlank()) {
            Supplier existing = supplierMapper.findByName(req.supplierName());
            if (existing == null) {
                existing = new Supplier();
                existing.setName(req.supplierName());
                supplierMapper.insert(existing);
            }
            p.setSupplierId(existing.getId());
            p.setSupplierName(existing.getName());
        }

        mapper.insert(p);
        return p.getId();
    }

    @Transactional
    public void updatePayStatus(Long id, String payStatus) {
        if (mapper.updatePayStatus(id, payStatus) == 0) throw new BizException(ErrorCode.NOT_FOUND);
    }

    @Transactional
    public void delete(Long id) {
        if (mapper.deleteById(id) == 0) throw new BizException(ErrorCode.NOT_FOUND);
    }
}
