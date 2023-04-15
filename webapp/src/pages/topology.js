import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import { Box, Container, Typography, Grid, CircularProgress, Button } from "@mui/material";
import { CustomerListToolbar } from "../components/customer/customer-list-toolbar";
import { DashboardLayout } from "../components/dashboard-layout";
import { customers } from "../__mocks__/customers";
import { BusTable } from "../components/topology/bus-topology-table";
import { DeviceTable } from "../components/topology/device-topology-table";
import { DriverTable } from "../components/topology/drivers-topology-table";
import { RouteTable } from "../components/topology/routes-topology-table";
import { ScheduleTable } from "../components/topology/schedules-topology-table";
import { StopTable } from "../components/topology/stops-topology-table";

const Page = () => {
  const [buses, setBuses] = useState([]);
  const [devices, setDevices] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [stops, setStops] = useState([]);
  const [busesIsLoading, setBusesIsLoading] = useState(true);
  const [devicesIsLoading, setDevicesIsLoading] = useState(true);
  const [driversIsLoading, setDriversIsLoading] = useState(true);
  const [routesIsLoading, setRoutesIsLoading] = useState(true);
  const [schedulesIsLoading, setSchedulesIsLoading] = useState(true);
  const [stopsIsLoading, setStopsIsLoading] = useState(true);

  useEffect(() => {
    fetchAllBuses().then((buses) => setBuses(buses));
    fetchAllDevices().then((devices) => setDevices(devices));
    fetchAllDrivers().then((drivers) => setDrivers(drivers));
    fetchAllRoutes().then((routes) => setRoutes(routes));
    fetchAllSchedules().then((schedules) => setSchedules(schedules));
    fetchAllStops().then((stops) => setStops(stops));
  }, [buses, devices, drivers, routes, schedules]);

  const fetchAllBuses = async () => {
    let buses = null;
    await fetch("http://192.168.160.222:8080/api/buses")
      .then((res) => res.json())
      .then((data) => (buses = data))
      .catch((err) => console.log(err));
    setBusesIsLoading(false);
    return buses;
  };

  const fetchAllDevices = async () => {
    let devices = null;
    await fetch("http://192.168.160.222:8080/api/devices")
      .then((res) => res.json())
      .then((data) => (devices = data))
      .catch((err) => console.log(err));
    setDevicesIsLoading(false);
    return devices;
  };

  const fetchAllDrivers = async () => {
    let drivers = null;
    await fetch("http://192.168.160.222:8080/api/drivers")
      .then((res) => res.json())
      .then((data) => (drivers = data))
      .catch((err) => console.log(err));
    setDriversIsLoading(false);
    return drivers;
  };

  const fetchAllRoutes = async () => {
    let routes = null;
    await fetch("http://192.168.160.222:8080/api/routes")
      .then((res) => res.json())
      .then((data) => (routes = data))
      .catch((err) => console.log(err));
    setRoutesIsLoading(false);
    return routes;
  };

  const fetchAllSchedules = async () => {
    let schedules = null;
    await fetch("http://192.168.160.222:8080/api/schedules")
      .then((res) => res.json())
      .then((data) => (schedules = data))
      .catch((err) => console.log(err));
    setSchedulesIsLoading(false);
    return schedules;
  };

  const fetchAllStops = async () => {
    let stops = null;
    await fetch("http://192.168.160.222:8080/api/stops")
      .then((res) => res.json())
      .then((data) => (stops = data))
      .catch((err) => console.log(err));
    setStopsIsLoading(false);
    return stops;
  };

  const busTable = useRef(null);
  const routeTable = useRef(null);
  const deviceTable = useRef(null);
  const driverTable = useRef(null);
  const scheduleTable = useRef(null);
  const stopTable = useRef(null);

  useEffect(() => {}, []);

  return (
    <>
      <Head>
        <title>BusRush - Fleet</title>
      </Head>
      {busesIsLoading ||
      devicesIsLoading ||
      driversIsLoading ||
      routesIsLoading ||
      schedulesIsLoading ||
      stopsIsLoading ? (
        <CircularProgress />
      ) : (
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
          }}
        >
          <Container maxWidth={false}>
            <Typography
              color="textPrimary"
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              Fleet
            </Typography>
            <Grid container sx={{ paddingBottom: 2 }}>
              <Typography>
                <Button onClick={() => window.scrollTo(0, busTable.current.offsetTop - 100)}>
                  Buses
                </Button>
              </Typography>
              <Typography sx={{ paddingLeft: 2 }}>
                <Button onClick={() => window.scrollTo(0, deviceTable.current.offsetTop - 100)}>
                  Devices
                </Button>
              </Typography>
              <Typography sx={{ paddingLeft: 2 }}>
                <Button onClick={() => window.scrollTo(0, driverTable.current.offsetTop - 100)}>
                  Drivers
                </Button>
              </Typography>
              <Typography sx={{ paddingLeft: 2 }}>
                <Button onClick={() => window.scrollTo(0, routeTable.current.offsetTop - 100)}>
                  Routes
                </Button>
              </Typography>
              <Typography sx={{ paddingLeft: 2 }}>
                <Button onClick={() => window.scrollTo(0, scheduleTable.current.offsetTop - 100)}>
                  Schedules
                </Button>
              </Typography>
              <Typography sx={{ paddingLeft: 2 }}>
                <Button onClick={() => window.scrollTo(0, stopTable.current.offsetTop - 100)}>
                  Stops
                </Button>
              </Typography>
            </Grid>

            <Grid container>
              <Grid item xs={12} md={6} lg={6}>
                <Box ref={busTable} id="bus-table">
                  <BusTable buses={buses} devices={devices} routes={routes} />
                </Box>
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <Box ref={deviceTable} id="device-table">
                  <DeviceTable devices={devices} buses={buses} />
                </Box>
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <Box ref={driverTable} id="driver-table">
                  <DriverTable drivers={drivers} routes={routes} />
                </Box>
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <Box ref={routeTable} id="route-table">
                  <RouteTable routes={routes} buses={buses} drivers={drivers} />
                </Box>
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <Box ref={scheduleTable} id="schedule-table">
                  <ScheduleTable schedules={schedules} routes={routes} stops={stops} />
                </Box>
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <Box ref={stopTable} id="stop-table">
                  <StopTable stops={stops} />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      )}
    </>
  );
};
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
