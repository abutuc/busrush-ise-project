package ies.project.busrush.controller;

import ies.project.busrush.dto.crud.*;
import ies.project.busrush.service.CrudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class CrudController {

    @Autowired
    private CrudService crudService;

    //
    // Buses
    //
    @GetMapping("/buses")
    public ResponseEntity<List<BusCrudDto>> getAllBuses(
            @RequestParam(value = "device_id") Optional<String> deviceId
    ) {
        return crudService.getAllBuses(deviceId);
    }

    @GetMapping("/buses/{id}")
    public ResponseEntity<BusCrudDto> getBusById(@PathVariable("id") String id) {
        return crudService.getBusById(id);
    }

    @PostMapping("/buses")
    public ResponseEntity<BusCrudDto> createBus(@RequestBody BusCrudDto busCrudDto) {
        return crudService.createBus(busCrudDto);
    }

    @CrossOrigin(origins = "http://192.168.160.222:3000")
    @PutMapping("/buses/{id}")
    public ResponseEntity<BusCrudDto> updateBus(@PathVariable("id") String id, @RequestBody BusCrudDto busCrudDto) {
        return crudService.updateBus(id, busCrudDto);
    }

    @CrossOrigin(origins = "http://192.168.160.222:3000")
    @DeleteMapping("/buses/{id}")
    public ResponseEntity<HttpStatus> deleteBus(@PathVariable("id") String id) {
        return crudService.deleteBus(id);
    }

    //
    // Devices
    //
    @GetMapping("/devices")
    public ResponseEntity<List<DeviceCrudDto>> getAllDevices() {
        return crudService.getAllDevices();
    }

    @GetMapping("/devices/{id}")
    public ResponseEntity<DeviceCrudDto> getDeviceById(@PathVariable("id") String id) {
        return crudService.getDeviceById(id);
    }

    @PostMapping("/devices")
    public ResponseEntity<DeviceCrudDto> createDevice(@RequestBody DeviceCrudDto deviceCrudDto) {
        return crudService.createDevice(deviceCrudDto);
    }

    @CrossOrigin(origins = "http://192.168.160.222:3000")
    @PutMapping("/devices/{id}")
    public ResponseEntity<DeviceCrudDto> updateDevice(@PathVariable("id") String id, @RequestBody DeviceCrudDto deviceCrudDto) {
        return crudService.updateDevice(id, deviceCrudDto);
    }

    @CrossOrigin(origins = "http://192.168.160.222:3000")
    @DeleteMapping("/devices/{id}")
    public ResponseEntity<HttpStatus> deleteDevice(@PathVariable("id") String id) {
        return crudService.deleteDevice(id);
    }

    //
    // Drivers
    //
    @GetMapping("/drivers")
    public ResponseEntity<List<DriverCrudDto>> getAllDrivers() {
        return crudService.getAllDrivers();
    }

    @GetMapping("/drivers/{id}")
    public ResponseEntity<DriverCrudDto> getDriverById(@PathVariable("id") String id) {
        return crudService.getDriverById(id);
    }

    @PostMapping("/drivers")
    public ResponseEntity<DriverCrudDto> createDriver(@RequestBody DriverCrudDto driverCrudDto) {
        return crudService.createDriver(driverCrudDto);
    }

    @CrossOrigin(origins = "http://192.168.160.222:3000")
    @PutMapping("/drivers/{id}")
    public ResponseEntity<DriverCrudDto> updateDriver(@PathVariable("id") String id, @RequestBody DriverCrudDto driverCrudDto) {
        return crudService.updateDriver(id, driverCrudDto);
    }
    @CrossOrigin(origins = "http://192.168.160.222:3000")
    @DeleteMapping("/drivers/{id}")
    public ResponseEntity<HttpStatus> deleteDriver(@PathVariable("id") String id) {
        return crudService.deleteDriver(id);
    }

    //
    // Routes
    //
    @GetMapping("/routes")
    public ResponseEntity<List<RouteCrudDto>> getAllRoutes() {
        return crudService.getAllRoutes();
    }

    @GetMapping("/routes/{routeId}")
    public ResponseEntity<RouteCrudDto> getRouteByRouteId(@PathVariable("routeId") String routeId) {
        return crudService.getRouteByRouteId(routeId);
    }

    @PostMapping("/routes")
    public ResponseEntity<RouteCrudDto> createRoute(@RequestBody RouteCrudDto routeCrudDto) {
        return crudService.createRoute(routeCrudDto);
    }

    @CrossOrigin(origins = "http://192.168.160.222:3000")
    @PutMapping("/routes/{routeId}")
    public ResponseEntity<RouteCrudDto> updateRoute(@PathVariable("routeId") String routeId, @RequestBody RouteCrudDto routeCrudDto) {
        return crudService.updateRoute(routeId, routeCrudDto);
    }
    @CrossOrigin(origins = "http://192.168.160.222:3000")
    @DeleteMapping("/routes/{routeId}")
    public ResponseEntity<HttpStatus> deleteRoute(@PathVariable("routeId") String routeId) {
        return crudService.deleteRoute(routeId);
    }

    //
    // Schedules
    //
    @GetMapping("/schedules")
    public ResponseEntity<List<ScheduleCrudDto>> getAllSchedules() {
        return crudService.getAllSchedules();
    }

    @GetMapping("/schedules/{scheduleId}")
    public ResponseEntity<ScheduleCrudDto> getScheduleByScheduleId(@PathVariable("scheduleId") String scheduleId) {
        return crudService.getScheduleByScheduleId(scheduleId);
    }

    @PostMapping("/schedules")
    public ResponseEntity<ScheduleCrudDto> createSchedule(@RequestBody ScheduleCrudDto scheduleCrudDto) {
        return crudService.createSchedule(scheduleCrudDto);
    }

    @CrossOrigin(origins = "http://192.168.160.222:3000")
    @PutMapping("/schedules/{scheduleId}")
    public ResponseEntity<ScheduleCrudDto> updateSchedule(@PathVariable("scheduleId") String scheduleId, @RequestBody ScheduleCrudDto scheduleCrudDto) {
        return crudService.updateSchedule(scheduleId, scheduleCrudDto);
    }

    @CrossOrigin(origins = "http://192.168.160.222:3000")
    @DeleteMapping("/schedules/{scheduleId}")
    public ResponseEntity<HttpStatus> deleteSchedule(@PathVariable("scheduleId") String scheduleId) {
        return crudService.deleteSchedule(scheduleId);
    }

    //
    // Stops
    //
    @GetMapping("/stops")
    public ResponseEntity<List<StopCrudDto>> getAllStops() {
        return crudService.getAllStops();
    }

    @GetMapping("/stops/{id}")
    public ResponseEntity<StopCrudDto> getStopById(@PathVariable("id") String id) {
        return crudService.getStopById(id);
    }

    @PostMapping("/stops")
    public ResponseEntity<StopCrudDto> createStop(@RequestBody StopCrudDto stopCrudDto) {
        return crudService.createStop(stopCrudDto);
    }

    @CrossOrigin(origins = "http://192.168.160.222:3000")
    @PutMapping("/stops/{id}")
    public ResponseEntity<StopCrudDto> updateStop(@PathVariable("id") String id, @RequestBody StopCrudDto stopCrudDto) {
        return crudService.updateStop(id, stopCrudDto);
    }

    @CrossOrigin(origins = "http://192.168.160.222:3000")
    @DeleteMapping("/stops/{id}")
    public ResponseEntity<HttpStatus> deleteStop(@PathVariable("id") String id) {
        return crudService.deleteStop(id);
    }

    //
    // Users
    //
    @GetMapping("/users")
    public ResponseEntity<List<UserCrudDto>> getAllUsers() {
        return crudService.getAllUsers();
    }

    @GetMapping("/users/{username}")
    public ResponseEntity<UserCrudDto> getUserByUsername(@PathVariable("username") String username) {
        return crudService.getUserByUsername(username);
    }

    @PostMapping("/users")
    public ResponseEntity<UserCrudDto> createUser(@RequestBody UserCrudDto userCrudDto) {
        return crudService.createUser(userCrudDto);
    }

    @CrossOrigin(origins = "http://192.168.160.222:3000")
    @PutMapping("/users/{username}")
    public ResponseEntity<UserCrudDto> updateUser(@PathVariable("username") String username, @RequestBody UserCrudDto userCrudDto) {
        return crudService.updateUser(username, userCrudDto);
    }

    @CrossOrigin(origins = "http://192.168.160.222:3000")
    @DeleteMapping("/users/{username}")
    public ResponseEntity<HttpStatus> deleteUser(@PathVariable("username") String username) {
        return crudService.deleteUser(username);
    }
}
