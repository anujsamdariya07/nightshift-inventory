package com.anujsamdariya07.nightshiftInventory.controllers;

import com.anujsamdariya07.nightshiftInventory.entity.PerformanceReview;
import com.anujsamdariya07.nightshiftInventory.services.PerformanceReviewService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/performance-reviews")
public class PerformanceReviewController {

    @Autowired
    private PerformanceReviewService performanceReviewService;

    @PostMapping("/{employeeId}/reviewer/{reviewerId}")
    public ResponseEntity<?> addReview(
            @PathVariable String employeeId,
            @PathVariable String reviewerId,
            @RequestBody PerformanceReview reviewData
    ) {
        PerformanceReview savedReview = performanceReviewService.addReview(
                new ObjectId(employeeId),
                new ObjectId(reviewerId),
                reviewData
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(savedReview);
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<PerformanceReview>> getReviewsByEmployee(@PathVariable String employeeId) {
        return ResponseEntity.ok(
                performanceReviewService.getReviewsByEmployeeId(new ObjectId(employeeId))
        );
    }

    @GetMapping("/reviewer/{reviewerId}")
    public ResponseEntity<List<PerformanceReview>> getReviewsByReviewer(@PathVariable String reviewerId) {
        return ResponseEntity.ok(
                performanceReviewService.getReviewsByReviewerId(new ObjectId(reviewerId))
        );
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<PerformanceReview> updateReview(
            @PathVariable String reviewId,
            @RequestBody PerformanceReview reviewData
    ) {
        PerformanceReview updatedReview = performanceReviewService.updateReview(
                new ObjectId(reviewId),
                reviewData
        );
        return ResponseEntity.ok(updatedReview);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable String reviewId) {
        performanceReviewService.deleteReview(new ObjectId(reviewId));
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
