package com.example.pambanswami.controller;

import com.example.pambanswami.entity.AdminAccount;
import com.example.pambanswami.repository.AdminAccountRepository;

import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class AdminLoginController {

    @Value("${admin.username}")
    private String adminUsername;

    @Value("${admin.password}")
    private String adminPassword;

    private final AdminAccountRepository repository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AdminLoginController(AdminAccountRepository repository) {
        this.repository = repository;
    }

    @PostMapping("/admin/login")
    public String login(
            @RequestParam String username,
            @RequestParam String password,
            HttpSession session) {

        // Main Admin login
        if (adminUsername.equals(username)
                && adminPassword.equals(password)) {

            session.setAttribute("adminLoggedIn", true);
            session.setAttribute("loggedInUsername", username);
            session.setAttribute("userRole", "ADMIN");

            return "redirect:/admin";
        }

        // Staff account login from MySQL
        AdminAccount account = repository.findByUsername(username)
                .orElse(null);

        if (account != null
                && account.isActive()
                && passwordEncoder.matches(
                        password, account.getPassword())) {

            session.setAttribute("adminLoggedIn", true);
            session.setAttribute("loggedInUsername", account.getUsername());
            session.setAttribute("userRole", "STAFF");

            return "redirect:/admin";
        }

        return "redirect:/login.html?error=true";
    }
}
