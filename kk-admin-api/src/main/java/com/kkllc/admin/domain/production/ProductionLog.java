package com.kkllc.admin.domain.production;

import lombok.Data;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Data
public class ProductionLog {
    private Long id;
    private LocalDate prodDate;
    private Long productId;
    private String productName;
    private Integer qty;
    private String note;
    private OffsetDateTime createdAt;
}
