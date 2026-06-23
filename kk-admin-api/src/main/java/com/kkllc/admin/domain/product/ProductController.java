package com.kkllc.admin.domain.product;

import com.kkllc.admin.common.ApiResponse;
import com.kkllc.admin.common.PageResult;
import com.kkllc.admin.security.CurrentUser;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<PageResult<Product>> list(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        return ApiResponse.ok(service.page(categoryId, q, page, size));
    }

    @GetMapping("/{id}")
    public ApiResponse<Product> get(@PathVariable Long id) {
        return ApiResponse.ok(service.get(id));
    }

    @PostMapping
    public ApiResponse<Map<String, Long>> create(@Valid @RequestBody ProductDto.SaveReq req) {
        return ApiResponse.ok(Map.of("id", service.create(req)));
    }

    @PutMapping("/{id}")
    public ApiResponse<Void> update(@PathVariable Long id, @Valid @RequestBody ProductDto.SaveReq req) {
        service.update(id, req);
        return ApiResponse.ok();
    }

    @PatchMapping("/{id}/stock")
    public ApiResponse<Void> adjustStock(@PathVariable Long id,
                                         @RequestBody ProductDto.StockAdjustReq req) {
        service.adjustStock(id, req, CurrentUser.id());
        return ApiResponse.ok();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ApiResponse.ok();
    }
}
