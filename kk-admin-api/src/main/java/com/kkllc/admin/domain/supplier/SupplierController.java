package com.kkllc.admin.domain.supplier;

import com.kkllc.admin.common.ApiResponse;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierMapper mapper;

    public SupplierController(SupplierMapper mapper) {
        this.mapper = mapper;
    }

    public record SaveReq(@NotBlank String name, String phone) {}

    @GetMapping
    public ApiResponse<List<Supplier>> list() {
        return ApiResponse.ok(mapper.findAll());
    }

    @PostMapping
    public ApiResponse<Map<String, Long>> create(@RequestBody SaveReq req) {
        Supplier s = new Supplier();
        s.setName(req.name());
        s.setPhone(req.phone());
        mapper.insert(s);
        return ApiResponse.ok(Map.of("id", s.getId()));
    }
}
