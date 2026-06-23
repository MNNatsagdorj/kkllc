package com.kkllc.admin.domain.supplier;

import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class Supplier {
    private Long id;
    private String name;
    private String phone;
    private OffsetDateTime createdAt;
}
