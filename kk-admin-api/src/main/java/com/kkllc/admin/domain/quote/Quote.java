package com.kkllc.admin.domain.quote;

import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class Quote {
    private Long id;
    private String customerName;
    private String phone;
    private String productText;
    private String message;
    private Long estimate;
    private String status;        // new|answered|closed
    private Boolean isRead;
    private String source;        // web|telegram|admin
    private Long tgChatId;
    private OffsetDateTime receivedAt;
}
