import { Avatar, Box, Card, CardContent, Grid, Typography } from "@mui/material";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import ExploreIcon from "@mui/icons-material/Explore";
import SpeedIcon from "@mui/icons-material/Speed";
import UpdateIcon from "@mui/icons-material/Update";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import GroupsIcon from "@mui/icons-material/Groups";

export const BusMetrics = (props) => {
  const { bus } = props;

  if (!bus) {
    return (
      <Card sx={{ height: "100%" }} {...props}>
        <CardContent>
          <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
            <Grid item>
              <Typography color="textSecondary" variant="overline">
                Select a bus in the map!
              </Typography>
            </Grid>
            <Grid item>
              <Avatar
                sx={{
                  backgroundColor: "primary.main",
                  height: 56,
                  width: 56,
                }}
              >
                <DirectionsBusIcon fontSize={"large"} />
              </Avatar>
            </Grid>
          </Grid>
          <Box
            sx={{
              pt: 2,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Grid container>
              <Grid item xs={12} sx={{ display: "flex" }}>
                <UpdateIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle2" sx={{ mr: 1 }}>
                  Timestamp:{" "}
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ display: "flex" }}>
                <ExploreIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle2" sx={{ mr: 1 }}>
                  Latitude:{" "}
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ display: "flex" }}>
                <ExploreIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle2" sx={{ mr: 1 }}>
                  Longitude:{" "}
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ display: "flex" }}>
                <SpeedIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle2" sx={{ mr: 1 }}>
                  Speed:{" "}
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ display: "flex" }}>
                <LocalGasStationIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle2" sx={{ mr: 1 }}>
                  Fuel:{" "}
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ display: "flex" }}>
                <GroupsIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle2" sx={{ mr: 1 }}>
                  Occupancy:{" "}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: "100%" }} {...props}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
          <Grid item>
            <Typography color="textPrimary" variant="h4">
              {bus.brand}
            </Typography>
            <Typography color="textSecondary" variant="overline">
              Id: {bus.id}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: "primary.main",
                height: 56,
                width: 56,
              }}
            >
              <DirectionsBusIcon fontSize={"large"} />
            </Avatar>
          </Grid>
        </Grid>
        <Box
          sx={{
            pt: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Grid container>
            <Grid item xs={12} sx={{ display: "flex" }}>
              <UpdateIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle2" sx={{ mr: 1 }}>
                Timestamp:{" "}
              </Typography>
              <Typography variant="body2">{bus.metrics.timestamp.toLocaleString()}</Typography>
            </Grid>
            <Grid item xs={12} sx={{ display: "flex" }}>
              <ExploreIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle2" sx={{ mr: 1 }}>
                Latitude:{" "}
              </Typography>
              <Typography variant="body2">{bus.metrics.position[0].toFixed(5)} º</Typography>
            </Grid>
            <Grid item xs={12} sx={{ display: "flex" }}>
              <ExploreIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle2" sx={{ mr: 1 }}>
                Longitude:{" "}
              </Typography>
              <Typography variant="body2">{bus.metrics.position[1].toFixed(5)} º</Typography>
            </Grid>
            <Grid item xs={12} sx={{ display: "flex" }}>
              <SpeedIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle2" sx={{ mr: 1 }}>
                Speed:{" "}
              </Typography>
              <Typography variant="body2">{bus.metrics.speed} km/h</Typography>
            </Grid>
            <Grid item xs={12} sx={{ display: "flex" }}>
              <LocalGasStationIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle2" sx={{ mr: 1 }}>
                Fuel:{" "}
              </Typography>
              <Typography variant="body2">{bus.metrics.fuel} liters</Typography>
            </Grid>
            <Grid item xs={12} sx={{ display: "flex" }}>
              <GroupsIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle2" sx={{ mr: 1 }}>
                Occupancy:{" "}
              </Typography>
              <Typography variant="body2">{bus.metrics.passengers} passengers</Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};
