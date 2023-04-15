import { Bar } from 'react-chartjs-2';
import { Box, Button, Card, CardContent, CardHeader, Divider, useTheme } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Component } from 'react';


export const StatsBus = (props) => {
  const theme = useTheme();
  
  console.log("handleChange " + props.dataf);

  const { dataf } = props.dataf;

  const ontime = function() {
    dataf = props.dataf;
    const temp = [];
    for(var i = 0; i < dataf.length; i++) {
      temp.push(dataf[i].on_time);
    };
    return temp;
  }

  const delayed = function() {
    dataf = props.dataf;
    const temp = [];
    for(var i = 0; i < dataf.length; i++) {
      temp.push(dataf[i].delayed);
    };
    return temp;
  }

  const date = function() {
    dataf = props.dataf;
    const temp = [];
    for(var i = 0; i < dataf.length; i++) {
      temp.push(dataf[i].date);
    };
    return temp;
  }


  const data = {
    datasets: [
      {
        backgroundColor: '#3F51B5',
        barPercentage: 0.5,
        barThickness: 12,
        borderRadius: 4,
        categoryPercentage: 0.5,
        data: ontime(),
        label: 'On Time',
        maxBarThickness: 10
      },
      {
        backgroundColor: '#EEEEEE',
        barPercentage: 0.5,
        barThickness: 12,
        borderRadius: 4,
        categoryPercentage: 0.5,
        data: delayed(),
        label: 'Delayed',
        maxBarThickness: 10
      }
    ],
    labels: date()
  };

  const options = {
    animation: false,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    xAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary
        },
        gridLines: {
          display: false,
          drawBorder: false
        }
      }
    ],
    yAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary,
          beginAtZero: true,
          min: 0
        },
        gridLines: {
          borderDash: [2],
          borderDashOffset: [2],
          color: theme.palette.divider,
          drawBorder: false,
          zeroLineBorderDash: [2],
          zeroLineBorderDashOffset: [2],
          zeroLineColor: theme.palette.divider
        }
      }
    ],
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }
  };

    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
        props.onDaysChange(event.target.value);
    };

  return (
    <Card {...props}>
      <CardHeader 
        action={(
            <Box sx={{ minWidth: 140 }}>
                <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Time Period</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={age}
                    label="Age"
                    onChange={handleChange}
                >
                    <MenuItem value={1}>1 day</MenuItem>
                    <MenuItem value={3}>3 days</MenuItem>
                    <MenuItem value={5}>5 days</MenuItem>
                </Select>
                </FormControl>
            </Box>)}
        title="Info Buses" />
    <Divider />
      <CardContent>
        <Box
          sx={{
            height: 400,
            position: 'relative'
          }}
        >
          <Bar
            data={data}
            options={options}
          />
        </Box>
      </CardContent>
      <Divider />
    </Card>
  );
};