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
import java.util.List;

@Document(collection = "customers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {

    @Id
    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId id;

    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId orgId;

    private String customerId;

    private String name;

    private String phone;

    private String email;

    private String address;

    @Builder.Default
    private String status = "active";

    @Builder.Default
    private ArrayList<CustomerOrder> orders = new ArrayList<>();

//    Worth of the above orders to be displayed in the client side

//    Last date of order also to be displayed

    @Builder.Default
    private ArrayList<Integer> satisfactionLevel = new ArrayList<>();

    @Builder.Default
    private ArrayList<String> preferredCategories = new ArrayList<>();

//    Also display the orders done in the last 5 months

//    Also display order frequency

    private String gstNo;

    private Date dateOfJoining = new Date();
}
