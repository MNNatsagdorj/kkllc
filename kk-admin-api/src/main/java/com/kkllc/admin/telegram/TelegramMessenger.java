package com.kkllc.admin.telegram;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.meta.api.methods.AnswerCallbackQuery;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.InlineKeyboardMarkup;
import org.telegram.telegrambots.meta.generics.TelegramClient;

/** Telegram 송신 래퍼 — telegram_outbox에 기록. enabled 일 때만 빈 생성. */
@Slf4j
@Component
@ConditionalOnBean(TelegramClient.class)
public class TelegramMessenger {

    private final TelegramClient client;
    private final TelegramMapper mapper;

    public TelegramMessenger(TelegramClient client, TelegramMapper mapper) {
        this.client = client;
        this.mapper = mapper;
    }

    public void send(Long chatId, String text) {
        send(chatId, text, null, "message");
    }

    public void send(Long chatId, String text, InlineKeyboardMarkup keyboard) {
        send(chatId, text, keyboard, "message");
    }

    public void send(Long chatId, String text, InlineKeyboardMarkup keyboard, String kind) {
        boolean ok = false;
        try {
            SendMessage.SendMessageBuilder<?, ?> b = SendMessage.builder()
                    .chatId(chatId.toString())
                    .text(text)
                    .parseMode("HTML");
            if (keyboard != null) b.replyMarkup(keyboard);
            client.execute(b.build());
            ok = true;
        } catch (Exception e) {
            log.warn("Telegram send failed chatId={}: {}", chatId, e.getMessage());
        }
        try {
            mapper.insertOutbox(chatId, kind, text, ok);
        } catch (Exception ignored) {
            // 로깅 실패는 무시
        }
    }

    /** 콜백 버튼 클릭 ack(로딩 스피너 종료). */
    public void answerCallback(String callbackId) {
        try {
            client.execute(AnswerCallbackQuery.builder().callbackQueryId(callbackId).build());
        } catch (Exception e) {
            log.debug("answerCallback failed: {}", e.getMessage());
        }
    }
}
