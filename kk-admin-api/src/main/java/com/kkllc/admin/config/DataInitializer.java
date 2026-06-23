package com.kkllc.admin.config;

import com.kkllc.admin.security.AdminUser;
import com.kkllc.admin.security.AdminUserMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/** 기본 관리자 계정 시드 (admin / admin1234). 운영에서는 즉시 비밀번호 변경 권장. */
@Slf4j
@Component
public class DataInitializer implements CommandLineRunner {

    private final AdminUserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(AdminUserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userMapper.count() == 0) {
            AdminUser u = new AdminUser();
            u.setUsername("admin");
            u.setPasswordHash(passwordEncoder.encode("admin1234"));
            u.setDisplayName("Администратор");
            u.setRole("ADMIN");
            userMapper.insert(u);
            log.warn("Default admin created: admin / admin1234 — нууц үгээ солино уу!");
        }
    }
}
