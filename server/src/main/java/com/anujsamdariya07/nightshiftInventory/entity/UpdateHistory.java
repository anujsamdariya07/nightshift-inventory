package com.anujsamdariya07.nightshiftInventory.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateHistory {
    public enum UpdateTypes {
        REPLENISHMENT, ORDER, ORDERREVERT
    }

    private String vendorName;

    private String vendorId;

    private String orderName;

    private String orderId;

    private int quantityUpdated;

    private double cost;

    private UpdateTypes updateType;

    @Builder.Default
    private Date date = new Date();
}
