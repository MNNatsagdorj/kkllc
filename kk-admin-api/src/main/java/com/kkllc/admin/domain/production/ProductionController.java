package com.kkllc.admin.domain.production;

import com.kkllc.admin.common.ApiResponse;
import com.kkllc.admin.security.CurrentUser;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/production")
public class ProductionController {

    private final ProductionService service;

    public ProductionController(ProductionService service) {
        this.service = service;
    }

    /** ?year=&month= → 월간 캘린더, ?date=YYYY-MM-DD → 특정일 항목. */
    @GetMapping
    public ApiResponse<?> query(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (date != null) {
            List<ProductionLog> items = service.byDate(date);
            return ApiResponse.ok(items);
        }
        LocalDate now = LocalDate.now();
        int y = year == null ? now.getYear() : year;
        int m = month == null ? now.getMonthValue() : month;
        return ApiResponse.ok(service.month(y, m));
    }

    @PostMapping
    public ApiResponse<Map<String, Long>> create(@Valid @RequestBody ProductionDto.CreateReq req) {
        return ApiResponse.ok(Map.of("id", service.create(req, CurrentUser.id())));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        service.delete(id, CurrentUser.id());
        return ApiResponse.ok();
    }
}
