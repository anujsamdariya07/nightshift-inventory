package com.anujsamdariya07.nightshiftInventory.repository;

import com.anujsamdariya07.nightshiftInventory.entity.Customer;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends MongoRepository<Customer, ObjectId> {

    List<Customer> findByOrgId(ObjectId orgId);

    Optional<Customer> findByOrgIdAndId(ObjectId orgId, ObjectId id);

    void deleteByOrgIdAndId(ObjectId orgId, ObjectId id);

    boolean existsByOrgIdAndId(ObjectId orgId, ObjectId id);
}
