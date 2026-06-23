package com.kkllc.admin.telegram;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "telegram")
public class TelegramProperties {
    private boolean enabled = false;
    private String botToken = "";
    private String botUsername = "";
    private String adminChatId = "";
}
