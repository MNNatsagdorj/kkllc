package com.kkllc.admin.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/** SecurityContext에서 현재 관리자 정보를 꺼내는 헬퍼. */
public final class CurrentUser {
    private CurrentUser() {}

    public static AdminPrincipal get() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof AdminPrincipal p) {
            return p;
        }
        return null;
    }

    public static Long id() {
        AdminPrincipal p = get();
        return p == null ? null : p.id();
    }

    public static String username() {
        AdminPrincipal p = get();
        return p == null ? null : p.username();
    }
}
