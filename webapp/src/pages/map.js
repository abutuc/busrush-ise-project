import Head from "next/head";
import { Component } from "react";
import { Box, Container, Grid } from "@mui/material";
import dynamic from "next/dynamic";
import Stomp from "stompjs";
import { DashboardLayout } from "../components/dashboard-layout";
// import { MapWidget } from '../components/map/map-widget';
const MapWidget = dynamic(() => import("../components/map/map-widget"), { ssr: false });
import { busesLive } from "../__mocks__/buses-live";
import { busRoutes } from "../__mocks__/bus-routes";
import { BusMetrics } from "../components/map/bus-metrics";

class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buses: {},
      stops: [],
      selectedBus: null,
    };
  }

  // Executes after the component is mounted in the DOM
  componentDidMount = () => {
    this.fetchAllStops().then((stops) => this.updateStops(stops));
    // Setup buses
    const stomp = Stomp.client("ws://192.168.160.222:15674/ws");
    const headers = {
      login: "guest",
      passcode: "guest",
      durable: true,
      "auto-delete": false,
    };
    stomp.connect(
      headers,
      () => {
        stomp.subscribe("/queue/devices", (msg) => {
          this.updateBuses(JSON.parse(msg.body));

          const { selectedBus } = this.state;
          if (selectedBus) {
            const stateBus = this.state.buses[selectedBus.deviceId];
            selectedBus.metrics = {
              timestamp: stateBus.timestamp,
              position: stateBus.position,
              speed: stateBus.speed,
              fuel: stateBus.fuel,
              passengers: stateBus.passengers,
            };
            this.updateSelectedBus(selectedBus);
          }
        });
      },
      (err) => {
        console.log(err);
      }
    );
  };

  fetchAllStops = async () => {
    let stops = null;
    await fetch("http://192.168.160.222:8080/api/stops")
      .then((res) => res.json())
      .then((data) => (stops = data))
      .catch((err) => console.log(err));
    return stops;
  };

  fetchBusesByDeviceId = async (deviceId) => {
    let buses = null;
    await fetch(`http://192.168.160.222:8080/api/buses?device_id=${deviceId}`)
      .then((res) => res.json())
      .then((data) => (buses = data))
      .catch((err) => console.log(err));
    return buses;
  };

  changeSelectedBus = (deviceId) => {
    this.fetchBusesByDeviceId(deviceId).then((buses) => {
      const fetchBus = buses[0]; // Should be only one (1 device <-> 1 bus)
      const stateBus = this.state.buses[deviceId];
      const bus = {
        id: fetchBus.id,
        deviceId: fetchBus.deviceId,
        registration: fetchBus.registration,
        brand: fetchBus.brand,
        model: fetchBus.model,
        metrics: {
          timestamp: stateBus.timestamp,
          position: stateBus.position,
          speed: stateBus.speed,
          fuel: stateBus.fuel,
          passengers: stateBus.passengers,
        },
      };
      this.updateSelectedBus(bus);
    });
  };

  updateStops = (stops) => {
    this.setState({ stops: stops });
  };

  updateBuses = (bus) => {
    const { buses } = this.state;
    buses[bus.device_id] = {
      routeId: bus.route_id,
      routeShift: bus.route_shift,
      timestamp: bus.timestamp,
      position: bus.position,
      speed: bus.speed,
      fuel: bus.fuel,
      passengers: bus.passengers,
    };
    this.setState({ buses: buses });
  };

  updateSelectedBus = (bus) => {
    this.setState({ selectedBus: bus });
  };

  render = () => {
    const { buses, stops, selectedBus } = this.state;
    return (
      <>
        <Head>
          <title>BusRush - Live Map</title>
        </Head>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 3,
          }}
        >
          <Container maxWidth={false}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} lg={8} xl={8}>
                <MapWidget buses={buses} stops={stops} changeSelectedBus={this.changeSelectedBus} />
              </Grid>
              <Grid item xs={12} sm={12} lg={4} xl={4}>
                <BusMetrics bus={selectedBus} />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </>
    );
  };
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
