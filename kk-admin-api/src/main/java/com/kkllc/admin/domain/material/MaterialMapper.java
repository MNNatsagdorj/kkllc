package com.kkllc.admin.domain.material;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MaterialMapper {
    List<Material> findAll(@Param("activeOnly") boolean activeOnly);
    Material findById(@Param("id") Long id);
    int insert(Material m);
    int update(Material m);
}
