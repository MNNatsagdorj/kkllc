package com.kkllc.admin.common;

/** 페이지네이션 헬퍼 — page/size 정규화 및 offset 계산. */
public final class Pageable {
    private Pageable() {}

    public static int page(Integer page) {
        return page == null || page < 0 ? 0 : page;
    }

    public static int size(Integer size) {
        if (size == null || size <= 0) return 20;
        return Math.min(size, 200);
    }

    public static int offset(int page, int size) {
        return page * size;
    }
}
