package com.kkllc.admin.domain.order;

import lombok.Data;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

@Data
public class SalesOrder {
    private Long id;
    private String code;
    private Long customerId;
    private String customerName;
    private String phone;
    private Long total;
    private String status;          // pending|shipping|delivered|canceled
    private LocalDate orderedAt;
    private LocalDate deliveredAt;
    private String note;
    private String source;          // admin|web|telegram
    private Long tgChatId;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    private String itemsSummary;    // 목록 표시용 대표 품목 문자열
    private List<SalesOrderItem> items;
}
