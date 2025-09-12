package com.anujsamdariya07.nightshiftInventory.services;

import com.anujsamdariya07.nightshiftInventory.entity.Customer;
import com.anujsamdariya07.nightshiftInventory.entity.CustomerDTO;
import com.anujsamdariya07.nightshiftInventory.entity.CustomerOrder;
import com.anujsamdariya07.nightshiftInventory.entity.Vendor;
import com.anujsamdariya07.nightshiftInventory.repository.CustomerRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CustomerService {
    @Autowired
    private CustomerRepository customerRepository;

    public List<CustomerDTO> getAllCustomersByOrgId(ObjectId orgId) {
        List<Customer> customers = customerRepository.findByOrgId(orgId);

        LocalDate fiveMonthsAgo = LocalDate.now().minusMonths(5);

        return customers.stream().map(customer -> {
            double totalOrderValue = customer.getOrders().stream()
                    .mapToDouble(CustomerOrder::getTotalAmount)
                    .sum();

            Date lastOrderDate = customer.getOrders().stream()
                    .map(CustomerOrder::getOrderDate)
                    .max(Date::compareTo)
                    .orElse(null);

            ArrayList<CustomerOrder> lastFiveMonthsOrders = customer.getOrders().stream()
                    .filter(o -> o.getOrderDate().toInstant()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDate()
                            .isAfter(fiveMonthsAgo))
                    .collect(Collectors.toCollection(ArrayList::new));

            long monthsSinceJoining = ChronoUnit.MONTHS.between(
                    customer.getDateOfJoining().toInstant()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDate(),
                    LocalDate.now()
            );

            double orderFrequency = monthsSinceJoining > 0
                    ? (double) customer.getOrders().size() / monthsSinceJoining
                    : customer.getOrders().size();

            return CustomerDTO.builder()
                    .id(customer.getId().toString())
                    .orgId(customer.getOrgId().toString())
                    .customerId(customer.getCustomerId())
                    .name(customer.getName())
                    .phone(customer.getPhone())
                    .email(customer.getEmail())
                    .address(customer.getAddress())
                    .status(customer.getStatus())
                    .orders(customer.getOrders())
                    .satisfactionLevel(customer.getSatisfactionLevel())
                    .preferredCategories(customer.getPreferredCategories())
                    .gstNo(customer.getGstNo())
                    .dateOfJoining(customer.getDateOfJoining())
                    .totalOrderValue(totalOrderValue)
                    .lastOrderDate(lastOrderDate)
                    .lastFiveMonthsOrders(lastFiveMonthsOrders)
                    .orderFrequency(orderFrequency)
                    .build();
        }).collect(Collectors.toList());
    }


    public CustomerDTO getCustomerByOrgAndId(ObjectId orgId, ObjectId id) {
        Customer customer = customerRepository.findByOrgIdAndId(orgId, id)
                .orElseThrow(() -> new RuntimeException("Customer Not Found!"));

        double totalOrderValue = customer.getOrders().stream()
                .mapToDouble(CustomerOrder::getTotalAmount)
                .sum();

        Date lastOrderDate = customer.getOrders().stream()
                .map(CustomerOrder::getOrderDate).
                max(Date::compareTo).
                orElse(null);

        LocalDate fiveMonthsAgo = LocalDate.now().minusMonths(5);
        ArrayList<CustomerOrder> lastFiveMonthsOrders = customer.getOrders().stream()
                .filter(o -> o.getOrderDate().toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate()
                        .isAfter(fiveMonthsAgo))
                .collect(Collectors.toCollection(ArrayList::new));

        long monthsSinceJoining = ChronoUnit.MONTHS.between(
                customer.getDateOfJoining().toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate(),
                LocalDate.now()
        );

        double orderFrequency = monthsSinceJoining > 0
                ? (double) customer.getOrders().size() / monthsSinceJoining
                : customer.getOrders().size();

        return CustomerDTO.builder().id(customer.getId().toString())
                .orgId(customer.getOrgId().toString())
                .customerId(customer.getCustomerId())
                .name(customer.getName())
                .phone(customer.getPhone())
                .email(customer.getEmail())
                .address(customer.getAddress())
                .status(customer.getStatus())
                .orders(customer.getOrders())
                .satisfactionLevel(customer.getSatisfactionLevel())
                .preferredCategories(customer.getPreferredCategories())
                .gstNo(customer.getGstNo())
                .dateOfJoining(customer.getDateOfJoining())
                .totalOrderValue(totalOrderValue)
                .lastOrderDate(lastOrderDate)
                .lastFiveMonthsOrders(lastFiveMonthsOrders)
                .orderFrequency(orderFrequency).build();
    }

    private String generateCustomerId(ObjectId orgId) {
        List<Customer> customers = customerRepository.findByOrgId(orgId);

        if (customers.isEmpty()) return "CUST-001";

        int maxId = customers.stream()
                .map(Customer::getCustomerId)
                .filter(id -> id != null && id.startsWith("CUST-"))
                .map(id -> id.substring(5)) // remove "CUST-"
                .filter(num -> num.matches("\\d+")) // keep only numeric parts
                .mapToInt(Integer::parseInt)
                .max()
                .orElse(0);
        System.out.println(maxId);

        int nextId = maxId + 1;

        return String.format("CUST-%03d", nextId);
    }

    public Customer createCustomer(Customer customer) {
        if (customer.getId() != null && customerRepository.existsById(customer.getId())) {
            throw new RuntimeException("Customer with the same id already exists!");
        }

        if (customer.getEmail() != null && customerRepository.existsByEmail(customer.getEmail())) {
            throw new RuntimeException("Customer with the same email already exists!");
        }

        if (customer.getPhone() != null && customerRepository.existsByPhone(customer.getPhone())) {
            throw new RuntimeException("Customer with the same phone number already exists!");
        }

        if (customer.getGstNo() != null && customerRepository.existsByGstNo(customer.getGstNo())) {
            throw new RuntimeException("Customer with the same GST number already exists!");
        }

        customer.setCustomerId(generateCustomerId(customer.getOrgId()));

        customer.setSatisfactionLevel(new ArrayList<>());
        return customerRepository.save(customer);
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

        return customerRepository.save(existingCustomer);
    }

    public void deleteCustomerForOrg(ObjectId orgId, ObjectId id) {
        if (!customerRepository.existsByOrgIdAndId(orgId, id)) {
            throw new RuntimeException("Customer not found!");
        }
        customerRepository.deleteByOrgIdAndId(orgId, id);
    }
}
