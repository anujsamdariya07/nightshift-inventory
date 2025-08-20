package com.anujsamdariya07.nightshiftInventory.repository;

import com.anujsamdariya07.nightshiftInventory.entity.Item;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository
        extends MongoRepository<Item, ObjectId> {
    List<Item> findAllByOrgId(ObjectId orgId);
    boolean existsByName(String name);
}
