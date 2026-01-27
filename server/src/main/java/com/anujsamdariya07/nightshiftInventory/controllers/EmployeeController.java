package com.anujsamdariya07.nightshiftInventory.controllers;

import com.anujsamdariya07.nightshiftInventory.entity.Employee;
import com.anujsamdariya07.nightshiftInventory.entity.Organization;
import com.anujsamdariya07.nightshiftInventory.services.EmployeeService;
import com.anujsamdariya07.nightshiftInventory.services.OrganizationService;
import jakarta.servlet.http.HttpServletRequest;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = {"http://localhost:3000", "https://nightshift-inventory-client.onrender.com"}, allowCredentials = "true")
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    @Autowired
    private EmployeeService employeeService;
    @Autowired
    private OrganizationService organizationService;

    @GetMapping
    public ResponseEntity<?> getEmployeesByOrgId(HttpServletRequest request) {
        Employee currentUser = employeeService.getCurrentUser(request);
        ObjectId orgId = currentUser.getOrgId();

        System.out.println("HERE");

        return ResponseEntity.status(HttpStatus.OK).body(employeeService.getEmployeesByOrgId(orgId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEmployeeById(@PathVariable String id) {
        System.out.println("HERE");
        return ResponseEntity.status(HttpStatus.OK).body(employeeService.getEmployeeById(new ObjectId(id)));
    }

    @PostMapping
    public ResponseEntity<?> createEmployee(@RequestBody Employee employee, HttpServletRequest request) {
        Employee currentUser = employeeService.getCurrentUser(request);
        ObjectId orgId = currentUser.getOrgId();
        String orgName = currentUser.getOrgName();
        employee.setId(null);
        employee.setOrgId(orgId);
        employee.setOrgName(orgName);
        Employee savedNewEmployee = employeeService.saveNewEmployee(employee);
        Optional<Organization> organization = organizationService.findOrgById(orgId);
        Employee finalSavedNewEmployee = savedNewEmployee;
        organization.ifPresent(value -> value.getEmployeeDetails().add(finalSavedNewEmployee));
        organizationService.saveOrganization(organization.get());
        savedNewEmployee.setOrgName(organization.get().getName());
        savedNewEmployee = employeeService.saveNewEmployee(savedNewEmployee);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedNewEmployee);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmployee(@RequestBody Employee employee, @PathVariable String id) {
        Employee updatedEmployee = employeeService.updateEmployee(new ObjectId(id), employee);
        return ResponseEntity.status(HttpStatus.OK).body(updatedEmployee);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable String id) {
        employeeService.deleteEmployeeById(new ObjectId(id));
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
