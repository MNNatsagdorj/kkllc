package com.kkllc.admin.domain.setting;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SettingMapper {
    List<Setting> findAll();
    String findValue(@Param("key") String key);
    int upsert(@Param("key") String key, @Param("value") String value);
}
