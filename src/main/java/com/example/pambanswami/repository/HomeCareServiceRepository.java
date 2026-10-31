
package com.example.pambanswami.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.pambanswami.entity.HomeCareService;

@Repository
public interface HomeCareServiceRepository
                extends JpaRepository<HomeCareService, Long> {
}
