import {
  Card,
  CardContent,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Grid,
  IconButton,
  TablePagination,
  TableFooter,
  Modal,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Button,
  List,
  ListItem,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";

export const StopTable = ({ stops, ...rest }) => {
  const api = "http://192.168.160.222:8080/";

  const [lower_bound, setLowerBound] = useState(0);
  const [upper_bound, setUpperBound] = useState(5);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const [openAddStopModal, setOpenAddStopModal] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [stopID, setStopID] = useState("");
  const [stopIDIsValid, setStopIDIsValid] = useState(true);
  const [stopIDInputHelpText, setStopIDInputHelpText] = useState("");
  const [stopDesignation, setStopDesignation] = useState("");
  const [stopDesignationIsValid, setStopDesignationIsValid] = useState(true);
  const [stopLatitude, setStopLatitude] = useState("");
  const [stopLatitudeIsValid, setStopLatitudeIsValid] = useState(true);
  const [stopLatitudeInputHelpText, setStopLatitudeInputHelpText] = useState("");
  const [stopLongitude, setStopLongitude] = useState("");
  const [stopLongitudeIsValid, setStopLongitudeIsValid] = useState(true);
  const [stopLongitudeInputHelpText, setStopLongitudeInputHelpText] = useState("");
  const [selectedSchedules, setSelectedSchedules] = useState([]);

  const [openInfoStopModal, setOpenInfoStopModal] = useState(false);
  const [stopInfo, setStopInfo] = useState({
    id: "",
    schedulesId: [],
    position: [],
    designation: "",
  });
  const [stopInfoIsLoading, setStopInfoIsLoading] = useState(true);

  const [openConfirmDeleteStop, setOpenConfirmDeleteStop] = useState(false);
  const [stopToDelete, setStopToDelete] = useState({ id: "", schedulesId: [] });

  const [openUpdateStopModal, setOpenUpdateStopModal] = useState(false);
  const [stopToUpdate, setStopToUpdate] = useState({
    id: "",
    schedulesId: [],
    position: [],
    designation: "",
  });

  // functions to handle pagination
  const handleLimitChange = (event) => {
    if (limit > event.target.value) {
      handlePageChange(event, page, -1, limit - event.target.value);
    } else if (limit < event.target.value) {
      handlePageChange(event, page, 1, event.target.value - limit);
    }

    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage, flag = 0, new_lim = 0) => {
    if (newPage > page) {
      setLowerBound(lower_bound + limit);
      setUpperBound(upper_bound + limit);
    } else if (newPage < page) {
      setLowerBound(lower_bound - limit);
      setUpperBound(upper_bound - limit);
    } else {
      if (flag == 1) {
        setUpperBound(upper_bound + new_lim);
      } else if (flag == -1) {
        setUpperBound(upper_bound - new_lim);
      }
    }
    setPage(newPage);
  };

  // Stop ID Input Handle Function and Validation
  const validateStopIDInput = (stopID) => {
    let pattern = /^AVRBUS-S[0-9]{4}$/;
    let stopId_is_valid = false;
    if (pattern.test(stopID)) {
      stopId_is_valid = true;
      stops.forEach((stop) => {
        if (stop.id == stopID) {
          stopId_is_valid = false;
          setStopIDInputHelpText("Stop ID already exists.");
        }
      });
    } else {
      stopId_is_valid = false;
      setStopIDInputHelpText("Should be in the form of AVRBUS-SXXXX");
    }
    return stopId_is_valid;
  };

  const handleStopIDInputChange = (event) => {
    let val = validateStopIDInput(event.target.value);
    setStopIDIsValid(val);
    if (val) {
      setStopID(event.target.value);
    }
  };

  const handleStopIDInputFocus = (event) => {
    setStopIDIsValid(validateStopIDInput(event.target.value));
  };

  const handleStopIDInputBlur = (event) => {
    let val = event.target.value;
    if (val == "") {
      setStopIDIsValid(true);
      setStopIDInputHelpText("");
    } else {
      if (validateStopIDInput(val)) {
        setStopIDInputHelpText("");
      }
    }
  };

  // Stop Designation Input Handle Function and Validation
  const validateStopDesignationInput = (stopDesignation) => {
    if (stopDesignation.length > 0) {
      return true;
    }
    return false;
  };

  const handleStopDesignationInputChange = (event) => {
    let val = validateStopDesignationInput(event.target.value);
    setStopDesignationIsValid(val);
    if (val) {
      setStopDesignation(event.target.value);
    }
  };

  const handleStopDesignationInputFocus = (event) => {
    setStopDesignationIsValid(validateStopDesignationInput(event.target.value));
  };

  const handleStopDesignationInputBlur = (event) => {
    let val = event.target.value;
    if (val == "") {
      setStopDesignationIsValid(true);
    }
  };

  // Stop Latitude Input Handle Function and Validation
  const validateStopLatitudeInput = (stopLatitude) => {
    if (
      stopLatitude.length > 0 &&
      !isNaN(Number(stopLatitude)) &&
      Number(stopLatitude) >= -90 &&
      Number(stopLatitude) <= 90
    ) {
      return true;
    } else {
      setStopLatitudeInputHelpText("Should be a number between -90 and 90");
      return false;
    }
  };

  const handleStopLatitudeInputChange = (event) => {
    let val = validateStopLatitudeInput(event.target.value);
    setStopLatitudeIsValid(val);
    if (val) {
      setStopLatitude(event.target.value);
    }
  };

  const handleStopLatitudeInputFocus = (event) => {
    setStopLatitudeIsValid(validateStopLatitudeInput(event.target.value));
  };

  const handleStopLatitudeInputBlur = (event) => {
    let val = event.target.value;
    if (val == "") {
      setStopLatitudeIsValid(true);
      setStopLatitudeInputHelpText("");
    } else {
      if (validateStopLatitudeInput(val)) {
        setStopLatitudeInputHelpText("");
      }
    }
  };

  // Stop Longitude Input Handle Function and Validation
  const validateStopLongitudeInput = (stopLongitude) => {
    if (
      stopLongitude.length > 0 &&
      !isNaN(Number(stopLongitude)) &&
      Number(stopLongitude) >= -90 &&
      Number(stopLongitude) <= 90
    ) {
      return true;
    } else {
      setStopLongitudeInputHelpText("Should be a number between -90 and 90");
      return false;
    }
  };

  const handleStopLongitudeInputChange = (event) => {
    let val = validateStopLongitudeInput(event.target.value);
    setStopLongitudeIsValid(val);
    if (val) {
      setStopLongitude(event.target.value);
    }
  };

  const handleStopLongitudeInputFocus = (event) => {
    setStopLongitudeIsValid(validateStopLongitudeInput(event.target.value));
  };

  const handleStopLongitudeInputBlur = (event) => {
    let val = event.target.value;
    if (val == "") {
      setStopLongitudeIsValid(true);
      setStopLongitudeInputHelpText("");
    } else {
      if (validateStopLongitudeInput(val)) {
        setStopLongitudeInputHelpText("");
      }
    }
  };

  // Add Stop
  const handleAddStop = () => {
    let newStop = {
      id: stopID,
      designation: stopDesignation,
      position: [Number(stopLatitude), Number(stopLongitude)],
    };

    fetch(api + "api/stops", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newStop),
    });
    handleCloseAddStopModal();
  };

  // Handle Delete Stop
  const handleDeleteStop = (stopID) => {
    fetch(api + "api/stops/" + stopID, {
      method: "DELETE",
    });
    handleCloseConfirmDeleteStop();
  };

  // Add Stop Modal Handle Functions
  const handleOpenAddStopModal = () => {
    setOpenAddStopModal(true);
  };

  const handleCloseAddStopModal = () => {
    setOpenAddStopModal(false);
    setStopID("");
    setStopDesignation("");
    setStopLatitude("");
    setStopLongitude("");
    setStopIDIsValid(true);
    setStopDesignationIsValid(true);
    setStopLatitudeIsValid(true);
    setStopLongitudeIsValid(true);
    setStopIDInputHelpText("");
    setStopLatitudeInputHelpText("");
    setStopLongitudeInputHelpText("");
  };

  // Fetch Stop Info
  const fetchStopInfo = (stopId) => {
    fetch(api + "api/stops/" + stopId)
      .then((response) => response.json())
      .then((data) => {
        setStopInfo(data);
        setStopInfoIsLoading(false);
        setStopID(data.id);
        setStopDesignation(data.designation);
        setStopLatitude(data.position[0].toString());
        setStopLongitude(data.position[1].toString());
        setStopIDIsValid(true);
        setStopDesignationIsValid(true);
        setStopLatitudeIsValid(true);
        setStopLongitudeIsValid(true);
        setStopIDInputHelpText("");
        setStopLatitudeInputHelpText("");
        setStopLongitudeInputHelpText("");
      });
    return true;
  };

  // Info Stop Modal Handle Functions
  const handleOpenInfoStopModal = (stopId) => {
    if (fetchStopInfo(stopId)) {
      setOpenInfoStopModal(true);
    }
  };

  const handleCloseInfoStopModal = () => {
    setOpenInfoStopModal(false);
    setStopInfoIsLoading(true);
    setStopInfo({ id: "", schedulesId: [], position: [], designation: "" });
    setStopID("");
    setStopDesignation("");
    setStopLatitude("");
    setStopLongitude("");
    setStopIDIsValid(true);
    setStopDesignationIsValid(true);
    setStopLatitudeIsValid(true);
    setStopLongitudeIsValid(true);
    setStopIDInputHelpText("");
    setStopLatitudeInputHelpText("");
    setStopLongitudeInputHelpText("");
    setSelectedSchedules([]);
  };

  // Handle Confirm Delete Stop
  const handleOpenConfirmDeleteStop = (stop) => {
    setStopToDelete(stop);
    setOpenConfirmDeleteStop(true);
  };

  const handleCloseConfirmDeleteStop = () => {
    setOpenConfirmDeleteStop(false);
  };

  // Handle Update Stop
  const handleOpenUpdateStopModal = (stop) => {
    setStopToUpdate(stop);
    fetchStopInfo(stop.id);
    setOpenUpdateStopModal(true);
  };

  const handleCloseUpdateStopModal = () => {
    setOpenUpdateStopModal(false);
    setStopInfoIsLoading(true);
    setStopInfo({ id: "", schedulesId: [], position: [], designation: "" });
    setStopID("");
    setStopDesignation("");
    setStopLatitude("");
    setStopLongitude("");
    setStopIDIsValid(true);
    setStopDesignationIsValid(true);
    setStopLatitudeIsValid(true);
    setStopLongitudeIsValid(true);
    setStopIDInputHelpText("");
    setStopLatitudeInputHelpText("");
    setStopLongitudeInputHelpText("");
  };

  const handleUpdateStop = () => {
    let schedulesID = [];
    selectedSchedules.forEach((schedule) => {
      let content = schedule.split("_");
      schedulesID.push({
        routeId: { id: content[0], shift: content[1] },
        stopId: content[2],
        sequence: content[3],
      });
    });

    let updatedStop = {
      id: stopID,
      designation: stopDesignation,
      position: [stopLatitude, stopLongitude],
    };

    if (schedulesID.length != 0) {
      updatedRoute.schedulesId = schedulesID;
    }

    fetch(api + "api/stops/" + stopID, {
      method: "PUT",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedStop),
    });

    handleCloseUpdateStopModal();
  };

  const schedulesToList = (schedules) => {
    let schedulesList = [];
    schedules.forEach((schedule) => {
      schedulesList.push(
        schedule.routeId.id +
          "_" +
          schedule.routeId.shift +
          "_" +
          schedule.stopId +
          "_" +
          schedule.sequence
      );
    });
    return schedulesList;
  };

  // Schedules Selection
  const handleSchedulesChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedSchedules(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  // useEffect
  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {stops == null ? (
        <CircularProgress />
      ) : (
        <Box>
          <Card>
            <CardContent>
              <Grid container>
                <Grid item xs={10} md={10} lg={10}>
                  <Typography
                    color="black"
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      margin: 0,
                    }}
                  >
                    Stops
                  </Typography>
                </Grid>
                <Grid item xs={2} md={2} lg={2}>
                  <IconButton onClick={handleOpenAddStopModal}>
                    <AddIcon />
                  </IconButton>
                </Grid>
              </Grid>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">ID</TableCell>
                    <TableCell align="left">Designation</TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stops.slice(lower_bound, upper_bound).map((stop) => (
                    <TableRow hover key={stop.id}>
                      <TableCell align="left">{stop.id}</TableCell>
                      <TableCell align="left">{stop.designation}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleOpenInfoStopModal(stop.id)}>
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleOpenConfirmDeleteStop(stop)}>
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleOpenUpdateStopModal(stop)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter></TableFooter>
              </Table>
            </CardContent>
            <TablePagination
              component="div"
              count={stops.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
              page={page}
              rowsPerPage={limit}
              rowsPerPageOptions={[5, 10, 15, 20]}
            />
          </Card>
          <Modal
            open={openAddStopModal}
            onClose={handleCloseAddStopModal}
            aria-labelledby="add-stop-modal"
            aria-describedby="add-stop-modal"
          >
            <Box sx={style(viewportWidth)}>
              <Grid container>
                <Grid item xs={11} md={11} lg={11}>
                  <Typography
                    id="add-stop-modal"
                    variant="h6"
                    component="h2"
                    sx={{ paddingBottom: 2 }}
                  >
                    Add Stop
                  </Typography>
                </Grid>
                <Grid item xs={1} md={1} lg={1}>
                  <IconButton onClick={handleCloseAddStopModal}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>
              <Box>
                <FormControl>
                  <InputLabel htmlFor="stop-id">Stop ID</InputLabel>
                  <Input
                    onFocus={handleStopIDInputFocus}
                    onBlur={handleStopIDInputBlur}
                    error={!stopIDIsValid}
                    id="stop-id"
                    aria-describedby="stop-id"
                    onChange={handleStopIDInputChange}
                  />
                  <FormHelperText id="stop-id">{stopIDInputHelpText}</FormHelperText>
                </FormControl>
              </Box>
              <Box sx={{ paddingTop: 4 }}>
                <FormControl>
                  <InputLabel htmlFor="stop-designation">Stop Designation</InputLabel>
                  <Input
                    onFocus={handleStopDesignationInputFocus}
                    onBlur={handleStopDesignationInputBlur}
                    error={!stopDesignationIsValid}
                    id="stop-designation"
                    aria-describedby="stop-designation"
                    onChange={handleStopDesignationInputChange}
                  />
                </FormControl>
              </Box>

              <Box sx={{ paddingTop: 4 }}>
                <FormControl>
                  <InputLabel htmlFor="stop-latitude">Stop Latitude</InputLabel>
                  <Input
                    onFocus={handleStopLatitudeInputFocus}
                    onBlur={handleStopLatitudeInputBlur}
                    error={!stopLatitudeIsValid}
                    id="stop-latitude"
                    aria-describedby="stop-latitude"
                    onChange={handleStopLatitudeInputChange}
                  />
                  <FormHelperText id="stop-latitude">{stopLatitudeInputHelpText}</FormHelperText>
                </FormControl>
              </Box>

              <Box sx={{ paddingTop: 4 }}>
                <FormControl>
                  <InputLabel htmlFor="stop-longitude">Stop Longitude</InputLabel>
                  <Input
                    onFocus={handleStopLongitudeInputFocus}
                    onBlur={handleStopLongitudeInputBlur}
                    error={!stopLongitudeIsValid}
                    id="stop-longitude"
                    aria-describedby="stop-longitude"
                    onChange={handleStopLongitudeInputChange}
                  />
                  <FormHelperText id="stop-longitude">{stopLongitudeInputHelpText}</FormHelperText>
                </FormControl>
              </Box>
              <Box sx={{ paddingTop: 4 }}>
                <FormControl>
                  <Button
                    variant="contained"
                    onClick={handleAddStop}
                    disabled={
                      stopID != "" &&
                      stopIDIsValid &&
                      stopDesignation != "" &&
                      stopDesignationIsValid &&
                      stopLatitude != "" &&
                      stopLatitudeIsValid &&
                      stopLongitude != "" &&
                      stopLongitudeIsValid
                        ? false
                        : true
                    }
                  >
                    Add Stop
                  </Button>
                </FormControl>
              </Box>
            </Box>
          </Modal>

          <Modal
            open={!stopInfoIsLoading && openUpdateStopModal}
            onClose={handleCloseUpdateStopModal}
            aria-labelledby="update-stop-modal"
            aria-describedby="update-stop-modal"
          >
            <Box sx={style(viewportWidth)}>
              <Grid container>
                <Grid item xs={11} md={11} lg={11}>
                  <Typography
                    id="update-stop-modal"
                    variant="h6"
                    component="h2"
                    sx={{ paddingBottom: 2 }}
                  >
                    Update Stop
                  </Typography>
                </Grid>
                <Grid item xs={1} md={1} lg={1}>
                  <IconButton onClick={handleCloseUpdateStopModal}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>
              <Box>
                <FormControl>
                  <TextField label="Stop ID" defaultValue={stopInfo.id} disabled={true} />
                </FormControl>
              </Box>

              <Box sx={{ paddingTop: 4 }}>
                <FormControl>
                  <TextField
                    label="Designation"
                    defaultValue={stopInfo.designation}
                    onChange={handleStopDesignationInputChange}
                    onFocus={handleStopDesignationInputFocus}
                    onBlur={handleStopDesignationInputBlur}
                    error={!stopDesignationIsValid}
                  />
                </FormControl>
              </Box>

              <Box sx={{ paddingTop: 4 }}>
                <FormControl>
                  <TextField
                    label="Stop Latitude"
                    defaultValue={stopInfo.position[0]}
                    onChange={handleStopLatitudeInputChange}
                    onFocus={handleStopLatitudeInputFocus}
                    onBlur={handleStopLatitudeInputBlur}
                    error={!stopLatitudeIsValid}
                  />
                </FormControl>
              </Box>

              <Box sx={{ paddingTop: 4 }}>
                <FormControl>
                  <TextField
                    label="Stop Longitude"
                    defaultValue={stopInfo.position[1]}
                    onChange={handleStopLongitudeInputChange}
                    onFocus={handleStopLongitudeInputFocus}
                    onBlur={handleStopLongitudeInputBlur}
                    error={!stopLongitudeIsValid}
                  />
                </FormControl>
              </Box>

              {stopInfo.schedulesId.length != 0 && (
                <Box sx={{ paddingTop: 4 }}>
                  <FormControl>
                    <InputLabel htmlFor="stop-schedules">Schedules</InputLabel>
                    <Select
                      multiple={true}
                      defaultValue={schedulesToList(stopInfo.schedulesId) || []}
                      onChange={handleSchedulesChange}
                      id="stop-schedules"
                      aria-describedby="stop-schedules"
                      sx={{ width: 200, marginTop: 1, height: 40 }}
                      MenuProps={{ PaperProps: { style: { maxHeight: 300, width: 250 } } }}
                    >
                      {stopInfo.schedulesId.length != 0 &&
                        stopInfo.schedulesId.map((schedule) => (
                          <MenuItem
                            key={
                              schedule.routeId.id +
                              "_" +
                              schedule.routeId.shift +
                              "_" +
                              schedule.stopId +
                              "_" +
                              schedule.sequence
                            }
                            value={
                              schedule.routeId.id +
                              "_" +
                              schedule.routeId.shift +
                              "_" +
                              schedule.stopId +
                              "_" +
                              schedule.sequence
                            }
                          >
                            {schedule.stopId} ({schedule.sequence})
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Box>
              )}

              <Box sx={{ paddingTop: 4 }}>
                <FormControl>
                  <Button
                    variant="contained"
                    onClick={handleUpdateStop}
                    disabled={
                      stopDesignation != "" &&
                      stopDesignationIsValid &&
                      stopLatitude != "" &&
                      stopLatitudeIsValid &&
                      stopLongitude != "" &&
                      stopLongitudeIsValid
                        ? false
                        : true
                    }
                  >
                    Update Stop
                  </Button>
                </FormControl>
              </Box>
            </Box>
          </Modal>

          <Modal
            open={!stopInfoIsLoading && openInfoStopModal}
            onClose={handleCloseInfoStopModal}
            aria-labelledby="info-stop-modal"
            aria-describedby="info-stop-modal"
          >
            <Box>
              {stopInfo != undefined && stopInfo.id != undefined ? (
                <Box sx={style(viewportWidth)}>
                  <Grid container>
                    <Grid item xs={11} md={11} lg={11}>
                      <Typography
                        id="info-stop-modal"
                        variant="h6"
                        component="h2"
                        sx={{ paddingBottom: 2 }}
                      >
                        {stopInfo.id}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} md={1} lg={1}>
                      <IconButton onClick={handleCloseInfoStopModal}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Grid>
                  </Grid>
                  <Box>
                    <Grid container>
                      <Grid item xs={4} md={4} lg={4}>
                        <Typography variant="body1" component="p" fontWeight={600}>
                          ID:
                        </Typography>
                      </Grid>
                      <Grid item xs={8} md={8} lg={8}>
                        <Typography variant="body1" component="p">
                          {stopInfo.id}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box>
                    <Grid container sx={{ paddingTop: 2 }}>
                      <Grid item xs={4} md={4} lg={4}>
                        <Typography variant="body1" component="p" fontWeight={600}>
                          Designation:
                        </Typography>
                      </Grid>
                      <Grid item xs={8} md={8} lg={8}>
                        <Typography variant="body1" component="p">
                          {stopInfo.designation}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box>
                    <Grid container sx={{ paddingTop: 2 }}>
                      <Grid item xs={4} md={4} lg={4}>
                        <Typography variant="body1" component="p" fontWeight={600}>
                          Position:
                        </Typography>
                      </Grid>
                      <Grid item xs={8} md={8} lg={8}>
                        <Typography variant="body1" component="p">
                          {stopInfo.position[0]}, {stopInfo.position[1]}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  {stopInfo.schedulesId != undefined && stopInfo.schedulesId.length != 0 && (
                    <Box sx={{ paddingTop: 2 }}>
                      <Grid container>
                        <Grid item xs={4} md={4} lg={4}>
                          <Typography variant="body1" component="p" fontWeight={600}>
                            Schedules:
                          </Typography>
                        </Grid>
                        <Grid item xs={8} md={8} lg={8}>
                          <List sx={{ paddingTop: 0, overflow: "auto", maxHeight: "140px" }}>
                            {stopInfo.schedulesId != undefined &&
                              stopInfo.schedulesId.map((schedule) => (
                                <ListItem
                                  key={
                                    schedule.routeId.id + schedule.routeId.shift + schedule.sequence
                                  }
                                  sx={{ paddingLeft: 0, paddingTop: 0 }}
                                >
                                  {schedule.routeId.id}|{schedule.routeId.shift}|{schedule.sequence}
                                </ListItem>
                              ))}
                          </List>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Box>
              ) : null}
            </Box>
          </Modal>

          <Dialog
            open={openConfirmDeleteStop}
            onClose={handleCloseConfirmDeleteStop}
            aria-labelledby="confirm-delete-stop"
            aria-describedby="confirm-delete-stop"
          >
            <DialogTitle id="confirm-delete-stop">Delete Stop</DialogTitle>
            <DialogContent>
              {stopToDelete.schedulesId.length == 0 ? (
                <DialogContentText id="confirm-delete-stop-description">
                  Are you sure you want to delete the stop with id {stopToDelete.id}?
                </DialogContentText>
              ) : (
                <Box>
                  <DialogContentText id="confirm-delete-stop-description">
                    You must remove from the following schedules from the stop:
                  </DialogContentText>

                  <List sx={{ paddingTop: 0, overflow: "auto", maxHeight: "140px" }}>
                    {stopToDelete.schedulesId != undefined &&
                      stopToDelete.schedulesId.map((schedule) => (
                        <ListItem
                          key={schedule.routeId.id + schedule.routeId.shift + schedule.sequence}
                          sx={{ paddingLeft: 0, paddingTop: 0 }}
                        >
                          {schedule.routeId.id}|{schedule.routeId.shift} | {schedule.sequence}
                        </ListItem>
                      ))}
                  </List>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseConfirmDeleteStop} color="primary">
                Cancel
              </Button>
              {stopToDelete.schedulesId.length == 0 && (
                <Button onClick={() => handleDeleteStop(stopToDelete.id)} color="primary" autoFocus>
                  Delete stop
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </>
  );
};

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
