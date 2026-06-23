package com.kkllc.admin.domain.quote;

import com.kkllc.admin.common.ApiResponse;
import com.kkllc.admin.common.PageResult;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/quotes")
public class QuoteController {

    private final QuoteService service;

    public QuoteController(QuoteService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<PageResult<Quote>> list(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        return ApiResponse.ok(service.page(status, page, size));
    }

    @GetMapping("/unread-count")
    public ApiResponse<Map<String, Long>> unread() {
        return ApiResponse.ok(Map.of("count", service.unreadCount()));
    }

    @GetMapping("/{id}")
    public ApiResponse<Quote> get(@PathVariable Long id) {
        return ApiResponse.ok(service.get(id));
    }

    @PostMapping("/{id}/answer")
    public ApiResponse<Quote> answer(@PathVariable Long id, @Valid @RequestBody QuoteDto.AnswerReq req) {
        return ApiResponse.ok(service.answer(id, req.estimate()));
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<Void> status(@PathVariable Long id, @Valid @RequestBody QuoteDto.StatusReq req) {
        service.changeStatus(id, req.status());
        return ApiResponse.ok();
    }
}
