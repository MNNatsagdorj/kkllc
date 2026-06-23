package com.kkllc.admin.telegram;

import com.kkllc.admin.common.event.DomainEvents;
import com.kkllc.admin.domain.order.OrderMapper;
import com.kkllc.admin.domain.order.SalesOrder;
import com.kkllc.admin.domain.quote.Quote;
import com.kkllc.admin.domain.quote.QuoteMapper;
import com.kkllc.admin.domain.setting.SettingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.InlineKeyboardMarkup;

/**
 * 도메인 이벤트 → Telegram 발송.
 * 관리자 알림(신규 주문/문의) + 고객 DM(주문 상태변경/견적 회신).
 */
@Slf4j
@Component
public class TelegramNotifier {

    private final OrderMapper orderMapper;
    private final QuoteMapper quoteMapper;
    private final SettingService settings;
    private final TelegramContext context;
    private final ObjectProvider<TelegramMessenger> messengerProvider;

    public TelegramNotifier(OrderMapper orderMapper, QuoteMapper quoteMapper, SettingService settings,
                            TelegramContext context, ObjectProvider<TelegramMessenger> messengerProvider) {
        this.orderMapper = orderMapper;
        this.quoteMapper = quoteMapper;
        this.settings = settings;
        this.context = context;
        this.messengerProvider = messengerProvider;
    }

    private TelegramMessenger tg() {
        return messengerProvider.getIfAvailable();
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onOrderCreated(DomainEvents.OrderCreated e) {
        TelegramMessenger m = tg();
        Long admin = context.adminChatId();
        if (m == null || admin == null || !settings.getBool("notify_new_order", true)) return;

        SalesOrder o = orderMapper.findById(e.orderId());
        if (o == null) return;
        o.setItems(orderMapper.findItems(o.getId()));
        StringBuilder sb = new StringBuilder();
        sb.append("🛒 <b>Шинэ захиалга</b> ").append(o.getCode())
          .append(" (").append(o.getSource()).append(")\n")
          .append("Харилцагч: ").append(safe(o.getCustomerName()));
        if (o.getPhone() != null) sb.append(" / ").append(o.getPhone());
        sb.append("\nДүн: <b>").append(o.getTotal()).append("₮</b>\n");
        if (o.getItems() != null) {
            o.getItems().forEach(it -> sb.append("• ").append(safe(it.getProductName()))
                    .append(" × ").append(it.getQty()).append("\n"));
        }
        InlineKeyboardMarkup kb = TgKeyboards.ofRows(TgKeyboards.row(
                TgKeyboards.btn("✅ Хүргэгдсэн", "adm:odlv:" + o.getId()),
                TgKeyboards.btn("🚫 Цуцлах", "adm:ocnl:" + o.getId())
        ));
        m.send(admin, sb.toString(), kb, "notify_admin");
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onQuoteCreated(DomainEvents.QuoteCreated e) {
        TelegramMessenger m = tg();
        Long admin = context.adminChatId();
        if (m == null || admin == null || !settings.getBool("notify_new_quote", true)) return;

        Quote q = quoteMapper.findById(e.quoteId());
        if (q == null) return;
        StringBuilder sb = new StringBuilder();
        sb.append("💬 <b>Шинэ үнийн хүсэлт</b> #").append(q.getId())
          .append(" (").append(q.getSource()).append(")\n")
          .append("Харилцагч: ").append(safe(q.getCustomerName()));
        if (q.getPhone() != null) sb.append(" / ").append(q.getPhone());
        if (q.getProductText() != null) sb.append("\nБараа: ").append(safe(q.getProductText()));
        sb.append("\nМессеж: ").append(safe(q.getMessage()));

        InlineKeyboardMarkup kb = TgKeyboards.ofRows(TgKeyboards.row(
                TgKeyboards.btn("💵 Үнэ хариулах", "adm:qans:" + q.getId())
        ));
        m.send(admin, sb.toString(), kb, "notify_admin");
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onOrderStatusChanged(DomainEvents.OrderStatusChanged e) {
        TelegramMessenger m = tg();
        if (m == null) return;
        SalesOrder o = orderMapper.findById(e.orderId());
        if (o == null || o.getTgChatId() == null) return;   // 텔레그램 출처 주문만 고객 DM
        String text = switch (e.status()) {
            case "shipping"  -> "🚚 Таны захиалга " + o.getCode() + " хүргэлтэнд гарлаа.";
            case "delivered" -> "✅ Таны захиалга " + o.getCode() + " амжилттай хүргэгдлээ. Баярлалаа!";
            case "canceled"  -> "🚫 Таны захиалга " + o.getCode() + " цуцлагдлаа.";
            default -> null;
        };
        if (text != null) m.send(o.getTgChatId(), text, null, "reply_customer");
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onQuoteAnswered(DomainEvents.QuoteAnswered e) {
        TelegramMessenger m = tg();
        if (m == null) return;
        Quote q = quoteMapper.findById(e.quoteId());
        if (q == null || q.getTgChatId() == null) return;
        String text = "💵 Таны үнийн хүсэлтийн хариу:\n<b>"
                + (q.getEstimate() == null ? "-" : q.getEstimate() + "₮") + "</b>";
        if (q.getProductText() != null) text += "\nБараа: " + safe(q.getProductText());
        m.send(q.getTgChatId(), text, null, "reply_customer");
    }

    private String safe(String s) {
        return s == null ? "" : s.replace("<", "&lt;").replace(">", "&gt;");
    }
}
