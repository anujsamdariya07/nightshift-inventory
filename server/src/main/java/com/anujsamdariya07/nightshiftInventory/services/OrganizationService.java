package com.anujsamdariya07.nightshiftInventory.services;

import com.anujsamdariya07.nightshiftInventory.entity.Organization;
import com.anujsamdariya07.nightshiftInventory.repository.OrganizationRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class OrganizationService {
    @Autowired
    public OrganizationRepository organizationRepository;

    public Optional<Organization> findOrgById(ObjectId orgId) {
        return organizationRepository.findById(orgId);
    }

    public Optional<Organization> findOrgByEmail(String email) {
        return organizationRepository.findByEmail(email);
    }

    public Optional<Organization> findOrgByMobileNo(String mobileNo) {
        return organizationRepository.findByMobileNo(mobileNo);
    }

    public Optional<Organization> findOrgByGstNo(String gstNo) {
        return organizationRepository.findByGstNo(gstNo);
    }

    public void saveOrganization(Organization organization) {
        organizationRepository.save(organization);
    }

    public void deleteOrgById(ObjectId orgId) {
        organizationRepository.deleteById(orgId);
    }
}
