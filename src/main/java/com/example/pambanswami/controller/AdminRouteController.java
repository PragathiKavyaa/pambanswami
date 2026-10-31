package com.example.pambanswami.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.servlet.http.HttpSession;

@Controller
public class AdminRouteController {

    @GetMapping("/admin")
    public String showAdminPanel(HttpSession session) {

        if (!Boolean.TRUE.equals(session.getAttribute("adminLoggedIn"))) {
            return "redirect:/login.html";
        }

        String role = (String) session.getAttribute("userRole");

        if (!"ADMIN".equals(role) && !"STAFF".equals(role)) {
            session.invalidate();
            return "redirect:/login.html";
        }

        return "forward:/admin.html";
    }

    @GetMapping("/admin/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login.html";
    }

    @GetMapping("/api/current-user")
    @ResponseBody
    public ResponseEntity<?> getCurrentUser(HttpSession session) {

        if (!Boolean.TRUE.equals(session.getAttribute("adminLoggedIn"))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String role = (String) session.getAttribute("userRole");

        if (!"ADMIN".equals(role) && !"STAFF".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(Map.of(
                "username", session.getAttribute("loggedInUsername"),
                "role", role));
    }
}