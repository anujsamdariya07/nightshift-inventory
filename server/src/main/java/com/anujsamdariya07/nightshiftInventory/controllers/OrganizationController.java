package com.anujsamdariya07.nightshiftInventory.controllers;

import com.anujsamdariya07.nightshiftInventory.entity.Organization;
import com.anujsamdariya07.nightshiftInventory.services.OrganizationService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "https://nightshift-inventory-client.onrender.com/")
@RestController
@RequestMapping("/api/organizations")
public class OrganizationController {
    @Autowired
    private OrganizationService organizationService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrganizationById(@PathVariable String id) {
        return ResponseEntity.status(HttpStatus.OK).body(organizationService.findOrgById(new ObjectId(id)));
    }
}
