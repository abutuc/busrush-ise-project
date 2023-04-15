package ies.project.busrush.model.cassandra;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.*; 

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CurrentLocation {  
    private String bus_id;
    private List<Double> position; 

    @Override
    public String toString() {
        return "CurrentLocation{" +
            "latitude=" + position.get(0) +
            ", longitude=" + position.get(1) +
            '}';
    }
}
