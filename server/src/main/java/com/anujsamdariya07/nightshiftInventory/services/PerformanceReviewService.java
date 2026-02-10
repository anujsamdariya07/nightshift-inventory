package com.anujsamdariya07.nightshiftInventory.services;

import com.anujsamdariya07.nightshiftInventory.entity.PerformanceReview;
import com.anujsamdariya07.nightshiftInventory.repository.PerformanceReviewRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class PerformanceReviewService {
    @Autowired
    private PerformanceReviewRepository performanceReviewRepository;

    //    Create review
    public PerformanceReview addReview(PerformanceReview performanceReviewData) {
        performanceReviewData.setReviewDate(new Date());
        return performanceReviewRepository.save(performanceReviewData);
    }

    //    Get all reviews received by an employee
    public List<PerformanceReview> getReviewsReceived(String employeeId) {
        return performanceReviewRepository.findByEmployeeId(employeeId);
    }

    //    Get all reviews given by the employee
    public List<PerformanceReview> getReviewsGiven(String reviewerId) {
        return performanceReviewRepository.findByReviewerId(reviewerId);
    }

    //    Get review by id
    public PerformanceReview getReviewById(ObjectId id) {
        return performanceReviewRepository.findById(id).orElseThrow(() -> new RuntimeException("Review Not Found!"));
    }

    //    Update a review
    public PerformanceReview updateReview(ObjectId id, PerformanceReview performanceReviewData) {
        System.out.println("Update Employee Service!");
        PerformanceReview reviewById = performanceReviewRepository.findById(id).orElseThrow(() -> new RuntimeException("Review not found!"));

        if (!performanceReviewData.getComments().equals(reviewById.getComments())) {
            System.out.println("Update Comments!");
            reviewById.setComments(performanceReviewData.getComments());
        }

        if (!performanceReviewData.getRating().equals(reviewById.getRating())) {
            System.out.println("Update Rating!");
            reviewById.setRating(performanceReviewData.getRating());
        }
        reviewById.setReviewDate(new Date());

        return performanceReviewRepository.save(reviewById);
    }

    //    Delete a review
    public void deleteReview(ObjectId id) {
        performanceReviewRepository.deleteById(id);
    }
}
