package com.anujsamdariya07.nightshiftInventory.controllers;

import com.anujsamdariya07.nightshiftInventory.dto.ItemRequest;
import com.anujsamdariya07.nightshiftInventory.entity.Employee;
import com.anujsamdariya07.nightshiftInventory.entity.Item;
import com.anujsamdariya07.nightshiftInventory.entity.Organization;
import com.anujsamdariya07.nightshiftInventory.entity.UpdateHistory;
import com.anujsamdariya07.nightshiftInventory.services.EmployeeService;
import com.anujsamdariya07.nightshiftInventory.services.ItemService;
import com.anujsamdariya07.nightshiftInventory.services.OrganizationService;
import jakarta.servlet.http.HttpServletRequest;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "https://nightshift-inventory-client.onrender.com", allowCredentials = "true")
@RestController
@RequestMapping("/api/items")
public class ItemController {
    @Autowired
    private ItemService itemService;
    @Autowired
    private EmployeeService employeeService;
    @Autowired
    private OrganizationService organizationService;

    @GetMapping
    public ResponseEntity<?> getItemsByOrgId(HttpServletRequest request) {
        System.out.println("Get Items By OrgId");
        Employee currentUser = employeeService.getCurrentUser(request);
        System.out.println("Current User ID: " + currentUser.getEmployeeId());
        ObjectId orgId = currentUser.getOrgId();
        return ResponseEntity.status(HttpStatus.OK).body(itemService.getItemsByOrgId(orgId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getItemById(@PathVariable String id) {
        return ResponseEntity.status(HttpStatus.OK).body(itemService.getItemById(new ObjectId(id)));
    }

    @PostMapping
    public ResponseEntity<?> createItem(HttpServletRequest request, @RequestBody ItemRequest itemRequest) {
        Employee currentUser = employeeService.getCurrentUser(request);
        ObjectId orgId = currentUser.getOrgId();

        if (itemService.existsByNameAndOrgId(itemRequest.getName(), orgId)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("An item with the same name already exists!");
        }

        itemRequest.setOrgId(orgId);

        Item savedItem = itemService.createItem(itemRequest);
        Optional<Organization> organization = organizationService.findOrgById(orgId);
        organization.ifPresent(value -> value.getItems().add(savedItem));
        organizationService.saveOrganization(organization.get());
        return ResponseEntity.status(HttpStatus.CREATED).body(savedItem);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateItem(@PathVariable String id, @RequestBody ItemRequest itemRequest) {
        Item existingItem = itemService.getItemById(new ObjectId(id));
        if (!existingItem.getName().equals(itemRequest.getName()) && itemService.existsByName(itemRequest.getName())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("An item with the same name already exists!");
        }

        Item updatedItem = itemService.updateItem(new ObjectId(id), itemRequest);
        return ResponseEntity.status(HttpStatus.OK).body(updatedItem);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable String id) {
        itemService.deleteItem(new ObjectId(id));
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PatchMapping("/{id}/quantity")
    public ResponseEntity<?> updateItemQuantity(@PathVariable String id, @RequestBody UpdateHistory updateHistory) {
        UpdateHistory savedUpdateHistory = itemService.updateItemQuantityByVendor(new ObjectId(id), updateHistory);
        return ResponseEntity.status(HttpStatus.OK).body(savedUpdateHistory);
    }
}
