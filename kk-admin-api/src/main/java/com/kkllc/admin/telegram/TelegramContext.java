package com.kkllc.admin.telegram;

import com.kkllc.admin.domain.setting.SettingService;
import org.springframework.stereotype.Component;

/** Telegram 관리자 chat id 해석 — DB 설정(app_setting) 우선, 없으면 프로퍼티. */
@Component
public class TelegramContext {

    private final SettingService settings;
    private final TelegramProperties props;

    public TelegramContext(SettingService settings, TelegramProperties props) {
        this.settings = settings;
        this.props = props;
    }

    public Long adminChatId() {
        String v = settings.get("telegram_admin_chat_id", props.getAdminChatId());
        if (v == null || v.isBlank()) return null;
        try { return Long.parseLong(v.trim()); } catch (NumberFormatException e) { return null; }
    }

    public boolean isAdmin(Long chatId) {
        Long admin = adminChatId();
        return admin != null && admin.equals(chatId);
    }
}
