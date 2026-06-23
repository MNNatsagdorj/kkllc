package com.kkllc.admin.domain.quote;

import com.kkllc.admin.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/** 공개(비인증) 문의 적재 — 고객 스토어프론트 폼이 여기로 POST. */
@RestController
@RequestMapping("/api/public/quotes")
public class PublicQuoteController {

    private final QuoteService service;

    public PublicQuoteController(QuoteService service) {
        this.service = service;
    }

    @PostMapping
    public ApiResponse<Map<String, Long>> submit(@Valid @RequestBody QuoteDto.CreateReq req) {
        return ApiResponse.ok(Map.of("id", service.create(req, "web", null)));
    }
}
