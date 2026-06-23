package com.kkllc.admin.security;

import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class AdminUser {
    private Long id;
    private String username;
    private String passwordHash;
    private String displayName;
    private String role;
    private boolean active;
    private OffsetDateTime createdAt;
}
