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

@Document(collection = "vendors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vendor {

    @Id
    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId id;

    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId orgId;

    private String name;

    private String vendorId;

    private String email;

    private String phone;

    @Builder.Default
    private String status = "active";

    private String gstNo;

    private ArrayList<String> specialities;

    private String address;

    private int totalRestocks;

    private double totalValue;

    private ArrayList<RestockItem> replenishmentHistory;

    private ArrayList<Integer> rating;

    private ArrayList<Integer> onTimeDelivery;

    private ArrayList<Integer> responseTime;
}
