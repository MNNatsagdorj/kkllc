package com.kkllc.admin.domain.purchase;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PurchaseDto {

    public record CreateReq(
            @NotNull LocalDate purchaseDate,
            @NotNull Long materialId,
            Long supplierId,
            String supplierName,
            @NotNull @Positive BigDecimal qty,
            @NotNull @PositiveOrZero Long unitPrice,
            String payStatus) {}

    public record PayStatusReq(@NotNull String payStatus) {}

    public record Summary(long monthTotal, long cnt, long unpaid, long avg) {}
}
