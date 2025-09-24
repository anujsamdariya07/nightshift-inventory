package com.anujsamdariya07.nightshiftInventory.controllers;

import com.anujsamdariya07.nightshiftInventory.dto.*;
import com.anujsamdariya07.nightshiftInventory.entity.Employee;
import com.anujsamdariya07.nightshiftInventory.entity.Organization;
import com.anujsamdariya07.nightshiftInventory.services.EmployeeService;
import com.anujsamdariya07.nightshiftInventory.services.OrganizationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Date;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private OrganizationService organizationService;

    @Autowired
    private EmployeeService employeeService;

//    @GetMapping("/current")
//    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
//        Employee currentUser = employeeService.getCurrentUser(request);
//        if (currentUser != null) {
//            Optional<Organization> org = organizationService.findOrgById(currentUser.getOrgId());
//        }
//    }

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        String userId = CookieUtil.getCookieValue(request, "loggedInUser");
        if (userId != null) {
            Employee currentUser = employeeService.getEmployeeById(new ObjectId(userId));
            return ResponseEntity.ok(new GetCurrentUserResponse(currentUser, "User found!"));
        }
        return ResponseEntity.status(HttpStatus.OK).body(new GetCurrentUserResponse(null, "Not logged in"));
    }

    @PostMapping("/sign-up")
    public ResponseEntity<?> signUp(@RequestBody SignupRequest request, HttpServletResponse response) {
        try {
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

            Organization organization = Organization.builder()
                    .name(request.getOrgName())
                    .mobileNo(request.getOrgMobileNo())
                    .email(request.getOrgEmail())
                    .gstNo(request.getOrgGstNo())
                    .address(request.getOrgAddress())
                    .build();
            organizationService.saveOrganization(organization);

            Employee admin = employeeService.saveNewAdminEmployee(
                    Employee.builder()
                            .orgId(organization.getId())
                            .employeeId("ADMIN-" + System.currentTimeMillis())
                            .name(request.getOrgName() + " Admin")
                            .email(request.getOrgEmail())
                            .password(request.getAdminPassword())
                            .mustChangePassword(true)
                            .role(Employee.Role.ADMIN)
                            .department("Administration")
                            .phone(request.getOrgMobileNo())
                            .location(request.getOrgAddress())
                            .status(Employee.EmployeeStatus.ACTIVE)
                            .attendance(0)
                            .hireDate(new Date())
                            .experience(0)
                            .salary(new BigDecimal("0.00"))
                            .skills(new ArrayList<>())
                            .performance(new ArrayList<>())
                            .build()
            );

            organization.getEmployeeDetails().add(admin);
            organizationService.saveOrganization(organization);

            ResponseCookie userCookie = ResponseCookie.from("loggedInUser", admin.getId().toHexString())
                    .httpOnly(true)
                    .secure(true)
                    .sameSite("None")
                    .path("/")
                    .maxAge(24 * 60 * 60)
                    .build();

            response.addHeader(HttpHeaders.SET_COOKIE, userCookie.toString());

            SignupResponse signupResponse = new SignupResponse(organization, admin, "Organization signed up successfully!");
            return ResponseEntity.status(HttpStatus.OK).body(signupResponse);

        } catch (Exception e) {
            throw new RuntimeException("Error in signing up!", e);
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response, HttpServletRequest request) {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        if (email == null || password == null) {
            return new ResponseEntity<>("Email or password not provided!", HttpStatus.NO_CONTENT);
        }

        Optional<Employee> employee = employeeService.loginEmployee(
                email,
                password
        );

        if (employee.isPresent()) {
            Employee e = employee.get();

            ResponseCookie userCookie = ResponseCookie.from("loggedInUser", e.getId().toHexString())
                    .httpOnly(true)
                    .secure(true) // true in production with https
                    .sameSite("None") // VERY IMPORTANT for cross-origin
                    .path("/")
                    .maxAge(24 * 60 * 60)
                    .build();

            response.addHeader(HttpHeaders.SET_COOKIE, userCookie.toString());

            // Sanitize the response (don't return password)
//            return ResponseEntity.ok(new LoginResponse(
//                    e.getId().toHexString(),
//                    e.getOrgId(),
//                    e.getUsername(),
//                    e.getName(),
//                    e.getRole()
//            ));
//            Employee currentUser = employeeService.getCurrentUser(request);
            Optional<Organization> organization = organizationService.findOrgById(employee.get().getOrgId());
            LoginResponse loginResponse = new LoginResponse(organization.get(), employee.get(), "Logged in successfully!");
            return ResponseEntity.status(HttpStatus.OK).body(loginResponse);
        } else {
            System.out.println("User not found!");
            LoginResponse loginResponse = new LoginResponse(null, null, "Invalid username or password!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(loginResponse);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        ResponseCookie deleteCookie = ResponseCookie.from("loggedInUser", "")
                .httpOnly(true)
                .secure(false)
                .sameSite("LAX")
                .path("/")
                .maxAge(0) // expire immediately
                .build();

        response.addHeader("Set-Cookie", deleteCookie.toString());
        return ResponseEntity.ok(Map.of("message", "Logged out successfully."));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest, HttpServletRequest request) {
        System.out.println("Inside auth controller, password: " + changePasswordRequest.getPassword());
        String decodedPassword = URLDecoder.decode(changePasswordRequest.getPassword(), StandardCharsets.UTF_8);
        employeeService.changePassword(request, decodedPassword);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
