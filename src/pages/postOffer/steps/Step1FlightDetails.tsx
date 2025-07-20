import React from "react";
import {
  TextField,
  Grid,
  Typography,
  Box,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import dayjs from "dayjs";
import "./Steps.scss";

interface Step1FlightDetailsProps {
  values: {
    flightNumber: string;
    departureAirport: string;
    arrivalAirport: string;
    departureDate: string;
    arrivalDate: string;
  };
  handleChange: (field: string, value: string) => void;
  airports: any[];
  onNext: () => void;
}

const Step1FlightDetails: React.FC<Step1FlightDetailsProps> = ({
  values,
  handleChange,
  airports,
  onNext,
}) => {
  const today = dayjs().format("YYYY-MM-DD");

  return (
    <Box className="step-container">
      <Typography variant="h5" className="step-title">
        Flight Details
      </Typography>

      <Grid container spacing={3} className="step-form-flight">
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Flight Number"
            value={values.flightNumber}
            onChange={(e) => handleChange("flightNumber", e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <Select
            fullWidth
            value={values.departureAirport}
            onChange={(e) => handleChange("departureAirport", e.target.value)}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Departure Airport
            </MenuItem>
            {airports.map((airport) => (
              <MenuItem key={airport.id} value={airport.id}>
                {airport.airport_name}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        <Grid item xs={12}>
          <Select
            fullWidth
            value={values.arrivalAirport}
            onChange={(e) => handleChange("arrivalAirport", e.target.value)}
            displayEmpty
            disabled={!values.departureAirport}
          >
            <MenuItem value="" disabled>
              Select Arrival Airport
            </MenuItem>
            {airports
              .filter((airport) => airport.id !== values.departureAirport)
              .map((airport) => (
                <MenuItem key={airport.id} value={airport.id}>
                  {airport.airport_name}
                </MenuItem>
              ))}
          </Select>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            type="date"
            label="Departure Date"
            InputLabelProps={{ shrink: true }}
            value={values.departureDate}
            onChange={(e) => handleChange("departureDate", e.target.value)}
            inputProps={{ min: today }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            type="date"
            label="Arrival Date"
            InputLabelProps={{ shrink: true }}
            value={values.arrivalDate}
            onChange={(e) => handleChange("arrivalDate", e.target.value)}
            inputProps={{
              min: values.departureDate
                ? dayjs(values.departureDate).add(1, "day").format("YYYY-MM-DD")
                : today,
            }}
          />
        </Grid>
      </Grid>

    </Box>
  );
};

export default Step1FlightDetails;
