package com.anujsamdariya07.nightshiftInventory.entity;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.util.Date;

@Document(collection = "performance_reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PerformanceReview {

    @Id
    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId id;

    @DBRef
    private Employee employee;

    @DBRef
    private Employee reviewer;

    // 1 to 5 rating
    private Integer rating;

    private String comments;

    @Builder.Default
    private Date reviewDate = new Date();
}
