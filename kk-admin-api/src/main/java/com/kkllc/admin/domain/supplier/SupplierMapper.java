package com.kkllc.admin.domain.supplier;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SupplierMapper {
    List<Supplier> findAll();
    int insert(Supplier s);
    Supplier findByName(@Param("name") String name);
}
