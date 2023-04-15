package ies.project.busrush.service;

import ies.project.busrush.dto.crud.*;
import ies.project.busrush.dto.id.RouteIdDto;
import ies.project.busrush.dto.id.ScheduleIdDto;
import ies.project.busrush.model.*;
import ies.project.busrush.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CrudService {
    private BusRepository busRepository;
    private DeviceRepository deviceRepository;
    private DriverRepository driverRepository;
    private RouteRepository routeRepository;
    private ScheduleRepository scheduleRepository;
    private StopRepository stopRepository;
    private UserRepository userRepository;

    @Autowired
    public CrudService(
            BusRepository busRepository,
            DeviceRepository deviceRepository,
            DriverRepository driverRepository,
            RouteRepository routeRepository,
            ScheduleRepository scheduleRepository,
            StopRepository stopRepository,
            UserRepository userRepository
    ) {
        this.busRepository = busRepository;
        this.deviceRepository = deviceRepository;
        this.driverRepository = driverRepository;
        this.routeRepository = routeRepository;
        this.scheduleRepository = scheduleRepository;
        this.stopRepository = stopRepository;
        this.userRepository = userRepository;

        // Clear all records on tables
        // scheduleRepository.deleteAll();
        // stopRepository.deleteAll();
        // routeRepository.deleteAll();
        // driverRepository.deleteAll();
        // busRepository.deleteAll();
        // deviceRepository.deleteAll();
        // userRepository.deleteAll();
    }

    //
    // Buses
    //
    public ResponseEntity<List<BusCrudDto>> getAllBuses(Optional<String> deviceId) {
        try {
            List<Bus> buses = busRepository.findAll();
            if (buses.isEmpty())
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);

            // Filters
            deviceId.ifPresent(_deviceId -> buses.removeIf(bus -> !bus.getDevice().getId().equals(_deviceId)));

            List<BusCrudDto> busesCrudDto = new ArrayList<>();
            for (Bus bus : buses) {
                busesCrudDto.add(new BusCrudDto(
                        bus.getId(),
                        bus.getRegistration(),
                        bus.getBrand(),
                        bus.getModel(),
                        (bus.getDevice() != null) ? bus.getDevice().getId() : null,
                        bus.getRoutes().stream().map(route -> new RouteIdDto(route.getId().getId(), route.getId().getShift())).toArray(RouteIdDto[]::new)
                ));
            }
            return new ResponseEntity<>(busesCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<BusCrudDto> getBusById(String id) {
        try {
            Optional<Bus> _bus = busRepository.findById(id);
            if (_bus.isEmpty())
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            Bus bus = _bus.get();

            BusCrudDto busCrudDto = new BusCrudDto(
                    bus.getId(),
                    bus.getRegistration(),
                    bus.getBrand(),
                    bus.getModel(),
                    (bus.getDevice() != null) ? bus.getDevice().getId() : null,
                    bus.getRoutes().stream().map(route -> new RouteIdDto(route.getId().getId(), route.getId().getShift())).toArray(RouteIdDto[]::new)
            );
            return new ResponseEntity<>(busCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<BusCrudDto> createBus(BusCrudDto busCrudDto) {
        try {
            // Check if bus already exists
            Optional<Bus> _bus = busRepository.findById(busCrudDto.getId());
            if (_bus.isPresent())
                return new ResponseEntity<>(HttpStatus.CONFLICT);

            // Check if device exists
            Device device = null;
            if (busCrudDto.getDeviceId() != null) {
                Optional<Device> _device = deviceRepository.findById(busCrudDto.getDeviceId());
                if (_device.isEmpty())
                    return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                device = _device.get();
                if (device.getBus() != null)
                    return new ResponseEntity<>(HttpStatus.CONFLICT);
            }

            // Check if routes exist
            List<Route> routes = new ArrayList<>();
            if (busCrudDto.getRoutesId() != null) {
                for (RouteIdDto routeIdDto : busCrudDto.getRoutesId()) {
                    Optional<Route> _route = routeRepository.findByRouteId(new RouteId(routeIdDto.getId(), routeIdDto.getShift()));
                    if (_route.isEmpty())
                        return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                    Route route = _route.get();
                    if (route.getBus() != null)
                        return new ResponseEntity<>(HttpStatus.CONFLICT);
                    routes.add(route);
                }
            }

            busRepository.save(new Bus(
                    busCrudDto.getId(),
                    busCrudDto.getRegistration(),
                    busCrudDto.getBrand(),
                    busCrudDto.getModel(),
                    device,
                    routes
            ));
            return new ResponseEntity<>(busCrudDto, HttpStatus.CREATED);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<BusCrudDto> updateBus(String id, BusCrudDto busCrudDto) {
        try {
            Optional<Bus> _bus = busRepository.findById(id);
            if (_bus.isEmpty())
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            Bus bus = _bus.get();

            // Check if device exists
            Device device = null;
            if (busCrudDto.getDeviceId() != null) {
                Optional<Device> _device = deviceRepository.findById(busCrudDto.getDeviceId());
                if (_device.isEmpty())
                    return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                device = _device.get();
                if (device.getBus() != null && !device.getBus().equals(bus))
                    return new ResponseEntity<>(HttpStatus.CONFLICT);
            }

            // Check if routes exist
            List<Route> routes = new ArrayList<>();
            if (busCrudDto.getRoutesId() != null) {
                for (RouteIdDto routeIdDto : busCrudDto.getRoutesId()) {
                    Optional<Route> _route = routeRepository.findByRouteId(new RouteId(routeIdDto.getId(), routeIdDto.getShift()));
                    if (_route.isEmpty())
                        return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                    Route route = _route.get();
                    if (route.getBus() != null && !route.getBus().equals(bus))
                        return new ResponseEntity<>(HttpStatus.CONFLICT);
                    routes.add(route);
                }
            }

            bus.setRegistration(busCrudDto.getRegistration());
            bus.setBrand(busCrudDto.getBrand());
            bus.setModel(busCrudDto.getModel());
            bus.setDevice(device);
            busRepository.save(bus);

            for (Route route : bus.getRoutes()) {
                route.setBus(null);
                routeRepository.save(route);
            }
            for (Route route : routes) {
                route.setBus(bus);
                routeRepository.save(route);
            }



            busCrudDto.setId(bus.getId());
            busCrudDto.setRegistration(bus.getRegistration());
            busCrudDto.setBrand(bus.getBrand());
            busCrudDto.setModel(bus.getModel());
            busCrudDto.setDeviceId((bus.getDevice() != null) ? bus.getDevice().getId() : null);
            busCrudDto.setRoutesId(routes.stream().map(route -> new RouteIdDto(route.getId().getId(), route.getId().getShift())).toArray(RouteIdDto[]::new));
            return new ResponseEntity<>(busCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<HttpStatus> deleteBus(String id) {
        try {
            Optional<Bus> _bus = busRepository.findById(id);
            if (_bus.isEmpty())
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            Bus bus = _bus.get();
            if (bus.getRoutes() != null && !bus.getRoutes().isEmpty())
                return new ResponseEntity<>(HttpStatus.CONFLICT);

            busRepository.delete(bus);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //
    // Devices
    //
    public ResponseEntity<List<DeviceCrudDto>> getAllDevices() {
        try {
            List<Device> devices = deviceRepository.findAll();
            if (devices.isEmpty())
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);

            List<DeviceCrudDto> devicesCrudDto = new ArrayList<>();
            for (Device device : devices) {
                devicesCrudDto.add(new DeviceCrudDto(
                        device.getId(),
                        (device.getBus() != null) ? device.getBus().getId() : null
                ));
            }
            return new ResponseEntity<>(devicesCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<DeviceCrudDto> getDeviceById(String id) {
        try {
            Optional<Device> _device = deviceRepository.findById(id);
            if (_device.isEmpty())
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            Device device = _device.get();

            DeviceCrudDto deviceCrudDto = new DeviceCrudDto(
                    device.getId(),
                    (device.getBus() != null) ? device.getBus().getId() : null
            );
            return new ResponseEntity<>(deviceCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<DeviceCrudDto> createDevice(DeviceCrudDto deviceCrudDto) {
        try {
            // Check if device already exists
            Optional<Device> _device = deviceRepository.findById(deviceCrudDto.getId());
            if (_device.isPresent())
                return new ResponseEntity<>(HttpStatus.CONFLICT);

            // Check if bus exists
            Bus bus = null;
            if (deviceCrudDto.getBusId() != null) {
                Optional<Bus> _bus = busRepository.findById(deviceCrudDto.getBusId());
                if (_bus.isEmpty())
                    return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                bus = _bus.get();
                if (bus.getDevice() != null)
                    return new ResponseEntity<>(HttpStatus.CONFLICT);
            }

            Device device = new Device(
                    deviceCrudDto.getId(),
                    null
            );
            deviceRepository.save(device);

            if (bus != null) {
                bus.setDevice(device);
                busRepository.save(bus);
            }
            return new ResponseEntity<>(deviceCrudDto, HttpStatus.CREATED);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<DeviceCrudDto> updateDevice(String id, DeviceCrudDto deviceCrudDto) {
        try {
            Optional<Device> _device = deviceRepository.findById(id);
            if (_device.isEmpty())
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            Device device = _device.get();

            // Check if bus exists
            Bus bus = null;
            if (deviceCrudDto.getBusId() != null) {
                Optional<Bus> _bus = busRepository.findById(deviceCrudDto.getBusId());
                if (_bus.isEmpty())
                    return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                bus = _bus.get();
                if (bus.getDevice() != null && !bus.getDevice().equals(device))
                    return new ResponseEntity<>(HttpStatus.CONFLICT);
            }

            if (bus != null) {
                bus.setDevice(device);
                busRepository.save(bus);

            }

            else if (device.getBus() != null) {
                Bus oldBus = device.getBus();
                oldBus.setDevice(null);
                busRepository.save(oldBus);


            }

            deviceCrudDto.setId(device.getId());
            deviceCrudDto.setBusId((bus != null) ? bus.getId() : null);
            return new ResponseEntity<>(deviceCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<HttpStatus> deleteDevice(String id) {
        try {
            Optional<Device> _device = deviceRepository.findById(id);
            if (_device.isEmpty())
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            Device device = _device.get();
            if (device.getBus() != null)
                return new ResponseEntity<>(HttpStatus.CONFLICT);

            deviceRepository.delete(device);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //
    // Drivers
    //
    public ResponseEntity<List<DriverCrudDto>> getAllDrivers() {
        try {
            List<Driver> drivers = driverRepository.findAll();
            if (drivers.isEmpty())
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);

            List<DriverCrudDto> driversCrudDto = new ArrayList<>();
            for (Driver driver : drivers) {
                driversCrudDto.add(new DriverCrudDto(
                        driver.getId(),
                        driver.getFirstName(),
                        driver.getLastName(),
                        driver.getRoutes().stream().map(route -> new RouteIdDto(route.getId().getId(), route.getId().getShift())).toArray(RouteIdDto[]::new)
                ));
            }
            return new ResponseEntity<>(driversCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<DriverCrudDto> getDriverById(String id) {
        try {
            Optional<Driver> _driver = driverRepository.findById(id);
            if (_driver.isEmpty())
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            Driver driver = _driver.get();

            DriverCrudDto driverCrudDto = new DriverCrudDto(
                    driver.getId(),
                    driver.getFirstName(),
                    driver.getLastName(),
                    driver.getRoutes().stream().map(route -> new RouteIdDto(route.getId().getId(), route.getId().getShift())).toArray(RouteIdDto[]::new)
            );
            return new ResponseEntity<>(driverCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<DriverCrudDto> createDriver(DriverCrudDto driverCrudDto) {
        try {
            // Check if driver already exists
            Optional<Driver> _driver = driverRepository.findById(driverCrudDto.getId());
            if (_driver.isPresent())
                return new ResponseEntity<>(HttpStatus.CONFLICT);

            // Check if routes exist
            List<Route> routes = new ArrayList<>();
            if (driverCrudDto.getRoutesId() != null) {
                for (RouteIdDto routeIdDto : driverCrudDto.getRoutesId()) {
                    Optional<Route> _route = routeRepository.findByRouteId(new RouteId(routeIdDto.getId(), routeIdDto.getShift()));
                    if (_route.isEmpty())
                        return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                    Route route = _route.get();
                    if (route.getDriver() != null)
                        return new ResponseEntity<>(HttpStatus.CONFLICT);
                    routes.add(route);
                }
            }

            driverRepository.save(new Driver(
                    driverCrudDto.getId(),
                    driverCrudDto.getFirstName(),
                    driverCrudDto.getLastName(),
                    routes
            ));
            return new ResponseEntity<>(driverCrudDto, HttpStatus.CREATED);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<DriverCrudDto> updateDriver(String id, DriverCrudDto driverCrudDto) {
        try {
            Optional<Driver> _driver = driverRepository.findById(id);
            if (_driver.isEmpty())
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            Driver driver = _driver.get();

            // Check if routes exist
            List<Route> routes = new ArrayList<>();
            if (driverCrudDto.getRoutesId() != null) {
                for (RouteIdDto routeIdDto : driverCrudDto.getRoutesId()) {
                    Optional<Route> _route = routeRepository.findByRouteId(new RouteId(routeIdDto.getId(), routeIdDto.getShift()));
                    if (_route.isEmpty())
                        return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                    Route route = _route.get();
                    if (route.getDriver() != null && !route.getDriver().equals(driver))
                        return new ResponseEntity<>(HttpStatus.CONFLICT);
                    routes.add(route);

                }
            }
            else {
                for (Route route : driver.getRoutes()) {
                    route.setDriver(null);
                    routeRepository.save(route);


                }
            }

            driver.setFirstName(driverCrudDto.getFirstName());
            driver.setLastName(driverCrudDto.getLastName());
            driverRepository.save(driver);


            for (Route route : driver.getRoutes()) {
                route.setBus(null);
                routeRepository.save(route);
            }
            for (Route route : routes) {
                route.setDriver(driver);
                routeRepository.save(route);
            }

            driverCrudDto.setId(driver.getId());
            driverCrudDto.setFirstName(driver.getFirstName());
            driverCrudDto.setLastName(driver.getLastName());
            driverCrudDto.setRoutesId(routes.stream().map(route -> new RouteIdDto(route.getId().getId(), route.getId().getShift())).toArray(RouteIdDto[]::new));
            return new ResponseEntity<>(driverCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<HttpStatus> deleteDriver(String id) {
        try {
            Optional<Driver> _driver = driverRepository.findById(id);
            if (_driver.isEmpty())
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            Driver driver = _driver.get();
            if (!driver.getRoutes().isEmpty())
                return new ResponseEntity<>(HttpStatus.CONFLICT);

            driverRepository.delete(driver);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //
    // Routes
    //
    public ResponseEntity<List<RouteCrudDto>> getAllRoutes() {
        try {
            List<Route> routes = routeRepository.findAll();
            if (routes.isEmpty())
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);

            List<RouteCrudDto> routesCrudDto = new ArrayList<>();
            for (Route route : routes) {
                routesCrudDto.add(new RouteCrudDto(
                        new RouteIdDto(route.getId().getId(), route.getId().getShift()),
                        route.getDesignation(),
                        (route.getDriver() != null) ? route.getDriver().getId() : null,
                        (route.getBus() != null) ? route.getBus().getId() : null,
                        route.getSchedules().stream().map(schedule -> new ScheduleIdDto(new RouteIdDto(schedule.getId().getRouteId().getId(), schedule.getId().getRouteId().getShift()), schedule.getId().getStopId(), schedule.getId().getSequence())).toArray(ScheduleIdDto[]::new)
                ));
            }
            return new ResponseEntity<>(routesCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<RouteCrudDto> getRouteByRouteId(String id) {
        try {
            String[] split = id.split("_");
            RouteId routeId = new RouteId(split[0], split[1]);
            Optional<Route> _route = routeRepository.findByRouteId(routeId);
            if (_route.isEmpty())
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            Route route = _route.get();

            RouteCrudDto routeCrudDto = new RouteCrudDto(
                    new RouteIdDto(route.getId().getId(), route.getId().getShift()),
                    route.getDesignation(),
                    (route.getDriver() != null) ? route.getDriver().getId() : null,
                    (route.getBus() != null) ? route.getBus().getId() : null,
                    route.getSchedules().stream().map(schedule -> new ScheduleIdDto(new RouteIdDto(schedule.getId().getRouteId().getId(), schedule.getId().getRouteId().getShift()), schedule.getId().getStopId(), schedule.getId().getSequence())).toArray(ScheduleIdDto[]::new)
            );
            return new ResponseEntity<>(routeCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<RouteCrudDto> createRoute(RouteCrudDto routeCrudDto) {
        try {
            // Check if route already exists
            Optional<Route> _route = routeRepository.findByRouteId(new RouteId(routeCrudDto.getId().getId(), routeCrudDto.getId().getShift()));
            if (_route.isPresent())
                return new ResponseEntity<>(HttpStatus.CONFLICT);

            // Check if driver exists
            Driver driver = null;
            if (routeCrudDto.getDriverId() != null) {
                Optional<Driver> _driver = driverRepository.findById(routeCrudDto.getDriverId());
                if (_driver.isEmpty())
                    return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                driver = _driver.get();
            }

            // Check if bus exists
            Bus bus = null;
            if (routeCrudDto.getBusId() != null) {
                Optional<Bus> _bus = busRepository.findById(routeCrudDto.getBusId());
                if (_bus.isEmpty())
                    return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                bus = _bus.get();
            }

            // Check if schedules exist
            List<Schedule> schedules = new ArrayList<>();
            if (routeCrudDto.getSchedulesId() != null) {
                for (ScheduleIdDto scheduleIdDto : routeCrudDto.getSchedulesId()) {
                    Optional<Schedule> _schedule = scheduleRepository.findByScheduleId(new ScheduleId(new RouteId(scheduleIdDto.getRouteId().getId(), scheduleIdDto.getRouteId().getShift()), scheduleIdDto.getStopId(), scheduleIdDto.getSequence()));
                    if (_schedule.isEmpty())
                        return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                    Schedule schedule = _schedule.get();
                    if (schedule.getRoute() != null)
                        return new ResponseEntity<>(HttpStatus.CONFLICT);
                    schedules.add(schedule);
                }
            }

            Route route = new Route(
                    new RouteId(routeCrudDto.getId().getId(), routeCrudDto.getId().getShift()),
                    routeCrudDto.getDesignation(),
                    driver,
                    bus,
                    schedules
            );
            routeRepository.save(route);

            if (driver != null) {
                driver.getRoutes().add(route);
                driverRepository.save(driver);
            }

            if (bus != null) {
                bus.getRoutes().add(route);
                busRepository.save(bus);
            }
            return new ResponseEntity<>(routeCrudDto, HttpStatus.CREATED);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<RouteCrudDto> updateRoute(String id, RouteCrudDto routeCrudDto) {
        try {
            String[] split = id.split("_");
            RouteId routeId = new RouteId(split[0], split[1]);
            Optional<Route> _route = routeRepository.findByRouteId(routeId);
            if (_route.isEmpty())
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            Route route = _route.get();

            // Check if driver exists
            Driver driver = null;
            if (routeCrudDto.getDriverId() != null) {
                Optional<Driver> _driver = driverRepository.findById(routeCrudDto.getDriverId());
                if (_driver.isEmpty())
                    return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                driver = _driver.get();
            }

            // Check if bus exists
            Bus bus = null;
            if (routeCrudDto.getBusId() != null) {
                Optional<Bus> _bus = busRepository.findById(routeCrudDto.getBusId());
                if (_bus.isEmpty())
                    return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                bus = _bus.get();
            }

            // Check if schedules exist
            List<Schedule> schedules = new ArrayList<>();
            if (routeCrudDto.getSchedulesId() != null) {
                for (ScheduleIdDto scheduleIdDto : routeCrudDto.getSchedulesId()) {
                    Optional<Schedule> _schedule = scheduleRepository.findByScheduleId(new ScheduleId(new RouteId(scheduleIdDto.getRouteId().getId(), scheduleIdDto.getRouteId().getShift()), scheduleIdDto.getStopId(), scheduleIdDto.getSequence()));
                    if (_schedule.isEmpty())
                        return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                    Schedule schedule = _schedule.get();
                    if (schedule.getRoute() != null && !schedule.getRoute().equals(route))
                        return new ResponseEntity<>(HttpStatus.CONFLICT);
                    schedules.add(schedule);
                }
            }

            route.setDesignation(routeCrudDto.getDesignation());
            route.setDriver(driver);
            route.setBus(bus);
            routeRepository.save(route);


            List<Schedule> newSchedules = new ArrayList<>();
            for (Schedule schedule : schedules) {
                newSchedules.add(new Schedule(
                        new ScheduleId(route.getId(), schedule.getId().getStopId(), schedule.getId().getSequence()),
                        route,
                        schedule.getStop(),
                        schedule.getTime()
                ));
            }
            for (Schedule schedule : newSchedules) {
                scheduleRepository.save(schedule);
            }
            for (Schedule schedule : route.getSchedules()) {
                if (!newSchedules.contains(schedule)) {
                    scheduleRepository.deleteByScheduleId(schedule.getId());
                }
            }

            routeCrudDto.setId(new RouteIdDto(route.getId().getId(), route.getId().getShift()));
            routeCrudDto.setDesignation(route.getDesignation());
            routeCrudDto.setDriverId(route.getDriver() != null ? route.getDriver().getId() : null);
            routeCrudDto.setBusId(route.getBus() != null ? route.getBus().getId() : null);
            routeCrudDto.setSchedulesId(newSchedules.stream().map(schedule -> new ScheduleIdDto(new RouteIdDto(schedule.getId().getRouteId().getId(), schedule.getId().getRouteId().getShift()), schedule.getId().getStopId(), schedule.getId().getSequence())).toArray(ScheduleIdDto[]::new));
            return new ResponseEntity<>(routeCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<HttpStatus> deleteRoute(String id) {
        try {
            String[] split = id.split("_");
            RouteId routeId = new RouteId(split[0], split[1]);
            Optional<Route> _route = routeRepository.findByRouteId(routeId);
            if (_route.isEmpty())
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            Route route = _route.get();
            if (route.getDriver() != null || route.getBus() != null || !route.getSchedules().isEmpty())
                return new ResponseEntity<>(HttpStatus.CONFLICT);

            routeRepository.delete(route);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //
    // Schedules
    //
    public ResponseEntity<List<ScheduleCrudDto>> getAllSchedules() {
        try {
            List<Schedule> schedules = scheduleRepository.findAll();
            if (schedules.isEmpty())
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);

            List<ScheduleCrudDto> schedulesCrudDto = new ArrayList<>();
            for (Schedule schedule : schedules) {
                schedulesCrudDto.add(new ScheduleCrudDto(
                        new ScheduleIdDto(
                                new RouteIdDto(schedule.getId().getRouteId().getId(), schedule.getId().getRouteId().getShift()),
                                schedule.getId().getStopId(),
                                schedule.getId().getSequence()
                        ),
                        schedule.getTime()
                ));
            }
            return new ResponseEntity<>(schedulesCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<ScheduleCrudDto> getScheduleByScheduleId(String id) {
        try {
            String[] split = id.split("_");
            ScheduleId scheduleId = new ScheduleId(new RouteId(split[0], split[1]), split[2], Integer.parseInt(split[3]));
            Optional<Schedule> _schedule = scheduleRepository.findByScheduleId(scheduleId);
            if (_schedule.isEmpty())
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            Schedule schedule = _schedule.get();

            ScheduleCrudDto scheduleCrudDto = new ScheduleCrudDto(
                    new ScheduleIdDto(
                            new RouteIdDto(schedule.getId().getRouteId().getId(), schedule.getId().getRouteId().getShift()),
                            schedule.getId().getStopId(),
                            schedule.getId().getSequence()
                    ),
                    schedule.getTime()
            );
            return new ResponseEntity<>(scheduleCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<ScheduleCrudDto> createSchedule(ScheduleCrudDto scheduleCrudDto) {
        try {
            // Check if schedule already exists
            Optional<Schedule> _schedule = scheduleRepository.findByScheduleId(new ScheduleId(new RouteId(scheduleCrudDto.getId().getRouteId().getId(), scheduleCrudDto.getId().getRouteId().getShift()), scheduleCrudDto.getId().getStopId(), scheduleCrudDto.getId().getSequence()));
            if (_schedule.isPresent())
                return new ResponseEntity<>(HttpStatus.CONFLICT);

            // Check if route exists
            Route route = null;
            if (scheduleCrudDto.getId().getRouteId() != null) {
                Optional<Route> _route = routeRepository.findByRouteId(new RouteId(scheduleCrudDto.getId().getRouteId().getId(), scheduleCrudDto.getId().getRouteId().getShift()));
                if (_route.isEmpty())
                    return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                route = _route.get();
            }

            // Check if stop exists
            Stop stop = null;
            if (scheduleCrudDto.getId().getStopId() != null) {
                Optional<Stop> _stop = stopRepository.findById(scheduleCrudDto.getId().getStopId());
                if (_stop.isEmpty())
                    return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                stop = _stop.get();
            }

            Integer sequence = scheduleCrudDto.getId().getSequence();

            if (route == null || stop == null || sequence == null)
                return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);

            scheduleRepository.save(new Schedule(
                    new ScheduleId(
                            route.getId(),
                            stop.getId(),
                            sequence
                    ),
                    route,
                    stop,
                    scheduleCrudDto.getTime()
            ));
            return new ResponseEntity<>(scheduleCrudDto, HttpStatus.CREATED);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<ScheduleCrudDto> updateSchedule(String id, ScheduleCrudDto scheduleCrudDto) {
        try {
            String[] split = id.split("_");
            ScheduleId scheduleId = new ScheduleId(new RouteId(split[0], split[1]), split[2], Integer.parseInt(split[3]));
            Optional<Schedule> _schedule = scheduleRepository.findByScheduleId(scheduleId);
            if (_schedule.isEmpty())
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            Schedule schedule = _schedule.get();

            // Check if route exists
            Route route = null;
            if (scheduleCrudDto.getId().getRouteId() != null) {
                Optional<Route> _route = routeRepository.findByRouteId(new RouteId(scheduleCrudDto.getId().getRouteId().getId(), scheduleCrudDto.getId().getRouteId().getShift()));
                if (_route.isEmpty())
                    return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                route = _route.get();
            }

            // Check if stop exists
            Stop stop = null;
            if (scheduleCrudDto.getId().getStopId() != null) {
                Optional<Stop> _stop = stopRepository.findById(scheduleCrudDto.getId().getStopId());
                if (_stop.isEmpty())
                    return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                stop = _stop.get();
            }

            Integer sequence = scheduleCrudDto.getId().getSequence();

            if (route == null || stop == null || sequence == null)
                return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);

            schedule.setRoute(route);
            schedule.setStop(stop);
            schedule.setTime(scheduleCrudDto.getTime());
            scheduleRepository.save(schedule);

            scheduleCrudDto.setId(new ScheduleIdDto(
                    new RouteIdDto(schedule.getId().getRouteId().getId(), schedule.getId().getRouteId().getShift()),
                    schedule.getId().getStopId(),
                    schedule.getId().getSequence()
            ));
            scheduleCrudDto.setTime(schedule.getTime());
            return new ResponseEntity<>(scheduleCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<HttpStatus> deleteSchedule(String id) {
        try {
            String[] split = id.split("_");
            ScheduleId scheduleId = new ScheduleId(new RouteId(split[0], split[1]), split[2], Integer.parseInt(split[3]));
            scheduleRepository.deleteByScheduleId(scheduleId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //
    // Stop
    //
    public ResponseEntity<List<StopCrudDto>> getAllStops() {
        try {
            List<Stop> stops = stopRepository.findAll();
            if (stops.isEmpty())
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);

            List<StopCrudDto> stopsCrudDto = new ArrayList<>();
            for (Stop stop : stops) {
                stopsCrudDto.add(new StopCrudDto(
                        stop.getId(),
                        stop.getDesignation(),
                        new Double[]{stop.getLat(), stop.getLon()},
                        stop.getSchedules().stream().map(schedule -> new ScheduleIdDto(new RouteIdDto(schedule.getId().getRouteId().getId(), schedule.getId().getRouteId().getShift()), schedule.getId().getStopId(), schedule.getId().getSequence())).toArray(ScheduleIdDto[]::new)
                ));
            }
            return new ResponseEntity<>(stopsCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<StopCrudDto> getStopById(String id) {
        try {
            Optional<Stop> _stop = stopRepository.findById(id);
            if (_stop.isEmpty())
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            Stop stop = _stop.get();

            StopCrudDto stopCrudDto = new StopCrudDto(
                    stop.getId(),
                    stop.getDesignation(),
                    new Double[]{stop.getLat(), stop.getLon()},
                    stop.getSchedules().stream().map(schedule -> new ScheduleIdDto(new RouteIdDto(schedule.getId().getRouteId().getId(), schedule.getId().getRouteId().getShift()), schedule.getId().getStopId(), schedule.getId().getSequence())).toArray(ScheduleIdDto[]::new)
            );
            return new ResponseEntity<>(stopCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<StopCrudDto> createStop(StopCrudDto stopCrudDto) {
        try {
            // Check if stop already exists
            Optional<Stop> _stop = stopRepository.findById(stopCrudDto.getId());
            if (_stop.isPresent())
                return new ResponseEntity<>(HttpStatus.CONFLICT);

            // Check if schedules exist
            List<Schedule> schedules = new ArrayList<>();
            if (stopCrudDto.getSchedulesId() != null) {
                for (ScheduleIdDto scheduleIdDto : stopCrudDto.getSchedulesId()) {
                    Optional<Schedule> _schedule = scheduleRepository.findByScheduleId(new ScheduleId(new RouteId(scheduleIdDto.getRouteId().getId(), scheduleIdDto.getRouteId().getShift()), scheduleIdDto.getStopId(), scheduleIdDto.getSequence()));
                    if (_schedule.isEmpty())
                        return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                    Schedule schedule = _schedule.get();
                    if (schedule.getStop() != null)
                        return new ResponseEntity<>(HttpStatus.CONFLICT);
                    schedules.add(schedule);
                }
            }

            stopRepository.save(new Stop(
                    stopCrudDto.getId(),
                    stopCrudDto.getDesignation(),
                    stopCrudDto.getPosition()[0],
                    stopCrudDto.getPosition()[1],
                    schedules
            ));
            return new ResponseEntity<>(stopCrudDto, HttpStatus.CREATED);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<StopCrudDto> updateStop(String id, StopCrudDto stopCrudDto) {
        try {
            Optional<Stop> _stop = stopRepository.findById(id);
            if (_stop.isEmpty())
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            Stop stop = _stop.get();

            // Check if schedules exist
            List<Schedule> schedules = new ArrayList<>();
            if (stopCrudDto.getSchedulesId() != null) {
                for (ScheduleIdDto scheduleIdDto : stopCrudDto.getSchedulesId()) {
                    Optional<Schedule> _schedule = scheduleRepository.findByScheduleId(new ScheduleId(new RouteId(scheduleIdDto.getRouteId().getId(), scheduleIdDto.getRouteId().getShift()), scheduleIdDto.getStopId(), scheduleIdDto.getSequence()));
                    if (_schedule.isEmpty())
                        return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
                    Schedule schedule = _schedule.get();
                    if (schedule.getStop() != null && !schedule.getStop().equals(stop))
                        return new ResponseEntity<>(HttpStatus.CONFLICT);
                    schedules.add(schedule);
                }
            }

            stop.setDesignation(stopCrudDto.getDesignation());
            stop.setLat(stopCrudDto.getPosition()[0]);
            stop.setLon(stopCrudDto.getPosition()[1]);
            stopRepository.save(stop);

            List<Schedule> newSchedules = new ArrayList<>();
            for (Schedule schedule : schedules) {
                newSchedules.add(new Schedule(
                        new ScheduleId(schedule.getId().getRouteId(), stop.getId(), schedule.getId().getSequence()),
                        schedule.getRoute(),
                        stop,
                        schedule.getTime()
                ));
            }
            for (Schedule schedule : newSchedules) {
                scheduleRepository.save(schedule);
            }
            for (Schedule schedule : stop.getSchedules()) {
                if (!newSchedules.contains(schedule)) {
                    scheduleRepository.deleteByScheduleId(schedule.getId());
                }
            }

            stopCrudDto.setId(id);
            stopCrudDto.setDesignation(stop.getDesignation());
            stopCrudDto.setPosition(new Double[]{stop.getLat(), stop.getLon()});
            stopCrudDto.setSchedulesId(newSchedules.stream().map(schedule -> new ScheduleIdDto(new RouteIdDto(schedule.getId().getRouteId().getId(), schedule.getId().getRouteId().getShift()), schedule.getId().getStopId(), schedule.getId().getSequence())).toArray(ScheduleIdDto[]::new));
            return new ResponseEntity<>(stopCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<HttpStatus> deleteStop(String id) {
        try {
            Optional<Stop> _stop = stopRepository.findById(id);
            if (_stop.isEmpty())
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            Stop stop = _stop.get();
            if (!stop.getSchedules().isEmpty())
                return new ResponseEntity<>(HttpStatus.CONFLICT);

            stopRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //
    // Users
    //
    public ResponseEntity<List<UserCrudDto>> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();
            if (users.isEmpty())
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);

            List<UserCrudDto> usersCrudDto = new ArrayList<>();
            for (User user : users) {
                usersCrudDto.add(new UserCrudDto(
                        user.getUsername(),
                        user.getPassword()
                ));
            }
            return new ResponseEntity<>(usersCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<UserCrudDto> getUserByUsername(String username) {
        try {
            Optional<User> _user = userRepository.findByUsername(username);
            if (_user.isEmpty())
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            User user = _user.get();

            UserCrudDto userCrudDto = new UserCrudDto(
                    user.getUsername(),
                    user.getPassword()
            );
            return new ResponseEntity<>(userCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<UserCrudDto> createUser(UserCrudDto userCrudDto) {
        try {
            // Check if user already exists
            Optional<User> _user = userRepository.findByUsername(userCrudDto.getUsername());
            if (_user.isPresent())
                return new ResponseEntity<>(HttpStatus.CONFLICT);

            userRepository.save(new User(
                    userCrudDto.getUsername(),
                    userCrudDto.getPassword()
            ));
            return new ResponseEntity<>(userCrudDto, HttpStatus.CREATED);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<UserCrudDto> updateUser(String username, UserCrudDto userCrudDto) {
        try {
            Optional<User> _user = userRepository.findByUsername(username);
            if (_user.isEmpty())
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            User user = _user.get();

            user.setPassword(userCrudDto.getPassword());
            userRepository.save(user);

            userCrudDto.setUsername(user.getUsername());
            userCrudDto.setPassword(user.getPassword());
            return new ResponseEntity<>(userCrudDto, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<HttpStatus> deleteUser(String username) {
        try {
            userRepository.deleteByUsername(username);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
