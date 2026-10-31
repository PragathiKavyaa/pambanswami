
package com.example.pambanswami.controller;

import com.example.pambanswami.entity.AdminAccount;
import com.example.pambanswami.repository.AdminAccountRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin-accounts")
public class AdminAccountController {

    private final AdminAccountRepository repository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AdminAccountController(AdminAccountRepository repository) {
        this.repository = repository;
    }

    // Display all accounts without passwords
    @GetMapping
    public List<Map<String, Object>> getAccounts() {

        return repository.findAll().stream()
                .map(account -> Map.<String, Object>of(
                        "id", account.getId(),
                        "username", account.getUsername(),
                        "role", account.getRole(),
                        "active", account.isActive(),
                        "createdAt", account.getCreatedAt()))
                .toList();
    }

    // Create a new Staff account
    @PostMapping
    public ResponseEntity<?> createAccount(
            @RequestBody Map<String, String> data) {

        String username = data.getOrDefault("username", "").trim();
        String password = data.getOrDefault("password", "").trim();

        if (username.isEmpty() || password.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("Username and password are required.");
        }

        if (password.length() < 8) {
            return ResponseEntity.badRequest()
                    .body("Password must contain at least 8 characters.");
        }

        if (repository.existsByUsername(username)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Username already exists.");
        }

        AdminAccount account = new AdminAccount();

        account.setUsername(username);
        account.setPassword(passwordEncoder.encode(password));
        account.setRole("STAFF");
        account.setActive(true);

        repository.save(account);

        return ResponseEntity.ok("Staff account created successfully.");
    }

    // Update an existing Staff account
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAccount(
            @PathVariable Long id,
            @RequestBody Map<String, String> data) {

        AdminAccount account = repository.findById(id).orElse(null);

        if (account == null) {
            return ResponseEntity.notFound().build();
        }

        String username = data.getOrDefault("username", "").trim();
        String password = data.getOrDefault("password", "").trim();

        if (username.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("Username is required.");
        }

        if (repository.findByUsername(username)
                .filter(existing -> !existing.getId().equals(id))
                .isPresent()) {

            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Username already exists.");
        }

        account.setUsername(username);

        if (!password.isEmpty()) {

            if (password.length() < 8) {
                return ResponseEntity.badRequest()
                        .body("Password must contain at least 8 characters.");
            }

            account.setPassword(passwordEncoder.encode(password));
        }

        repository.save(account);

        return ResponseEntity.ok("Staff account updated successfully.");
    }

    // Activate or deactivate an account
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> data) {

        AdminAccount account = repository.findById(id).orElse(null);

        if (account == null) {
            return ResponseEntity.notFound().build();
        }

        Boolean active = data.get("active");

        if (active == null) {
            return ResponseEntity.badRequest()
                    .body("Account status is required.");
        }

        account.setActive(active);
        repository.save(account);

        return ResponseEntity.ok("Account status updated successfully.");
    }

    // Delete an account
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable Long id) {

        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        repository.deleteById(id);

        return ResponseEntity.ok("Staff account deleted successfully.");
    }
}
