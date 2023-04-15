import Head from "next/head";
import { Box, Button, Container, List, ListItem, Modal, Typography } from "@mui/material";
import { DashboardLayout } from "../components/dashboard-layout";
import Stomp from "stompjs";
import { useEffect, useState } from "react";
import WelcomeNavbar from "../components/navbar-welcome";
import CarouselComponent from "../components/caroussel-welcome";

const Page = () => {
  const [delayed_buses, setDelayedBuses] = useState(new Map());
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Head>
        <title>BusRush</title>
      </Head>
      <WelcomeNavbar />
      <CarouselComponent />
    </>
  );
};
export default Page;

const style = (viewportWidth) => ({
  position: "absolute",
  top: "50%",
  left: viewportWidth > 1200 ? "60%" : "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid grey",
  borderRadius: 1,
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  justifyContent: "center",
  alignItems: "center",
});
