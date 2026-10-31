package com.example.pambanswami.controller;

import com.example.pambanswami.entity.GlobalSiteSettings;
import com.example.pambanswami.repository.GlobalSiteSettingsRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/global-site-settings")
public class GlobalSiteSettingsController {

    private final GlobalSiteSettingsRepository repository;

    private final Path uploadDirectory = Paths.get("uploads/site-assets")
            .toAbsolutePath()
            .normalize();

    public GlobalSiteSettingsController(
            GlobalSiteSettingsRepository repository) {
        this.repository = repository;
    }

    // GET: Retrieve global website settings
    @GetMapping
    public ResponseEntity<GlobalSiteSettings> getSettings() {

        return repository.findFirstByOrderByIdAsc()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    // POST: Add settings or update existing settings
    @PostMapping
    public ResponseEntity<GlobalSiteSettings> addOrUpdateSettings(
            @RequestBody Map<String, String> values) {

        GlobalSiteSettings settings = repository
                .findFirstByOrderByIdAsc()
                .orElse(new GlobalSiteSettings());

        updateFields(settings, values);

        GlobalSiteSettings saved = repository.save(settings);

        return ResponseEntity.ok(saved);
    }

    // PUT: Update global settings
    @PutMapping
    public ResponseEntity<GlobalSiteSettings> updateSettings(
            @RequestBody Map<String, String> values) {

        return addOrUpdateSettings(values);
    }

    // PUT: Update an individual field
    @PutMapping("/field/{fieldName}")
    public ResponseEntity<GlobalSiteSettings> updateField(
            @PathVariable String fieldName,
            @RequestBody Map<String, String> body) {

        if (!body.containsKey("value")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Value is required.");
        }

        GlobalSiteSettings settings = repository
                .findFirstByOrderByIdAsc()
                .orElse(new GlobalSiteSettings());

        String value = body.get("value");

        setFieldValue(settings, fieldName, value);

        return ResponseEntity.ok(repository.save(settings));
    }

    // DELETE: Delete an individual field
    @DeleteMapping("/field/{fieldName}")
    public ResponseEntity<GlobalSiteSettings> deleteField(
            @PathVariable String fieldName) {

        GlobalSiteSettings settings = repository
                .findFirstByOrderByIdAsc()
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Settings not found."));

        setFieldValue(settings, fieldName, null);

        return ResponseEntity.ok(repository.save(settings));
    }

    // POST: Upload or replace website logo
    @PostMapping(value = "/logo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<GlobalSiteSettings> uploadLogo(
            @RequestParam("logo") MultipartFile logo) throws IOException {

        if (logo == null || logo.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Please select a logo image.");
        }

        if (logo.getSize() > 5 * 1024 * 1024) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Logo size must not exceed 5 MB.");
        }

        String contentType = logo.getContentType();

        if (contentType == null ||
                !contentType.matches("image/(png|jpeg|webp|gif)")) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only PNG, JPG, JPEG, WEBP and GIF images are allowed.");
        }

        String originalFilename = logo.getOriginalFilename();

        String extension = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(
                    originalFilename.lastIndexOf(".")).toLowerCase();
        }

        if (!extension.matches("\\.(png|jpg|jpeg|webp|gif)")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid logo file extension.");
        }

        Files.createDirectories(uploadDirectory);

        String newFilename = UUID.randomUUID() + extension;

        Path destination = uploadDirectory.resolve(newFilename).normalize();

        if (!destination.startsWith(uploadDirectory)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid file path.");
        }

        Files.copy(
                logo.getInputStream(),
                destination,
                StandardCopyOption.REPLACE_EXISTING);

        GlobalSiteSettings settings = repository
                .findFirstByOrderByIdAsc()
                .orElse(new GlobalSiteSettings());

        String oldLogo = settings.getLogoImage();

        settings.setLogoImage("/uploads/site-assets/" + newFilename);

        GlobalSiteSettings saved = repository.save(settings);

        // Remove the previous logo after successfully saving the new one
        deleteLogoFile(oldLogo);

        return ResponseEntity.ok(saved);
    }

    // DELETE: Remove website logo
    @DeleteMapping("/logo")
    public ResponseEntity<GlobalSiteSettings> deleteLogo() {

        GlobalSiteSettings settings = repository
                .findFirstByOrderByIdAsc()
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Settings not found."));

        String oldLogo = settings.getLogoImage();

        settings.setLogoImage(null);

        GlobalSiteSettings saved = repository.save(settings);

        deleteLogoFile(oldLogo);

        return ResponseEntity.ok(saved);
    }

    // Update only the fields supplied in the request
    private void updateFields(
            GlobalSiteSettings settings,
            Map<String, String> values) {

        values.forEach((fieldName, value) -> setFieldValue(settings, fieldName, value));
    }

    // Assign values to supported fields
    private void setFieldValue(
            GlobalSiteSettings settings,
            String fieldName,
            String value) {

        switch (fieldName) {

            case "brandName":
                settings.setBrandName(value);
                break;

            case "footerDesc":
                settings.setFooterDesc(value);
                break;

            case "footerPhoneString":
                settings.setFooterPhoneString(value);
                break;

            case "footerEmailString":
                settings.setFooterEmailString(value);
                break;

            case "footerCityString":
                settings.setFooterCityString(value);
                break;

            case "findUsLocationString":
                settings.setFindUsLocationString(value);
                break;

            case "findUsMapUrl":
                settings.setFindUsMapUrl(value);
                break;

            case "copyrightText":
                settings.setCopyrightText(value);
                break;

            case "headerPhone":
                settings.setHeaderPhone(value);
                break;

            default:
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Invalid field name: " + fieldName);
        }
    }

    // Safely delete the previous logo from the upload folder
    private void deleteLogoFile(String logoPath) {

        if (logoPath == null || logoPath.isBlank()) {
            return;
        }

        try {
            String filename = Paths.get(logoPath)
                    .getFileName()
                    .toString();

            Path file = uploadDirectory.resolve(filename).normalize();

            if (file.startsWith(uploadDirectory)) {
                Files.deleteIfExists(file);
            }

        } catch (IOException | RuntimeException exception) {
            System.err.println(
                    "Unable to delete old logo: " + exception.getMessage());
        }
    }
}