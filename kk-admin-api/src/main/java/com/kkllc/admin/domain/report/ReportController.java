package com.kkllc.admin.domain.report;

import com.kkllc.admin.common.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportMapper mapper;

    public ReportController(ReportMapper mapper) {
        this.mapper = mapper;
    }

    private String month(String month) {
        return month != null && !month.isBlank()
                ? month : LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));
    }

    @GetMapping("/sales")
    public ApiResponse<List<ReportDto.MonthAmount>> sales(@RequestParam(defaultValue = "6") int months) {
        return ApiResponse.ok(mapper.salesMonthly(months));
    }

    @GetMapping("/top-products")
    public ApiResponse<List<ReportDto.TopProduct>> topProducts(@RequestParam(defaultValue = "5") int limit) {
        return ApiResponse.ok(mapper.topProducts(limit));
    }

    @GetMapping("/category-share")
    public ApiResponse<List<ReportDto.NameAmount>> categoryShare() {
        return ApiResponse.ok(mapper.categoryShare());
    }

    @GetMapping("/purchase")
    public ApiResponse<ReportDto.ProfitRow> purchase(@RequestParam(required = false) String month) {
        return ApiResponse.ok(mapper.profit(month(month)));
    }

    @GetMapping("/revenue-vs-cost")
    public ApiResponse<List<ReportDto.RevCost>> revenueVsCost(@RequestParam(defaultValue = "6") int months) {
        return ApiResponse.ok(mapper.revenueVsCost(months));
    }

    @GetMapping("/spend-by-supplier")
    public ApiResponse<List<ReportDto.NameAmount>> spendBySupplier(@RequestParam(required = false) String month) {
        return ApiResponse.ok(mapper.spendBySupplier(month(month)));
    }

    @GetMapping("/spend-by-material")
    public ApiResponse<List<ReportDto.NameAmount>> spendByMaterial(@RequestParam(required = false) String month) {
        return ApiResponse.ok(mapper.spendByMaterial(month(month)));
    }
}
