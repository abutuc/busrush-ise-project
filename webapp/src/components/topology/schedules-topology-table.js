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
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";

export const ScheduleTable = ({ schedules, routes, stops, ...rest }) => {
  const api = "http://192.168.160.222:8080/";
  const [lower_bound, setLowerBound] = useState(0);
  const [upper_bound, setUpperBound] = useState(5);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const [openAddScheduleModal, setOpenAddScheduleModal] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedStop, setSelectedStop] = useState("");
  const [scheduleSequence, setScheduleSequence] = useState("");
  const [scheduleSequenceIsValid, setScheduleSequenceIsValid] = useState(true);
  const [scheduleSequenceInputHelpText, setScheduleSequenceInputHelpText] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduleTimeIsValid, setScheduleTimeIsValid] = useState(true);
  const [scheduleTimeInputHelpText, setScheduleTimeInputHelpText] = useState("");

  const [openInfoScheduleModal, setOpenInfoScheduleModal] = useState(false);
  const [scheduleInfo, setScheduleInfo] = useState({
    id: { routeId: { id: "", shift: "" }, stopId: "", sequence: -1 },
    time: "",
  });
  const [scheduleInfoIsLoading, setScheduleInfoIsLoading] = useState(true);

  const [openConfirmDeleteSchedule, setOpenConfirmDeleteSchedule] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState({
    id: { routeId: { id: "", shift: "" }, stopId: "", sequence: -1 },
    time: "",
  });

  const [openUpdateScheduleModal, setOpenUpdateScheduleModal] = useState(false);
  const [scheduleToUpdate, setScheduleToUpdate] = useState({
    id: { routeId: { id: "", shift: "" }, stopId: "", sequence: -1 },
    time: "",
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

  // Route Selection
  const handleRouteChange = (event) => {
    setSelectedRoute(event.target.value);
  };

  // Stop Selection
  const handleStopChange = (event) => {
    setSelectedStop(event.target.value);
  };

  // Schedule Sequence Input Handle Function and Validation
  const validateScheduleSequenceInput = (scheduleSequence) => {
    if (
      scheduleSequence.length > 0 &&
      !isNaN(Number(scheduleSequence)) &&
      Number(scheduleSequence) >= 0
    ) {
      for (var i = 0; i < schedules.length; i++) {
        if (
          schedules[i].id.routeId.id + "_" + schedules[i].id.routeId.shift == selectedRoute &&
          Number(schedules[i].id.sequence) == scheduleSequence &&
          Number(scheduleSequence) != scheduleToUpdate.id.sequence
        ) {
          setScheduleSequenceInputHelpText("Sequence already exists in giving route.");
          return false;
        }
      }
      setScheduleSequenceInputHelpText("");
      return true;
    } else {
      setScheduleSequenceInputHelpText("You must enter a valid postive number");
      return false;
    }
  };

  const handleScheduleSequenceInputChange = (event) => {
    let val = validateScheduleSequenceInput(event.target.value);
    setScheduleSequenceIsValid(val);
    if (val) {
      setScheduleSequence(event.target.value);
    }
  };

  const handleScheduleSequenceInputFocus = (event) => {
    setScheduleSequenceIsValid(validateScheduleSequenceInput(event.target.value));
  };

  const handleScheduleSequenceInputBlur = (event) => {
    let val = event.target.value;
    if (val == "") {
      setScheduleSequenceIsValid(true);
      setScheduleSequenceInputHelpText("");
    } else {
      if (validateScheduleSequenceInput(val)) {
        setScheduleSequenceInputHelpText("");
      }
    }
  };

  // Schedule Time Input Handle Function and Validation
  const validateScheduleTimeInput = (scheduleTime) => {
    let pattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    let scheduleTime_is_valid = false;
    if (pattern.test(scheduleTime)) {
      scheduleTime_is_valid = true;
    } else {
      scheduleTime_is_valid = false;
      setScheduleTimeInputHelpText("Time must be in the format HH:MM:SS");
    }
    return scheduleTime_is_valid;
  };

  const handleScheduleTimeInputChange = (event) => {
    let val = validateScheduleTimeInput(event.target.value);
    setScheduleTimeIsValid(val);
    if (val) {
      setScheduleTime(event.target.value);
    }
  };

  const handleScheduleTimeInputFocus = (event) => {
    setScheduleTimeIsValid(validateScheduleTimeInput(event.target.value));
  };

  const handleScheduleTimeInputBlur = (event) => {
    let val = event.target.value;
    if (val == "") {
      setScheduleTimeIsValid(true);
      setScheduleTimeInputHelpText("");
    } else {
      if (validateScheduleTimeInput(val)) {
        setScheduleTimeInputHelpText("");
      }
    }
  };

  // Add Schedule
  const handleAddSchedule = () => {
    let routeID = selectedRoute.split("_");
    let newSchedule = {
      id: {
        routeId: {
          id: routeID[0],
          shift: routeID[1],
        },
        stopId: selectedStop,
        sequence: scheduleSequence,
      },
      time: scheduleTime,
    };

    fetch(api + "api/schedules", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSchedule),
    });

    handleCloseAddScheduleModal();
  };

  // Handle Delete Schedule
  const handleDeleteSchedule = (routeID, routeShift, stopID, sequence) => {
    fetch(api + "api/schedules/" + routeID + "_" + routeShift + "_" + stopID + "_" + sequence, {
      method: "DELETE",
    });
    handleCloseConfirmDeleteSchedule();
  };

  // Add Schedule Modal Handle Functions
  const handleOpenAddScheduleModal = () => {
    setOpenAddScheduleModal(true);
  };

  const handleCloseAddScheduleModal = () => {
    setOpenAddScheduleModal(false);
    setSelectedRoute("");
    setSelectedStop("");
    setScheduleSequence("");
    setScheduleTime("");
    setScheduleTimeIsValid(true);
    setScheduleSequenceIsValid(true);
    setScheduleTimeInputHelpText("");
    setScheduleSequenceInputHelpText("");
  };

  // Fetch Schedule Info
  const fetchScheduleInfo = (routeId, routeShift, stopId, sequence) => {
    fetch(api + "api/schedules/" + routeId + "_" + routeShift + "_" + stopId + "_" + sequence)
      .then((response) => response.json())
      .then((data) => {
        setScheduleInfo(data);
        setScheduleInfoIsLoading(false);
        setSelectedRoute(data.id.routeId.id + "_" + data.id.routeId.shift);
        setSelectedStop(data.id.stopId);
        setScheduleSequence(data.id.sequence);
        setScheduleTime(data.time);
      });
    return true;
  };

  // Info Schedule Modal Handle Functions
  const handleOpenInfoScheduleModal = (routeId, routeShift, stopId, sequence) => {
    if (fetchScheduleInfo(routeId, routeShift, stopId, sequence)) {
      setOpenInfoScheduleModal(true);
    }
  };

  const handleCloseInfoScheduleModal = () => {
    setOpenInfoScheduleModal(false);
    setScheduleInfoIsLoading(true);
    setScheduleInfo({ id: { routeId: { id: "", shift: "" }, stopId: "", sequence: "" }, time: "" });
    setSelectedRoute("");
    setSelectedStop("");
    setScheduleSequence("");
    setScheduleTime("");
    setScheduleTimeIsValid(true);
    setScheduleSequenceIsValid(true);
    setScheduleTimeInputHelpText("");
    setScheduleSequenceInputHelpText("");
  };

  // Handle Confirm Delete Schedule
  const handleOpenConfirmDeleteSchedule = (routeId, routeShift, stopId, sequence) => {
    setScheduleToDelete({
      id: { routeId: { id: routeId, shift: routeShift }, stopId: stopId, sequence: sequence },
    });
    setOpenConfirmDeleteSchedule(true);
  };

  const handleCloseConfirmDeleteSchedule = () => {
    setOpenConfirmDeleteSchedule(false);
  };

  // Handle Update Schedule
  const handleOpenUpdateScheduleModal = (schedule) => {
    setScheduleToUpdate(schedule);
    fetchScheduleInfo(
      schedule.id.routeId.id,
      schedule.id.routeId.shift,
      schedule.id.stopId,
      schedule.id.sequence
    );
    setOpenUpdateScheduleModal(true);
  };

  const handleCloseUpdateScheduleModal = () => {
    setOpenUpdateScheduleModal(false);
    setScheduleInfoIsLoading(true);
    setScheduleInfo({ id: { routeId: { id: "", shift: "" }, stopId: "", sequence: "" }, time: "" });
    setSelectedRoute("");
    setSelectedStop("");
    setScheduleSequence("");
    setScheduleTime("");
    setScheduleTimeIsValid(true);
    setScheduleSequenceIsValid(true);
    setScheduleTimeInputHelpText("");
    setScheduleSequenceInputHelpText("");
  };

  const handleUpdateSchedule = () => {
    let routeID = selectedRoute.split("_");
    let updatedSchedule = {
      id: {
        routeId: { id: routeID[0], shift: routeID[1] },
        stopId: selectedStop,
        sequence: scheduleSequence,
      },
      time: scheduleTime,
    };

    fetch(
      api +
        "api/schedules/" +
        routeID[0] +
        "_" +
        routeID[1] +
        "_" +
        selectedStop +
        "_" +
        scheduleSequence,
      {
        method: "PUT",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSchedule),
      }
    );

    handleCloseUpdateScheduleModal();
  };

  // useEffect
  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {schedules == null || routes == null || stops == null ? (
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
                    Schedules
                  </Typography>
                </Grid>
                <Grid item xs={2} md={2} lg={2}>
                  <IconButton onClick={handleOpenAddScheduleModal}>
                    <AddIcon />
                  </IconButton>
                </Grid>
              </Grid>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Route ID</TableCell>
                    <TableCell align="left">Sequence</TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {schedules.slice(lower_bound, upper_bound).map((schedule) => (
                    <TableRow
                      hover
                      key={
                        schedule.id.routeId.id +
                        schedule.id.routeId.shift +
                        schedule.id.stopId +
                        schedule.id.sequence
                      }
                    >
                      <TableCell align="left">
                        {schedule.id.routeId.id} ({schedule.id.routeId.shift})
                      </TableCell>
                      <TableCell align="left">{schedule.id.sequence}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() =>
                            handleOpenInfoScheduleModal(
                              schedule.id.routeId.id,
                              schedule.id.routeId.shift,
                              schedule.id.stopId,
                              schedule.id.sequence
                            )
                          }
                        >
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() =>
                            handleOpenConfirmDeleteSchedule(
                              schedule.id.routeId.id,
                              schedule.id.routeId.shift,
                              schedule.id.stopId,
                              schedule.id.sequence
                            )
                          }
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleOpenUpdateScheduleModal(schedule)}>
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
              count={schedules.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
              page={page}
              rowsPerPage={limit}
              rowsPerPageOptions={[5, 10, 15, 20]}
            />
          </Card>
          <Modal
            open={openAddScheduleModal}
            onClose={handleCloseAddScheduleModal}
            aria-labelledby="add-schedule-modal"
            aria-describedby="add-schedule-modal"
          >
            <Box sx={style(viewportWidth)}>
              <Grid container>
                <Grid item xs={11} md={11} lg={11}>
                  <Typography
                    id="add-schedule-modal"
                    variant="h6"
                    component="h2"
                    sx={{ paddingBottom: 2 }}
                  >
                    Add Schedule
                  </Typography>
                </Grid>
                <Grid item xs={1} md={1} lg={1}>
                  <IconButton onClick={handleCloseAddScheduleModal}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>
              <Box>
                <FormControl>
                  <InputLabel htmlFor="route-id">Route</InputLabel>
                  <Select
                    value={selectedRoute}
                    onChange={handleRouteChange}
                    id="route-id"
                    aria-describedby="route-id"
                    sx={{ width: 250, marginTop: 1, height: 40 }}
                  >
                    {routes.map((route) => (
                      <MenuItem
                        key={route.id.id + "_" + route.id.shift}
                        value={route.id.id + "_" + route.id.shift}
                      >
                        {route.id.id} {route.id.shift}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ paddingTop: 4 }}>
                <FormControl>
                  <InputLabel htmlFor="stop-id">Stop</InputLabel>
                  <Select
                    value={selectedStop}
                    onChange={handleStopChange}
                    id="stop-id"
                    aria-describedby="stop-id"
                    sx={{ width: 250, marginTop: 1, height: 40 }}
                  >
                    {stops.map((stop) => (
                      <MenuItem key={stop.id} value={stop.id}>
                        {stop.id}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ paddingTop: 4 }}>
                <FormControl>
                  <InputLabel htmlFor="schedule-sequence">Sequence</InputLabel>
                  <Input
                    onFocus={handleScheduleSequenceInputFocus}
                    onBlur={handleScheduleSequenceInputBlur}
                    error={!scheduleSequenceIsValid}
                    id="schedule-sequence"
                    aria-describedby="schedule-sequence"
                    onChange={handleScheduleSequenceInputChange}
                  />
                  <FormHelperText id="schedule-sequence">
                    {scheduleSequenceInputHelpText}
                  </FormHelperText>
                </FormControl>
              </Box>
              <Box sx={{ paddingTop: 4 }}>
                <FormControl>
                  <InputLabel htmlFor="schedule-time">Time</InputLabel>
                  <Input
                    onFocus={handleScheduleTimeInputFocus}
                    onBlur={handleScheduleTimeInputBlur}
                    error={!scheduleTimeIsValid}
                    id="schedule-time"
                    aria-describedby="schedule-time"
                    onChange={handleScheduleTimeInputChange}
                  />
                  <FormHelperText id="schedule-time">{scheduleTimeInputHelpText}</FormHelperText>
                </FormControl>
              </Box>
              <Box sx={{ paddingTop: 4 }}>
                <FormControl>
                  <Button
                    variant="contained"
                    onClick={handleAddSchedule}
                    disabled={
                      selectedRoute != "" &&
                      selectedStop != "" &&
                      scheduleSequenceIsValid &&
                      scheduleSequence != "" &&
                      scheduleTimeIsValid &&
                      scheduleTime != ""
                        ? false
                        : true
                    }
                  >
                    Add Schedule
                  </Button>
                </FormControl>
              </Box>
            </Box>
          </Modal>

          <Modal
            open={!scheduleInfoIsLoading && openUpdateScheduleModal}
            onClose={handleCloseUpdateScheduleModal}
            aria-labelledby="update-schedule-modal"
            aria-describedby="update-schedule-modal"
          >
            <Box sx={style(viewportWidth)}>
              <Grid container>
                <Grid item xs={11} md={11} lg={11}>
                  <Typography
                    id="update-schedule-modal"
                    variant="h6"
                    component="h2"
                    sx={{ paddingBottom: 2 }}
                  >
                    Update Schedule
                  </Typography>
                </Grid>
                <Grid item xs={1} md={1} lg={1}>
                  <IconButton onClick={handleCloseUpdateScheduleModal}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>
              <Box>
                <FormControl>
                  <InputLabel htmlFor="schedule-route">Route</InputLabel>
                  <Select
                    defaultValue={
                      scheduleInfo.id.routeId.id + "_" + scheduleInfo.id.routeId.shift || ""
                    }
                    id="schedule-route"
                    aria-describedby="schedule-route"
                    disabled={true}
                    sx={{ width: 200, marginTop: 1, height: 40 }}
                  >
                    <MenuItem
                      key={scheduleInfo.id.routeId.id + "_" + scheduleInfo.id.routeId.shift}
                      value={scheduleInfo.id.routeId.id + "_" + scheduleInfo.id.routeId.shift}
                    >
                      {scheduleInfo.id.routeId.id} {scheduleInfo.id.routeId.shift}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ paddingTop: 4 }}>
                <FormControl>
                  <InputLabel htmlFor="schedule-stop">Stop</InputLabel>
                  <Select
                    defaultValue={scheduleInfo.id.stopId || ""}
                    id="schedule-stop"
                    aria-describedby="schedule-stop"
                    disabled={true}
                    sx={{ width: 200, marginTop: 1, height: 40 }}
                  >
                    <MenuItem key={scheduleInfo.id.stopId} value={scheduleInfo.id.stopId}>
                      {scheduleInfo.id.stopId}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ paddingTop: 4 }}>
                <FormControl>
                  <TextField
                    label="Sequence"
                    defaultValue={scheduleInfo.id.sequence}
                    disabled={true}
                  />
                </FormControl>
              </Box>

              <Box sx={{ paddingTop: 4 }}>
                <FormControl>
                  <TextField
                    label="Time"
                    defaultValue={scheduleInfo.time}
                    onChange={handleScheduleTimeInputChange}
                    onFocus={handleScheduleTimeInputFocus}
                    onBlur={handleScheduleTimeInputBlur}
                    error={!scheduleTimeIsValid}
                  />
                </FormControl>
              </Box>

              <Box sx={{ paddingTop: 4 }}>
                <FormControl>
                  <Button
                    variant="contained"
                    onClick={handleUpdateSchedule}
                    disabled={scheduleTimeIsValid && scheduleTime != "" ? false : true}
                  >
                    Update Schedule
                  </Button>
                </FormControl>
              </Box>
            </Box>
          </Modal>

          <Modal
            open={!scheduleInfoIsLoading && openInfoScheduleModal}
            onClose={handleCloseInfoScheduleModal}
            aria-labelledby="info-schedule-modal"
            aria-describedby="info-schedule-modal"
          >
            <Box>
              {scheduleInfo != undefined &&
              scheduleInfo.id != undefined &&
              scheduleInfo.id.routeId != undefined ? (
                <Box sx={style(viewportWidth)}>
                  <Grid container>
                    <Grid item xs={11} md={11} lg={11}>
                      <Typography
                        id="info-schedule-modal"
                        variant="h6"
                        component="h2"
                        sx={{ paddingBottom: 2 }}
                      >
                        {scheduleInfo.id.routeId.id} | {scheduleInfo.id.routeId.shift}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} md={1} lg={1}>
                      <IconButton onClick={handleCloseInfoScheduleModal}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Grid>
                  </Grid>
                  <Box>
                    <Grid container>
                      <Grid item xs={4} md={4} lg={4}>
                        <Typography variant="body1" component="p" fontWeight={600}>
                          Stop:
                        </Typography>
                      </Grid>
                      <Grid item xs={8} md={8} lg={8}>
                        <Typography variant="body1" component="p">
                          {scheduleInfo.id.stopId}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box>
                    <Grid container sx={{ paddingTop: 2 }}>
                      <Grid item xs={4} md={4} lg={4}>
                        <Typography variant="body1" component="p" fontWeight={600}>
                          Sequence:
                        </Typography>
                      </Grid>
                      <Grid item xs={8} md={8} lg={8}>
                        <Typography variant="body1" component="p">
                          {scheduleInfo.id.sequence}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box>
                    <Grid container sx={{ paddingTop: 2 }}>
                      <Grid item xs={4} md={4} lg={4}>
                        <Typography variant="body1" component="p" fontWeight={600}>
                          Time:
                        </Typography>
                      </Grid>
                      <Grid item xs={8} md={8} lg={8}>
                        <Typography variant="body1" component="p">
                          {scheduleInfo.time}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              ) : null}
            </Box>
          </Modal>
          <Dialog
            open={openConfirmDeleteSchedule}
            onClose={handleCloseConfirmDeleteSchedule}
            aria-labelledby="confirm-delete-schedule"
            aria-describedby="confirm-delete-schedule"
          >
            <DialogTitle id="confirm-delete-schedule">Delete Schedule</DialogTitle>
            <DialogContent>
              <DialogContentText id="confirm-delete-schedule-description">
                Are you sure you want to delete the schedule from the{" "}
                {scheduleToDelete.id.routeId.id} | {scheduleToDelete.id.routeId.shift}, on Stop{" "}
                {scheduleToDelete.id.stopId} and sequence {scheduleToDelete.id.sequence}?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseConfirmDeleteSchedule} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() =>
                  handleDeleteSchedule(
                    scheduleToDelete.id.routeId.id,
                    scheduleToDelete.id.routeId.shift,
                    scheduleToDelete.id.stopId,
                    scheduleToDelete.id.sequence
                  )
                }
                color="primary"
                autoFocus
              >
                Delete schedule
              </Button>
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
