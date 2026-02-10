package com.anujsamdariya07.nightshiftInventory.dto;

import com.anujsamdariya07.nightshiftInventory.entity.PerformanceReview;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ReviewResponse {
    String message = "";
    PerformanceReview performanceReview = null;
}
