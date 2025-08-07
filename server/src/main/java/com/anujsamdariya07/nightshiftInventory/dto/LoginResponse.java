package com.anujsamdariya07.nightshiftInventory.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponse {
    private String id;
    private String orgId;
    private String username;
    private String name;
    private String role;
}
