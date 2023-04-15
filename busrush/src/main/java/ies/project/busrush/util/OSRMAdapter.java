package ies.project.busrush.util;

import ies.project.busrush.dto.osrm.RouteServiceDto;
import ies.project.busrush.dto.osrm.TableServiceDto;
import ies.project.busrush.model.Stop;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;

public class OSRMAdapter {

    private static final String ROUTE_URI = "http://osrm:5000/route/v1/driving/"; // TODO: Connect to local server
    private static final String TABLE_URI = "http://osrm:5000/table/v1/driving/"; // TODO: Connect to local server

    public static Double getPathDuration(List<Coordinates> coordinates) {

        // Build the request
        StringBuilder sb = new StringBuilder(ROUTE_URI);
        for (int i = 0; i < coordinates.size(); i++) {
            Coordinates c = coordinates.get(i);
            sb.append(c.getLon()).append(",").append(c.getLat());
            if (i < coordinates.size() - 1) sb.append(";");
        }
        String req = sb.toString();

        // Send the request
        RestTemplate restTemplate = new RestTemplate();
        RouteServiceDto res = restTemplate.getForObject(req, RouteServiceDto.class);
        assert res != null; // TODO: Handle this

        return res.getRoutes().get(0).getDuration();
    }

    public static StopDurationIndex getNextStop(Coordinates coordinates, List<Stop> stops) {

        // Build the request
        StringBuilder sb = new StringBuilder(TABLE_URI);
        sb.append(coordinates.getLon()).append(",").append(coordinates.getLat());
        for (Stop stop : stops)
            sb.append(';').append(stop.getLon()).append(",").append(stop.getLat());
        sb.append("?sources=0");
        String req = sb.toString();

        // Send the request
        RestTemplate restTemplate = new RestTemplate();
        TableServiceDto res = restTemplate.getForObject(req, TableServiceDto.class);
        assert res != null; // TODO: Handle this

        // Index durations according to stops
        List<Double> durations = res.getDurations().get(0)
                .subList(1, res.getDurations().get(0).size());

        // Get the next stop and the duration to reach it
        int index = durations.indexOf(Collections.min(durations));
        return new StopDurationIndex(stops.get(index), durations.get(index), index);
    }
}
