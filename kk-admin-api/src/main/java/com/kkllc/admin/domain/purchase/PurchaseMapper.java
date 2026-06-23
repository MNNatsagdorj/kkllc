package com.kkllc.admin.domain.purchase;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PurchaseMapper {
    List<Purchase> findPage(@Param("month") String month,
                            @Param("payStatus") String payStatus,
                            @Param("offset") int offset,
                            @Param("size") int size);
    long countPage(@Param("month") String month, @Param("payStatus") String payStatus);
    Purchase findById(@Param("id") Long id);
    int insert(Purchase p);
    int updatePayStatus(@Param("id") Long id, @Param("payStatus") String payStatus);
    int deleteById(@Param("id") Long id);

    PurchaseDto.Summary summary(@Param("month") String month);
}
