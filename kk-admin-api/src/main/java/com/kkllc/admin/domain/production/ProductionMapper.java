package com.kkllc.admin.domain.production;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface ProductionMapper {
    List<ProductionDto.DayTotal> monthDays(@Param("year") int year, @Param("month") int month);
    Long monthTotal(@Param("year") int year, @Param("month") int month);
    List<ProductionLog> findByDate(@Param("date") LocalDate date);
    ProductionLog findById(@Param("id") Long id);
    int insert(ProductionLog log);
    int deleteById(@Param("id") Long id);
}
