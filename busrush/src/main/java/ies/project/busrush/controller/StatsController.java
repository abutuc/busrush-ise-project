package ies.project.busrush.controller;

import ies.project.busrush.dto.stats.DayDelayDto;
import ies.project.busrush.dto.stats.DayOccupationDto;
import ies.project.busrush.service.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class StatsController {

    @Autowired
    private StatsService statsService;

    @GetMapping("/stats/day/delays")
    public ResponseEntity<List<DayDelayDto>> getDayDelays(
            @RequestParam(value = "from") String from,
            @RequestParam(value = "to") String to
    ) {
        return statsService.getDayDelays(from, to);
    }

    @GetMapping("/stats/day/occupations")
    public ResponseEntity<List<DayOccupationDto>> getDayOccupations(
            @RequestParam(value = "of") String of
    ) {
        return statsService.getDayOccupations(of);
    }
}
