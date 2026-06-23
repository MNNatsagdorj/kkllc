package com.kkllc.admin.telegram;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.telegram.telegrambots.client.okhttp.OkHttpTelegramClient;
import org.telegram.telegrambots.meta.generics.TelegramClient;

@Configuration
public class TelegramConfig {

    /** telegram.enabled=true 이고 토큰이 있을 때만 송신 클라이언트 등록. */
    @Bean
    @ConditionalOnProperty(prefix = "telegram", name = "enabled", havingValue = "true")
    public TelegramClient telegramClient(TelegramProperties props) {
        return new OkHttpTelegramClient(props.getBotToken());
    }
}
