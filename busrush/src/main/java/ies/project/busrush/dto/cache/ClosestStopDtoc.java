package ies.project.busrush.dto.cache;

import java.io.Serializable;

public class ClosestStopDtoc implements Serializable {

    private static final long serialVersionUID = 1L;

    private String id;
    private String designation;
    private Double[] position;
    private Double distance;

    public ClosestStopDtoc(String id, String designation, Double[] position, Double distance) {
        this.id = id;
        this.designation = designation;
        this.position = position;
        this.distance = distance;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public Double[] getPosition() {
        return position;
    }

    public void setPosition(Double[] position) {
        this.position = position;
    }

    public Double getDistance() {
        return distance;
    }

    public void setDistance(Double distance) {
        this.distance = distance;
    }

    public String toString() {
        return "ClosestStopDtoc{" +
                "id='" + id + '\'' +
                ", designation='" + designation + '\'' +
                ", position=" + position +
                ", distance=" + distance +
                '}';
    }
}
