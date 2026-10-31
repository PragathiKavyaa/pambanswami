package com.example.pambanswami.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.pambanswami.entity.HomeCareService;
import com.example.pambanswami.repository.HomeCareServiceRepository;

@RestController
@RequestMapping("/api/home-care-services")
public class HomeCareServiceController {

    private final HomeCareServiceRepository repository;

    private final Path uploadDirectory = Paths.get("uploads/home-care-services").toAbsolutePath().normalize();

    public HomeCareServiceController(HomeCareServiceRepository repository) {
        this.repository = repository;
    }

    // GET: Display all services
    @GetMapping
    public List<HomeCareService> getAllServices() {
        return repository.findAll();
    }

    // POST: Add a new service
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addService(
            @RequestParam String serviceTitle,
            @RequestParam(required = false) String serviceEmoji,
            @RequestParam String serviceThemeColor,
            @RequestParam(required = false) MultipartFile serviceImageFile) {

        try {
            HomeCareService service = new HomeCareService();

            service.setServiceTitle(serviceTitle);
            service.setServiceEmoji(serviceEmoji);
            service.setThemeColor(serviceThemeColor);

            if (serviceImageFile != null && !serviceImageFile.isEmpty()) {
                service.setServiceImage(saveImage(serviceImageFile));
            }

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(repository.save(service));

        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body("Unable to upload service image.");
        }
    }

    // PUT: Edit an existing service
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateService(
            @PathVariable Long id,
            @RequestParam String serviceTitle,
            @RequestParam(required = false) String serviceEmoji,
            @RequestParam String serviceThemeColor,
            @RequestParam(required = false) MultipartFile serviceImageFile) {

        return repository.findById(id).map(service -> {
            try {
                service.setServiceTitle(serviceTitle);
                service.setServiceEmoji(serviceEmoji);
                service.setThemeColor(serviceThemeColor);

                if (serviceImageFile != null && !serviceImageFile.isEmpty()) {
                    String oldImage = service.getServiceImage();
                    service.setServiceImage(saveImage(serviceImageFile));
                    deleteImage(oldImage);
                }

                return ResponseEntity.ok(repository.save(service));

            } catch (IOException e) {
                return ResponseEntity.internalServerError()
                        .body("Unable to update service image.");
            }
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // DELETE: Remove a service
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteService(@PathVariable Long id) {

        return repository.findById(id).map(service -> {
            deleteImage(service.getServiceImage());
            repository.delete(service);

            return ResponseEntity.ok("Service deleted successfully.");

        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Save uploaded image
    private String saveImage(MultipartFile file) throws IOException {

        Files.createDirectories(uploadDirectory);

        String originalName = file.getOriginalFilename();
        String extension = "";

        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf("."));
        }

        String fileName = UUID.randomUUID() + extension;

        Path targetPath = uploadDirectory.resolve(fileName).normalize();

        if (!targetPath.startsWith(uploadDirectory)) {
            throw new IOException("Invalid image path.");
        }

        file.transferTo(targetPath);

        return "/uploads/home-care-services/" + fileName;
    }

    // Delete uploaded image
    private void deleteImage(String imagePath) {

        if (imagePath == null || imagePath.isBlank()) {
            return;
        }

        try {
            String fileName = Paths.get(imagePath).getFileName().toString();
            Files.deleteIfExists(uploadDirectory.resolve(fileName));
        } catch (IOException e) {
            System.err.println("Could not delete old service image: " + e.getMessage());
        }
    }
}
