package ies.project.busrush.service;

import ies.project.busrush.dto.basic.RouteBasicDto;
import ies.project.busrush.dto.stats.DayDelayDto;
import ies.project.busrush.dto.stats.DayOccupationDto;
import ies.project.busrush.model.RouteId;
import ies.project.busrush.model.cassandra.RouteOccupation;
import ies.project.busrush.repository.BusRepository;
import ies.project.busrush.repository.RouteRepository;
import ies.project.busrush.repository.cassandra.BusMetricsRepository;
import ies.project.busrush.repository.cassandra.RouteOccupationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

@Service
public class StatsService {

    private BusRepository busRepository;
    private RouteRepository routeRepository;
    private BusMetricsRepository busMetricsRepository;
    private RouteOccupationRepository routeOccupationRepository;

    @Autowired
    public StatsService(
            BusRepository busRepository,
            RouteRepository routeRepository,
            BusMetricsRepository busMetricsRepository,
            RouteOccupationRepository routeOccupationRepository
    ) {
        this.busRepository = busRepository;
        this.routeRepository = routeRepository;
        this.busMetricsRepository = busMetricsRepository;
        this.routeOccupationRepository = routeOccupationRepository;
    }

    public ResponseEntity<List<DayDelayDto>> getDayDelays(String from, String to) {
        List<DayDelayDto> dayDelaysDto = new ArrayList<>();

        LocalDate fromDate = LocalDate.parse(from);
        LocalDate toDate = LocalDate.parse(to);

        Long fromTs = fromDate.atStartOfDay().toEpochSecond(ZoneOffset.ofHours(0));
        Long toTs = toDate.atStartOfDay().toEpochSecond(ZoneOffset.ofHours(0)) + 86400;

        Long middleTs = fromTs;
        Integer count = 0;
        while (middleTs < toTs) {
            middleTs += 86400;
            Integer delayed = busMetricsRepository.findAllDelayed(fromTs, middleTs).size();
            Integer onTime = busRepository.findAll().size() - delayed;

            DayDelayDto dayDelayDto = new DayDelayDto(fromDate.plusDays(count), delayed, onTime);
            dayDelaysDto.add(dayDelayDto);

            fromTs = middleTs;
            count++;
        }

        return new ResponseEntity<>(dayDelaysDto, HttpStatus.OK);
    }

    public ResponseEntity<List<DayOccupationDto>> getDayOccupations(String of) {
        List<DayOccupationDto> dayOccupationsDto = new ArrayList<>();

        LocalDate ofDate = LocalDate.parse(of);

        Long fromTs = ofDate.atStartOfDay().toEpochSecond(ZoneOffset.ofHours(0));
        Long toTs = fromTs + 86400;

        List<RouteOccupation> routeOccupations = routeOccupationRepository.findAllOccupations(fromTs, toTs);

        for (RouteOccupation r : routeOccupations) {
            RouteId routeId = new RouteId(r.getRoute_id(), r.getRoute_shift());
            String designation = routeRepository.findByRouteId(routeId).get().getDesignation();

            dayOccupationsDto.add(new DayOccupationDto(
                    ofDate,
                    new RouteBasicDto(routeId.toString(), designation),
                    r.getOccupation()));
        }

        return new ResponseEntity<>(dayOccupationsDto, HttpStatus.OK);
    }
}
