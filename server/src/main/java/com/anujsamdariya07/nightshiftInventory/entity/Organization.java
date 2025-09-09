package com.anujsamdariya07.nightshiftInventory.entity;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "organizations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Organization {

    @Id
    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId id;

    private String name;

    private String mobileNo;

    private String email;

    private String password;

    private String gstNo;

    private String address;

    @DBRef
    @Builder.Default
    private ArrayList<Employee> employeeDetails = new ArrayList<>();

    @DBRef
    @Builder.Default
    private ArrayList<Order> orders = new ArrayList<>();

    @DBRef
    @Builder.Default
    private ArrayList<Customer> customers = new ArrayList<>();

    @DBRef
    @Builder.Default
    private ArrayList<Item> items = new ArrayList<>();

    @DBRef
    @Builder.Default
    private ArrayList<Vendor> vendors = new ArrayList<>();
}
