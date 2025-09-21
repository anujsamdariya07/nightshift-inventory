package com.anujsamdariya07.nightshiftInventory.entity;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.bson.types.ObjectId;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {
    //    Item name is the name of the item
//    Quantity is the total quantity of that item involved in a specific order
//    Price at order is the price of each item * quantity of that item
    private String itemId;

    private String itemName;

    private int quantity;

    private double priceAtOrder;
}
