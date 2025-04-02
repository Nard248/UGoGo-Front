import { FC, ChangeEvent, useState, useEffect } from "react";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import searchIcon from "./../../assets/icons/search.svg";
import { IOfferCreateForm } from "../../types/global";
import { Label } from "../label/Label";
import { getAirports, searchOffer } from "../../api/route";
import { Select } from "../../components/select/Select";
import "./Search.scss";

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
    if (!value) return;

    setOfferFormData((prevState) => ({
      ...prevState,
      [type === "to" ? "to_airport_id" : "from_airport_id"]: {
        value,
        errorMessage: null,
      },
    }));
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

    // try {
    //   const response = await searchOffer(searchParams);
    // } catch (error) {
    //   console.error("Search Error:", error);
    // }

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

