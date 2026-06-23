package com.kkllc.admin.domain.purchase;

import com.kkllc.admin.common.ApiResponse;
import com.kkllc.admin.common.PageResult;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/purchases")
public class PurchaseController {

    private final PurchaseService service;

    public PurchaseController(PurchaseService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<PageResult<Purchase>> list(
            @RequestParam(required = false) String month,
            @RequestParam(required = false) String payStatus,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        return ApiResponse.ok(service.page(month, payStatus, page, size));
    }

    @GetMapping("/summary")
    public ApiResponse<PurchaseDto.Summary> summary(@RequestParam String month) {
        return ApiResponse.ok(service.summary(month));
    }

    @PostMapping
    public ApiResponse<Map<String, Long>> create(@Valid @RequestBody PurchaseDto.CreateReq req) {
        return ApiResponse.ok(Map.of("id", service.create(req)));
    }

    @PatchMapping("/{id}/pay-status")
    public ApiResponse<Void> updatePayStatus(@PathVariable Long id,
                                             @Valid @RequestBody PurchaseDto.PayStatusReq req) {
        service.updatePayStatus(id, req.payStatus());
        return ApiResponse.ok();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ApiResponse.ok();
    }
}
