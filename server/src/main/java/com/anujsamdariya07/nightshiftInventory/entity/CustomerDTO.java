package com.anujsamdariya07.nightshiftInventory.entity;

import com.anujsamdariya07.nightshiftInventory.entity.CustomerOrder;
import lombok.*;

import java.util.ArrayList;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CustomerDTO {
    private String id;
    private String orgId;
    private String customerId;
    private String name;
    private String phone;
    private String email;
    private String address;
    private String status;
    private ArrayList<CustomerOrder> orders;
    private ArrayList<Integer> satisfactionLevel;
    private ArrayList<String> preferredCategories;
    private String gstNo;
    private Date dateOfJoining;

    // Derived fields
    private double totalOrderValue;
    private Date lastOrderDate;
    @Builder.Default
    private ArrayList<CustomerOrder> lastFiveMonthsOrders = new ArrayList<>();
    private double orderFrequency;
}
