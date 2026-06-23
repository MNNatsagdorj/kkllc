package com.kkllc.admin.domain.material;

import com.kkllc.admin.common.ApiResponse;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/materials")
public class MaterialController {

    private final MaterialMapper mapper;

    public MaterialController(MaterialMapper mapper) {
        this.mapper = mapper;
    }

    public record SaveReq(@NotBlank String name, String unit, @NotNull Long defaultPrice, Boolean active) {}

    @GetMapping
    public ApiResponse<List<Material>> list(
            @RequestParam(name = "activeOnly", defaultValue = "true") boolean activeOnly) {
        return ApiResponse.ok(mapper.findAll(activeOnly));
    }

    @PostMapping
    public ApiResponse<Map<String, Long>> create(@RequestBody SaveReq req) {
        Material m = new Material();
        m.setName(req.name());
        m.setUnit(req.unit() == null ? "кг" : req.unit());
        m.setDefaultPrice(req.defaultPrice());
        m.setActive(req.active() == null ? Boolean.TRUE : req.active());
        mapper.insert(m);
        return ApiResponse.ok(Map.of("id", m.getId()));
    }
}
