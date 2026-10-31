
package com.example.pambanswami.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "physio_services")
public class PhysioService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String physioTitle;

    private String physioEmoji;

    private String themeColor;

    @Column(length = 1000)
    private String physioImage;

    public PhysioService() {
    }

    public Long getId() {
        return id;
    }

    public String getPhysioTitle() {
        return physioTitle;
    }

    public void setPhysioTitle(String physioTitle) {
        this.physioTitle = physioTitle;
    }

    public String getPhysioEmoji() {
        return physioEmoji;
    }

    public void setPhysioEmoji(String physioEmoji) {
        this.physioEmoji = physioEmoji;
    }

    public String getThemeColor() {
        return themeColor;
    }

    public void setThemeColor(String themeColor) {
        this.themeColor = themeColor;
    }

    public String getPhysioImage() {
        return physioImage;
    }

    public void setPhysioImage(String physioImage) {
        this.physioImage = physioImage;
    }
}
