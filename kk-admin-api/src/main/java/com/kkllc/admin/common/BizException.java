package com.kkllc.admin.common;

import lombok.Getter;

@Getter
public class BizException extends RuntimeException {
    private final ErrorCode code;

    public BizException(ErrorCode code) {
        super(code.defaultMessage);
        this.code = code;
    }

    public BizException(ErrorCode code, String message) {
        super(message);
        this.code = code;
    }
}
