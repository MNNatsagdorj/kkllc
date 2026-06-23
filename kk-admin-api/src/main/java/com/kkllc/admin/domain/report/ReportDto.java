package com.kkllc.admin.domain.report;

public class ReportDto {
    public record MonthAmount(String month, Long amount) {}
    public record RevCost(String month, Long revenue, Long cost) {}
    public record NameAmount(String name, Long amount) {}
    public record TopProduct(Long productId, String productName, Long sold) {}
    public record ProfitRow(Long revenue, Long cost, Long grossProfit, Integer margin, Integer costRatio) {}
}
