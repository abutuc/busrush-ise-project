import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { AuthGuard } from "./auth-guard";
import { DashboardNavbar } from "./dashboard-navbar";
import { DashboardSidebar } from "./dashboard-sidebar";
import Stomp from "stompjs";

const DashboardLayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  paddingTop: 64,
  [theme.breakpoints.up("lg")]: {
    paddingLeft: 280,
  },
}));

export const DashboardLayout = (props) => {
  const [delayed_buses, setDelayedBuses] = useState(new Map());
  const { children } = props;
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const addDelayedBus = (bus) => {
    const delayed_buses = new Map();
    delayed_buses.set(bus.bus_id, bus.delay);
    setDelayedBuses(delayed_buses);
  };

  useEffect(() => {
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
        stomp.subscribe("/queue/events", (msg) => {
          const data = JSON.parse(msg.body);
          addDelayedBus(data);
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }, []);

  return (
    <AuthGuard>
      <DashboardLayoutRoot>
        <Box
          sx={{
            display: "flex",
            flex: "1 1 auto",
            flexDirection: "column",
            width: "100%",
          }}
        >
          {children}
        </Box>
      </DashboardLayoutRoot>
      <DashboardNavbar delayed_buses={delayed_buses} onSidebarOpen={() => setSidebarOpen(true)} />
      <DashboardSidebar onClose={() => setSidebarOpen(false)} open={isSidebarOpen} />
    </AuthGuard>
  );
};
