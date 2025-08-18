package com.anujsamdariya07.nightshiftInventory.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(collection = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    private ObjectId id;

    private String orderId; // corresponds to "id" in Mongoose

    private String orgId;

    private String customerId;

    private String employeeId;

    private ArrayList<OrderItem> items;

    private double totalAmount;

    @Builder.Default
    private String status = "pending"; // Enum: pending, processing, completed, cancelled

    @Builder.Default
    private Date orderDate = new Date();

    private String notes;
}
