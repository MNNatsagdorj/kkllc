package com.kkllc.admin.common.event;

/** 도메인 이벤트 모음 — Telegram 등 부가 모듈이 @TransactionalEventListener로 구독. */
public class DomainEvents {
    private DomainEvents() {}

    public record OrderCreated(Long orderId, String source) {}
    public record OrderStatusChanged(Long orderId, String status) {}
    public record QuoteCreated(Long quoteId, String source) {}
    public record QuoteAnswered(Long quoteId) {}
}
