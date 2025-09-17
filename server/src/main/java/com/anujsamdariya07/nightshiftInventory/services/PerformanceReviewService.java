package com.anujsamdariya07.nightshiftInventory.services;

import com.anujsamdariya07.nightshiftInventory.entity.Employee;
import com.anujsamdariya07.nightshiftInventory.entity.PerformanceReview;
import com.anujsamdariya07.nightshiftInventory.repository.EmployeeRepository;
import com.anujsamdariya07.nightshiftInventory.repository.PerformanceReviewRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PerformanceReviewService {

    @Autowired
    private PerformanceReviewRepository performanceReviewRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public PerformanceReview addReview(ObjectId employeeId, ObjectId reviewerId, PerformanceReview reviewData) {
        Optional<Employee> employeeOpt = employeeRepository.findById(employeeId);
        Optional<Employee> reviewerOpt = employeeRepository.findById(reviewerId);

        if (employeeOpt.isEmpty() || reviewerOpt.isEmpty()) {
            throw new RuntimeException("Employee or Reviewer not found!");
        }

        Employee employee = employeeOpt.get();
        Employee reviewer = reviewerOpt.get();

        PerformanceReview review = PerformanceReview.builder()
                .employee(employee)
                .reviewer(reviewer)
                .rating(reviewData.getRating())
                .comments(reviewData.getComments())
                .build();

        PerformanceReview savedReview = performanceReviewRepository.save(review);

        employee.getPerformance().add(savedReview);
        employeeRepository.save(employee);

        return savedReview;
    }

    public List<PerformanceReview> getReviewsByEmployeeId(ObjectId employeeId) {
        return performanceReviewRepository.findByEmployeeId(employeeId);
    }

    public List<PerformanceReview> getReviewsByReviewerId(ObjectId reviewerId) {
        return performanceReviewRepository.findByReviewerId(reviewerId);
    }

    public PerformanceReview updateReview(ObjectId reviewId, PerformanceReview updateData) {
        Optional<PerformanceReview> reviewOpt = performanceReviewRepository.findById(reviewId);
        if (reviewOpt.isEmpty()) {
            throw new RuntimeException("Review not found!");
        }

        PerformanceReview existingReview = reviewOpt.get();

        if (updateData.getRating() != null) {
            existingReview.setRating(updateData.getRating());
        }
        if (updateData.getComments() != null) {
            existingReview.setComments(updateData.getComments());
        }

        return performanceReviewRepository.save(existingReview);
    }

    public void deleteReview(ObjectId reviewId) {
        if (performanceReviewRepository.findById(reviewId).isEmpty()) {
            throw new RuntimeException("Review not found!");
        }
        performanceReviewRepository.deleteById(reviewId);
    }
}
