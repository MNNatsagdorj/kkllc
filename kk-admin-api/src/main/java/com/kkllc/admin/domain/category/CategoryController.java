package com.kkllc.admin.domain.category;

import com.kkllc.admin.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService service;

    public CategoryController(CategoryService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<List<Category>> list() {
        return ApiResponse.ok(service.list());
    }

    @PostMapping
    public ApiResponse<Map<String, Long>> create(@Valid @RequestBody CategoryDto.SaveReq req) {
        return ApiResponse.ok(Map.of("id", service.create(req)));
    }

    @PutMapping("/{id}")
    public ApiResponse<Void> update(@PathVariable Long id, @Valid @RequestBody CategoryDto.SaveReq req) {
        service.update(id, req);
        return ApiResponse.ok();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ApiResponse.ok();
    }
}
