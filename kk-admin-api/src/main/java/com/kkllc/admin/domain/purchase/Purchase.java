package com.kkllc.admin.domain.purchase;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Data
public class Purchase {
    private Long id;
    private LocalDate purchaseDate;
    private Long materialId;
    private String materialName;
    private Long supplierId;
    private String supplierName;
    private BigDecimal qty;
    private String unit;
    private Long unitPrice;
    private Long total;
    private String payStatus;     // paid|pending
    private OffsetDateTime createdAt;
}
