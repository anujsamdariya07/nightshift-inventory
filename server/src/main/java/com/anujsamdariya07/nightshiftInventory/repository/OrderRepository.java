package com.anujsamdariya07.nightshiftInventory.repository;

import com.anujsamdariya07.nightshiftInventory.entity.Order;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository
        extends MongoRepository<Order, ObjectId> {
    List<Order> findAllByOrgId(ObjectId orgId);
    List<Order> findAllByCustomerIdAndOrgId(String customerId, ObjectId orgId);
}
