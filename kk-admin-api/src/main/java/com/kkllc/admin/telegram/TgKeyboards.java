package com.kkllc.admin.telegram;

import org.telegram.telegrambots.meta.api.objects.replykeyboard.InlineKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.InlineKeyboardButton;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.InlineKeyboardRow;

import java.util.ArrayList;
import java.util.List;

/** 인라인 키보드 빌더 헬퍼. */
public final class TgKeyboards {
    private TgKeyboards() {}

    public static InlineKeyboardButton btn(String text, String callbackData) {
        return InlineKeyboardButton.builder().text(text).callbackData(callbackData).build();
    }

    /** 버튼들을 perRow 개씩 줄바꿈하여 키보드 생성. */
    public static InlineKeyboardMarkup grid(List<InlineKeyboardButton> buttons, int perRow) {
        List<InlineKeyboardRow> rows = new ArrayList<>();
        InlineKeyboardRow row = new InlineKeyboardRow();
        for (InlineKeyboardButton b : buttons) {
            row.add(b);
            if (row.size() >= perRow) {
                rows.add(row);
                row = new InlineKeyboardRow();
            }
        }
        if (!row.isEmpty()) rows.add(row);
        return InlineKeyboardMarkup.builder().keyboard(rows).build();
    }

    public static InlineKeyboardMarkup ofRows(InlineKeyboardRow... rows) {
        return InlineKeyboardMarkup.builder().keyboard(List.of(rows)).build();
    }

    public static InlineKeyboardRow row(InlineKeyboardButton... buttons) {
        InlineKeyboardRow r = new InlineKeyboardRow();
        for (InlineKeyboardButton b : buttons) r.add(b);
        return r;
    }
}
