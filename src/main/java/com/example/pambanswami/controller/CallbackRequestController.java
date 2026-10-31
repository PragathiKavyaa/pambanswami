package com.example.pambanswami.controller;

import com.example.pambanswami.entity.CallbackRequest;
import com.example.pambanswami.repository.CallbackRequestRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/callback-requests")
public class CallbackRequestController {

    private final CallbackRequestRepository repository;

    public CallbackRequestController(CallbackRequestRepository repository) {
        this.repository = repository;
    }

    // Customer submits callback request
    @PostMapping
    public ResponseEntity<CallbackRequest> submitRequest(
            @RequestBody CallbackRequest request) {

        if (request.getFullName() == null || request.getFullName().isBlank()
                || request.getPhoneNumber() == null || request.getPhoneNumber().isBlank()
                || request.getPatientAge() == null
                || request.getPatientAge() < 0 || request.getPatientAge() > 120
                || request.getPatientGender() == null || request.getPatientGender().isBlank()
                || request.getSelectedServiceCategory() == null
                || request.getRequestedServiceType() == null
                || request.getRequestedServiceType().isBlank()) {

            return ResponseEntity.badRequest().build();
        }

        request.setId(null);
        request.setCreatedAt(null);
        request.setStatus("Pending");

        return ResponseEntity.ok(repository.save(request));
    }

    // Admin gets all callback requests
    @GetMapping
    public List<CallbackRequest> getAllRequests() {
        return repository.findAll();
    }

    // Admin updates callback status
    @PutMapping("/{id}/status")
    public ResponseEntity<CallbackRequest> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        if (!List.of("Pending", "Contacted", "Completed").contains(status)) {
            return ResponseEntity.badRequest().build();
        }

        return repository.findById(id)
                .map(request -> {
                    request.setStatus(status);
                    return ResponseEntity.ok(repository.save(request));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Admin deletes callback request
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {

        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        repository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}