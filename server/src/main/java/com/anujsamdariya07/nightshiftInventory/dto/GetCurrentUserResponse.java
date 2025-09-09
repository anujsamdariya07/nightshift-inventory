package com.anujsamdariya07.nightshiftInventory.dto;

import com.anujsamdariya07.nightshiftInventory.entity.Employee;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class GetCurrentUserResponse {
    private Employee employee;
    private String message;
}
