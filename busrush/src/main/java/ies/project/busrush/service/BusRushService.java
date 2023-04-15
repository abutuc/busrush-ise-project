package ies.project.busrush.service;

import ies.project.busrush.dto.basic.BusBasicDto;
import ies.project.busrush.dto.basic.RouteBasicDto;
import ies.project.busrush.dto.basic.StopBasicDto;
import ies.project.busrush.dto.busrush.InfoScheduleDto;
import ies.project.busrush.dto.busrush.NextScheduleDto;
import ies.project.busrush.dto.busrush.ClosestStopDto;
import ies.project.busrush.repository.cassandra.*;
import ies.project.busrush.dto.cache.*;
import ies.project.busrush.model.*;
import ies.project.busrush.model.cassandra.CurrentLocation;
import ies.project.busrush.model.cassandra.PeopleOnBus;
import ies.project.busrush.model.custom.StopWithDistance;
import ies.project.busrush.repository.*;
import ies.project.busrush.util.Coordinates;
import ies.project.busrush.util.OSRMAdapter;
import ies.project.busrush.util.StopDurationIndex;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BusRushService {
    private BusRepository busRepository;
    private DeviceRepository deviceRepository;
    private DriverRepository driverRepository;
    private RouteRepository routeRepository;
    private ScheduleRepository scheduleRepository;
    private StopRepository stopRepository;
    private UserRepository userRepository;
    private CacheRepository cacheRepository;
    private BusLocationRepository busLocationRepository; 
    private BusOccupationRepository busOccupationRepository;

    @Autowired
    public BusRushService(
            BusRepository busRepository,
            DeviceRepository deviceRepository,
            DriverRepository driverRepository,
            RouteRepository routeRepository,
            ScheduleRepository scheduleRepository,
            StopRepository stopRepository,
            UserRepository userRepository,
            CacheRepository cacheRepository,
            BusLocationRepository busLocationRepository, 
            BusOccupationRepository busOccupationRepository
    ) {
        this.busRepository = busRepository;
        this.deviceRepository = deviceRepository;
        this.driverRepository = driverRepository;
        this.routeRepository = routeRepository;
        this.scheduleRepository = scheduleRepository;
        this.stopRepository = stopRepository;
        this.userRepository = userRepository;
        this.cacheRepository = cacheRepository;
        this.busLocationRepository =   busLocationRepository; 
        this.busOccupationRepository = busOccupationRepository;
    }


    public ResponseEntity<ClosestStopDto> getClosestStop(Double lat, Double lon) {
        String key = "closestStop:" + lat + ":" + lon;
        if (cacheRepository.exists(key)) {
            ClosestStopDtoc temp = (ClosestStopDtoc) cacheRepository.get(key);
            ClosestStopDto closestStopDto = new ClosestStopDto(temp.getId(), temp.getDesignation(), temp.getPosition(), temp.getDistance());
            return new ResponseEntity<>(closestStopDto, HttpStatus.OK);
        }
        else {
            List<StopWithDistance> stopWithDistance = stopRepository.findClosest(lat, lon, PageRequest.of(0, 1));
            if (stopWithDistance.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            StopWithDistance _stopWithDistance = stopWithDistance.get(0);
            ClosestStopDto closestStopDto = new ClosestStopDto(
                    _stopWithDistance.getStop().getId(),
                    _stopWithDistance.getStop().getDesignation(),
                    new Double[]{_stopWithDistance.getStop().getLat(), _stopWithDistance.getStop().getLon()},
                    _stopWithDistance.getDistance());

            ClosestStopDtoc closestStopDtoc = new ClosestStopDtoc(
                    closestStopDto.getId(),
                    closestStopDto.getDesignation(),
                    closestStopDto.getPosition(),
                    closestStopDto.getDistance()
            );
            cacheRepository.save(key,closestStopDtoc);
            return new ResponseEntity<>(closestStopDto, HttpStatus.OK);
        }
    }

    public ResponseEntity<List<NextScheduleDto>> getNextSchedules(String originStopId, Optional<String> destinationStopId) {

        String key = "nextSchedules:" + originStopId + ":" + destinationStopId.orElse("");

        if(cacheRepository.exists(key)) {
            Set<Object> temp = cacheRepository.getAll(key);
            List<NextScheduleDto> r = new ArrayList<>();
            for(Object o : temp) {
                NextScheduleDtoc nextScheduleDtoc = (NextScheduleDtoc) o;
                NextScheduleDto nextScheduleDto = new NextScheduleDto(
                        nextScheduleDtoc.getId(),
                        new RouteBasicDto(nextScheduleDtoc.getRoute().getId(), nextScheduleDtoc.getRoute().getDesignation()),
                        nextScheduleDtoc.getTime(),
                        nextScheduleDtoc.getDelay()
                );
                r.add(nextScheduleDto);
            }
            return new ResponseEntity<>(r, HttpStatus.OK);
        } else {
            LocalTime currentTime = LocalTime.now().truncatedTo(ChronoUnit.SECONDS);

            // Find all schedules on origin stop (that go to destination stop if provided)
            List<Schedule> originSchedules;
            if (destinationStopId.isEmpty()) {
                originSchedules = scheduleRepository.findAllByStopId(originStopId);
            } else {
                originSchedules = scheduleRepository.findAllByOriginStopIdAndDestinationStopId(originStopId, destinationStopId.get());
            }
            if (originSchedules.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            // Reorder schedules on origin stop according to the current time (i.e. next schedules must appear first in the list)
            int sliceIndex = 0;
            for (int i = 1; i < originSchedules.size(); i++) {
                Schedule testSchedule = originSchedules.get(i);
                // The first schedule that passes through the origin stop after the current time is the head of the list
                // because the list is already sorted by time
                if (testSchedule.getTime().isAfter(currentTime)) {
                    sliceIndex = i;
                    break;
                }
            }
            List<Schedule> head = originSchedules.subList(sliceIndex, originSchedules.size());
            List<Schedule> tail = originSchedules.subList(0, sliceIndex);
            List<Schedule> join = new ArrayList<>();
            join.addAll(head);
            join.addAll(tail);
            originSchedules = join;

            // Filter schedules on origin stop so that we only get the next from a given route
            List<Schedule> nextSchedules = new ArrayList<>();
            Set<String> seenRouteIds = new HashSet<>();
            for (Schedule os : originSchedules) {
                String routeId = os.getRoute().getId().getId();
                Bus bus = os.getRoute().getBus();
                if (bus == null) continue; // No bus assigned to this route
                // We only want the next schedule for each route
                if (!seenRouteIds.contains(routeId)) {
                    nextSchedules.add(os);
                    seenRouteIds.add(routeId);
                }
            }
            originSchedules = nextSchedules;

            // For each origin schedule...
            //
            // What we have:
            // - the schedule's route id (id + shift)                                - to return
            // - the schedule's route designation                                    - to return
            // - the schedule's sequence number                                      - to compute delay
            // - the schedule's time of arrival at origin stop                       - to compute delay
            //
            // What is missing:
            // - the bus associated with the schedule's route and its location
            // - the schedule for the next stop of the bus and time of arrival there
            // - the estimated time of arrival of the bus to origin stop             - to return
            // - the delay of the bus to origin stop                                 - to return

            List<NextScheduleDto> originSchedulesDto = new ArrayList<>();
            List<NextScheduleDtoc> originSchedulesDtoc = new ArrayList<>();
            for (Schedule os : originSchedules) {
                Integer osSequence = os.getId().getSequence();
                RouteId osRouteId = os.getRoute().getId();
                String osRouteDesignation = os.getRoute().getDesignation();
                LocalTime osTime = os.getTime();

                // Find all other schedules and stops of this schedule's route
                List<Schedule> allRouteSchedules = os.getRoute().getSchedules();
                List<Stop> allRouteStops = allRouteSchedules.stream()
                        .map(Schedule::getStop)
                        .collect(Collectors.toCollection(ArrayList::new));

                // Find the bus associated with the schedule's route
                Bus bus = os.getRoute().getBus();
                 // Find the current location of the bus -> static version -> Previous TODO (This is a "breakpoint" for debugging)
                // Coordinates busLocation = new Coordinates(40.643632, -8.643966);

                // Find the current location of the bus -> Query Cassandra - use busId and routeId
                String bus_id = bus.getId(); 
                String route_id = osRouteId.getId();  
                String route_shift = osRouteId.getShift(); 
                System.out.printf("[Cassandra] Current location of bus with bus_id %s and route_id %s and route_shift %s.\n", bus_id, route_id, route_shift); 
                      
                List<CurrentLocation> locationObject = busLocationRepository.findPositionByBusId(bus_id, route_id, route_shift);
                List<Double> location = new ArrayList<Double>(); 
                for (CurrentLocation l : locationObject) {
                    location = l.getPosition(); 
                }
                      
                Coordinates busLocation = new Coordinates(location.get(0), location.get(1)); 
                System.out.printf("[Cassandra] Query result: %s.\n", busLocation.toString()); 

                
                // Find the next stop of the bus
                StopDurationIndex busNext = OSRMAdapter.getNextStop(busLocation, allRouteStops);
                // Find the schedule for the next stop of the bus
                Schedule ns = allRouteSchedules.get(busNext.getIndex());
                Integer nsSequence = ns.getId().getSequence();
                if (nsSequence > osSequence) continue; // The bus has already passed by the origin stop
                LocalTime nsTime = ns.getTime();
                // Find the time of arrival (in seconds without new day wrap) to next stop and origin stop
                Double nsTimeSeconds = (double) nsTime.toSecondOfDay();
                Double osTimeSeconds = (double) ((nsTime.isAfter(osTime)) ? 86400 + osTime.toSecondOfDay() : osTime.toSecondOfDay());

                // Compute the duration of the trip bus->next->origin
                Double busNextDuration = busNext.getDuration();
                Double nextOriginDuration = osTimeSeconds - nsTimeSeconds;
                Double busOriginDuration = busNextDuration + nextOriginDuration;
                // Compute the time of arrival of the bus to origin stop
                Double busTimeSeconds = currentTime.toSecondOfDay() + busOriginDuration;
                LocalTime busTime = LocalTime.ofSecondOfDay(busTimeSeconds.longValue() % 86400);
                // Compute the delay of the bus to origin stop
                Double busDelay = busTimeSeconds - osTimeSeconds;

                originSchedulesDto.add(new NextScheduleDto(
                        os.getId().toString(),
                        new RouteBasicDto(
                                osRouteId.toString(),
                                osRouteDesignation
                        ),
                        busTime,
                        busDelay
                ));

                cacheRepository.add(key,new NextScheduleDtoc(
                        os.getId().toString(),
                        new RouteBasicDtoc(
                                osRouteId.toString(),
                                osRouteDesignation
                        ),
                        busTime,
                        busDelay
                ));
            }
            return new ResponseEntity<>(originSchedulesDto, HttpStatus.OK);
        }
    }

    public ResponseEntity<InfoScheduleDto> getInfoSchedule(String id) {

        String key = "schedule:" + id;

        if(cacheRepository.exists(key)) {
            InfoScheduleDtoc tempora = (InfoScheduleDtoc) cacheRepository.get(key);
            InfoScheduleDto temp2 = new InfoScheduleDto(
                    tempora.getId(),
                    new BusBasicDto(tempora.getBus().getId(), tempora.getBus().getRegistration(), tempora.getBus().getBrand(), tempora.getBus().getModel()),
                    tempora.getPassengers(),
                    new StopBasicDto(tempora.getNextStop().getId(), tempora.getNextStop().getDesignation()),
                    tempora.getTime(),
                    tempora.getDelay());
            return new ResponseEntity<>(temp2, HttpStatus.OK);
        } else {
            LocalTime currentTime = LocalTime.now().truncatedTo(ChronoUnit.SECONDS);
            ScheduleId scheduleId = ScheduleId.fromString(id);

            // Find the target schedule
            Optional<Schedule> _ts = scheduleRepository.findByScheduleId(scheduleId);
            if (_ts.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            Schedule ts = _ts.get();
            Integer tsSequence = ts.getId().getSequence();
            LocalTime tsTime = ts.getTime();

            // Find all other schedules and stops of this target schedule's route
            List<Schedule> allRouteSchedules = ts.getRoute().getSchedules();
            List<Stop> allRouteStops = allRouteSchedules.stream()
                    .map(Schedule::getStop)
                    .collect(Collectors.toCollection(ArrayList::new));

            // Find the bus associated with the target schedule's route
            Bus bus = ts.getRoute().getBus(); // Should never be null
            // Find the current location of the bus
            //Coordinates busLocation = new Coordinates(40.643632, -8.643966); // TODO: Query Cassandra - use busId and routeId

            // Find the current location of the bus -> Query Cassandra - use busId and routeId
            String bus_id = bus.getId();  

            // Find the current number of passengers on the bus -> static -> previous TODO (this is another "breakpoint")
            // Integer busPassengers = 10;

            // Find the current number of passengers on the bus -> Query Cassandra - use busId and routeId
            System.out.printf("[Cassandra] Current number of passengers with bus_id %s.\n", bus_id); 
            List<PeopleOnBus> passengers = busOccupationRepository.findPassengersByBusId(bus_id);
            Integer busPassengers = 0; 
            for (PeopleOnBus r : passengers) {
                busPassengers = r.getPassengers(); 
            }
            System.out.printf("[Cassandra] Query result: %s.\n", busPassengers.toString());  
                
            String route_id = ts.getRoute().getId().getId(); 
            String route_shift = ts.getRoute().getId().getShift();
            System.out.printf("[Cassandra] Current location of bus with bus_id %s and route_id %s and route_shift %s.\n", bus_id, route_id, route_shift); 
 
     
            List<CurrentLocation> locationObject = busLocationRepository.findPositionByBusId(bus_id, route_id, route_shift);
            List<Double> location = new ArrayList<Double>(); 
            for (CurrentLocation l : locationObject) {
                location = l.getPosition(); 
            }
                  
            Coordinates busLocation = new Coordinates(location.get(0), location.get(1));
 
            System.out.printf("[Cassandra] Query result: %s.\n", busLocation.toString()); 

            // Find the next stop of the bus
            StopDurationIndex busNext = OSRMAdapter.getNextStop(busLocation, allRouteStops);
            // Find the schedule for the next stop of the bus
            Schedule ns = allRouteSchedules.get(busNext.getIndex());
            Integer nsSequence = ns.getId().getSequence();
            if (nsSequence > tsSequence) {
                // The bus has already passed by the target stop
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            LocalTime nsTime = ns.getTime();
            // Find the time of arrival (in seconds without new day wrap) to next stop and target stop
            Double nsTimeSeconds = (double) nsTime.toSecondOfDay();
            Double tsTimeSeconds = (double) ((nsTime.isAfter(tsTime)) ? 86400 + tsTime.toSecondOfDay() : tsTime.toSecondOfDay());

            // Compute the duration of the trip bus->next->target
            Double busNextDuration = busNext.getDuration();
            Double nextTargetDuration = tsTimeSeconds - nsTimeSeconds;
            Double busTargetDuration = busNextDuration + nextTargetDuration;
            // Compute the time of arrival of the bus to target stop
            Double busTimeSeconds = currentTime.toSecondOfDay() + busTargetDuration;
            LocalTime busTime = LocalTime.ofSecondOfDay(busTimeSeconds.longValue() % 86400);
            // Compute the delay of the bus to target stop
            Double busDelay = busTimeSeconds - tsTimeSeconds;

            InfoScheduleDto infoScheduleDto = new InfoScheduleDto(
                    ts.getId().toString(),
                    new BusBasicDto(
                            bus.getId(),
                            bus.getRegistration(),
                            bus.getBrand(),
                            bus.getModel()
                    ),
                    busPassengers,
                    new StopBasicDto(
                            ns.getStop().getId(),
                            ns.getStop().getDesignation()
                    ),
                    busTime,
                    busDelay
            );

            InfoScheduleDtoc info = new InfoScheduleDtoc(
                    ts.getId().toString(),
                    new BusBasicDtoc(
                            bus.getId(),
                            bus.getRegistration(),
                            bus.getBrand(),
                            bus.getModel()
                    ),
                    busPassengers,
                    new StopBasicDtoc(
                            ns.getStop().getId(),
                            ns.getStop().getDesignation()
                    ),
                    busTime,
                    busDelay
            );
            cacheRepository.save(key, info);
            return new ResponseEntity<>(infoScheduleDto, HttpStatus.OK);
        }
    }
}
