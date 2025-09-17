package com.anujsamdariya07.nightshiftInventory.repository;

import com.anujsamdariya07.nightshiftInventory.entity.PerformanceReview;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PerformanceReviewRepository extends MongoRepository<PerformanceReview, ObjectId> {
    List<PerformanceReview> findByEmployeeId(ObjectId employeeId);

    List<PerformanceReview> findByReviewerId(ObjectId reviewerId);
}
