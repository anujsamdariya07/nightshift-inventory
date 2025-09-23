package com.anujsamdariya07.nightshiftInventory.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerOrder {

    private String orderId;

    @Builder.Default
    private Order.OrderStatus status = Order.OrderStatus.PENDING;

    @Builder.Default
    private Date orderDate = new Date();

    private double totalAmount;
}
