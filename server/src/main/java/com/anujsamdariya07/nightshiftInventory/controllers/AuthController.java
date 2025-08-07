package com.anujsamdariya07.nightshiftInventory.controllers;

import com.anujsamdariya07.nightshiftInventory.dto.LoginRequest;
import com.anujsamdariya07.nightshiftInventory.dto.LoginResponse;
import com.anujsamdariya07.nightshiftInventory.dto.SignupRequest;
import com.anujsamdariya07.nightshiftInventory.entity.Employee;
import com.anujsamdariya07.nightshiftInventory.entity.Organization;
import com.anujsamdariya07.nightshiftInventory.services.EmployeeService;
import com.anujsamdariya07.nightshiftInventory.services.OrganizationService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private OrganizationService organizationService;

    @Autowired
    private EmployeeService employeeService;

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        String userId = CookieUtil.getCookieValue(request, "loggedInUser");

        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.status(401).body("User not logged in.");
        }

        return ResponseEntity.ok(employeeService.getEmployeeById(new ObjectId(userId)));
    }

    @PostMapping("/sign-up")
    public ResponseEntity<?> signUp(@RequestBody SignupRequest request, HttpServletResponse response) {
        try {
            System.out.println("HERE");

            if (organizationService.findOrgByEmail(request.getOrgEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Organization already exists with this email.");
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
            Employee admin = Employee.builder()
                    .orgId(organization.getId().toString())
                    .employeeId("ADMIN-" + username.toUpperCase())
                    .name(request.getAdminName())
                    .username(username)
                    .password(request.getAdminPassword())
                    .mobileNo(request.getAdminMobileNo())
                    .address(request.getAdminAddress())
                    .role("admin")
                    .mustChangePassword(true)
                    .build();

            employeeService.saveNewAdminEmployee(admin);

            Cookie userCookie = new Cookie("loggedInUser", admin.getId().toHexString());
            userCookie.setHttpOnly(false);
            userCookie.setSecure(false);
            userCookie.setPath("/");
            userCookie.setMaxAge(24 * 60 * 60);

            response.addCookie(userCookie);

            return ResponseEntity.ok("Organization and Admin created successfully.");
        } catch (Exception e) {
            throw new RuntimeException("Error in signing up!", e);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
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
            return ResponseEntity.ok(new LoginResponse(
                    e.getId().toHexString(),
                    e.getOrgId(),
                    e.getUsername(),
                    e.getName(),
                    e.getRole()
            ));
        } else {
            return ResponseEntity.status(401).body("Invalid username or password.");
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
