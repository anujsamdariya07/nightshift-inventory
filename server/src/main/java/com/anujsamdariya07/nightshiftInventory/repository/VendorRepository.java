package com.anujsamdariya07.nightshiftInventory.repository;

import com.anujsamdariya07.nightshiftInventory.entity.Vendor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorRepository
        extends MongoRepository<Vendor, ObjectId> {
    public List<Vendor> findAllByOrgId(ObjectId orgId);
    public boolean existsByEmail(String email);
    public boolean existsByPhone(String phone);
    public boolean existsByGstNo(String gstNo);
}
