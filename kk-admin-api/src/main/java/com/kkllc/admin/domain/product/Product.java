package com.kkllc.admin.domain.product;

import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class Product {
    private Long id;
    private String sku;
    private String name;
    private String brand;
    private Long categoryId;
    private String categoryName;   // join
    private Long price;
    private String pack;
    private Integer stock;
    private String status;         // active|low|out (트리거 동기화)
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
