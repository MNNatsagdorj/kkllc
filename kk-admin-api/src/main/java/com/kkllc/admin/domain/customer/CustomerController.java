package com.kkllc.admin.domain.customer;

import com.kkllc.admin.common.ApiResponse;
import com.kkllc.admin.common.BizException;
import com.kkllc.admin.common.ErrorCode;
import com.kkllc.admin.common.PageResult;
import com.kkllc.admin.common.Pageable;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerMapper mapper;

    public CustomerController(CustomerMapper mapper) {
        this.mapper = mapper;
    }

    @GetMapping
    public ApiResponse<PageResult<Customer>> list(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String tier,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        int p = Pageable.page(page);
        int s = Pageable.size(size);
        var items = mapper.findPage(q, tier, Pageable.offset(p, s), s);
        long total = mapper.countPage(q, tier);
        return ApiResponse.ok(new PageResult<>(items, total, p, s));
    }

    @GetMapping("/{id}")
    public ApiResponse<CustomerDto.Detail> get(@PathVariable Long id) {
        Customer c = mapper.findById(id);
        if (c == null) throw new BizException(ErrorCode.NOT_FOUND);
        return ApiResponse.ok(new CustomerDto.Detail(c, mapper.recentOrders(id, 20)));
    }

    @PostMapping
    public ApiResponse<Map<String, Long>> create(@Valid @RequestBody CustomerDto.SaveReq req) {
        Customer c = new Customer();
        applyReq(c, req);
        if (c.getTier() == null) c.setTier("new");
        if (c.getType() == null) c.setType("individual");
        mapper.insert(c);
        return ApiResponse.ok(Map.of("id", c.getId()));
    }

    @PutMapping("/{id}")
    public ApiResponse<Void> update(@PathVariable Long id, @Valid @RequestBody CustomerDto.SaveReq req) {
        Customer c = mapper.findById(id);
        if (c == null) throw new BizException(ErrorCode.NOT_FOUND);
        String tier = c.getTier();
        String type = c.getType();
        applyReq(c, req);
        c.setId(id);
        if (c.getTier() == null) c.setTier(tier);
        if (c.getType() == null) c.setType(type);
        mapper.update(c);
        return ApiResponse.ok();
    }

    private static void applyReq(Customer c, CustomerDto.SaveReq req) {
        c.setName(req.name());
        c.setPhone(req.phone());
        c.setTier(req.tier());
        c.setType(req.type());
        c.setAddress(req.address());
        c.setLat(req.lat());
        c.setLng(req.lng());
        c.setEmail(req.email());
        c.setNote(req.note());
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        mapper.deleteById(id);
        return ApiResponse.ok();
    }
}
