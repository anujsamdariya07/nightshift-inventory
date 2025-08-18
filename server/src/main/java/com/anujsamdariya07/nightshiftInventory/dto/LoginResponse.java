package com.anujsamdariya07.nightshiftInventory.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.bson.types.ObjectId;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponse {
    private String id;
    private ObjectId orgId;
    private String username;
    private String name;
    private String role;
}
