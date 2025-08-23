package com.anujsamdariya07.nightshiftInventory.dto;

import com.anujsamdariya07.nightshiftInventory.entity.Organization;
import com.anujsamdariya07.nightshiftInventory.entity.Employee;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SignupResponse {
    private Organization organization;
    private Employee employee;
    private String message;
}
