
package com.example.pambanswami.repository;

import com.example.pambanswami.entity.ContactDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContactDetailsRepository
        extends JpaRepository<ContactDetails, Long> {

    Optional<ContactDetails> findFirstByOrderByIdAsc();
}