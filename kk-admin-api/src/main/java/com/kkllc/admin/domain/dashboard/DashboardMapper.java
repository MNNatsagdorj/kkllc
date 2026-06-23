package com.kkllc.admin.domain.dashboard;

import com.kkllc.admin.domain.order.SalesOrder;
import com.kkllc.admin.domain.product.Product;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface DashboardMapper {
    DashboardDto.Summary summary();
    List<DashboardDto.ChartPoint> salesChart(@Param("days") int days);
    List<SalesOrder> recentOrders(@Param("limit") int limit);
    List<Product> lowStock(@Param("limit") int limit);
}
