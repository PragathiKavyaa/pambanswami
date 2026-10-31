package com.example.pambanswami.controller;

import com.example.pambanswami.entity.PhysioService;
import com.example.pambanswami.repository.PhysioServiceRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/physio-services")
public class PhysioServiceController {

    private final PhysioServiceRepository repository;

    private final Path uploadDirectory = Paths.get("uploads/physio-services")
            .toAbsolutePath()
            .normalize();

    public PhysioServiceController(PhysioServiceRepository repository) {
        this.repository = repository;
    }

    // GET: Display all physiotherapy services
    @GetMapping
    public List<PhysioService> getAllServices() {
        return repository.findAll();
    }

    // POST: Add a new physiotherapy service
    @PostMapping
    public ResponseEntity<?> addService(
            @RequestParam String physioTitle,
            @RequestParam(required = false) String physioEmoji,
            @RequestParam String physioThemeColor,
            @RequestParam(required = false) MultipartFile physioImageFile) {
        try {
            if (physioImageFile == null || physioImageFile.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body("Please upload a physiotherapy image.");
            }

            PhysioService service = new PhysioService();

            service.setPhysioTitle(physioTitle);
            service.setPhysioEmoji(physioEmoji);
            service.setThemeColor(physioThemeColor);
            service.setPhysioImage(saveImage(physioImageFile));

            return ResponseEntity.ok(repository.save(service));

        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body("Unable to save physiotherapy image.");
        }
    }

    // PUT: Update an existing physiotherapy service
    @PutMapping("/{id}")
    public ResponseEntity<?> updateService(
            @PathVariable Long id,
            @RequestParam String physioTitle,
            @RequestParam(required = false) String physioEmoji,
            @RequestParam String physioThemeColor,
            @RequestParam(required = false) MultipartFile physioImageFile) {
        try {
            PhysioService service = repository.findById(id).orElse(null);

            if (service == null) {
                return ResponseEntity.notFound().build();
            }

            service.setPhysioTitle(physioTitle);
            service.setPhysioEmoji(physioEmoji);
            service.setThemeColor(physioThemeColor);

            if (physioImageFile != null && !physioImageFile.isEmpty()) {
                String oldImage = service.getPhysioImage();
                String newImage = saveImage(physioImageFile);

                service.setPhysioImage(newImage);
                deleteImage(oldImage);
            }

            return ResponseEntity.ok(repository.save(service));

        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body("Unable to update physiotherapy image.");
        }
    }

    // DELETE: Remove a physiotherapy service
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteService(@PathVariable Long id) {

        PhysioService service = repository.findById(id).orElse(null);

        if (service == null) {
            return ResponseEntity.notFound().build();
        }

        deleteImage(service.getPhysioImage());
        repository.delete(service);

        return ResponseEntity.ok("Physiotherapy service deleted successfully.");
    }

    // Save uploaded image
    private String saveImage(MultipartFile file) throws IOException {

        Files.createDirectories(uploadDirectory);

        String originalName = file.getOriginalFilename();
        String extension = "";

        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(
                    originalName.lastIndexOf(".")).toLowerCase();
        }

        if (!List.of(".jpg", ".jpeg", ".png", ".webp").contains(extension)) {
            throw new IOException("Only JPG, JPEG, PNG and WEBP images are allowed.");
        }

        String fileName = UUID.randomUUID() + extension;

        Path destination = uploadDirectory.resolve(fileName).normalize();

        if (!destination.startsWith(uploadDirectory)) {
            throw new IOException("Invalid image path.");
        }

        Files.copy(file.getInputStream(), destination,
                StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/physio-services/" + fileName;
    }

    // Delete old image
    private void deleteImage(String imagePath) {

        if (imagePath == null || imagePath.isBlank()) {
            return;
        }

        try {
            String fileName = Paths.get(imagePath).getFileName().toString();
            Path image = uploadDirectory.resolve(fileName).normalize();

            if (image.startsWith(uploadDirectory)) {
                Files.deleteIfExists(image);
            }

        } catch (Exception e) {
            System.err.println("Unable to delete old physiotherapy image: "
                    + e.getMessage());
        }
    }
}
