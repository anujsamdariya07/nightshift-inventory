package com.anujsamdariya07.nightshiftInventory.controllers;

import com.anujsamdariya07.nightshiftInventory.entity.Employee;
import com.anujsamdariya07.nightshiftInventory.entity.Order;
import com.anujsamdariya07.nightshiftInventory.entity.Organization;
import com.anujsamdariya07.nightshiftInventory.services.EmployeeService;
import com.anujsamdariya07.nightshiftInventory.services.OrderService;
import com.anujsamdariya07.nightshiftInventory.services.OrganizationService;
import jakarta.servlet.http.HttpServletRequest;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;
    @Autowired
    private EmployeeService employeeService;
    @Autowired
    private OrganizationService organizationService;

    @GetMapping
    public ResponseEntity<?> getOrdersByOrgId(HttpServletRequest request) {
        Employee currentUser = employeeService.getCurrentUser(request);
        ObjectId orgId = currentUser.getOrgId();
        return ResponseEntity.status(HttpStatus.OK).body(orderService.getOrdersByOrgId(orgId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable String id) {
        Order orderById = orderService.getOrderById(new ObjectId(id));
        if (orderById == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found!");
        }
        return ResponseEntity.status(HttpStatus.OK).body(orderById);
    }

    @PostMapping
    public ResponseEntity<?> createOrder(HttpServletRequest request, @RequestBody Order order) {
        Employee currentUser = employeeService.getCurrentUser(request);
        ObjectId orgId = currentUser.getOrgId();
        order.setOrgId(orgId);
        Order savedOrder = orderService.createOrder(order);
        Optional<Organization> organization = organizationService.findOrgById(orgId);
        organization.ifPresent(value -> value.getOrders().add(savedOrder));
        organizationService.saveOrganization(organization.get());
        return ResponseEntity.status(HttpStatus.CREATED).body(savedOrder);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable String id, @RequestBody Order order) {
        Order savedOrder = orderService.updateOrder(new ObjectId(id), order);
        return ResponseEntity.status(HttpStatus.OK).body(savedOrder);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable String id) {
        orderService.deleteOrder(new ObjectId(id));
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
