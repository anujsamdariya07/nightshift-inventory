package com.anujsamdariya07.nightshiftInventory.services;

import com.anujsamdariya07.nightshiftInventory.entity.Customer;
import com.anujsamdariya07.nightshiftInventory.repository.CustomerRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {
    @Autowired
    private CustomerRepository customerRepository;

    public List<Customer> getAllCustomersByOrgId(ObjectId orgId) {
        return customerRepository.findByOrgId(orgId);
    }

    public Customer getCustomerByOrgAndId(ObjectId orgId, ObjectId id) {
        Optional<Customer> customer= customerRepository.findByOrgIdAndId(orgId, id);
        return customer.orElseThrow(() -> new RuntimeException("Customer Not Found!"));
    }

    public Customer createCustomer(Customer customer) {
        if (customer.getId() != null && customerRepository.existsById(customer.getId())) {
            throw new RuntimeException("Customer with the same id already exists!");
        }
        Customer savedCustomer = customerRepository.save(customer);
        return savedCustomer;
    }

    public Customer updateCustomerForOrg(ObjectId orgId, ObjectId id, Customer customer) {
        if (id == null) {
            throw new RuntimeException("Customer ID must be provided for update!");
        }

        Customer existingCustomer = customerRepository.findByOrgIdAndId(orgId, id)
                .orElseThrow(() -> new RuntimeException("Customer not found!"));

        if (customer.getName() != null) {
            existingCustomer.setName(customer.getName());
        }
        if (customer.getPhone() != null) {
            existingCustomer.setPhone(customer.getPhone());
        }
        if (customer.getAddress() != null) {
            existingCustomer.setAddress(customer.getAddress());
        }
        if (customer.getEmail() != null) {
            existingCustomer.setEmail(customer.getEmail());
        }
        if (customer.getStatus() != null) {
            existingCustomer.setStatus(customer.getStatus());
        }
        if (customer.getGstNo() != null) {
            existingCustomer.setGstNo(customer.getGstNo());
        }
        if (customer.getOrders() != null) {
            existingCustomer.setOrders(customer.getOrders());
        }

        Customer savedCustomer = customerRepository.save(existingCustomer);
        return savedCustomer;
    }

    public void deleteCustomerForOrg(ObjectId orgId, ObjectId id) {
        if (!customerRepository.existsByOrgIdAndId(orgId, id)) {
            throw new RuntimeException("Customer not found!");
        }
        customerRepository.deleteByOrgIdAndId(orgId, id);
    }
}
