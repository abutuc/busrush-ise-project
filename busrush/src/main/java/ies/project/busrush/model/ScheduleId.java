package ies.project.busrush.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import javax.persistence.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class ScheduleId implements Serializable {
    @Column(name = "route_id")
    private RouteId routeId;
    @Column(name = "stop_id")
    private String stopId;
    @Column(name = "sequence")
    private Integer sequence;
    public static ScheduleId fromString(String id) {
        String[] split = id.split("_");
        return new ScheduleId(new RouteId(split[0], split[1]), split[2], Integer.parseInt(split[3]));
    }
    @Override
    public String toString() {
        return routeId.toString() + "_" + stopId + "_" + sequence.toString();
    }
}
