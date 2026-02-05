package com.anujsamdariya07.nightshiftInventory.controllers;

import com.anujsamdariya07.nightshiftInventory.dto.ReviewResponse;
import com.anujsamdariya07.nightshiftInventory.entity.Employee;
import com.anujsamdariya07.nightshiftInventory.entity.PerformanceReview;
import com.anujsamdariya07.nightshiftInventory.services.EmployeeService;
import com.anujsamdariya07.nightshiftInventory.services.PerformanceReviewService;
import jakarta.servlet.http.HttpServletRequest;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Iterator;

@CrossOrigin(origins = {"http://localhost:3000", "https://nightshift-inventory-client.onrender.com"}, allowCredentials = "true")
@RestController
@RequestMapping("/api/reviews")
public class PerformanceReviewController {
    @Autowired
    private PerformanceReviewService performanceReviewService;
    @Autowired
    private EmployeeService employeeService;

    @PostMapping
    public ResponseEntity<?> addReview(HttpServletRequest request, @RequestBody PerformanceReview performanceReviewData) {
        System.out.println("Adding Review");

        System.out.println("Getting the reviewer and reviewee");
        Employee currentUser = employeeService.getCurrentUser(request);
        Employee employee = employeeService.getEmployeeByEmployeeId(currentUser.getOrgId(), performanceReviewData.getEmployeeId());

        if (!currentUser.getEmployeeId().equals(employee.getManagerId()) && !currentUser.getRole().equals(Employee.Role.ADMIN)) {
            System.out.println("Access Denied!");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ReviewResponse("Access Denied!", null));
        }

        performanceReviewData.setReviewerId(currentUser.getEmployeeId());

        PerformanceReview savedPerformance = performanceReviewService.addReview(performanceReviewData);

        employee.getPerformance().add(savedPerformance);

        employeeService.updateEmployee(employee.getId(), employee);

        System.out.println("Done!");

        return ResponseEntity.status(HttpStatus.CREATED).body(new ReviewResponse("Review Created!", savedPerformance));
    }

    //    TODO: Make a generalized output format for returning reviews with a string message
    @GetMapping("/received/{employeeId}")
    public ResponseEntity<?> getReviewsReceived(@PathVariable String employeeId) {
        return ResponseEntity.status(HttpStatus.OK).body(performanceReviewService.getReviewsReceived(employeeId));
    }

    @GetMapping("/given/{reviewerId}")
    public ResponseEntity<?> getReviewsGiven(@PathVariable String reviewerId) {
        return ResponseEntity.status(HttpStatus.OK).body(performanceReviewService.getReviewsGiven(reviewerId));
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<?> updateReview(HttpServletRequest request, @PathVariable String reviewId, @RequestBody PerformanceReview performanceReviewData) {
        Employee currentUser = employeeService.getCurrentUser(request);
        Employee employee = employeeService.getEmployeeByEmployeeId(currentUser.getOrgId(), performanceReviewData.getEmployeeId());

        if (!currentUser.getEmployeeId().equals(employee.getManagerId()) && !currentUser.getRole().equals(Employee.Role.ADMIN)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ReviewResponse("Access denied!", null));
        }

        PerformanceReview updatedReview = performanceReviewService.updateReview(new ObjectId(reviewId), performanceReviewData);

        employee.getPerformance().removeIf(review -> review.getId().equals(new ObjectId(reviewId)));

        employee.getPerformance().add(updatedReview);

        employeeService.updateEmployee(employee.getId(), employee);

        return ResponseEntity.status(HttpStatus.OK).body(new ReviewResponse("Review updated successfully!", updatedReview));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(HttpServletRequest request, @PathVariable String id) {
        Employee currentUser = employeeService.getCurrentUser(request);
        PerformanceReview performanceReview = performanceReviewService.getReviewById(new ObjectId(id));
        Employee employee = employeeService.getEmployeeByEmployeeId(currentUser.getOrgId(), performanceReview.getEmployeeId());

        if (!currentUser.getEmployeeId().equals(employee.getManagerId()) && !currentUser.getRole().equals(Employee.Role.ADMIN)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ReviewResponse("Access denied!", null));
        }

        employee.getPerformance().removeIf(review -> review.getId().equals(new ObjectId(id)));

        employeeService.updateEmployee(employee.getId(), employee);

        performanceReviewService.deleteReview(new ObjectId(id));

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
