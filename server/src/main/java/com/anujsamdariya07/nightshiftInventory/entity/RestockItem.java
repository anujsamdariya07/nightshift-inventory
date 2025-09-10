package com.anujsamdariya07.nightshiftInventory.entity;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.*;
import org.bson.types.ObjectId;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestockItem {
    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId id;
    private String itemId;
    private String itemName;
    private int quantity;
    private double cost;
}
