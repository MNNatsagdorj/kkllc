package com.kkllc.admin.domain.quote;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class QuoteDto {

    /** 공개 문의 폼(스토어프론트·Telegram 공용). */
    public record CreateReq(
            @NotBlank String customerName,
            String phone,
            String productText,
            @NotBlank String message) {}

    public record AnswerReq(@NotNull Long estimate, String message) {}

    public record StatusReq(@NotBlank String status) {}
}
