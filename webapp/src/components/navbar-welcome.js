import React from "react";
import { AppBar } from "@mui/material";
import { Toolbar } from "@mui/material";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";

export default function WelcomeNavbar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#121828" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          BusRush
        </Typography>
        <Button href="/statistics" color="inherit" sx={{ alignSelf: "right" }}>
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
}
