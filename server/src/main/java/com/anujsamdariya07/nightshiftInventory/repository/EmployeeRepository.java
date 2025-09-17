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
    public List<Employee> findByOrgId(ObjectId orgId);

    public boolean existsByEmailAndOrgId(String email, ObjectId orgId);

    public boolean existsByPhone(String phone);

    public boolean existsByEmail(String email);

    public Optional<Employee> findByEmail(String email);
}
