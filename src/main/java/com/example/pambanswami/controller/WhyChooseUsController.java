package com.example.pambanswami.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.example.pambanswami.entity.WhyChooseUs;
import com.example.pambanswami.repository.WhyChooseUsRepository;

import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/why-choose-us")
@CrossOrigin(origins = "*")
public class WhyChooseUsController {

    private final WhyChooseUsRepository repository;

    public WhyChooseUsController(WhyChooseUsRepository repository) {
        this.repository = repository;
    }

    // Get all cards
    @GetMapping
    public List<WhyChooseUs> getAllCards() {
        return repository.findAll();
    }

    // Add a new card
    @PostMapping
    public WhyChooseUs addCard(@RequestBody WhyChooseUs card) {
        card.setId(null);
        return repository.save(card);
    }

    // Update an existing card
    @PutMapping("/{id}")
    public WhyChooseUs updateCard(
            @PathVariable Long id,
            @RequestBody WhyChooseUs updatedCard) {

        WhyChooseUs existingCard = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Card not found"));

        existingCard.setCardTitle(updatedCard.getCardTitle());
        existingCard.setIconType(updatedCard.getIconType());
        existingCard.setDescription(updatedCard.getDescription());

        return repository.save(existingCard);
    }

    // Delete a card
    @DeleteMapping("/{id}")
    public void deleteCard(@PathVariable Long id) {

        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Card not found");
        }

        repository.deleteById(id);
    }
}