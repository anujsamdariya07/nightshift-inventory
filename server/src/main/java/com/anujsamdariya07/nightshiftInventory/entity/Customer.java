package com.anujsamdariya07.nightshiftInventory.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "customers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {

    @Id
    private ObjectId id;

    private String orgId;

    private String customerId; // corresponds to "id" in Mongoose

    private String name;

    private String phone;

    private String email;

    private String address;

    @Builder.Default
    private String status = "active"; // Enum: active, inactive

    @Builder.Default
    private List<CustomerOrder> orders = List.of();

    private String gstNo;
}
