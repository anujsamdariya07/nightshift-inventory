package com.anujsamdariya07.nightshiftInventory.controllers;

import com.anujsamdariya07.nightshiftInventory.entity.Customer;
import com.anujsamdariya07.nightshiftInventory.entity.Employee;
import com.anujsamdariya07.nightshiftInventory.services.CustomerService;
import com.anujsamdariya07.nightshiftInventory.services.EmployeeService;
import jakarta.servlet.http.HttpServletRequest;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private CustomerService customerService;
    @Autowired
    private EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomersForCurrentOrg(HttpServletRequest request) {
        try {
            Employee currentUser = employeeService.getCurrentUser(request);
            ObjectId orgId = currentUser.getOrgId();
            return ResponseEntity.ok(customerService.getAllCustomersByOrgId(orgId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(HttpServletRequest request, @PathVariable String id) {
        try {
            Employee currentUser = employeeService.getCurrentUser(request);
            ObjectId orgId = currentUser.getOrgId();
            ObjectId customerId = new ObjectId(id);

            Customer customer = customerService.getCustomerByOrgAndId(orgId, customerId);
            return ResponseEntity.ok(customer);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createCustomer(HttpServletRequest request, @RequestBody Customer customer) {
        try {
            Employee currentUser = employeeService.getCurrentUser(request);
            ObjectId orgId = currentUser.getOrgId();

            System.out.println(currentUser);

            customer.setId(null);
            customer.setOrgId(orgId);

            Customer savedCustomer = customerService.createCustomer(customer);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedCustomer);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not logged in or invalid org.");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(HttpServletRequest request, @PathVariable String id, @RequestBody Customer customer) {
        try {
            Employee currentUser = employeeService.getCurrentUser(request);
            ObjectId orgId = currentUser.getOrgId();

            customer.setOrgId(orgId);

            Customer updatedCustomer = customerService.updateCustomerForOrg(orgId, new ObjectId(id), customer);
            return ResponseEntity.ok(updatedCustomer);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(HttpServletRequest request, @PathVariable String id) {
        try {
            Employee currentUser = employeeService.getCurrentUser(request);
            ObjectId orgId = currentUser.getOrgId();
            ObjectId customerId = new ObjectId(id);

            customerService.deleteCustomerForOrg(orgId, customerId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
