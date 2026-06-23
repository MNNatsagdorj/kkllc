package com.kkllc.admin.domain.category;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CategoryMapper {
    List<Category> findAll();
    Category findById(@Param("id") Long id);
    int insert(Category c);
    int update(Category c);
    int deleteById(@Param("id") Long id);
    long countProducts(@Param("id") Long id);
}
