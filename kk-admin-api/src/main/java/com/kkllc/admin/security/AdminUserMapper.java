package com.kkllc.admin.security;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Insert;

@Mapper
public interface AdminUserMapper {

    @Select("SELECT id, username, password_hash, display_name, role, active, created_at "
            + "FROM admin_user WHERE username = #{username}")
    AdminUser findByUsername(@Param("username") String username);

    @Select("SELECT COUNT(*) FROM admin_user")
    long count();

    @Insert("INSERT INTO admin_user (username, password_hash, display_name, role) "
            + "VALUES (#{username}, #{passwordHash}, #{displayName}, #{role})")
    int insert(AdminUser u);
}
