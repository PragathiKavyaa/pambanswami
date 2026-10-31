package com.example.pambanswami.repository;

import com.example.pambanswami.entity.PhysioService;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PhysioServiceRepository
                extends JpaRepository<PhysioService, Long> {
}
