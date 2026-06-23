package com.kkllc.admin.domain.customer;

import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class Customer {
    private Long id;
    private String name;
    private String phone;
    private String tier;          // new|reg|vip
    private Long ordersCount;     // 집계(v_customer_stats)
    private Long totalSpent;      // 집계
    private OffsetDateTime createdAt;
}
