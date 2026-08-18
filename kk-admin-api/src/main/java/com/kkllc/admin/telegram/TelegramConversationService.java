package com.kkllc.admin.telegram;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kkllc.admin.domain.order.OrderDto;
import com.kkllc.admin.domain.order.OrderService;
import com.kkllc.admin.domain.product.Product;
import com.kkllc.admin.domain.product.ProductMapper;
import com.kkllc.admin.domain.quote.QuoteDto;
import com.kkllc.admin.domain.quote.QuoteService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Service;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.InlineKeyboardButton;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/** 고객 ↔ 봇 다단계 대화(FSM). 상태는 telegram_user.state/state_data 에 저장. */
@Slf4j
@Service
public class TelegramConversationService {

    private static final String S_QUOTE_PRODUCT = "Q_PRODUCT";
    private static final String S_QUOTE_MESSAGE = "Q_MESSAGE";
    private static final String S_ORDER_QTY = "O_QTY";

    private final TelegramMapper tgMapper;
    private final ProductMapper productMapper;
    private final QuoteService quoteService;
    private final OrderService orderService;
    private final ObjectMapper json;
    private final ObjectProvider<TelegramMessenger> messengerProvider;

    public TelegramConversationService(TelegramMapper tgMapper, ProductMapper productMapper,
                                       QuoteService quoteService, OrderService orderService,
                                       ObjectMapper json, ObjectProvider<TelegramMessenger> messengerProvider) {
        this.tgMapper = tgMapper;
        this.productMapper = productMapper;
        this.quoteService = quoteService;
        this.orderService = orderService;
        this.json = json;
        this.messengerProvider = messengerProvider;
    }

    private TelegramMessenger tg() {
        return messengerProvider.getIfAvailable();
    }

    public void start(TelegramUser u) {
        tgMapper.updateState(u.getChatId(), null, null);
        TelegramMessenger m = tg();
        if (m == null) return;
        m.send(u.getChatId(),
                "Сайн байна уу, <b>" + safe(u.getFirstName()) + "</b>! 👷\n"
                        + "KKLLC-ийн албан ёсны бот. Юу хийх вэ?",
                menu());
    }

    public void showMenu(Long chatId) {
        TelegramMessenger m = tg();
        if (m != null) m.send(chatId, "Үндсэн цэс:", menu());
    }

    private org.telegram.telegrambots.meta.api.objects.replykeyboard.InlineKeyboardMarkup menu() {
        return TgKeyboards.grid(List.of(
                TgKeyboards.btn("💬 Үнийн хүсэлт", "menu:quote"),
                TgKeyboards.btn("🛒 Захиалга өгөх", "menu:order")
        ), 1);
    }

    /** 콜백(버튼) 처리. */
    public void onCallback(TelegramUser u, String data) {
        Long chatId = u.getChatId();
        TelegramMessenger m = tg();
        if (m == null) return;

        if ("menu:quote".equals(data)) {
            tgMapper.updateState(chatId, S_QUOTE_PRODUCT, null);
            m.send(chatId, "Аль бараа сонирхож байна вэ? (нэр бичнэ үү)");
        } else if ("menu:order".equals(data)) {
            sendProductList(chatId);
        } else if (data.startsWith("ord:prod:")) {
            long pid = Long.parseLong(data.substring("ord:prod:".length()));
            Product p = productMapper.findById(pid);
            if (p == null) { m.send(chatId, "Бараа олдсонгүй."); return; }
            tgMapper.updateState(chatId, S_ORDER_QTY,
                    write(Map.of("productId", p.getId(), "productName", p.getName(), "price", p.getPrice())));
            m.send(chatId, "<b>" + safe(p.getName()) + "</b>\nХэдэн ширхэг захиалах вэ? (тоо бичнэ үү)");
        } else {
            showMenu(chatId);
        }
    }

    /** 텍스트 메시지 처리(상태 기반). */
    public void onText(TelegramUser u, String text) {
        Long chatId = u.getChatId();
        TelegramMessenger m = tg();
        if (m == null) return;
        String state = u.getState();

        if (S_QUOTE_PRODUCT.equals(state)) {
            tgMapper.updateState(chatId, S_QUOTE_MESSAGE, write(Map.of("productText", text)));
            m.send(chatId, "Дэлгэрэнгүй мессеж/тоо хэмжээгээ бичнэ үү:");
        } else if (S_QUOTE_MESSAGE.equals(state)) {
            Map<String, Object> d = read(u.getStateData());
            String productText = d == null ? null : (String) d.get("productText");
            quoteService.create(new QuoteDto.CreateReq(
                    displayName(u), u.getPhone(), productText, text), "telegram", chatId);
            tgMapper.updateState(chatId, null, null);
            m.send(chatId, "✅ Таны үнийн хүсэлт хүлээн авлаа. Удахгүй хариу өгөх болно.", null);
            showMenu(chatId);
        } else if (S_ORDER_QTY.equals(state)) {
            Integer qty = parseQty(text);
            if (qty == null) { m.send(chatId, "Зөв тоо оруулна уу (жишээ: 20)."); return; }
            Map<String, Object> d = read(u.getStateData());
            if (d == null || d.get("productId") == null) {
                tgMapper.updateState(chatId, null, null);
                m.send(chatId, "Алдаа гарлаа, дахин эхлүүлнэ үү.");
                showMenu(chatId);
                return;
            }
            long pid = ((Number) d.get("productId")).longValue();
            Long orderId = orderService.create(new OrderDto.CreateReq(
                    displayName(u), u.getPhone(), null,
                    List.of(new OrderDto.ItemReq(pid, qty)),
                    null, "Telegram-ээс ирсэн захиалга",
                    null, null, null), "telegram", chatId);
            tgMapper.updateState(chatId, null, null);
            m.send(chatId, "✅ Захиалга хүлээн авлаа (#" + orderId + ").\n"
                    + safe((String) d.get("productName")) + " × " + qty
                    + "\nМенежер тантай холбогдоно.", null);
            showMenu(chatId);
        } else {
            showMenu(chatId);
        }
    }

    public void onContact(TelegramUser u, String phone) {
        tgMapper.updatePhone(u.getChatId(), phone);
        TelegramMessenger m = tg();
        if (m != null) m.send(u.getChatId(), "📞 Утасны дугаар хадгалагдлаа: " + phone);
    }

    private void sendProductList(Long chatId) {
        List<Product> products = productMapper.findPage(null, null, 0, 30);
        List<InlineKeyboardButton> btns = new ArrayList<>();
        for (Product p : products) {
            btns.add(TgKeyboards.btn(p.getName() + " — " + p.getPrice() + "₮", "ord:prod:" + p.getId()));
        }
        TelegramMessenger m = tg();
        if (m == null) return;
        if (btns.isEmpty()) {
            m.send(chatId, "Одоогоор бараа алга байна.");
        } else {
            m.send(chatId, "Бараагаа сонгоно уу:", TgKeyboards.grid(btns, 1));
        }
    }

    // ---- helpers ----
    private String displayName(TelegramUser u) {
        if (u.getFirstName() != null && !u.getFirstName().isBlank()) return u.getFirstName();
        if (u.getUsername() != null) return "@" + u.getUsername();
        return "Telegram хэрэглэгч";
    }

    private Integer parseQty(String text) {
        try {
            int v = Integer.parseInt(text.trim());
            return v > 0 ? v : null;
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private String write(Map<String, Object> data) {
        try { return json.writeValueAsString(data); }
        catch (Exception e) { return null; }
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> read(String s) {
        if (s == null || s.isBlank()) return new HashMap<>();
        try { return json.readValue(s, Map.class); }
        catch (Exception e) { return new HashMap<>(); }
    }

    private String safe(String s) {
        return s == null ? "" : s.replace("<", "&lt;").replace(">", "&gt;");
    }
}
