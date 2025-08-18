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

import java.util.ArrayList;
import java.util.List;

@Document(collection = "employees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

    @Id
    private ObjectId id;

    private ObjectId orgId;

    private String name;

    private String username;

    @Builder.Default
    private String password = "pwd";

    @Builder.Default
    private boolean mustChangePassword = true;

    @Builder.Default
    private String role = "worker"; // Should be validated manually or through service logic

    private String mobileNo;

    private String address;

    @Builder.Default
    private int attendance = 0;

    @DBRef
    private ArrayList<Message> messages;
}
