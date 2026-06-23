package com.kkllc.admin.domain.stock;

import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class StockMovement {
    private Long id;
    private Long productId;
    private Integer qty;          // +입고 / -출고
    private String reason;        // production|sale|purchase_in|adjust|reversal|initial
    private String refType;       // production_log|sales_order|...
    private Long refId;
    private Long reversalOf;
    private Integer balanceAfter;
    private String note;
    private Long createdBy;
    private OffsetDateTime createdAt;
}
