package com.kkllc.admin.telegram;

import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class TelegramUser {
    private Long id;
    private Long chatId;
    private String username;
    private String firstName;
    private String phone;
    private Long customerId;
    private String lang;
    private String state;        // null=메뉴, Q_PRODUCT|Q_MESSAGE|O_QTY ...
    private String stateData;    // JSONB(텍스트로 매핑)
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
