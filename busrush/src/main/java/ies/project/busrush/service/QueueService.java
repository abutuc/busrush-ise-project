package ies.project.busrush.service;

import ies.project.busrush.model.RouteId;
import ies.project.busrush.model.Schedule;
import ies.project.busrush.model.Stop;
import ies.project.busrush.model.cassandra.RouteMetrics;
import ies.project.busrush.repository.ScheduleRepository;
import ies.project.busrush.repository.StopRepository;
import ies.project.busrush.repository.cassandra.RouteMetricsRepository;
import ies.project.busrush.util.Coordinates;
import ies.project.busrush.util.OSRMAdapter;
import ies.project.busrush.util.StopDurationIndex;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;
import ies.project.busrush.model.cassandra.BusMetrics;

import org.json.JSONObject;
import ies.project.busrush.repository.BusRepository;
import ies.project.busrush.repository.cassandra.BusMetricsRepository;


import java.time.LocalTime;

import java.util.*;

import org.json.JSONArray;


@Service
public class QueueService {
    private RabbitTemplate rabbitTemplate;
    private BusRepository busRepository;
    private ScheduleRepository scheduleRepository;
    private StopRepository stopRepository;
    private BusMetricsRepository busMetricsRepository;
    private RouteMetricsRepository routeMetricsRepository;

    @Autowired
    public QueueService(
            RabbitTemplate rabbitTemplate,
            BusRepository busRepository,
            ScheduleRepository scheduleRepository,
            StopRepository stopRepository,
            BusMetricsRepository busMetricsRepository,
            RouteMetricsRepository routeMetricsRepository
    ) {
        this.rabbitTemplate = rabbitTemplate;
        this.busRepository = busRepository;
        this.scheduleRepository = scheduleRepository;
        this.stopRepository = stopRepository;
        this.busMetricsRepository = busMetricsRepository;
        this.routeMetricsRepository = routeMetricsRepository;
    }

    @RabbitListener(queues = "devices")
    public void receiveDevices(@Payload String msg) {
        System.out.println("Received: " + msg);
        processMessage(msg);

    }

    public void sendEvents(String msg) {
        rabbitTemplate.convertAndSend("events", msg);
    }

    public void processMessage(String msg) {

        JSONObject json = new JSONObject(msg);

        String device_id = json.getString("device_id");
        String route_id = json.getString("route_id");
        String route_shift = json.getString("route_shift");
        Long timestamp = json.getLong("timestamp");
        JSONArray pos = json.getJSONArray("position");
        List<Double> position = new ArrayList<>();
        position.add(pos.getDouble(0));
        position.add(pos.getDouble(1));
        Double speed = json.getDouble("speed");
        Double fuel = json.getDouble("fuel");
        int passengers = json.getInt("passengers");

        // Get field bus_id from MySQL
        String bus_id = busRepository.findIdByDeviceId(device_id);
        System.out.println("BUS ID: " + bus_id);

        //
        // BEGIN: Compute delay
        //

        // Find all schedules and stops of the route the bus is serving
        List<Schedule> allRouteSchedules = scheduleRepository.findAllByRouteId(new RouteId(route_id, route_shift));
        List<Stop> allRouteStops = stopRepository.findAllByScheduleId(allRouteSchedules.get(0).getId());

        // Find the next stop of the bus
        StopDurationIndex busNext = OSRMAdapter.getNextStop(new Coordinates(position.get(0), position.get(1)), allRouteStops);
        // Find the schedule for the next stop of the bus
        Schedule ns = allRouteSchedules.get(busNext.getIndex());

        // Find the time of arrival (in seconds without new day wrap) to next stop
        LocalTime nsTime = ns.getTime();
        Double nsTimeSeconds = (double) nsTime.toSecondOfDay();
        // Compute the duration of the trip bus->next
        Double busNextDuration = busNext.getDuration();
        // Compute the time of arrival of the bus to next stop
        Double busTimeSeconds = (timestamp % 86400) + busNextDuration;

        // Compute the delay of the bus to next stop
        Double busDelay = busTimeSeconds - nsTimeSeconds;

        System.out.println("BUS DELAY: " + busDelay);

        //
        // END: Compute delay
        //

        // Save metrics to Cassandra
        BusMetrics busMetrics = new BusMetrics(bus_id, timestamp, route_id, route_shift, device_id, position, speed, fuel, passengers, busDelay);
        RouteMetrics routeMetrics = new RouteMetrics(route_id, route_shift, timestamp, bus_id, device_id, position, speed, fuel, passengers, busDelay);
        busMetricsRepository.save(busMetrics);
        routeMetricsRepository.save(routeMetrics);

        // Send bus delayed event to RabbitMQ
        if (busDelay > 5*60) {
            JSONObject event = new JSONObject();
            event.put("type", "DELAY");
            event.put("bus_id", bus_id);
            event.put("route_id", route_id);
            event.put("route_shift", route_shift);
            event.put("timestamp", timestamp);
            event.put("delay", busDelay);
            sendEvents(event.toString());
        }
    }
}