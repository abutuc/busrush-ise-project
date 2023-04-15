import { Avatar, Card, CardContent, Grid, Typography } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
//import { busesLive } from '../../__mocks__/buses-live';
//import { busRoutes } from '../../__mocks__/bus-routes';

export const TotalStops = (props) => {

  const { stops } = props;

  return (
  <Card {...props}>
    <CardContent>
      <Grid
        container
        spacing={3}
        sx={{ justifyContent: 'space-between' }}
      >
        <Grid item>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="overline"
          >
            TOTAL STOPS
          </Typography>
          <Typography
            color="textPrimary"
            variant="h4"
          >
            {stops.length}
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: 'primary.main',
              height: 56,
              width: 56
            }}
          >
            <PlaceIcon />
          </Avatar>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
  );
};