package com.kkllc.admin.domain.customer;

import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class Customer {
    private Long id;
    private String name;
    private String phone;
    private String tier;          // new|reg|vip
    private String type;          // company|business|individual
    private String address;       // 주소/위치 설명
    private Double lat;           // 지도 핀 좌표
    private Double lng;
    private String email;
    private String note;
    private Long ordersCount;     // 집계(v_customer_stats)
    private Long totalSpent;      // 집계
    private OffsetDateTime createdAt;
}
