package ies.project.busrush.dto.cache;

import java.io.Serializable;
import java.time.LocalTime;

public class InfoScheduleDtoc implements Serializable {

    private static final long serialVersionUID = 1L;

    private String id;
    private BusBasicDtoc bus;
    private Integer passengers;
    private StopBasicDtoc nextStop;
    private LocalTime time;
    private Double delay;

    public InfoScheduleDtoc(String id, BusBasicDtoc bus, Integer passengers, StopBasicDtoc nextStop, LocalTime time, Double delay) {
        this.id = id;
        this.bus = bus;
        this.passengers = passengers;
        this.nextStop = nextStop;
        this.time = time;
        this.delay = delay;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public BusBasicDtoc getBus() {
        return bus;
    }

    public void setBus(BusBasicDtoc bus) {
        this.bus = bus;
    }

    public Integer getPassengers() {
        return passengers;
    }

    public void setPassengers(Integer passengers) {
        this.passengers = passengers;
    }

    public StopBasicDtoc getNextStop() {
        return nextStop;
    }

    public void setNextStop(StopBasicDtoc nextStop) {
        this.nextStop = nextStop;
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

    public String toString() {
        return "InfoScheduleDtoc{" +
                "id='" + id + '\'' +
                ", bus='" + bus + '\'' +
                ", passengers=" + passengers +
                ", nextStop='" + nextStop + '\'' +
                ", time='" + time + '\'' +
                ", delay=" + delay +
                '}';
    }
}
