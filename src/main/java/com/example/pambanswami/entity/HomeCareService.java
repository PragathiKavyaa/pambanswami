
package com.example.pambanswami.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "home_care_services")
public class HomeCareService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String serviceTitle;

    private String serviceEmoji;

    private String themeColor;

    private String serviceImage;

    public HomeCareService() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getServiceTitle() {
        return serviceTitle;
    }

    public void setServiceTitle(String serviceTitle) {
        this.serviceTitle = serviceTitle;
    }

    public String getServiceEmoji() {
        return serviceEmoji;
    }

    public void setServiceEmoji(String serviceEmoji) {
        this.serviceEmoji = serviceEmoji;
    }

    public String getThemeColor() {
        return themeColor;
    }

    public void setThemeColor(String themeColor) {
        this.themeColor = themeColor;
    }

    public String getServiceImage() {
        return serviceImage;
    }

    public void setServiceImage(String serviceImage) {
        this.serviceImage = serviceImage;
    }
}
