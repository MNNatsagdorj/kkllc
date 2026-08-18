package com.kkllc.admin.domain.customer;

import com.kkllc.admin.domain.order.SalesOrder;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CustomerMapper {
    List<Customer> findPage(@Param("q") String q, @Param("tier") String tier,
                            @Param("offset") int offset, @Param("size") int size);
    long countPage(@Param("q") String q, @Param("tier") String tier);
    Customer findById(@Param("id") Long id);
    Customer findByPhone(@Param("phone") String phone);
    List<SalesOrder> recentOrders(@Param("customerId") Long customerId, @Param("limit") int limit);
    int insert(Customer c);
    int update(Customer c);
    int deleteById(@Param("id") Long id);
}
