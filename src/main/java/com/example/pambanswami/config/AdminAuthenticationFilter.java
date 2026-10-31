
package com.example.pambanswami.config;

import java.io.IOException;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Component
public class AdminAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI()
                .substring(request.getContextPath().length());

        String method = request.getMethod();

        HttpSession session = request.getSession(false);

        boolean loggedIn = session != null
                && Boolean.TRUE.equals(session.getAttribute("adminLoggedIn"));

        String role = loggedIn
                ? (String) session.getAttribute("userRole")
                : null;

        boolean isAdmin = "ADMIN".equals(role);
        boolean isStaff = "STAFF".equals(role);

        // Protect admin dashboard
        if (path.equals("/admin") || path.equals("/admin.html")) {

            if (!isAdmin && !isStaff) {
                response.sendRedirect(request.getContextPath() + "/login.html");
                return;
            }

            setNoCacheHeaders(response);
        }

        // Protect all admin account APIs
        if (path.startsWith("/api/admin-accounts")) {

            if (!isAdmin) {
                response.sendError(HttpServletResponse.SC_FORBIDDEN,
                        "Only Admin can manage staff accounts.");
                return;
            }
        }

        // Protect admin-only APIs
        if (path.startsWith("/api/admin/")) {

            if (!isAdmin) {
                response.sendError(HttpServletResponse.SC_FORBIDDEN,
                        "Admin permission required.");
                return;
            }
        }

        // Appointment management permissions
        if (path.equals("/api/callback-requests")) {

            // Public customer appointment submission
            if ("POST".equals(method)) {
                filterChain.doFilter(request, response);
                return;
            }

            // Admin and Staff can view appointments
            if ("GET".equals(method)) {

                if (!isAdmin && !isStaff) {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED,
                            "Login required.");
                    return;
                }
            } else {
                response.sendError(HttpServletResponse.SC_FORBIDDEN);
                return;
            }
        }

        if (path.matches("/api/callback-requests/\\d+/status")
                || path.matches("/api/callback-requests/\\d+")) {

            if (!isAdmin && !isStaff) {
                response.sendError(HttpServletResponse.SC_FORBIDDEN,
                        "Admin or Staff login required.");
                return;
            }
        }

        // All other API modifications require Admin
        if (path.startsWith("/api/")
                && !path.equals("/api/callback-requests")
                && !path.matches("/api/callback-requests/\\d+/status")
                && !path.matches("/api/callback-requests/\\d+")
                && !path.startsWith("/api/admin-accounts")
                && !path.startsWith("/api/admin/")
                && !("GET".equals(method) || "HEAD".equals(method))) {

            if (!isAdmin) {
                response.sendError(HttpServletResponse.SC_FORBIDDEN,
                        "Only Admin can modify website content.");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private void setNoCacheHeaders(HttpServletResponse response) {
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setDateHeader("Expires", 0);
    }
}
