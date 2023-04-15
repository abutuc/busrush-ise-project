package ies.project.busrush.dto.cache;

import java.io.Serializable;
import java.time.LocalTime;

public class NextScheduleDtoc implements Serializable {
    private String id;
    private RouteBasicDtoc route;
    private LocalTime time;
    private Double delay;

    public NextScheduleDtoc(String id, RouteBasicDtoc route, LocalTime time, Double delay) {
        this.id = id;
        this.route = route;
        this.time = time;
        this.delay = delay;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public RouteBasicDtoc getRoute() {
        return route;
    }

    public void setRoute(RouteBasicDtoc route) {
        this.route = route;
    }

    public LocalTime getTime() {
        return time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }

    public Double getDelay() {
        return delay;
    }

    public void setDelay(Double delay) {
        this.delay = delay;
    }
}
