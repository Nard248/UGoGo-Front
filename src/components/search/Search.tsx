import { FC, ChangeEvent } from "react";
import searchIcon from "./../../assets/icons/search.svg";
import "./Search.scss";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { IOfferCreateForm } from "../../types/global";
import { Label } from "../label/Label";
import { getAirports, searchOffer } from "../../api/route";
import { Select } from "../../components/select/Select";
import { useState, useEffect } from "react";

interface SearchProps {
  onSearchResults: (searchParams: {
    origin_airport: string;
    destination_airport: string;
    takeoff_date: string;
  }) => void;
}

export const Search: FC<SearchProps> = ({ onSearchResults }) => {
  const [airports, setAirports] = useState<any[]>([]);
  const [offerFormData, setOfferFormData] = useState<IOfferCreateForm>({
    flight_number: { value: "", errorMessage: null },
    from_airport_id: { value: "", errorMessage: null },
    to_airport_id: { value: "", errorMessage: null },
    departure_datetime: { value: null, errorMessage: null },
    arrival_datetime: { value: null, errorMessage: null },
    available_dimensions: { value: "", errorMessage: null },
    available_weight: { value: "", errorMessage: null },
    price: { value: "", errorMessage: null },
  });

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const data = await getAirports();
        const results = data.data.results;
        setAirports(results);

        if (results.length) {
          setOfferFormData((prevState) => ({
            ...prevState,
            from_airport_id: {
              value:
                prevState.from_airport_id.value || results[0].airport_code,
              errorMessage: null,
            },
            to_airport_id: {
              value:
                prevState.to_airport_id.value ||
                (results[1] ? results[1].airport_code : results[0].airport_code),
              errorMessage: null,
            },
          }));
        }
      } catch (error) {
        console.error("Error fetching airports:", error);
      }
    };
    fetchAirports();
  }, []);

  const onSelectChange = (
    event: ChangeEvent<HTMLSelectElement>,
    type: "from" | "to"
  ) => {
    const { value } = event.target;
    if (!value) return;

    const selectedAirport = airports.find(
      (airport) => airport.airport_code === value
    );
    if (!selectedAirport) return;

    setOfferFormData((prevState) => {
      const newState = { ...prevState };

      if (type === "from") {
        newState.from_airport_id = { value, errorMessage: null };
        if (prevState.to_airport_id.value === value) {
          const alternative = airports.find(
            (airport) => airport.airport_code !== value
          );
          newState.to_airport_id = {
            value: alternative ? alternative.airport_code : "",
            errorMessage: null,
          };
        }
      } else {
        newState.to_airport_id = { value, errorMessage: null };
        if (prevState.from_airport_id.value === value) {
          const alternative = airports.find(
            (airport) => airport.airport_code !== value
          );
          newState.from_airport_id = {
            value: alternative ? alternative.airport_code : "",
            errorMessage: null,
          };
        }
      }

      return newState;
    });
  };

  const onDateChange = (date: Dayjs | null) => {
    setOfferFormData((prevState) => ({
      ...prevState,
      departure_datetime: {
        value: date ? date.format("YYYY-MM-DD") : null,
        errorMessage: null,
      },
    }));
  };

  const handleSearch = async () => {
    const searchParams = {
      origin_airport: offerFormData.from_airport_id.value,
      destination_airport: offerFormData.to_airport_id.value,
      takeoff_date: offerFormData.departure_datetime.value,
    };

    try {
      const response = await searchOffer(searchParams);
    } catch (error) {
      console.error("Search Error:", error);
    }

    onSearchResults(searchParams);
  };

  const filteredToAirports = airports.filter(
    (airport) => airport.airport_code !== offerFormData.from_airport_id.value
  );

  return (
    <div className="search-bar">
      <div className="search-field">
        <label>From</label>
        <Select
          options={airports}
          id="departure"
          placeholder="Select departure airport"
          classnames="postOffer__input cursor-pointer"
          handleSelectChange={(event) => onSelectChange(event, "from")}
          value={offerFormData.from_airport_id.value}
        />
      </div>

      <div className="search__divider"></div>

      <div className="search-field">
        <label>To</label>
        <Select
          options={filteredToAirports}
          id="destination"
          placeholder="Select destination airport"
          classnames="postOffer__input cursor-pointer"
          handleSelectChange={(event) => onSelectChange(event, "to")}
          value={offerFormData.to_airport_id.value}
        />
      </div>

      <div className="search__divider"></div>

      <div className="search-field">
        <Label
          title="Arrival Date"
          htmlFor="arrivalTime"
          classnames="postOffer__label"
        >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                views={["day"]}
                format="YYYY-MM-DD"
                value={
                  offerFormData.departure_datetime.value
                    ? dayjs(offerFormData.departure_datetime.value)
                    : null
                }
                onChange={onDateChange}
                minDate={dayjs()}
                slotProps={{
                  textField: {
                    sx: { width: "100%" },
                  },
                }}
              />
            </LocalizationProvider>
        </Label>
      </div>

      <div className="search__divider"></div>

      <button className="search-button" onClick={handleSearch}>
        <img src={searchIcon} alt="Search Icon" />
      </button>
    </div>
  );
};

