package com.example.pambanswami.config;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        // Home Care uploaded images
        Path homeCareDirectory = Paths.get("uploads/home-care-services")
                .toAbsolutePath()
                .normalize();

        registry.addResourceHandler("/uploads/home-care-services/**")
                .addResourceLocations(homeCareDirectory.toUri().toString());

        // Physiotherapy uploaded images
        Path physioDirectory = Paths.get("uploads/physio-services")
                .toAbsolutePath()
                .normalize();

        registry.addResourceHandler("/uploads/physio-services/**")
                .addResourceLocations(physioDirectory.toUri().toString());

        // Website logo and other global site assets
        Path siteAssetsDirectory = Paths.get("uploads/site-assets")
                .toAbsolutePath()
                .normalize();

        registry.addResourceHandler("/uploads/site-assets/**")
                .addResourceLocations(siteAssetsDirectory.toUri().toString());
    }
}