package com.anujsamdariya07.nightshiftInventory.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ChangePasswordRequest {
    private String password;
    private String confirmPassword;
}
