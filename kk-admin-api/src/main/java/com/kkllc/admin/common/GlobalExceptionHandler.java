package com.kkllc.admin.common;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BizException.class)
    public ResponseEntity<ApiResponse<Void>> handleBiz(BizException e) {
        return ResponseEntity.status(e.getCode().status)
                .body(ApiResponse.fail(new ApiError(e.getCode().name(), e.getMessage())));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException e) {
        String msg = e.getBindingResult().getFieldErrors().stream()
                .map(this::fieldMsg)
                .collect(Collectors.joining("; "));
        return ResponseEntity.status(ErrorCode.BAD_REQUEST.status)
                .body(ApiResponse.fail(new ApiError(ErrorCode.BAD_REQUEST.name(), msg)));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleOther(Exception e) {
        return ResponseEntity.status(ErrorCode.INTERNAL.status)
                .body(ApiResponse.fail(new ApiError(ErrorCode.INTERNAL.name(),
                        e.getMessage() == null ? ErrorCode.INTERNAL.defaultMessage : e.getMessage())));
    }

    private String fieldMsg(FieldError fe) {
        return fe.getField() + ": " + fe.getDefaultMessage();
    }
}
