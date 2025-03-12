import { FC } from "react";
import searchIcon from "./../../assets/icons/search.svg";
import "./Search.scss";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import React, { ChangeEvent, useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { IOfferCreateForm } from "../../types/global";
import { Label } from "../label/Label";
import { getAirports } from "../../api/route";
import { Select } from "../../components/select/Select";

export const Search: FC = () => {
  const [airports, setAirports] = useState<any[]>([]);

  const [offerFormData, setOfferFormData] = useState<IOfferCreateForm>(
    {} as IOfferCreateForm
  );

  const getAirportsData = async () => {
    const data = await getAirports();
    setAirports(data.data.results);
  };

  useEffect(() => {
    getAirportsData();
    // getCategoriesData();
  }, []);

  const onSelectChange = (
    event: ChangeEvent<HTMLSelectElement>,
    type: string
  ) => {
    const { value } = event.target;
    if (!value) {
      return;
    }

    setOfferFormData((prevState) => ({
      ...prevState,
      [type === "to" ? "to_airport_id" : "from_airport_id"]: {
        value: value,
        errorMessage: null,
      },
    }));
  };

  return (
    <div className="search-bar">
      <div className="search-field">
        <label>From</label>
        {/* <Select
          options={airports.map((airport) => ({
            value: airport.id,
            label: airport.name,
          }))}
          placeholder="Select departure airport"
          classnames="search-select"
          handleSelectChange={(event) => setDeparture(event.target.value)}
        /> */}
        <Select
          options={airports || []}
          id={"departure"}
          placeholder={"Yerevan (EVN)"}
          classnames={"postOffer__input cursor-pointer"}
          handleSelectChange={(event) => onSelectChange(event, "from")}
        />

        {/* </div> */}

        {/* <input type="text" placeholder="Search destinations" /> */}
      </div>
      <div className="search__divider"></div>
      <div className="search-field">
        <label>To</label>
        {/* <Select
          options={airports.map((airport) => ({
            value: airport.id,
            label: airport.name,
          }))}
          placeholder="Select destination airport"
          classnames="search-select"
          handleSelectChange={(event) => setDestination(event.target.value)}
        /> */}
        <Select
          options={airports || []}
          placeholder={"Moscow (SVO)"}
          id={"destination"}
          classnames={"postOffer__input cursor-pointer"}
          handleSelectChange={(event) => onSelectChange(event, "to")}
        />

        {/* <input type="text" placeholder="Search destinations" /> */}
      </div>
      <div className="search__divider"></div>
      <div className="search-field">
        <Label
          title={"Arrival Date"}
          htmlFor={"arrivalTime"}
          classnames={"postOffer__label"}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              views={["day"]}
              slotProps={{
                day: {
                  sx: {
                    fontSize: "1.4rem",
                    "&.Mui-selected": {},
                    "&:hover": {},
                  },
                },
                toolbar: {
                  sx: {
                    ".MuiTypography-root": {
                      fontSize: "1.4rem",
                      backgroundColor: "red",
                    },
                  },
                },
                textField: {
                  sx: {
                    width: "100%",
                    input: {
                      width: "100%",
                      fontSize: "1.4rem",
                      padding: "0",
                    },
                    ".MuiOutlinedInput-root": {
                      borderRadius: ".8rem",
                      padding: "1rem",
                      marginTop: "6px",
                    },
                  },
                },
              }}
              minDate={
                dayjs(offerFormData.departure_datetime?.value) || dayjs()
              } // Set minDate to ensure valid selection
              // onChange={(event) => handleDateChange(event, "end")}
            />
          </LocalizationProvider>
        </Label>
      </div>
      <div className="search__divider"></div>
      <div className="search-field">
        <label>Item</label>
        <input type="text" placeholder="Search by item name" />
      </div>
      <button className="search-button">
        <img src={searchIcon} alt="Search Icon" />
      </button>
    </div>
  );
};
