package com.kkllc.admin.domain.quote;

import com.kkllc.admin.common.BizException;
import com.kkllc.admin.common.ErrorCode;
import com.kkllc.admin.common.PageResult;
import com.kkllc.admin.common.Pageable;
import com.kkllc.admin.common.event.DomainEvents;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class QuoteService {

    private final QuoteMapper mapper;
    private final ApplicationEventPublisher events;

    public QuoteService(QuoteMapper mapper, ApplicationEventPublisher events) {
        this.mapper = mapper;
        this.events = events;
    }

    @Transactional(readOnly = true)
    public PageResult<Quote> page(String status, Integer page, Integer size) {
        int p = Pageable.page(page);
        int s = Pageable.size(size);
        var items = mapper.findPage(status, Pageable.offset(p, s), s);
        long total = mapper.countPage(status);
        return new PageResult<>(items, total, p, s);
    }

    @Transactional(readOnly = true)
    public long unreadCount() {
        return mapper.countUnread();
    }

    /** 상세 조회 시 읽음 처리. */
    @Transactional
    public Quote get(Long id) {
        Quote q = mapper.findById(id);
        if (q == null) throw new BizException(ErrorCode.NOT_FOUND);
        if (Boolean.FALSE.equals(q.getIsRead())) {
            mapper.markRead(id);
            q.setIsRead(true);
        }
        return q;
    }

    /** 문의 적재(스토어프론트/Telegram/관리자 공용). */
    @Transactional
    public Long create(QuoteDto.CreateReq req, String source, Long tgChatId) {
        Quote q = new Quote();
        q.setCustomerName(req.customerName());
        q.setPhone(req.phone());
        q.setProductText(req.productText());
        q.setMessage(req.message());
        q.setStatus("new");
        q.setIsRead(false);
        q.setSource(source == null ? "web" : source);
        q.setTgChatId(tgChatId);
        mapper.insert(q);
        events.publishEvent(new DomainEvents.QuoteCreated(q.getId(), q.getSource()));
        return q.getId();
    }

    /** 견적 회신 — estimate 저장 + status=answered. */
    @Transactional
    public Quote answer(Long id, Long estimate) {
        if (mapper.answer(id, estimate) == 0) throw new BizException(ErrorCode.NOT_FOUND);
        events.publishEvent(new DomainEvents.QuoteAnswered(id));
        return mapper.findById(id);
    }

    @Transactional
    public void changeStatus(Long id, String status) {
        if (mapper.updateStatus(id, status) == 0) throw new BizException(ErrorCode.NOT_FOUND);
    }
}
