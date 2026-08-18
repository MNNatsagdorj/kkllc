package com.kkllc.admin.domain.order;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface OrderMapper {
    List<SalesOrder> findPage(@Param("status") String status,
                              @Param("q") String q,
                              @Param("offset") int offset,
                              @Param("size") int size);
    long countPage(@Param("status") String status, @Param("q") String q);
    List<Map<String, Object>> statusCounts();
    SalesOrder findById(@Param("id") Long id);
    List<SalesOrderItem> findItems(@Param("orderId") Long orderId);

    String nextCode();

    int insert(SalesOrder o);
    int insertItems(@Param("items") List<SalesOrderItem> items);

    int updateStatus(@Param("id") Long id, @Param("status") String status);
    int markDelivered(@Param("id") Long id);
    int deleteById(@Param("id") Long id);
}
