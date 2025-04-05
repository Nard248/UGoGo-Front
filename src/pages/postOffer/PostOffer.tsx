import React, { ChangeEvent, useEffect, useState } from "react";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { creatOffer, getAirports, getCategories } from "../../api/route";
import { IOfferCreateForm } from "../../types/global";
import { Label } from "../../components/label/Label";
import { Input } from "../../components/input/Input";
import { Button } from "../../components/button/Button";
import { Select } from "../../components/select/Select";
import { Card } from "../../components/card/Card";
import "./PostOffer.scss";
import { useNavigate } from "react-router-dom";
import { Snackbar } from "@mui/material";
import classNames from "classnames";

export const PostOffer = () => {
  const [airports, setAirports] = useState<any[]>();
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<
    number[] | null
  >();
  const [offerFormData, setOfferFormData] = useState<IOfferCreateForm>(
    {} as IOfferCreateForm
  );
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [departureDate, setDepartureDate] = useState<Dayjs | null>(null);
  const [isFragile, setIsFragile] = useState(false);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const navigate = useNavigate();

  const handleCardClick = (id: number) => {
    if (selectedCategories?.includes(id)) {
      const _selectedCategories = selectedCategories.filter(
        (item) => item !== id
      );
      setSelectedCategories(_selectedCategories);
      return;
    }
    const _selectedCategories = selectedCategories?.length
      ? [...selectedCategories, id]
      : [id];
    setSelectedCategories(_selectedCategories);
    setOfferFormData((prevState) => ({
      ...prevState,
      category_ids: {
        value: _selectedCategories,
        errorMessage: null,
      },
    }));
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    nextField: string
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextElement = document.getElementById(nextField);
      if (nextElement) {
        nextElement.focus();
      }
    }
  };

  const getAirportsData = async () => {
    const data = await getAirports();
    console.log(data.data.results);

    setAirports(data.data.results);
  };

  const getCategoriesData = async () => {
    const data = await getCategories();
    setCategories(data.data);
  };

  useEffect(() => {
    getAirportsData();
    getCategoriesData();
  }, []);

  const handleFlightChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    if (!value) {
      return;
    }
    setOfferFormData((prevState) => ({
      ...prevState,
      flight_number: {
        value: value,
        errorMessage: null,
      },
    }));
  };
  const onSelectChange = (
    event: ChangeEvent<HTMLSelectElement>,
    type: string
  ) => {
    const selectedAirportCode = event.target.value;

    // Ensure airports is defined and is an array before using .find()
    if (!airports || !Array.isArray(airports)) return;

    const selectedAirport = airports.find(
      (airport) => airport.airport_code === selectedAirportCode
    );

    if (!selectedAirport) return;

    setOfferFormData((prevState) => ({
      ...prevState,
      [type === "to" ? "to_airport_id" : "from_airport_id"]: {
        value: selectedAirport.id, // Use the airport ID
        errorMessage: null,
      },
    }));
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {};

  const handlePriceChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    if (!value) {
      return;
    }

    setOfferFormData((prevState) => ({
      ...prevState,
      price: {
        value: +value,
        errorMessage: null,
      },
    }));
  };

  const handleWeightChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    if (!value) {
      return;
    }

    setOfferFormData((prevState) => ({
      ...prevState,
      available_weight: {
        value: +value,
        errorMessage: null,
      },
    }));
  };

  const handleDimensionsChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    if (!value) {
      return;
    }

    setOfferFormData((prevState) => ({
      ...prevState,
      available_dimensions: {
        value: value,
        errorMessage: null,
      },
    }));
  };

  const handleDateChange = (event: Dayjs | null, type: string) => {
    const value = event?.toDate();
    if (!value) {
      return;
    }

    if (type === "start") {
      setDepartureDate(event); // Store Departure Date
    }

    setOfferFormData((prevState) => ({
      ...prevState,
      [type === "start" ? "arrival_datetime" : "departure_datetime"]: {
        value: value,
        errorMessage: null,
      },
    }));
  };

  const handleArrivalDateValidation = (value: Dayjs | null) => {
    if (departureDate && value) {
      if (value.isBefore(departureDate, "minute")) {
        return true;
      }
    }
    return false;
  };

  const handleCreateButtonClick = () => {
    onConfirm();
  };

  const [errors, setErrors] = useState({
    flight_number: false,
    from_airport_id: false,
    to_airport_id: false,
    departure_datetime: false,
    arrival_datetime: false,
    category_ids: false,
    available_weight: false,
    price: false,
    available_dimensions: false,
  });

  const onConfirm = async () => {
    const requiredFields = [
      { field: "flight_number", value: offerFormData.flight_number?.value },
      { field: "from_airport_id", value: offerFormData.from_airport_id?.value },
      { field: "to_airport_id", value: offerFormData.to_airport_id?.value },
      {
        field: "departure_datetime",
        value: offerFormData.departure_datetime?.value,
      },
      {
        field: "arrival_datetime",
        value: offerFormData.arrival_datetime?.value,
      },
      {
        field: "category_ids",
        value: offerFormData.category_ids?.value?.length,
      },
      {
        field: "available_weight",
        value: offerFormData.available_weight?.value,
      },
      { field: "price", value: offerFormData.price?.value },
      {
        field: "available_dimensions",
        value: offerFormData.available_dimensions?.value,
      },
    ];

    let isValid = true;
    const newErrors: {
      flight_number: boolean;
      from_airport_id: boolean;
      to_airport_id: boolean;
      departure_datetime: boolean;
      arrival_datetime: boolean;
      category_ids: boolean;
      available_weight: boolean;
      price: boolean;
      available_dimensions: boolean;
    } = { ...errors };

    requiredFields.forEach(({ field, value }) => {
      if (!value) {
        newErrors[field as keyof typeof newErrors] = true;
        isValid = false;
      } else {
        newErrors[field as keyof typeof newErrors] = false;
      }
    });

    setErrors(newErrors); // Update the error state

    if (!isValid) {
      setOpenSnackbar(true);
      return;
    }
    const formatDate = (date: Date) => {
      return date ? new Date(date).toISOString() : "";
    };

    const departureDate = offerFormData.departure_datetime?.value;
    const arrivalDate = offerFormData.arrival_datetime?.value;

    const sendingData = {
      flight_number: offerFormData.flight_number?.value,
      from_airport_id: offerFormData.from_airport_id?.value,
      to_airport_id: offerFormData.to_airport_id?.value,
      departure_datetime: formatDate(new Date(departureDate)),
      arrival_datetime: formatDate(new Date(arrivalDate)),
      category_ids: offerFormData.category_ids?.value,
      available_dimensions: offerFormData.available_dimensions.value,
      available_space: 1,
      available_weight: offerFormData.available_weight?.value,
      price: offerFormData.price?.value,
      is_fragile: isFragile,
    };

    try {
      const data = await creatOffer(sendingData);

      if (data) {
        navigate("/offers", {
          state: { notification: "Offer has been created successfully" },
        });
      }
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  };

  const onAddCategory = () => {};

  const onFlightAdd = () => {};

  return (
    <div className="postOffer">
      <div className="flex justify-between items-center mb-[2.1rem]">
        <h1 className="font-medium text-[2rem]">Create a new flight</h1>
      </div>
      <div className="postOffer__content flex justify-between gap-20">
        <div className="postOffer__flightDetails">
          <div className="postOffer__flightDetails__form postOffer__form">
            <div className="postOffer__flightDetails__form__header postOffer__header">
              <h3 className="postOffer__flightDetails__form__header__title postOffer__title">
                Flight details
              </h3>
            </div>
            <div className="postOffer__flightDetails__form__content">
              <Label
                title={"Flight number"}
                htmlFor={"flightNumber"}
                classnames={"postOffer__label"}
              >
                <Input
                  type={"text"}
                  placeholder={"LH123"}
                  id={"flightNumber"}
                  classnames={`postOffer__input ${
                    errors.flight_number ? "error" : ""
                  }`}
                  handleChange={handleFlightChange}
                />
              </Label>
            </div>
            <div className="postOffer__flightDetails__form__content">
              <Label
                title={"Departure"}
                htmlFor={"departure"}
                classnames={"postOffer__label"}
              >
                <Select
                  options={airports || []}
                  id={"departure"}
                  placeholder={"select airport"}
                  classnames={`postOffer__input cursor-pointer ${
                    errors.from_airport_id ? "error" : ""
                  }`}
                  handleSelectChange={(event) => onSelectChange(event, "from")}
                />
              </Label>
            </div>
            <div className="postOffer__flightDetails__form__content">
              <Label
                title={"Destination"}
                htmlFor={"destination"}
                classnames={"postOffer__label"}
              >
                <Select
                  options={airports || []}
                  placeholder={"select airport"}
                  id={"destination"}
                  classnames={`postOffer__input cursor-pointer ${
                    errors.to_airport_id ? "error" : ""
                  }`}
                  handleSelectChange={(event) => onSelectChange(event, "to")}
                />
              </Label>
            </div>
            <div className="postOffer__flightDetails__form__content">
              <Label
                title={"Departure Date and Time"}
                htmlFor={"departureTime"}
                classnames={"postOffer__label"}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
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
                        className: `postOffer__input ${
                          errors.departure_datetime ? "error" : ""
                        }`,
                      },
                    }}
                    minDate={dayjs()}
                    onChange={(event) => handleDateChange(event, "start")}
                  />
                </LocalizationProvider>
              </Label>
            </div>
            <div className="postOffer__flightDetails__form__content">
              <Label
                title={"Arrival Date and Time"}
                htmlFor={"arrivalTime"}
                // classnames={"postOffer__label"}
                classnames={`postOffer__label ${
                  errors.arrival_datetime ? "error" : ""
                }`}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
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
                        className: `postOffer__input ${
                          errors.arrival_datetime ? "error" : ""
                        }`,
                      },
                    }}
                    minDate={
                      departureDate
                        ? dayjs(departureDate).add(1, "minute")
                        : dayjs()
                    }
                    onChange={(event) => handleDateChange(event, "end")}
                    shouldDisableDate={handleArrivalDateValidation}
                  />
                </LocalizationProvider>
              </Label>
            </div>
          </div>
          <div className="postOffer__flightDetails__notes">
            <div className="postOffer__flightDetails__notes__content">
              <Label
                title={"Details"}
                htmlFor={"details"}
                classnames={"postOffer__label"}
              >
                <Input
                  type={"textarea"}
                  placeholder={
                    "Want to add something specific about the flight?"
                  }
                  id={"Details"}
                  handleChange={handleInputChange}
                />
              </Label>
            </div>
          </div>
        </div>
        <div className="postOffer__detailedForm grow shrink">
          {!!categories.length && (
            <div className="postOffer__detailedForm__prefferedCategory">
              <div className="postOffer__detailedForm__prefferedCategory__form postOffer__form">
                <div className="postOffer__detailedForm__prefferedCategory__form__header postOffer__header">
                  <h3 className="postOffer__detailedForm__prefferedCategory__form__header__title postOffer__title">
                    Item preferred category
                  </h3>
                </div>
                <div className="postOffer__detailedForm__prefferedCategory__form__content">
                  {categories?.map(({ id, name, icon_path }) => (
                    <Card
                      key={id}
                      id={id}
                      title={name}
                      iconSrc={icon_path}
                      iconName={name}
                      selected={selectedCategories?.includes(id)}
                      handleCardClick={handleCardClick}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="postOffer__detailedForm__itemDetails">
            <div className="postOffer__detailedForm__itemDetails__form postOffer__form">
              <div className="postOffer__detailedForm__itemDetails__form__header postOffer__header">
                <h3 className="postOffer__detailedForm__itemDetails__form__header__title postOffer__title">
                  Item details
                </h3>
              </div>
              <div className="postOffer__detailedForm__itemDetails__form__content">
                <div className="postOffer__detailedForm__itemDetails__form__content__item">
                  <Label
                    title={"Weight"}
                    htmlFor={"weight"}
                    classnames={"postOffer__label"}
                  >
                    <div className="postOffer__inputWrapper">
                      <Input
                        type={"text"}
                        placeholder={"1"}
                        id={"weight"}
                        classnames={`postOffer__input ${
                          errors.available_weight ? "error" : ""
                        }`}
                        handleChange={handleWeightChange}
                      />
                      <span className="postOffer__kg">kg</span>
                    </div>
                  </Label>
                </div>
                <div className="postOffer__detailedForm__itemDetails__form__content__item">
                  <Label
                    title={"Available Dimensions"}
                    htmlFor={"availableDimensions"}
                    classnames={"postOffer__label"}
                  >
                    <div className="postOffer__dimensionsWrapper">
                      <div className="postOffer__inputWrapper">
                        <input
                          type="number"
                          placeholder="Height"
                          id="height"
                          className={`postOffer__dimensionInput ${
                            errors.available_dimensions ? "error" : ""
                          }`}
                          onKeyDown={(e) => handleKeyDown(e, "width")}
                          onChange={handleDimensionsChange}
                        />
                        <span className="postOffer__unit">cm</span>
                      </div>
                      <div className="postOffer__inputWrapper">
                        <input
                          type="number"
                          placeholder="Width"
                          id="width"
                          className={`postOffer__dimensionInput ${
                            errors.available_dimensions ? "error" : ""
                          }`}
                          onKeyDown={(e) => handleKeyDown(e, "length")}
                          onChange={handleDimensionsChange}
                        />
                        <span className="postOffer__unit">cm</span>
                      </div>
                      <div className="postOffer__inputWrapper">
                        <input
                          type="number"
                          placeholder="Length"
                          id="length"
                          className={`postOffer__dimensionInput ${
                            errors.available_dimensions ? "error" : ""
                          }`}
                          onChange={handleDimensionsChange}
                        />
                        <span className="postOffer__unit">cm</span>
                      </div>
                    </div>
                  </Label>
                </div>
                <div className="postOffer__flightDetails__form__content">
                  <label
                    htmlFor="fragileCheckbox"
                    className="postOffer__label flex items-center"
                  >
                    <input
                      type="checkbox"
                      id="fragileCheckbox"
                      checked={isFragile}
                      onChange={() => setIsFragile(!isFragile)}
                      className="mr-2"
                    />
                    Fragile
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="postOffer__detailedForm__priceDetails gap-32">
            <div className="postOffer__detailedForm__priceDetails__form postOffer__form w-full">
              <div className="postOffer__detailedForm__itemDetails__form__header postOffer__header">
                <h3 className="postOffer__detailedForm__itemDetails__form__header__title postOffer__title">
                  Item details
                </h3>
              </div>
              <div className="postOffer__detailedForm__itemDetails__form__content">
                <div className="postOffer__detailedForm__itemDetails__form__content__item">
                  <Label
                    title={"Price details"}
                    htmlFor={"priceDetails"}
                    classnames={"postOffer__label"}
                  >
                    <div className="postOffer__inputWrapper">
                      <Input
                        type={"number"}
                        placeholder={"20 "}
                        id={"priceDetails"}
                        classnames={`postOffer__input ${
                          errors.price ? "error" : ""
                        }`}
                        handleChange={handlePriceChange}
                      />
                      <span className="postOffer__currencySign">$</span>
                    </div>
                  </Label>
                </div>
              </div>
            </div>
            <div className="postOffer__detailedForm__itemDetails__form__content__item w-full">
              <Label
                title={"Details"}
                htmlFor={"details"}
                classnames={"postOffer__label"}
              >
                <Input
                  type={"textarea"}
                  placeholder={"Want to add something specific about the item?"}
                  id={"details"}
                  classnames={"postOffer__input h-full"}
                  handleChange={handleInputChange}
                />
              </Label>
            </div>
          </div>
          <div className="postOffer__actions">
            <Button
              title={"Create"}
              type={"tertiary"}
              classNames={"postOffer__actionsConfirm"}
              handleClick={handleCreateButtonClick}
            />
            <Snackbar
              open={openSnackbar}
              onClose={handleCloseSnackbar}
              autoHideDuration={4000}
              message="Please fill all required fields."
              className="postOffer__notification"
              ContentProps={{
                className: "postOffer__notification",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
