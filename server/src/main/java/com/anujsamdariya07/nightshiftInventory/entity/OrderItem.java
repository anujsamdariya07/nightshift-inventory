package com.anujsamdariya07.nightshiftInventory.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {
//    Item name is the name of the item
//    Quantity is the total quantity of that item involved in a specific order
//    Price at order is the price of each item * quantity of that item

    private String itemName;

    private int quantity;

    private double priceAtOrder;
}
