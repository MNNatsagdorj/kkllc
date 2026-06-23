package com.kkllc.admin;

import org.apache.ibatis.annotations.Mapper;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan(basePackages = "com.kkllc.admin", annotationClass = Mapper.class)
public class KkAdminApplication {
    public static void main(String[] args) {
        SpringApplication.run(KkAdminApplication.class, args);
    }
}
