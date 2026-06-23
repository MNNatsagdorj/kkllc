package com.kkllc.admin.domain.order;

import com.kkllc.admin.common.ApiResponse;
import com.kkllc.admin.common.PageResult;
import com.kkllc.admin.security.CurrentUser;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<PageResult<SalesOrder>> list(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        return ApiResponse.ok(service.page(status, page, size));
    }

    @GetMapping("/{id}")
    public ApiResponse<SalesOrder> get(@PathVariable Long id) {
        return ApiResponse.ok(service.get(id));
    }

    @PostMapping
    public ApiResponse<Map<String, Long>> create(@Valid @RequestBody OrderDto.CreateReq req) {
        return ApiResponse.ok(Map.of("id", service.create(req, "admin", null)));
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<Void> changeStatus(@PathVariable Long id, @Valid @RequestBody OrderDto.StatusReq req) {
        service.changeStatus(id, req.status(), CurrentUser.id());
        return ApiResponse.ok();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ApiResponse.ok();
    }
}
