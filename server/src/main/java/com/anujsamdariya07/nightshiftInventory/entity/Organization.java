package com.anujsamdariya07.nightshiftInventory.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.util.List;

@Document(collection = "organizations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Organization {

    @Id
    private ObjectId id;

    private String name;

    private String mobileNo;

    private String email;

    private String password;

    private String gstNo;

    private String address;

    @DBRef
    @Builder.Default
    private List<Employee> employeeDetails = List.of();

    @DBRef
    @Builder.Default
    private List<Order> orders = List.of();

    @DBRef
    @Builder.Default
    private List<Customer> customers = List.of();

    @DBRef
    @Builder.Default
    private List<Product> products = List.of();
}
