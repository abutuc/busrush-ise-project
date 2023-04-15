package ies.project.busrush.controller;

import ies.project.busrush.dto.busrush.NextScheduleDto;
import ies.project.busrush.dto.busrush.ClosestStopDto;
import ies.project.busrush.dto.busrush.InfoScheduleDto;
import ies.project.busrush.service.BusRushService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class BusRushController {

    @Autowired
    private BusRushService busRushService;

    @GetMapping("/stops/closest")
    public ResponseEntity<ClosestStopDto> getClosestStop(
            @RequestParam(value = "lat") Double lat,
            @RequestParam(value = "lon") Double lon
    ) {
        return busRushService.getClosestStop(lat, lon);
    }

    @GetMapping("/schedules/next")
    public ResponseEntity<List<NextScheduleDto>> getNextSchedules(
            @RequestParam(value = "origin_stop_id") String originStopId,
            @RequestParam(value = "destination_stop_id") Optional<String> destinationStopId
    ) {
        return busRushService.getNextSchedules(originStopId, destinationStopId);
    }

    @GetMapping("/schedules/info/{id}")
    public ResponseEntity<InfoScheduleDto> getInfoSchedule(
            @PathVariable("id") String id
    ) {
        return busRushService.getInfoSchedule(id);
    }
}