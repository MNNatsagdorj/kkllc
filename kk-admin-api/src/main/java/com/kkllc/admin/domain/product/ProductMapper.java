package com.kkllc.admin.domain.product;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ProductMapper {
    List<Product> findPage(@Param("categoryId") Long categoryId,
                           @Param("q") String q,
                           @Param("offset") int offset,
                           @Param("size") int size);
    long countPage(@Param("categoryId") Long categoryId, @Param("q") String q);
    Product findById(@Param("id") Long id);
    int insert(Product p);
    int update(Product p);
    int deleteById(@Param("id") Long id);

    String findMaxSku();

    /** 조건부 차감 — affected rows = 0 이면 재고부족(음수 방지 가드). */
    int decreaseStock(@Param("id") Long id, @Param("qty") int qty);
    /** 증가(되돌림/생산/조정+). */
    int increaseStock(@Param("id") Long id, @Param("qty") int qty);
    /** 절대값 설정(실사 보정). */
    int setStock(@Param("id") Long id, @Param("stock") int stock);
}
