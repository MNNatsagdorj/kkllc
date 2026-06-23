package com.kkllc.admin.domain.production;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.util.List;

public class ProductionDto {

    public record CreateReq(
            @NotNull LocalDate prodDate,
            @NotNull Long productId,
            @Positive Integer qty,          // 기본 44는 서버에서 적용
            String note) {}

    public record DayTotal(LocalDate date, Long total) {}

    public record MonthView(long monthTotal, List<DayTotal> days) {}
}
