package ies.project.busrush.dto.cache;

import java.io.Serializable;

public class BusBasicDtoc implements Serializable {

    private static final long serialVersionUID = 1L;

    private String id;
    private String registration;
    private String brand;
    private String model;

    public BusBasicDtoc(String id, String registration, String brand, String model) {
        this.id = id;
        this.registration = registration;
        this.brand = brand;
        this.model = model;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRegistration() {
        return registration;
    }

    public void setRegistration(String registration) {
        this.registration = registration;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }
}
