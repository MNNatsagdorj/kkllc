package com.kkllc.admin.domain.product;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public class ProductDto {
    public record SaveReq(
            String sku,                         // 비우면 서버 자동 채번
            @NotBlank String name,
            String brand,
            @NotNull Long categoryId,
            @NotNull @PositiveOrZero Long price,
            String pack,
            @PositiveOrZero Integer stock) {}

    /** 재고 조정(adjust): delta(+/-) 또는 절대값(setTo) 중 하나. */
    public record StockAdjustReq(Integer delta, Integer setTo, String note) {}
}
