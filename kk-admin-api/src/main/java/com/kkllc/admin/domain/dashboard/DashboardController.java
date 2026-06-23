package com.kkllc.admin.domain.dashboard;

import com.kkllc.admin.common.ApiResponse;
import com.kkllc.admin.domain.order.SalesOrder;
import com.kkllc.admin.domain.product.Product;
import com.kkllc.admin.domain.report.ReportDto;
import com.kkllc.admin.domain.report.ReportMapper;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardMapper mapper;
    private final ReportMapper reportMapper;

    public DashboardController(DashboardMapper mapper, ReportMapper reportMapper) {
        this.mapper = mapper;
        this.reportMapper = reportMapper;
    }

    @GetMapping("/summary")
    public ApiResponse<DashboardDto.Summary> summary() {
        return ApiResponse.ok(mapper.summary());
    }

    @GetMapping("/sales-chart")
    public ApiResponse<List<DashboardDto.ChartPoint>> salesChart(
            @RequestParam(defaultValue = "7d") String range) {
        int days = "30d".equals(range) ? 30 : 7;
        return ApiResponse.ok(mapper.salesChart(days));
    }

    @GetMapping("/category-share")
    public ApiResponse<List<ReportDto.NameAmount>> categoryShare() {
        return ApiResponse.ok(reportMapper.categoryShare());
    }

    @GetMapping("/recent-orders")
    public ApiResponse<List<SalesOrder>> recentOrders(@RequestParam(defaultValue = "5") int limit) {
        return ApiResponse.ok(mapper.recentOrders(limit));
    }

    @GetMapping("/low-stock")
    public ApiResponse<List<Product>> lowStock(@RequestParam(defaultValue = "4") int limit) {
        return ApiResponse.ok(mapper.lowStock(limit));
    }
}
