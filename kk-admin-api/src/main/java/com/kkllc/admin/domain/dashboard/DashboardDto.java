package com.kkllc.admin.domain.dashboard;

public class DashboardDto {
    public record Summary(
            Long monthRevenue,
            Double revenueDeltaPct,
            Long ordersCount,
            Double ordersDeltaPct,
            Long newCustomers,
            Long avgOrder) {}

    public record ChartPoint(String label, Long amount) {}
}
