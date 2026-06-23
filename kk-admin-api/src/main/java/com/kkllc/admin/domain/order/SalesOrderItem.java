package com.kkllc.admin.domain.order;

import lombok.Data;

@Data
public class SalesOrderItem {
    private Long id;
    private Long orderId;
    private Long productId;
    private String productName;
    private Long unitPrice;
    private Integer qty;
    private Long lineTotal;
}
