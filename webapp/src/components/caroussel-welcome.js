import React from "react";
import Carousel from "react-material-ui-carousel";
import { Paper, Box, Avatar } from "@mui/material";
import { useState, useEffect } from "react";

export default function CarouselComponent() {
  const [value, setValue] = React.useState(0);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  // useEffect
  useEffect(() => {
    const handleResize = () => setViewportHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: "#121828" }}>
      <Paper sx={{ width: "auto" }}>
        <Carousel
          value={value}
          onChange={(event, newValue) => setValue(newValue)}
          sx={{ backgroundColor: "#121828" }}
        >
          <Box>
            <Avatar
              sx={{
                cursor: "pointer",
                height: viewportHeight * 0.8,
                width: "auto",
                borderRadius: 0,
              }}
              src="/static/images/carrousel1.jpeg"
            />
          </Box>
          <Box>
            <Avatar
              sx={{
                cursor: "pointer",
                height: viewportHeight * 0.8,
                width: "auto",
                borderRadius: 0,
              }}
              src="/static/images/images2.png"
            />
          </Box>
          <Box>
            <Avatar
              sx={{
                cursor: "pointer",
                height: viewportHeight * 0.8,
                width: "auto",
                borderRadius: 0,
              }}
              src="/static/images/images3.jpeg"
            />
          </Box>
        </Carousel>
      </Paper>
    </Box>
  );
}
