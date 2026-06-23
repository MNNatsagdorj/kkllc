package com.kkllc.admin.domain.stock;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface StockMovementMapper {
    int insert(StockMovement m);
    List<StockMovement> findByRef(@Param("refType") String refType,
                                  @Param("refId") Long refId,
                                  @Param("reason") String reason);
    boolean existsReversal(@Param("movementId") Long movementId);
    List<StockMovement> findByProduct(@Param("productId") Long productId,
                                      @Param("limit") int limit);
}
