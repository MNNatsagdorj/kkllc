package com.kkllc.admin.domain.order;

import com.kkllc.admin.common.BizException;
import com.kkllc.admin.common.ErrorCode;
import com.kkllc.admin.common.PageResult;
import com.kkllc.admin.common.Pageable;
import com.kkllc.admin.common.event.DomainEvents;
import com.kkllc.admin.domain.customer.Customer;
import com.kkllc.admin.domain.customer.CustomerMapper;
import com.kkllc.admin.domain.product.Product;
import com.kkllc.admin.domain.product.ProductMapper;
import com.kkllc.admin.domain.stock.StockService;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class OrderService {

    private final OrderMapper mapper;
    private final ProductMapper productMapper;
    private final CustomerMapper customerMapper;
    private final StockService stockService;
    private final ApplicationEventPublisher events;

    public OrderService(OrderMapper mapper, ProductMapper productMapper,
                        CustomerMapper customerMapper,
                        StockService stockService, ApplicationEventPublisher events) {
        this.mapper = mapper;
        this.productMapper = productMapper;
        this.customerMapper = customerMapper;
        this.stockService = stockService;
        this.events = events;
    }

    @Transactional(readOnly = true)
    public PageResult<SalesOrder> page(String status, String q, Integer page, Integer size) {
        int p = Pageable.page(page);
        int s = Pageable.size(size);
        var items = mapper.findPage(status, q, Pageable.offset(p, s), s);
        long total = mapper.countPage(status, q);
        return new PageResult<>(items, total, p, s);
    }

    /** 상태별 건수 — 목록 탭 뱃지용. 키: 각 status + "all"(전체). */
    @Transactional(readOnly = true)
    public Map<String, Long> statusCounts() {
        Map<String, Long> counts = new LinkedHashMap<>();
        long all = 0;
        for (Map<String, Object> row : mapper.statusCounts()) {
            long cnt = ((Number) row.get("cnt")).longValue();
            counts.put((String) row.get("status"), cnt);
            all += cnt;
        }
        counts.put("all", all);
        return counts;
    }

    @Transactional(readOnly = true)
    public SalesOrder get(Long id) {
        SalesOrder o = mapper.findById(id);
        if (o == null) throw new BizException(ErrorCode.NOT_FOUND);
        o.setItems(mapper.findItems(id));
        return o;
    }

    /** 신규 주문 — 단가/합계는 서버에서 계산(클라 total 불신, §6.4). */
    @Transactional
    public Long create(OrderDto.CreateReq req, String source, Long tgChatId) {
        SalesOrder o = new SalesOrder();
        o.setCode(mapper.nextCode());
        o.setCustomerId(resolveCustomer(req));
        o.setCustomerName(req.customerName());
        o.setPhone(req.phone());
        o.setStatus("pending");
        o.setOrderedAt(req.orderedAt() == null ? LocalDate.now() : req.orderedAt());
        o.setNote(req.note());
        o.setDeliveryAddress(req.deliveryAddress());
        o.setDeliveryLat(req.deliveryLat());
        o.setDeliveryLng(req.deliveryLng());
        // 배달 위치 미지정 시 고객 기본 위치로 보완
        if (o.getDeliveryLat() == null && o.getCustomerId() != null) {
            Customer c = customerMapper.findById(o.getCustomerId());
            if (c != null) {
                if (o.getDeliveryAddress() == null) o.setDeliveryAddress(c.getAddress());
                o.setDeliveryLat(c.getLat());
                o.setDeliveryLng(c.getLng());
            }
        }
        o.setSource(source == null ? "admin" : source);
        o.setTgChatId(tgChatId);

        long total = 0;
        List<SalesOrderItem> items = new ArrayList<>();
        for (OrderDto.ItemReq ir : req.items()) {
            Product prod = productMapper.findById(ir.productId());
            if (prod == null) throw new BizException(ErrorCode.NOT_FOUND, "Бараа олдсонгүй: " + ir.productId());
            SalesOrderItem it = new SalesOrderItem();
            it.setProductId(prod.getId());
            it.setProductName(prod.getName());
            it.setUnitPrice(prod.getPrice());
            it.setQty(ir.qty());
            it.setLineTotal(prod.getPrice() * ir.qty());
            total += it.getLineTotal();
            items.add(it);
        }
        o.setTotal(total);
        mapper.insert(o);
        items.forEach(it -> it.setOrderId(o.getId()));
        mapper.insertItems(items);

        events.publishEvent(new DomainEvents.OrderCreated(o.getId(), o.getSource()));
        return o.getId();
    }

    /**
     * 고객 연결 — 지정된 customerId 우선, 없으면 전화번호로 기존 고객 매칭,
     * 그래도 없으면 신규 고객 자동 등록(주문 배달 위치를 기본 위치로 저장).
     */
    private Long resolveCustomer(OrderDto.CreateReq req) {
        if (req.customerId() != null) return req.customerId();
        if (req.phone() != null && !req.phone().isBlank()) {
            Customer existing = customerMapper.findByPhone(req.phone());
            if (existing != null) return existing.getId();
        }
        Customer c = new Customer();
        c.setName(req.customerName());
        c.setPhone(req.phone());
        c.setTier("new");
        c.setType("individual");
        c.setAddress(req.deliveryAddress());
        c.setLat(req.deliveryLat());
        c.setLng(req.deliveryLng());
        customerMapper.insert(c);
        return c.getId();
    }

    /**
     * 상태 전이 + 재고/매출 연동(정책 A). 배송완료=출고+delivered_at, 취소(배송후)=출고 되돌림.
     * 모두 한 트랜잭션(상세 §2.7).
     */
    @Transactional
    public void changeStatus(Long id, String target, Long adminId) {
        SalesOrder o = get(id);
        String cur = o.getStatus();
        if (cur.equals(target)) return;

        switch (target) {
            case "shipping" -> {
                requireTransition(cur.equals("pending"));
                mapper.updateStatus(id, "shipping");
            }
            case "delivered" -> {
                requireTransition(cur.equals("pending") || cur.equals("shipping"));
                for (SalesOrderItem it : o.getItems()) {
                    stockService.stockOut(it.getProductId(), it.getQty(), it.getProductName(),
                            "sale", "sales_order", id, adminId);
                }
                mapper.markDelivered(id);   // status=delivered, delivered_at=current_date
            }
            case "canceled" -> {
                if (cur.equals("delivered")) {
                    stockService.reverseRef("sales_order", id, adminId);
                }
                mapper.updateStatus(id, "canceled");
            }
            default -> throw new BizException(ErrorCode.BAD_REQUEST, "Үл мэдэгдэх төлөв: " + target);
        }
        events.publishEvent(new DomainEvents.OrderStatusChanged(id, target));
    }

    @Transactional
    public void delete(Long id) {
        SalesOrder o = get(id);
        if ("delivered".equals(o.getStatus())) {
            // 매출 인식된 주문은 삭제 대신 취소 처리 권장
            throw new BizException(ErrorCode.CONFLICT, "Хүргэгдсэн захиалгыг устгах боломжгүй (цуцлана уу)");
        }
        mapper.deleteById(id);
    }

    private void requireTransition(boolean ok) {
        if (!ok) throw new BizException(ErrorCode.INVALID_TRANSITION);
    }
}
