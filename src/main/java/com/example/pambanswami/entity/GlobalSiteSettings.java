package com.example.pambanswami.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "global_site_settings")
public class GlobalSiteSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String brandName;

    private String logoImage;

    @Column(columnDefinition = "TEXT")
    private String footerDesc;

    private String footerPhoneString;

    private String footerEmailString;

    private String footerCityString;

    @Column(columnDefinition = "TEXT")
    private String findUsLocationString;

    @Column(columnDefinition = "TEXT")
    private String findUsMapUrl;

    private String copyrightText;

    private String headerPhone;

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBrandName() {
        return brandName;
    }

    public void setBrandName(String brandName) {
        this.brandName = brandName;
    }

    public String getLogoImage() {
        return logoImage;
    }

    public void setLogoImage(String logoImage) {
        this.logoImage = logoImage;
    }

    public String getFooterDesc() {
        return footerDesc;
    }

    public void setFooterDesc(String footerDesc) {
        this.footerDesc = footerDesc;
    }

    public String getFooterPhoneString() {
        return footerPhoneString;
    }

    public void setFooterPhoneString(String footerPhoneString) {
        this.footerPhoneString = footerPhoneString;
    }

    public String getFooterEmailString() {
        return footerEmailString;
    }

    public void setFooterEmailString(String footerEmailString) {
        this.footerEmailString = footerEmailString;
    }

    public String getFooterCityString() {
        return footerCityString;
    }

    public void setFooterCityString(String footerCityString) {
        this.footerCityString = footerCityString;
    }

    public String getFindUsLocationString() {
        return findUsLocationString;
    }

    public void setFindUsLocationString(String findUsLocationString) {
        this.findUsLocationString = findUsLocationString;
    }

    public String getFindUsMapUrl() {
        return findUsMapUrl;
    }

    public void setFindUsMapUrl(String findUsMapUrl) {
        this.findUsMapUrl = findUsMapUrl;
    }

    public String getCopyrightText() {
        return copyrightText;
    }

    public void setCopyrightText(String copyrightText) {
        this.copyrightText = copyrightText;
    }

    public String getHeaderPhone() {
        return headerPhone;
    }

    public void setHeaderPhone(String headerPhone) {
        this.headerPhone = headerPhone;
    }
}