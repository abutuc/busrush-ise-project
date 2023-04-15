package ies.project.busrush.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class RouteId implements Serializable {
    @Column(name = "id")
    private String id;
    @Column(name = "shift")
    private String shift;
    public static RouteId fromString(String id) {
        String[] split = id.split("_");
        return new RouteId(split[0], split[1]);
    }
    @Override
    public String toString() {
        return id + "_" + shift;
    }
}
