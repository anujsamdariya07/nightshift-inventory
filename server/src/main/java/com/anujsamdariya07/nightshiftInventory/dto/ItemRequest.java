package com.anujsamdariya07.nightshiftInventory.dto;

import lombok.Getter;
import lombok.Setter;
import org.bson.types.ObjectId;

import java.util.Date;

@Getter
@Setter
public class ItemRequest {
    private ObjectId orgId;
    private String name;
    private int quantity;
    private int threshold;
    private String image;
    private String vendorName;
    private double cost;
}
