package com.example.pambanswami.controller;

import com.example.pambanswami.entity.ContactDetails;
import com.example.pambanswami.repository.ContactDetailsRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact-details")
public class ContactDetailsController {

    private final ContactDetailsRepository repository;

    public ContactDetailsController(ContactDetailsRepository repository) {
        this.repository = repository;
    }

    // Get all contact details
    @GetMapping
    public List<ContactDetails> getAllContacts() {
        return repository.findAll();
    }

    // Add contact details
    @PostMapping
    public ContactDetails addContact(@RequestBody ContactDetails contact) {
        return repository.save(contact);
    }

    // Update contact details
    @PutMapping("/{id}")
    public ResponseEntity<ContactDetails> updateContact(
            @PathVariable Long id,
            @RequestBody ContactDetails updatedContact) {

        return repository.findById(id)
                .map(contact -> {
                    contact.setContactPhone(updatedContact.getContactPhone());
                    contact.setContactEmail(updatedContact.getContactEmail());
                    contact.setContactLocation(updatedContact.getContactLocation());
                    contact.setContactHours(updatedContact.getContactHours());

                    return ResponseEntity.ok(repository.save(contact));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete contact details
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {

        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        repository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}