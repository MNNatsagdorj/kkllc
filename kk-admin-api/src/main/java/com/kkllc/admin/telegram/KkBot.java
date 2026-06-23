package com.kkllc.admin.telegram;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.longpolling.starter.SpringLongPollingBot;
import org.telegram.telegrambots.longpolling.util.LongPollingSingleThreadUpdateConsumer;
import org.telegram.telegrambots.meta.api.objects.CallbackQuery;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.message.Message;

/**
 * KKLLC Telegram 봇 (long polling). telegram.enabled=true 일 때만 등록.
 * 들어온 update를 고객 대화/관리자 회신으로 라우팅.
 */
@Slf4j
@Component
@ConditionalOnProperty(prefix = "telegram", name = "enabled", havingValue = "true")
public class KkBot implements SpringLongPollingBot {

    private final TelegramProperties props;
    private final TelegramMapper tgMapper;
    private final TelegramContext context;
    private final TelegramConversationService conversation;
    private final TelegramAdminService adminService;
    private final ObjectProvider<TelegramMessenger> messengerProvider;

    public KkBot(TelegramProperties props, TelegramMapper tgMapper, TelegramContext context,
                 TelegramConversationService conversation, TelegramAdminService adminService,
                 ObjectProvider<TelegramMessenger> messengerProvider) {
        this.props = props;
        this.tgMapper = tgMapper;
        this.context = context;
        this.conversation = conversation;
        this.adminService = adminService;
        this.messengerProvider = messengerProvider;
    }

    @Override
    public String getBotToken() {
        return props.getBotToken();
    }

    @Override
    public LongPollingSingleThreadUpdateConsumer getUpdatesConsumer() {
        return this::route;
    }

    private void route(Update update) {
        try {
            if (update.hasCallbackQuery()) {
                handleCallback(update.getCallbackQuery());
            } else if (update.hasMessage()) {
                handleMessage(update.getMessage());
            }
        } catch (Exception e) {
            log.error("Telegram update handling error", e);
        }
    }

    private void handleCallback(CallbackQuery cb) {
        Long chatId = cb.getMessage().getChatId();
        String data = cb.getData();
        TelegramMessenger m = messengerProvider.getIfAvailable();
        if (m != null) m.answerCallback(cb.getId());

        if (context.isAdmin(chatId) && data != null && data.startsWith("adm:")) {
            adminService.onCallback(chatId, data);
        } else {
            TelegramUser user = ensureUser(chatId, cb.getFrom() == null ? null : cb.getFrom().getUserName(),
                    cb.getFrom() == null ? null : cb.getFrom().getFirstName());
            conversation.onCallback(user, data);
        }
    }

    private void handleMessage(Message msg) {
        Long chatId = msg.getChatId();

        // 관리자 회신 대기 처리(추산금액 입력 등) 우선
        if (context.isAdmin(chatId) && msg.hasText()) {
            if (adminService.onText(chatId, msg.getText())) return;
        }

        if (msg.hasContact()) {
            TelegramUser user = ensureUser(chatId,
                    msg.getFrom() == null ? null : msg.getFrom().getUserName(),
                    msg.getFrom() == null ? null : msg.getFrom().getFirstName());
            conversation.onContact(user, msg.getContact().getPhoneNumber());
            return;
        }

        if (!msg.hasText()) return;
        String text = msg.getText().trim();
        TelegramUser user = ensureUser(chatId,
                msg.getFrom() == null ? null : msg.getFrom().getUserName(),
                msg.getFrom() == null ? null : msg.getFrom().getFirstName());

        if (text.startsWith("/start")) {
            conversation.start(user);
        } else if (text.startsWith("/menu")) {
            conversation.showMenu(chatId);
        } else {
            conversation.onText(user, text);
        }
    }

    /** telegram_user upsert 후 현재 상태 포함 행 반환. */
    private TelegramUser ensureUser(Long chatId, String username, String firstName) {
        TelegramUser u = new TelegramUser();
        u.setChatId(chatId);
        u.setUsername(username);
        u.setFirstName(firstName);
        u.setLang("mn");
        tgMapper.upsertUser(u);
        return tgMapper.findByChatId(chatId);
    }
}
