package com.kkllc.admin.domain.category;

import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class Category {
    private Long id;
    private String name;
    private String iconKey;
    private Integer sortOrder;
    private Boolean active;
    private Long productCount;   // 집계(목록 응답용)
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
