package com.anujsamdariya07.nightshiftInventory.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {
    private String orgName;
    private String orgMobileNo;
    private String orgEmail;
    private String orgGstNo;
    private String orgAddress;

    private String adminPassword;
}
