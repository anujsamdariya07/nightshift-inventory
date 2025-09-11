package com.anujsamdariya07.nightshiftInventory.services;

import com.anujsamdariya07.nightshiftInventory.entity.Vendor;
import com.anujsamdariya07.nightshiftInventory.repository.VendorRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VendorService {
    @Autowired
    private VendorRepository vendorRepository;

    public List<Vendor> getAllVendorsByOrgId(ObjectId orgId) {
        return vendorRepository.findAllByOrgId(orgId);
    }

    public Vendor getVendorById(ObjectId vendorId) {
        return vendorRepository.findById(vendorId).orElseThrow(() -> new RuntimeException("Vendor Not Found"));
    }

    private String generateVendorId(ObjectId orgId) {
        List<Vendor> vendors = vendorRepository.findAllByOrgId(orgId);

        int maxId = vendors.stream()
                .map(Vendor::getVendorId)
                .filter(id -> id != null && id.startsWith("VEND-"))
                .map(id -> id.substring(5)) // remove "VEN-"
                .filter(num -> num.matches("\\d+")) // keep only numeric parts
                .mapToInt(Integer::parseInt)
                .max()
                .orElse(0);
        System.out.println(maxId);

        int nextId = maxId + 1;

        return String.format("VEND-%03d", nextId);
    }


    public Vendor createVendor(Vendor vendor) {
        if (vendor.getId() != null && vendorRepository.existsById(vendor.getId())) {
            throw new RuntimeException("Vendor with this id already exists!");
        }
        if (vendor.getEmail() != null && vendorRepository.existsByEmail(vendor.getEmail())) {
            throw new RuntimeException("Vendor with this email already exists!");
        }
        if (vendor.getPhone() != null && vendorRepository.existsByPhone(vendor.getPhone())) {
            throw new RuntimeException("Vendor with this phone number already exists!");
        }
        if (vendor.getGstNo() != null && vendorRepository.existsByGstNo(vendor.getGstNo())) {
            throw new RuntimeException("Vendor with this GST number already exists!");
        }

        vendor.setVendorId(generateVendorId(vendor.getOrgId()));

        return vendorRepository.save(vendor);
    }

    public Vendor updateVendor(ObjectId vendorId, Vendor vendor) {
        if (vendorId == null) {
            throw new RuntimeException("Vendor Id not provided!");
        }

        Vendor exisitingVendor = vendorRepository.findById(vendorId).orElseThrow(() -> new RuntimeException("Vendor with the given ID does not exist!"));

        if (vendor.getName() != null) exisitingVendor.setName(vendor.getName());
        if (vendor.getEmail() != null && !vendorRepository.existsByEmail(vendor.getEmail())) exisitingVendor.setEmail(vendor.getEmail());
        if (vendor.getPhone() != null && !vendorRepository.existsByPhone(vendor.getPhone())) exisitingVendor.setPhone(vendor.getPhone());
        if (vendor.getStatus() != null) exisitingVendor.setStatus(vendor.getStatus());
        if (vendor.getGstNo() != null && !vendorRepository.existsByGstNo(vendor.getGstNo())) exisitingVendor.setGstNo(vendor.getGstNo());
        if (vendor.getAddress() != null) exisitingVendor.setAddress(vendor.getAddress());
        if (vendor.getSpecialities() != null) exisitingVendor.setSpecialities(vendor.getSpecialities());
        if (vendor.getReplenishmentHistory() != null) exisitingVendor.setReplenishmentHistory(vendor.getReplenishmentHistory());

        return vendorRepository.save(exisitingVendor);
    }

    public void deleteVendor(ObjectId vendorId) {
        if (!vendorRepository.existsById(vendorId)) {
            throw new RuntimeException("Vendor not found!");
        }
        vendorRepository.deleteById(vendorId);
    }
}
