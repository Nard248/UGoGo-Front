import React from "react";
import {
  TextField,
  Grid,
  Box,
  Select,
  MenuItem,
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
            type="datetime-local"
            label="Departure Date and Time"
            InputLabelProps={{ shrink: true }}
            value={values.departureDate}
            onChange={(e) => handleChange("departureDate", e.target.value)}
            onKeyDown={(e) => e.preventDefault()}
            inputProps={{
              min: dayjs().format("YYYY-MM-DDTHH:mm"),
              style: { cursor: "pointer" },
            }}
            onClick={(e) => {
              const input = e.currentTarget.querySelector("input");
              if (input) input.showPicker();
            }}
            sx={{ "& input": { cursor: "pointer", caretColor: "transparent" } }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            type="datetime-local"
            label="Arrival Date and Time"
            InputLabelProps={{ shrink: true }}
            value={values.arrivalDate}
            onChange={(e) => {
              const selectedArrival = dayjs(e.target.value);
              const minArrival = values.departureDate
                ? dayjs(values.departureDate).add(1, "hour")
                : dayjs().add(1, "hour");

              if (selectedArrival.isBefore(minArrival)) {
                handleChange(
                  "arrivalDate",
                  minArrival.format("YYYY-MM-DDTHH:mm")
                );
              } else {
                handleChange("arrivalDate", e.target.value);
              }
            }}
            onKeyDown={(e) => e.preventDefault()}
            inputProps={{
              min: values.departureDate
                ? dayjs(values.departureDate)
                    .add(1, "hour")
                    .format("YYYY-MM-DDTHH:mm")
                : dayjs().add(1, "hour").format("YYYY-MM-DDTHH:mm"),
              style: { cursor: "pointer" },
            }}
            onClick={(e) => {
              const input = e.currentTarget.querySelector("input");
              if (input) input.showPicker();
            }}
            sx={{ "& input": { cursor: "pointer", caretColor: "transparent" } }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Step1FlightDetails;
