package com.anujsamdariya07.nightshiftInventory.controllers;

import com.anujsamdariya07.nightshiftInventory.entity.Employee;
import com.anujsamdariya07.nightshiftInventory.entity.Organization;
import com.anujsamdariya07.nightshiftInventory.entity.Vendor;
import com.anujsamdariya07.nightshiftInventory.services.EmployeeService;
import com.anujsamdariya07.nightshiftInventory.services.OrganizationService;
import com.anujsamdariya07.nightshiftInventory.services.VendorService;
import jakarta.servlet.http.HttpServletRequest;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/vendors")
public class VendorController {
    @Autowired
    private VendorService vendorService;
    @Autowired
    private EmployeeService employeeService;
    @Autowired
    private OrganizationService organizationService;

    @GetMapping
    public ResponseEntity<?> getAllVendorsByOrgId(HttpServletRequest request) {
        Employee currentUser = employeeService.getCurrentUser(request);
        ObjectId orgId = currentUser.getOrgId();
        return ResponseEntity.status(HttpStatus.OK).body(vendorService.getAllVendorsByOrgId(orgId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getVendorById(@PathVariable String id) {
        return ResponseEntity.status(HttpStatus.OK).body(vendorService.getVendorById(new ObjectId(id)));
    }

    @PostMapping
    public ResponseEntity<?> createVendor(@RequestBody Vendor vendor, HttpServletRequest request) {
        Employee currentUser = employeeService.getCurrentUser(request);
        ObjectId orgId = currentUser.getOrgId();

        vendor.setId(null);
        vendor.setOrgId(orgId);

        Vendor savedVendor = vendorService.createVendor(vendor);
        Optional<Organization> organization = organizationService.findOrgById(orgId);
        organization.ifPresent(value -> value.getVendors().add(savedVendor));
        organizationService.saveOrganization(organization.get());
        return ResponseEntity.status(HttpStatus.CREATED).body(savedVendor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateVendor(@PathVariable String id, @RequestBody Vendor vendor) {
        Vendor updatedVendor = vendorService.updateVendor(new ObjectId(id), vendor);
        return ResponseEntity.status(HttpStatus.OK).body(updatedVendor);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVendor(@PathVariable String id) {
        vendorService.deleteVendor(new ObjectId(id));
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
