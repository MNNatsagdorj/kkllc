package com.kkllc.admin.domain.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.util.List;

public class OrderDto {

    public record ItemReq(@NotNull Long productId, @NotNull @Positive Integer qty) {}

    public record CreateReq(
            @NotBlank String customerName,
            String phone,
            Long customerId,
            @NotEmpty @Valid List<ItemReq> items,
            LocalDate orderedAt,
            String note) {}

    public record StatusReq(@NotBlank String status) {}
}
