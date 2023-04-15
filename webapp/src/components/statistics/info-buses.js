import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import * as React from "react";
import { useEffect, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
} from "@mui/material";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

export const InfoBuses = (props) => {
  const { ocupation } = props;
  const [value, setValue] = React.useState(dayjs("2022-12-12"));

  const tostring = (ocupation) => {
    const temp = ocupation.toString();
    return temp.substring(0, 4) + "%";
  };

  const handleChange = (newValue) => {
    setValue(newValue);
    props.onOcupationChange(newValue);
  };

  return (
    <Card {...props}>
      <CardHeader
        title="Info Ocupation"
        action={
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Date desktop"
              inputFormat="MM/DD/YYYY"
              value={value}
              onChange={handleChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        }
      />
      <Divider />
      {!ocupation.error && ocupation.length > 0 && (
        <PerfectScrollbar>
          <Box sx={{ width: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Route ID</TableCell>
                  <TableCell>Line</TableCell>
                  <TableCell>Ocupation (%)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(ocupation).map(
                  (r) => (
                    console.log(r[1].ocupation),
                    (
                      <TableRow hover key={r[1].route.id}>
                        <TableCell>{r[1].route.id}</TableCell>
                        <TableCell>{r[1].route.designation}</TableCell>
                        <TableCell>{tostring(r[1].occupation)}</TableCell>
                      </TableRow>
                    )
                  )
                )}
              </TableBody>
            </Table>
          </Box>
        </PerfectScrollbar>
      )}
    </Card>
  );
};
