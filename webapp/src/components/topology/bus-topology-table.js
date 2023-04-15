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
  Modal,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  List,
  ListItem,
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
import { useEffect, useState } from "react";

export const BusTable = ({ buses, devices, routes, ...rest }) => {
  const api = "http://192.168.160.222:8080/";
  // use states
  const [lower_bound, setLowerBound] = useState(0);
  const [upper_bound, setUpperBound] = useState(5);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const [openAddBusModal, setOpenAddBusModal] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [busID, setBusID] = useState("");
  const [busIDIsValid, setBusIDIsValid] = useState(true);
  const [busIDInputHelpText, setBusIDInputHelpText] = useState("");
  const [busRegistration, setBusRegistration] = useState("");
  const [busRegistrationIsValid, setBusRegistrationIsValid] = useState(true);
  const [busRegistrationInputHelpText, setBusRegistrationInputHelpText] = useState("");
  const [busBrand, setBusBrand] = useState("");
  const [busBrandIsValid, setBusBrandIsValid] = useState(true);
  const [busModel, setBusModel] = useState("");
  const [busModelIsValid, setBusModelIsValid] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [selectedRoutes, setSelectedRoutes] = useState([]);

  const [openInfoBusModal, setOpenInfoBusModal] = useState(false);
  const [busInfo, setBusInfo] = useState({ routesId: [], deviceId: "" });
  const [busInfoIsLoading, setBusInfoIsLoading] = useState(true);

  const [openConfirmDeleteBus, setOpenConfirmDeleteBus] = useState(false);
  const [busToDelete, setBusToDelete] = useState({ id: "", routesId: [] });

  const [openUpdateBusModal, setOpenUpdateBusModal] = useState(false);
  const [busToUpdate, setBusToUpdate] = useState({});

  // pagination function handlers
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

  // Bus ID Input Handle Function and Validation
  const validateBusIDInput = (busID) => {
    let pattern = /^AVRBUS-B[0-9]{4}$/;
    let busId_is_valid = false;
    if (pattern.test(busID)) {
      busId_is_valid = true;
      setBusIDInputHelpText("");
      buses.forEach((bus) => {
        if (bus.id == busID && busID != busToUpdate.id) {
          busId_is_valid = false;
          setBusIDInputHelpText("Bus ID already exists");
        }
      });
    } else {
      busId_is_valid = false;
      setBusIDInputHelpText("Should be in the form of AVRBUS-BXXXX");
    }
    return busId_is_valid;
  };

  const handleBusIDInputChange = (event) => {
    let val = validateBusIDInput(event.target.value);
    setBusIDIsValid(val);
    if (val) {
      setBusID(event.target.value);
    }
  };

  const handleBusIDInputFocus = (event) => {
    setBusIDIsValid(validateBusIDInput(event.target.value));
  };

  const handleBusIDInputBlur = (event) => {
    let val = event.target.value;
    if (val == "") {
      setBusIDIsValid(true);
      setBusIDInputHelpText("");
    } else {
      if (validateBusIDInput(val)) {
        setBusIDInputHelpText("");
      }
    }
  };

  // Bus Registration Input Handle Function and Validation
  const validateBusRegistrationInput = (busRegistration) => {
    let pattern = /^[0-9]{2}-[A-Z]{2}-[0-9]{2}$/;
    let busRegistration_is_valid = false;
    if (pattern.test(busRegistration)) {
      busRegistration_is_valid = true;
      setBusRegistrationInputHelpText("");
    } else {
      busRegistration_is_valid = false;
      setBusRegistrationInputHelpText(
        "Should be in the form of XX-YY-XX (X: digit, Y: capital letter)"
      );
    }
    return busRegistration_is_valid;
  };
  const handleBusRegistrationInputChange = (event) => {
    let val = validateBusRegistrationInput(event.target.value);
    setBusRegistrationIsValid(val);
    if (val) {
      setBusRegistration(event.target.value);
    }
  };

  const handleBusRegistrationInputFocus = (event) => {
    setBusRegistrationIsValid(validateBusRegistrationInput(event.target.value));
  };

  const handleBusRegistrationInputBlur = (event) => {
    let val = event.target.value;
    if (val == "") {
      setBusRegistrationIsValid(true);
      setBusRegistrationInputHelpText("");
    } else {
      if (validateBusRegistrationInput(val)) {
        setBusRegistrationInputHelpText("");
      }
    }
  };

  // Bus Brand Input Handle Function and Validation
  const validateBusBrandInput = (busBrand) => {
    if (busBrand == "") {
      return false;
    }
    return true;
  };

  const handleBusBrandInputChange = (event) => {
    let val = validateBusBrandInput(event.target.value);
    setBusBrandIsValid(val);
    if (val) {
      setBusBrand(event.target.value);
    }
  };

  const handleBusBrandInputFocus = (event) => {
    setBusBrandIsValid(validateBusBrandInput(event.target.value));
  };

  const handleBusBrandInputBlur = (event) => {
    let val = event.target.value;
    if (val == "") {
      setBusBrandIsValid(true);
    }
  };

  // Bus Model Input Handle Function and Validation
  const validateBusModelInput = (busModel) => {
    if (busModel == "") {
      return false;
    }
    return true;
  };

  const handleBusModelInputChange = (event) => {
    let val = validateBusModelInput(event.target.value);
    setBusModelIsValid(val);
    if (val) {
      setBusModel(event.target.value);
    }
  };

  const handleBusModelInputFocus = (event) => {
    setBusModelIsValid(validateBusModelInput(event.target.value));
  };

  const handleBusModelInputBlur = (event) => {
    let val = event.target.value;
    if (val == "") {
      setBusModelIsValid(true);
    }
  };

  // Device Selection
  const handleDeviceChange = (event) => {
    setSelectedDevice(event.target.value);
  };

  // Routes Selection
  const handleRoutesChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedRoutes(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  // Add Bus
  const handleAddBus = () => {
    let routesID = [];
    selectedRoutes.forEach((route) => {
      let content = route.split("|");
      routesID.push({ id: content[0], shift: content[1] });
    });

    let newBus = {
      id: busID,
      registration: busRegistration,
      brand: busBrand,
      model: busModel,
    };

    if (routesID.length != 0) {
      newBus.routesId = routesID;
    }

    if (selectedDevice != "") {
      newBus.deviceId = selectedDevice;
    }

    fetch(api + "api/buses", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBus),
    });

    handleCloseAddBusModal();
  };

  // Handle Delete Bus
  const handleDeleteBus = (busID) => {
    fetch(api + "api/buses/" + busID, {
      method: "DELETE",
    });
    handleCloseConfirmDeleteBus();
  };

  // Add Bus Modal Handle Functions
  const handleOpenAddBusModal = () => {
    setOpenAddBusModal(true);
  };

  const handleCloseAddBusModal = () => {
    setOpenAddBusModal(false);
    setBusID("");
    setBusIDIsValid(true);
    setBusIDInputHelpText("");
    setBusRegistration("");
    setBusRegistrationIsValid(true);
    setBusRegistrationInputHelpText("");
    setBusBrand("");
    setBusBrandIsValid(true);
    setBusModel("");
    setBusModelIsValid(true);
    setSelectedDevice("");
    setSelectedRoutes([]);
  };

  // Fetch Bus Info
  const fetchBusInfo = (busId) => {
    fetch(api + "api/buses/" + busId)
      .then((response) => response.json())
      .then((data) => {
        setBusInfo(data);
        setBusInfoIsLoading(false);
        setBusID(data.id);
        setBusRegistration(data.registration);
        setBusBrand(data.brand);
        setBusModel(data.model);
        setSelectedDevice(data.deviceId);
      });
    return true;
  };

  // Info Bus Modal Handle Functions
  const handleOpenInfoBusModal = (busId) => {
    if (fetchBusInfo(busId)) {
      setOpenInfoBusModal(true);
    }
  };

  const handleCloseInfoBusModal = () => {
    setOpenInfoBusModal(false);
    setBusInfoIsLoading(true);
    setBusInfo({ routesId: [] });
    setBusID("");
    setBusIDIsValid(true);
    setBusIDInputHelpText("");
    setBusRegistration("");
    setBusRegistrationIsValid(true);
    setBusRegistrationInputHelpText("");
    setBusBrand("");
    setBusBrandIsValid(true);
    setBusModel("");
    setBusModelIsValid(true);
    setSelectedDevice("");
    setSelectedRoutes([]);
  };

  // Handle Confirm Delete Bus
  const handleOpenConfirmDeleteBus = (bus) => {
    setBusToDelete(bus);
    setOpenConfirmDeleteBus(true);
  };

  const handleCloseConfirmDeleteBus = () => {
    setOpenConfirmDeleteBus(false);
  };

  // Handle Update Bus
  const handleOpenUpdateBusModal = (bus) => {
    setBusToUpdate(bus);
    fetchBusInfo(bus.id);
    setOpenUpdateBusModal(true);
  };

  const handleCloseUpdateBusModal = () => {
    setOpenUpdateBusModal(false);
    setBusInfoIsLoading(true);
    setBusInfo({ routesId: [] });
    setBusID("");
    setBusIDIsValid(true);
    setBusIDInputHelpText("");
    setBusRegistration("");
    setBusRegistrationIsValid(true);
    setBusRegistrationInputHelpText("");
    setBusBrand("");
    setBusBrandIsValid(true);
    setBusModel("");
    setBusModelIsValid(true);
    setSelectedDevice("");
    setSelectedRoutes([]);
  };

  const handleUpdateBus = () => {
    let routesID = [];
    selectedRoutes.forEach((route) => {
      let content = route.split("|");
      routesID.push({ id: content[0], shift: content[1] });
    });

    let updatedBus = {
      id: busID,
      registration: busRegistration,
      brand: busBrand,
      model: busModel,
    };

    if (routesID.length != 0) {
      updatedBus.routesId = routesID;
    }

    if (selectedDevice != "") {
      updatedBus.deviceId = selectedDevice;
    }

    fetch(api + "api/buses/" + busID, {
      method: "PUT",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedBus),
    });

    handleCloseUpdateBusModal();
  };

  const routesToList = (routes) => {
    let routesList = [];
    routes.forEach((route) => {
      routesList.push(route.id + "|" + route.shift);
    });
    return routesList;
  };

  // useEffect
  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {(buses == null) | (devices == null) | (routes == null) ? (
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
                    Buses
                  </Typography>
                </Grid>
                <Grid item xs={2} md={2} lg={2}>
                  <IconButton onClick={handleOpenAddBusModal}>
                    <AddIcon />
                  </IconButton>
                </Grid>
              </Grid>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">ID</TableCell>
                    <TableCell align="left">Registration</TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {buses.slice(lower_bound, upper_bound).map((bus) => (
                    <TableRow hover key={bus.id}>
                      <TableCell align="left">{bus.id}</TableCell>
                      <TableCell align="left">{bus.registration}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleOpenInfoBusModal(bus.id)}>
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleOpenConfirmDeleteBus(bus)}>
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleOpenUpdateBusModal(bus)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <TablePagination
              component="div"
              count={buses.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
              page={page}
              rowsPerPage={limit}
              rowsPerPageOptions={[5, 10, 15, 20]}
            />
          </Card>
          <Modal
            open={openAddBusModal}
            onClose={handleCloseAddBusModal}
            aria-labelledby="add-bus-modal"
            aria-describedby="add-bus-modal"
          >
            <Box sx={style(viewportWidth)}>
              <Grid container>
                <Grid item xs={11} md={11} lg={11}>
                  <Typography
                    id="add-bus-modal"
                    variant="h6"
                    component="h2"
                    sx={{ paddingBottom: 2 }}
                  >
                    Add Bus
                  </Typography>
                </Grid>
                <Grid item xs={1} md={1} lg={1}>
                  <IconButton onClick={handleCloseAddBusModal}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>
              <Box>
                <FormControl>
                  <InputLabel htmlFor="bus-id">Bus ID</InputLabel>
                  <Input
                    onFocus={handleBusIDInputFocus}
                    onBlur={handleBusIDInputBlur}
                    error={!busIDIsValid}
                    id="bus-id"
                    aria-describedby="bus-id"
                    onChange={handleBusIDInputChange}
                  />
                  <FormHelperText id="bus-id">{busIDInputHelpText}</FormHelperText>
                </FormControl>
              </Box>
              <Box sx={{ paddingTop: 4 }}>
                <FormControl>
                  <InputLabel htmlFor="bus-registration">Registration</InputLabel>
                  <Input
                    onFocus={handleBusRegistrationInputFocus}
                    onBlur={handleBusRegistrationInputBlur}
                    error={!busRegistrationIsValid}
                    id="bus-registration"
                    aria-describedby="bus-registration"
                    onChange={handleBusRegistrationInputChange}
                  />
                  <FormHelperText id="bus-registration">
                    {busRegistrationInputHelpText}
                  </FormHelperText>
                </FormControl>
              </Box>
              <Box sx={{ paddingTop: 4 }}>
                <FormControl>
                  <InputLabel htmlFor="bus-brand">Brand</InputLabel>
                  <Input
                    onFocus={handleBusBrandInputFocus}
                    onBlur={handleBusBrandInputBlur}
                    error={!busBrandIsValid}
                    id="bus-brand"
                    aria-describedby="bus-brand"
                    onChange={handleBusBrandInputChange}
                  />
                </FormControl>
              </Box>
              <Box sx={{ paddingTop: 4 }}>
                <FormControl>
                  <InputLabel htmlFor="bus-model">Model</InputLabel>
                  <Input
                    onFocus={handleBusModelInputFocus}
                    onBlur={handleBusModelInputBlur}
                    error={!busModelIsValid}
                    id="bus-model"
                    aria-describedby="bus-model"
                    onChange={handleBusModelInputChange}
                  />
                </FormControl>
              </Box>
              <Box sx={{ paddingTop: 4 }}>
                <FormControl>
                  <InputLabel htmlFor="bus-device">Device</InputLabel>
                  <Select
                    value={selectedDevice}
                    onChange={handleDeviceChange}
                    id="bus-device"
                    aria-describedby="bus-device"
                    sx={{ width: 200, marginTop: 1, height: 40 }}
                  >
                    {devices.map((device) =>
                      device.busId == null ? (
                        <MenuItem key={device.id} value={device.id}>
                          {device.id}
                        </MenuItem>
                      ) : null
                    )}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ paddingTop: 4 }}>
                <FormControl>
                  <InputLabel htmlFor="bus-routes">Routes</InputLabel>
                  <Select
                    multiple={true}
                    value={selectedRoutes}
                    onChange={handleRoutesChange}
                    id="bus-routes"
                    aria-describedby="bus-routes"
                    sx={{ width: 200, marginTop: 1, height: 40 }}
                    MenuProps={{ PaperProps: { style: { maxHeight: 300, width: 250 } } }}
                  >
                    {routes.map((route) =>
                      route.busId == null ? (
                        <MenuItem
                          key={route.id.id + "|" + route.id.shift}
                          value={route.id.id + "|" + route.id.shit}
                        >
                          {route.id.id} | {route.id.shift}
                        </MenuItem>
                      ) : null
                    )}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ paddingTop: 4 }}>
                <FormControl>
                  <Button
                    variant="contained"
                    onClick={handleAddBus}
                    disabled={
                      busIDIsValid &&
                      busID != "" &&
                      busRegistrationIsValid &&
                      busRegistration != "" &&
                      busBrandIsValid &&
                      busBrand != "" &&
                      busModelIsValid &&
                      busModel != ""
                        ? false
                        : true
                    }
                  >
                    Add Bus
                  </Button>
                </FormControl>
              </Box>
            </Box>
          </Modal>

          <Modal
            open={!busInfoIsLoading && openUpdateBusModal}
            onClose={handleCloseUpdateBusModal}
            aria-labelledby="update-bus-modal"
            aria-describedby="update-bus-modal"
          >
            <Box sx={style(viewportWidth)}>
              <Grid container>
                <Grid item xs={11} md={11} lg={11}>
                  <Typography
                    id="update-bus-modal"
                    variant="h6"
                    component="h2"
                    sx={{ paddingBottom: 2 }}
                  >
                    Update Bus
                  </Typography>
                </Grid>
                <Grid item xs={1} md={1} lg={1}>
                  <IconButton onClick={handleCloseUpdateBusModal}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>
              <Box>
                <FormControl>
                  <TextField label="Bus ID" defaultValue={busInfo.id} disabled={true} />
                </FormControl>
              </Box>
              <Box sx={{ paddingTop: 4 }}>
                <FormControl>
                  <TextField
                    label="Registration"
                    defaultValue={busInfo.registration}
                    onChange={handleBusRegistrationInputChange}
                    onFocus={handleBusRegistrationInputFocus}
                    onBlur={handleBusRegistrationInputBlur}
                    error={!busRegistrationIsValid}
                  />
                  <FormHelperText id="bus-registration">
                    {busRegistrationInputHelpText}
                  </FormHelperText>
                </FormControl>
              </Box>
              <Box sx={{ paddingTop: 4 }}>
                <FormControl>
                  <TextField
                    label="Brand"
                    defaultValue={busInfo.brand}
                    onChange={handleBusBrandInputChange}
                    onFocus={handleBusBrandInputFocus}
                    onBlur={handleBusBrandInputBlur}
                    error={!busBrandIsValid}
                  />
                </FormControl>
              </Box>
              <Box sx={{ paddingTop: 4 }}>
                <FormControl>
                  <TextField
                    label="Model"
                    defaultValue={busInfo.model}
                    onChange={handleBusModelInputChange}
                    onFocus={handleBusModelInputFocus}
                    onBlur={handleBusModelInputBlur}
                    error={!busModelIsValid}
                  />
                </FormControl>
              </Box>
              <Box sx={{ paddingTop: 4 }}>
                <FormControl>
                  <InputLabel htmlFor="bus-device">Device</InputLabel>
                  <Select
                    defaultValue={busInfo.deviceId || ""}
                    onChange={handleDeviceChange}
                    id="bus-device"
                    aria-describedby="bus-device"
                    sx={{ width: 200, marginTop: 1, height: 40 }}
                  >
                    <MenuItem key="" value="">
                      -
                    </MenuItem>
                    {busInfo.deviceId != null && (
                      <MenuItem key={busInfo.deviceId} value={busInfo.deviceId}>
                        {busInfo.deviceId}
                      </MenuItem>
                    )}
                    {devices.map((device) =>
                      device.busId == null ? (
                        <MenuItem key={device.id} value={device.id}>
                          {device.id}
                        </MenuItem>
                      ) : null
                    )}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ paddingTop: 4 }}>
                <FormControl>
                  <InputLabel htmlFor="bus-routes">Routes</InputLabel>
                  <Select
                    multiple={true}
                    defaultValue={routesToList(busInfo.routesId) || []}
                    onChange={handleRoutesChange}
                    id="bus-routes"
                    aria-describedby="bus-routes"
                    sx={{ width: 200, marginTop: 1, height: 40 }}
                    MenuProps={{ PaperProps: { style: { maxHeight: 300, width: 250 } } }}
                  >
                    {busInfo.routesId.length != 0 &&
                      busInfo.routesId.map((route) => (
                        <MenuItem
                          key={route.id + "|" + route.shift}
                          value={route.id + "|" + route.shift}
                        >
                          {route.id} | {route.shift}
                        </MenuItem>
                      ))}

                    {routes.map((route) =>
                      route.busId == null ? (
                        <MenuItem
                          key={route.id.id + "|" + route.id.shift}
                          value={route.id.id + "|" + route.id.shift}
                        >
                          {route.id.id} | {route.id.shift}
                        </MenuItem>
                      ) : null
                    )}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ paddingTop: 4 }}>
                <FormControl>
                  <Button
                    variant="contained"
                    onClick={handleUpdateBus}
                    disabled={
                      busIDIsValid &&
                      busID != "" &&
                      busRegistrationIsValid &&
                      busRegistration != "" &&
                      busBrandIsValid &&
                      busBrand != "" &&
                      busModelIsValid &&
                      busModel != ""
                        ? false
                        : true
                    }
                  >
                    Update Bus
                  </Button>
                </FormControl>
              </Box>
            </Box>
          </Modal>

          <Modal
            open={!busInfoIsLoading && openInfoBusModal}
            onClose={handleCloseInfoBusModal}
            aria-labelledby="info-bus-modal"
            aria-describedby="info-bus-modal"
          >
            <Box sx={style(viewportWidth)}>
              <Grid container>
                <Grid item xs={11} md={11} lg={11}>
                  <Typography
                    id="info-bus-modal"
                    variant="h6"
                    component="h2"
                    sx={{ paddingBottom: 2 }}
                  >
                    {busInfo.id}
                  </Typography>
                </Grid>
                <Grid item xs={1} md={1} lg={1}>
                  <IconButton onClick={handleCloseInfoBusModal}>
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
                      {busInfo.id}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ paddingTop: 2 }}>
                <Grid container>
                  <Grid item xs={4} md={4} lg={4}>
                    <Typography variant="body1" component="p" fontWeight={600}>
                      Registration:
                    </Typography>
                  </Grid>
                  <Grid item xs={8} md={8} lg={8} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body1" component="p">
                      {busInfo.registration}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ paddingTop: 2 }}>
                <Grid container>
                  <Grid item xs={4} md={4} lg={4}>
                    <Typography variant="body1" component="p" fontWeight={600}>
                      Brand:
                    </Typography>
                  </Grid>
                  <Grid item xs={8} md={8} lg={8} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body1" component="p">
                      {busInfo.brand}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ paddingTop: 2 }}>
                <Grid container>
                  <Grid item xs={4} md={4} lg={4}>
                    <Typography variant="body1" component="p" fontWeight={600}>
                      Model:
                    </Typography>
                  </Grid>
                  <Grid item xs={8} md={8} lg={8} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body1" component="p">
                      {busInfo.model}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ paddingTop: 2 }}>
                <Grid container>
                  <Grid item xs={4} md={4} lg={4}>
                    <Typography variant="body1" component="p" fontWeight={600}>
                      Device:
                    </Typography>
                  </Grid>
                  <Grid item xs={8} md={8} lg={8} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body1" component="p">
                      {busInfo.deviceId}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              {busInfo.routesId != undefined && busInfo.routesId.length != 0 && (
                <Box sx={{ paddingTop: 2 }}>
                  <Grid container>
                    <Grid item xs={4} md={4} lg={4}>
                      <Typography variant="body1" component="p" fontWeight={600}>
                        Routes:
                      </Typography>
                    </Grid>
                    <Grid item xs={8} md={8} lg={8}>
                      <List sx={{ paddingTop: 0, overflow: "auto", maxHeight: "140px" }}>
                        {busInfo.routesId != undefined &&
                          busInfo.routesId.map((route) => (
                            <ListItem
                              key={route.id + "|" + route.shift}
                              sx={{ paddingLeft: 0, paddingTop: 0 }}
                            >
                              {route.id}|{route.shift}
                            </ListItem>
                          ))}
                      </List>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          </Modal>

          <Dialog
            open={openConfirmDeleteBus}
            onClose={handleCloseConfirmDeleteBus}
            aria-labelledby="confirm-delete-bus"
            aria-describedby="confirm-delete-bus"
          >
            <DialogTitle id="confirm-delete-bus">Delete Bus</DialogTitle>
            <DialogContent>
              {busToDelete.routesId.length == 0 ? (
                <DialogContentText id="confirm-delete-bus-description">
                  Are you sure you want to delete the bus with id {busToDelete.id}?
                </DialogContentText>
              ) : (
                <DialogContentText id="confirm-delete-bus-description">
                  You must remove the following routes from the bus before deleting it:
                  {busToDelete.routesId.map((route) => (
                    <ListItem
                      key={route.id + "|" + route.shift}
                      sx={{ paddingLeft: 0, paddingTop: 0 }}
                    >
                      {route.id}|{route.shift}
                    </ListItem>
                  ))}
                </DialogContentText>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseConfirmDeleteBus} color="primary">
                Cancel
              </Button>
              {busToDelete.routesId.length == 0 && (
                <Button onClick={() => handleDeleteBus(busToDelete.id)} color="primary" autoFocus>
                  Delete bus
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
