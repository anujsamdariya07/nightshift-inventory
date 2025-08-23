package com.anujsamdariya07.nightshiftInventory.controllers;

import com.anujsamdariya07.nightshiftInventory.dto.LoginRequest;
import com.anujsamdariya07.nightshiftInventory.dto.LoginResponse;
import com.anujsamdariya07.nightshiftInventory.dto.SignupRequest;
import com.anujsamdariya07.nightshiftInventory.dto.SignupResponse;
import com.anujsamdariya07.nightshiftInventory.entity.Employee;
import com.anujsamdariya07.nightshiftInventory.entity.Organization;
import com.anujsamdariya07.nightshiftInventory.services.EmployeeService;
import com.anujsamdariya07.nightshiftInventory.services.OrganizationService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private OrganizationService organizationService;

    @Autowired
    private EmployeeService employeeService;

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        Employee currentUser = employeeService.getCurrentUser(request);
        if (currentUser != null) {
            Optional<Organization> org = organizationService.findOrgById(currentUser.getOrgId());
            return ResponseEntity.ok(currentUser);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not logged in");
    }

    @PostMapping("/sign-up")
    public ResponseEntity<?> signUp(@RequestBody SignupRequest request, HttpServletResponse response) {
        try {
            // System.out.println("HERE");

            if (organizationService.findOrgByEmail(request.getOrgEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Organization already exists with this email.");
            }
            if (organizationService.findOrgByMobileNo(request.getOrgMobileNo()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Organization already exists with this mobile number.");
            }
            if (organizationService.findOrgByGstNo(request.getOrgGstNo()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Organization already exists with this GST number.");
            }

            // 1. Create and save Organization
            Organization organization = Organization.builder()
                    .name(request.getOrgName())
                    .mobileNo(request.getOrgMobileNo())
                    .email(request.getOrgEmail())
                    .gstNo(request.getOrgGstNo())
                    .address(request.getOrgAddress())
                    .build();
            organizationService.saveOrganization(organization);

            // 2. Extract username from email
            String username = request.getOrgEmail().split("@")[0];

            // 3. Create and save Admin Employee
            Employee admin = employeeService.saveNewAdminEmployee(
                    Employee.builder()
                            .orgId(organization.getId())
                            .name(request.getOrgName())
                            .username(username)
                            .password(request.getAdminPassword())
                            .mobileNo(request.getOrgMobileNo())
                            .address(request.getOrgAddress())
                            .role("admin")
                            .mustChangePassword(true)
                            .build()
            );

            organization.getEmployeeDetails().add(admin);

            organizationService.saveOrganization(organization);

            Cookie userCookie = new Cookie("loggedInUser", admin.getId().toHexString());
            userCookie.setHttpOnly(false);
            userCookie.setSecure(false);
            userCookie.setPath("/");
            userCookie.setMaxAge(24 * 60 * 60);

            response.addCookie(userCookie);

            SignupResponse signupResponse = new SignupResponse(organization, admin, "Organization signed up successfully!");

            return ResponseEntity.status(HttpStatus.OK).body(signupResponse);
        } catch (Exception e) {
            throw new RuntimeException("Error in signing up!", e);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response, HttpServletRequest request) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        if (username == null || password == null) {
            return new ResponseEntity<>("Username or password not provided!", HttpStatus.NO_CONTENT);
        }

        Optional<Employee> employee = employeeService.loginEmployee(
                username,
                password
        );

        if (employee.isPresent()) {
            Employee e = employee.get();

            Cookie userCookie = new Cookie("loggedInUser", e.getId().toHexString());
            userCookie.setHttpOnly(false);
            userCookie.setSecure(false);
            userCookie.setPath("/");
            userCookie.setMaxAge(24 * 60 * 60);

            response.addCookie(userCookie);

            // Sanitize the response (don't return password)
//            return ResponseEntity.ok(new LoginResponse(
//                    e.getId().toHexString(),
//                    e.getOrgId(),
//                    e.getUsername(),
//                    e.getName(),
//                    e.getRole()
//            ));
            Employee currentUser = employeeService.getCurrentUser(request);
            Optional<Organization> organization = organizationService.findOrgById(currentUser.getOrgId());
            if (organization.isPresent()) {
                LoginResponse loginResponse = new LoginResponse(organization.get(), currentUser, "Logged in successfully!");
                return ResponseEntity.status(HttpStatus.OK).body(loginResponse);
            }
            LoginResponse loginResponse = new LoginResponse(null, null, "Organization not found!");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(loginResponse);
        } else {
            LoginResponse loginResponse = new LoginResponse(null, null, "Invalid username or password!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(loginResponse);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie userCookie = new Cookie("loggedInUser", null);
        userCookie.setPath("/");
        userCookie.setMaxAge(0); // Expire immediately
        response.addCookie(userCookie);
        return ResponseEntity.ok(Map.of("message", "Logged out successfully."));
    }
}
