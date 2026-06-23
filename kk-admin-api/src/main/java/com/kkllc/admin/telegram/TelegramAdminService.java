package com.kkllc.admin.telegram;

import com.kkllc.admin.domain.order.OrderService;
import com.kkllc.admin.domain.quote.QuoteService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 관리자 → 봇 회신 처리.
 * - quote: "회신" 버튼 → 관리자가 추산금액 입력 → answer + 고객 DM(이벤트로).
 * - order: 상태 버튼 → OrderService 호출(재고 연동) → 고객 DM(이벤트로).
 */
@Slf4j
@Service
public class TelegramAdminService {

    /** adminChatId → 회신 대기 중인 quoteId (in-memory). */
    private final Map<Long, Long> pendingQuoteAnswer = new ConcurrentHashMap<>();

    private final QuoteService quoteService;
    private final OrderService orderService;
    private final ObjectProvider<TelegramMessenger> messengerProvider;

    public TelegramAdminService(QuoteService quoteService, OrderService orderService,
                                ObjectProvider<TelegramMessenger> messengerProvider) {
        this.quoteService = quoteService;
        this.orderService = orderService;
        this.messengerProvider = messengerProvider;
    }

    private TelegramMessenger tg() {
        return messengerProvider.getIfAvailable();
    }

    public void onCallback(Long adminChatId, String data) {
        TelegramMessenger m = tg();
        if (m == null) return;
        try {
            if (data.startsWith("adm:qans:")) {
                long quoteId = Long.parseLong(data.substring("adm:qans:".length()));
                pendingQuoteAnswer.put(adminChatId, quoteId);
                m.send(adminChatId, "Үнийн хүсэлт #" + quoteId + " — тооцоолсон үнийг бичнэ үү (₮):");
            } else if (data.startsWith("adm:odlv:")) {
                long orderId = Long.parseLong(data.substring("adm:odlv:".length()));
                orderService.changeStatus(orderId, "delivered", null);   // 재고 출고 + 매출 인식 (이벤트로 고객 DM)
                m.send(adminChatId, "✅ Захиалга #" + orderId + " хүргэгдсэн төлөвт шилжлээ.");
            } else if (data.startsWith("adm:ocnl:")) {
                long orderId = Long.parseLong(data.substring("adm:ocnl:".length()));
                orderService.changeStatus(orderId, "canceled", null);
                m.send(adminChatId, "🚫 Захиалга #" + orderId + " цуцлагдлаа.");
            }
        } catch (Exception e) {
            log.warn("admin callback failed: {}", e.getMessage());
            m.send(adminChatId, "⚠️ Алдаа: " + e.getMessage());
        }
    }

    /** 관리자 텍스트가 회신 대기 처리에 해당하면 true. */
    public boolean onText(Long adminChatId, String text) {
        Long quoteId = pendingQuoteAnswer.get(adminChatId);
        if (quoteId == null) return false;
        TelegramMessenger m = tg();
        Long amount = parseAmount(text);
        if (amount == null) {
            if (m != null) m.send(adminChatId, "Зөв дүн оруулна уу (жишээ: 760000).");
            return true;
        }
        quoteService.answer(quoteId, amount);   // status=answered, 이벤트 → 고객 DM
        pendingQuoteAnswer.remove(adminChatId);
        if (m != null) m.send(adminChatId, "✅ Үнийн хүсэлт #" + quoteId + " -д " + amount + "₮ хариу илгээлээ.");
        return true;
    }

    private Long parseAmount(String text) {
        String digits = text.replaceAll("[^0-9]", "");
        if (digits.isEmpty()) return null;
        try { return Long.parseLong(digits); } catch (NumberFormatException e) { return null; }
    }
}
