package com.anujsamdariya07.nightshiftInventory.entity;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;

@Document(collection = "employees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {
    public enum EmployeeStatus { ACTIVE, INACTIVE, SUSPENDED }
    public enum Role { WORKER, MANAGER, ADMIN }

    @Id
    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId id;

    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId orgId;

    private String orgName;

    private String employeeId;

    private String name;

    private String email;

    private String password;

    @Builder.Default
    private boolean mustChangePassword = true;

    @Builder.Default
    private Role role = Role.WORKER;

    private String department;

    private String phone;

    private String location;

    @DBRef
    @Builder.Default
    private ArrayList<PerformanceReview> performance = new ArrayList<>();

    private Integer experience;

    private BigDecimal salary;

    @Builder.Default
    private EmployeeStatus status = EmployeeStatus.ACTIVE;

    @Builder.Default
    private int attendance = 0;

    @Builder.Default
    private Date hireDate = new Date();

    @Transient
    public int getYearsOfService() {
        return Period.between(
                this.hireDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate(),
                LocalDate.now()
        ).getYears();
    }

    private String manager;

    private String managerId;

    private ArrayList<String> skills;

    @DBRef
    private ArrayList<Message> messages;
}
