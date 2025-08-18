package com.anujsamdariya07.nightshiftInventory.controllers;

import com.anujsamdariya07.nightshiftInventory.entity.Employee;
import com.anujsamdariya07.nightshiftInventory.services.EmployeeService;
import jakarta.servlet.http.HttpServletRequest;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    @Autowired
    private EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<?> getEmployeesByOrgId(HttpServletRequest request) {
        Employee currentUser = employeeService.getCurrentUser(request);
        ObjectId orgId = currentUser.getOrgId();
        return ResponseEntity.status(HttpStatus.OK).body(employeeService.getEmployeesByOrgId(orgId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEmployeeById(@PathVariable String id) {
        return ResponseEntity.status(HttpStatus.OK).body(employeeService.getEmployeeById(new ObjectId(id)));
    }

    @PostMapping
    public ResponseEntity<?> createEmployee(@RequestBody Employee employee, HttpServletRequest request) {
        Employee currentUser = employeeService.getCurrentUser(request);
        ObjectId orgId = currentUser.getOrgId();
        if (employeeService.employeeExistsByUsernameAndOrgId(employee.getUsername(), orgId)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Employee with the same username already exists!");
        }
        System.out.println(orgId);
        employee.setId(null);
        employee.setOrgId(orgId);
        Employee savedNewEmployee = employeeService.saveNewEmployee(employee);
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
