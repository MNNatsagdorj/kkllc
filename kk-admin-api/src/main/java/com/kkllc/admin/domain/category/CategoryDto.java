package com.kkllc.admin.domain.category;

import jakarta.validation.constraints.NotBlank;

public class CategoryDto {
    public record SaveReq(
            @NotBlank String name,
            String iconKey,
            Integer sortOrder,
            Boolean active) {}
}
