package com.kkllc.admin.domain.customer;

import com.kkllc.admin.domain.order.SalesOrder;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

public class CustomerDto {

    public record SaveReq(@NotBlank String name, String phone, String tier,
                          String type, String address, Double lat, Double lng,
                          String email, String note) {}

    public record Detail(Customer customer, List<SalesOrder> recentOrders) {}
}
