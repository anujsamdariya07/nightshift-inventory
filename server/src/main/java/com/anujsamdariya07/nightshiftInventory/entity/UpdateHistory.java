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

    private String vendorName;

    private int quantityUpdated;

    private double cost;

    @Builder.Default
    private Date date = new Date();
}
