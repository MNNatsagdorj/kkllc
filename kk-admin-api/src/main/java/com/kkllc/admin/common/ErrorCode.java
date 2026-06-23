package com.kkllc.admin.common;

import org.springframework.http.HttpStatus;

public enum ErrorCode {
    BAD_REQUEST(HttpStatus.BAD_REQUEST, "Буруу хүсэлт"),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "Нэвтрэх шаардлагатай"),
    FORBIDDEN(HttpStatus.FORBIDDEN, "Хандах эрхгүй"),
    NOT_FOUND(HttpStatus.NOT_FOUND, "Олдсонгүй"),
    CONFLICT(HttpStatus.CONFLICT, "Зөрчилтэй"),
    OUT_OF_STOCK(HttpStatus.CONFLICT, "Нөөц хүрэлцэхгүй байна"),
    INVALID_TRANSITION(HttpStatus.CONFLICT, "Төлөв шилжилт буруу"),
    CATEGORY_IN_USE(HttpStatus.CONFLICT, "Ангилалд бараа холбогдсон байна"),
    INTERNAL(HttpStatus.INTERNAL_SERVER_ERROR, "Дотоод алдаа");

    public final HttpStatus status;
    public final String defaultMessage;

    ErrorCode(HttpStatus status, String defaultMessage) {
        this.status = status;
        this.defaultMessage = defaultMessage;
    }
}
