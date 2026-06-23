package com.kkllc.admin.domain.setting;

import com.kkllc.admin.common.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/settings")
public class SettingController {

    private final SettingService service;

    public SettingController(SettingService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<Map<String, String>> get() {
        return ApiResponse.ok(service.getAll());
    }

    @PutMapping
    public ApiResponse<Void> save(@RequestBody Map<String, String> body) {
        service.setAll(body);
        return ApiResponse.ok();
    }
}
