package ies.project.busrush.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "schedules")
public class Schedule {
    @EmbeddedId
    private ScheduleId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("routeId")
    //@JoinColumn(name = "route_id")
    private Route route;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("stopId")
    //@JoinColumn(name = "stop_id")
    private Stop stop;

    @Column(name = "time", nullable = false)
    private LocalTime time;
}
