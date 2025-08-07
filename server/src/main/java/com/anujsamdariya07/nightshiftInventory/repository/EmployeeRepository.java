package com.anujsamdariya07.nightshiftInventory.repository;

import com.anujsamdariya07.nightshiftInventory.entity.Employee;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository
        extends MongoRepository<Employee, ObjectId> {
    List<Employee> findByOrgId(ObjectId orgId);

    Optional<Employee> findByOrgIdAndId
            (ObjectId orgId, ObjectId id);

    Optional<Employee> findByUsername(String username);
}
