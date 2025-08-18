package com.anujsamdariya07.nightshiftInventory.services;

import com.anujsamdariya07.nightshiftInventory.controllers.CookieUtil;
import com.anujsamdariya07.nightshiftInventory.entity.Employee;
import com.anujsamdariya07.nightshiftInventory.repository.EmployeeRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {
    @Autowired
    private EmployeeRepository employeeRepository;

    private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Employee getCurrentUser(HttpServletRequest request) {
        String userId = CookieUtil.getCookieValue(request, "loggedInUser");

        if (userId == null || userId.isEmpty()) {
            throw new RuntimeException("User not logged in.");
        }

        return getEmployeeById(new ObjectId(userId)).orElseThrow(() -> new RuntimeException("Error while getting current user!"));
    }

    public List<Employee> getEmployeesByOrgId(ObjectId orgId) {
        return employeeRepository.findByOrgId(orgId);
    }

    public Optional<Employee> getEmployeeById(ObjectId employeeId) {
        return employeeRepository.findById(employeeId);
    }

    public void saveNewAdminEmployee(Employee employee) {
        try {
            employee.setPassword(passwordEncoder.encode(employee.getPassword()));
            employee.setRole("admin");
            employeeRepository.save(employee);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public Employee saveNewEmployee(Employee employee) {
        try {
            if (employee.getPassword() == null) {
                employee.setPassword(passwordEncoder.encode("pwd"));
            }
            employee.setPassword(passwordEncoder.encode(employee.getPassword()));
            employee.setRole("worker");
            return employeeRepository.save(employee);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public boolean employeeExistsByUsernameAndOrgId(String username, ObjectId orgId) {
        if (employeeRepository.existsByUsernameAndOrgId(username, orgId)) {
            return true;
        }
        return false;
    }

    public Optional<Employee> loginEmployee(String username, String password) {
        if (username == null || password == null) {
            return Optional.empty();
        }

        Optional<Employee> employeeOptional = employeeRepository.findByUsername(username);
        if (employeeOptional.isPresent()) {
            Employee employee = employeeOptional.get();
            boolean passwordMatches = passwordEncoder.matches(password, employee.getPassword());

            if (passwordMatches) {
                return Optional.of(employee);
            }
        }

        return Optional.empty();
    }

    public Employee updateEmployee(ObjectId employeeId, Employee updatedEmployeeData) {
        Optional<Employee> existingEmployeeOpt = employeeRepository.findById(employeeId);

        if (existingEmployeeOpt.isEmpty()) {
            throw new RuntimeException("Employee not found");
        }

        Employee existingEmployee = existingEmployeeOpt.get();

        // Update only the fields you want to allow editing
        if (updatedEmployeeData.getName() != null) existingEmployee.setName(updatedEmployeeData.getName());
        if (updatedEmployeeData.getRole() != null) existingEmployee.setRole(updatedEmployeeData.getRole());
        if (updatedEmployeeData.getMobileNo() != null && !employeeRepository.existsByMobileNo(updatedEmployeeData.getMobileNo())) existingEmployee.setMobileNo(updatedEmployeeData.getMobileNo());
        if (updatedEmployeeData.getAddress() != null) existingEmployee.setAddress(updatedEmployeeData.getAddress());

        if (updatedEmployeeData.getPassword() != null &&
                !passwordEncoder.matches(updatedEmployeeData.getPassword(), existingEmployee.getPassword())) {
            existingEmployee.setPassword(passwordEncoder.encode(updatedEmployeeData.getPassword()));
        }

        return employeeRepository.save(existingEmployee);
    }

    public void deleteEmployeeById(ObjectId employeeId) {
        Optional<Employee> employeeOpt = employeeRepository.findById(employeeId);

        if (employeeOpt.isEmpty()) {
            throw new RuntimeException("Employee not found for deletion");
        }

        employeeRepository.deleteById(employeeId);
    }

}
