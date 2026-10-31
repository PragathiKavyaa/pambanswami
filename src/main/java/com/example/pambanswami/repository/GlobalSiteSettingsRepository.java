package com.example.pambanswami.repository;

import com.example.pambanswami.entity.GlobalSiteSettings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GlobalSiteSettingsRepository
        extends JpaRepository<GlobalSiteSettings, Long> {

    Optional<GlobalSiteSettings> findFirstByOrderByIdAsc();
}