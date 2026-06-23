package com.kkllc.admin.domain.report;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ReportMapper {
    List<ReportDto.MonthAmount> salesMonthly(@Param("months") int months);
    List<ReportDto.TopProduct> topProducts(@Param("limit") int limit);
    List<ReportDto.NameAmount> categoryShare();
    ReportDto.ProfitRow profit(@Param("month") String month);
    List<ReportDto.RevCost> revenueVsCost(@Param("months") int months);
    List<ReportDto.NameAmount> spendBySupplier(@Param("month") String month);
    List<ReportDto.NameAmount> spendByMaterial(@Param("month") String month);
}
