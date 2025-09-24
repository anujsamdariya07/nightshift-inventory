package com.anujsamdariya07.nightshiftInventory.services;

import com.anujsamdariya07.nightshiftInventory.controllers.CookieUtil;
import com.anujsamdariya07.nightshiftInventory.entity.Customer;
import com.anujsamdariya07.nightshiftInventory.entity.Employee;
import com.anujsamdariya07.nightshiftInventory.repository.EmployeeRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class EmployeeService {
    @Autowired
    private EmployeeRepository employeeRepository;

    private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Employee getCurrentUser(HttpServletRequest request) {
        String userId = CookieUtil.getCookieValue(request, "loggedInUser");
//        System.out.println(userId);

        if (userId == null || userId.isEmpty()) {
            throw new RuntimeException("User not logged in!");
        }

        return getEmployeeById(new ObjectId(userId));
    }

    public List<Employee> getEmployeesByOrgId(ObjectId orgId) {
        return employeeRepository.findByOrgId(orgId);
    }

    public Employee getEmployeeById(ObjectId id) {
//        System.out.println("userId: " + id);
//        System.out.println("Hey over here!");
//        Optional<Employee> employeeById = employeeRepository.findById(id);
//        if (employeeById.isEmpty()) {
//            System.out.println("No over here!");
//            throw new NoSuchElementException("Employee does not exists!");
//        }
//        return employeeById.get();
        Optional<Employee> employee = employeeRepository.findById(id);
//        System.out.println("employee: " + employee.isPresent());
        return employee.get();
    }

    private String generateEmployeeId(ObjectId orgId) {
        List<Employee> employees = employeeRepository.findByOrgId(orgId);

        if (employees.isEmpty()) return "EMP-101";

        int maxId = employees.stream()
                .map(Employee::getEmployeeId)
                .filter(id -> id != null && id.startsWith("EMP-"))
                .map(id -> id.substring(4))
                .filter(num -> num.matches("\\d+"))
                .mapToInt(Integer::parseInt)
                .max()
                .orElse(0);
        System.out.println(maxId);

        int nextId = maxId + 1;

        return String.format("EMP-%03d", nextId);
    }

    public Employee saveNewAdminEmployee(Employee employee) {
        try {
            employee.setPassword(passwordEncoder.encode(employee.getPassword()));
            employee.setRole(Employee.Role.ADMIN);
            employee.setEmployeeId(generateEmployeeId(employee.getOrgId()));
            return employeeRepository.save(employee);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public Employee saveNewEmployee(Employee employee) {
        try {
            System.out.println("Save New Employee!");
            employee.setPassword(passwordEncoder.encode("pwd"));
            employee.setRole(Employee.Role.WORKER);
            employee.setEmployeeId(generateEmployeeId(employee.getOrgId()));
            return employeeRepository.save(employee);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public boolean employeeExistsByEmailAndOrgId(String email, ObjectId orgId) {
        return employeeRepository.existsByEmailAndOrgId(email, orgId);
    }

    public Optional<Employee> loginEmployee(String email, String password) {
        if (email == null || password == null) return Optional.empty();

        System.out.println("Email: " + email + ", Password: " + password);

        Optional<Employee> employeeByEmail = employeeRepository.findByEmail(email);
        System.out.println("employeeByEmail: " + employeeByEmail.get());
        if (employeeByEmail.isPresent()) {
            Employee employee = employeeByEmail.get();

            System.out.println("employee.getPassword(): " + employee.getPassword());

            boolean passwordMatches = passwordEncoder.matches(password, employee.getPassword());

            if (passwordMatches) return Optional.of(employee);
        }

        return Optional.empty();
    }

    public Employee updateEmployee(ObjectId id, Employee updateEmployeeData) {
        System.out.println("updateEmployeeData: " + updateEmployeeData.getEmail());

        Optional<Employee> employeeById = employeeRepository.findById(id);
        if (employeeById.isEmpty()) {
            throw new NoSuchElementException("Employee Not Found!");
        }

        Employee existingEmployee = employeeById.get();
        System.out.println(updateEmployeeData.getEmail() != null && !employeeRepository.existsByEmail(updateEmployeeData.getEmail()));

        if (updateEmployeeData.getName() != null) {
            existingEmployee.setName(updateEmployeeData.getName());
        }
        if (updateEmployeeData.getRole() != null) existingEmployee.setRole(updateEmployeeData.getRole());
        if (updateEmployeeData.getStatus() != null) existingEmployee.setStatus(updateEmployeeData.getStatus());
        if (updateEmployeeData.getPhone() != null && !employeeRepository.existsByPhone(updateEmployeeData.getPhone())) {
            existingEmployee.setPhone(updateEmployeeData.getPhone());
        }
        if (updateEmployeeData.getEmail() != null && !employeeRepository.existsByEmail(updateEmployeeData.getEmail())) {
//            System.out.println("HERE");
            existingEmployee.setEmail(updateEmployeeData.getEmail());
        }
        if (updateEmployeeData.getLocation() != null) existingEmployee.setLocation(updateEmployeeData.getLocation());

        if (updateEmployeeData.getPassword() != null &&
                !passwordEncoder.matches(updateEmployeeData.getPassword(), existingEmployee.getPassword())) {
            existingEmployee.setPassword(passwordEncoder.encode(updateEmployeeData.getPassword()));
        }
        if (updateEmployeeData.getPassword() != null &&
                passwordEncoder.matches(updateEmployeeData.getPassword(), existingEmployee.getPassword())) {
            throw new RuntimeException("You have the entered the same password!");
        }

        return employeeRepository.save(existingEmployee);
    }

    public void deleteEmployeeById(ObjectId id) {
        employeeRepository.deleteById(id);
    }

    public void changePassword(HttpServletRequest request, String password) {
        String decodedPassword = URLDecoder.decode(password, StandardCharsets.UTF_8);
        System.out.println("Inside employee service, password: " + decodedPassword);
        Employee currentUser = getCurrentUser(request);
        System.out.println("Current User's ID: " + currentUser.getEmployeeId());
        System.out.println("New Password: " + decodedPassword);
        currentUser.setPassword(passwordEncoder.encode(decodedPassword));
        currentUser.setMustChangePassword(false);
        employeeRepository.save(currentUser);
    }
}