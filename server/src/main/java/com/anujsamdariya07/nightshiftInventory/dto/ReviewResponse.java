package com.anujsamdariya07.nightshiftInventory.dto;

import com.anujsamdariya07.nightshiftInventory.entity.PerformanceReview;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class ReviewResponse {
    String message = "";
    PerformanceReview performanceReview = null;
}
