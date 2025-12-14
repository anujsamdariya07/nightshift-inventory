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

@CrossOrigin(origins = "https://nightshift-inventory-client.onrender.com/")
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
        String employeeId = currentUser.getEmployeeId();
        String employeeName = currentUser.getName();
        order.setOrgId(orgId);
        order.setEmployeeId(employeeId);
        order.setEmployeeName(employeeName);
        Order savedOrder = orderService.createOrder(request, order);
        Optional<Organization> organization = organizationService.findOrgById(orgId);
        organization.ifPresent(value -> {
            value.getOrders().add(savedOrder);
        });
        organizationService.saveOrganization(organization.get());
        return ResponseEntity.status(HttpStatus.CREATED).body(savedOrder);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable String id, @RequestBody Order order) {
        Order savedOrder = orderService.updateOrder(new ObjectId(id), order);
        if (savedOrder == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found!");
        }
        return ResponseEntity.status(HttpStatus.OK).body(savedOrder);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable String id) {
        System.out.println("Delete Order 1");
        Order orderById = orderService.getOrderById(new ObjectId(id));
        System.out.println("Delete Order 2");
        if (orderById == null) {
            System.out.println("Delete Order 3");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found!");
        }
        System.out.println("Delete Order 4");
        orderService.deleteOrder(new ObjectId(id));
        System.out.println("Delete Order 5");
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
