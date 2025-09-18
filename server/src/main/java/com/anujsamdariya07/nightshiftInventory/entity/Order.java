package com.anujsamdariya07.nightshiftInventory.entity;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
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

@Document(collection = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
    public enum OrderStatus {
        PENDING, DELIVERED, SHIPPED, PROCESSING
    }

    @Id
    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId id;

    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId orgId;

    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId customerId;

    private String customerName;

    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId employeeId;

    private String employeeName;

    private String orderId;

    private ArrayList<OrderItem> items;

    private double totalAmount;

    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;

    @Builder.Default
    private Date orderDate = new Date();

    private Date deadline;

    private String notes;
}
