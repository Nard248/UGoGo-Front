import React, { useState, useEffect } from "react";
import Step1FlightDetails from "./steps/Step1FlightDetails";
import Step2ItemCategory from "./steps/Step2ItemCategory";
import Step4ItemDetails from "./steps/Step4PriceDetails";
import { Button } from "../../components/button/Button";
import { Snackbar } from "@mui/material";
import { IOfferCreateForm } from "../../types/global";
import { getAirports, creatOffer } from "../../api/route"; 
import { useNavigate } from "react-router-dom"; 
import { AxiosError } from "axios"; 
import Step3ItemDetailsSectionProps from "./steps/Step3ItemDetailsSectionProps";

import "./PostOffer.scss";
const PostOffer: React.FC = () => {
  const [airports, setAirports] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [offerFormData, setOfferFormData] = useState<IOfferCreateForm>(
    {} as IOfferCreateForm
  );
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const navigate = useNavigate(); 

  const getAirportsData = async () => {
    const data = await getAirports();
    console.log(data.data.results);
    setAirports(data.data.results);
  };

  useEffect(() => {
    getAirportsData();
  }, []);

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setOpenSnackbar(true);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return (
          !!offerFormData.flight_number?.value &&
          !!offerFormData.from_airport_id?.value &&
          !!offerFormData.to_airport_id?.value &&
          !!offerFormData.departure_datetime?.value &&
          !!offerFormData.arrival_datetime?.value
        );
      case 2:
        const categoryValues = offerFormData.category_ids?.value || [];
        return !!categoryValues.length;
      case 3:
        const { height, width, length } =
          offerFormData.available_dimensions?.value || {};
        const weight = offerFormData.available_weight?.value;
        const isDimensionsFilled = [height, width, length].every(
          (dim) => dim !== null && dim !== undefined && dim !== ""
        );
        const name = offerFormData.name?.value

        return  !!weight && isDimensionsFilled && !!name;

      case 4:
        return !!offerFormData.price?.value;
      default:
        return true;
    }
  };

  const formatDate = (date: Date) => {
    return date.toISOString(); 
  };

  const handleCreateOffer = async () => {
    const sendingData = {
      flight_number: offerFormData.flight_number?.value,
      from_airport_id: offerFormData.from_airport_id?.value,
      to_airport_id: offerFormData.to_airport_id?.value,
      departure_datetime: formatDate(
        new Date(offerFormData.departure_datetime?.value)
      ),
      arrival_datetime: formatDate(
        new Date(offerFormData.arrival_datetime?.value)
      ),
      category_ids: offerFormData.category_ids?.value,
      available_dimensions: `${offerFormData.available_dimensions?.value?.height}x${offerFormData.available_dimensions?.value?.length}x${offerFormData.available_dimensions?.value?.width}`, // Fix here: Join dimensions as a string
      available_space: 1,
      available_weight: offerFormData.available_weight?.value,
      price: offerFormData.price?.value,
      is_fragile: offerFormData.is_fragile,
    };


    try {
      const data = await creatOffer(sendingData);
      if (data) {
        navigate("/offers", {
          state: { notification: "Offer has been created successfully" },
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError; 
      console.error(
        "Error creating offer:",
        axiosError.response?.data || axiosError
      ); 
    }
  };

  return (
    <div className="postOffer">
      <div className="flex justify-between items-center mb-[2.1rem]">
        <h1 className="font-medium text-[2rem]">Create a new flight</h1>
      </div>

      <div className="postOffer__content">
        {currentStep === 1 && (
          <Step1FlightDetails
            airports={airports}
            values={{
              flightNumber: offerFormData.flight_number?.value || "",
              departureAirport: offerFormData.from_airport_id?.value || "",
              arrivalAirport: offerFormData.to_airport_id?.value || "",
              departureDate: offerFormData.departure_datetime?.value || "",
              arrivalDate: offerFormData.arrival_datetime?.value || "",
            }}
            handleChange={(field, value) => {
              const fieldMap: Record<string, keyof IOfferCreateForm> = {
                flightNumber: "flight_number",
                departureAirport: "from_airport_id",
                arrivalAirport: "to_airport_id",
                departureDate: "departure_datetime",
                arrivalDate: "arrival_datetime",
              };

              const key = fieldMap[field];
              setOfferFormData((prev) => ({
                ...prev,
                [key]: { value },
              }));
            }}
            onNext={handleNext}
          />
        )}

        {currentStep === 2 && (
          <Step2ItemCategory
            offerFormData={offerFormData}
            setOfferFormData={setOfferFormData}
            errors={errors}
            setErrors={setErrors}
          />
        )}
        {currentStep === 3 && (
          <Step3ItemDetailsSectionProps
            offerFormData={offerFormData}
            setOfferFormData={setOfferFormData}
            errors={errors}
            // setErrors={setErrors}
          />
        )}
        {currentStep === 4 && (
          <Step4ItemDetails
            offerFormData={offerFormData}
            setOfferFormData={setOfferFormData}
            errors={errors}
            setErrors={setErrors}
          />
        )}


        <div className="postOffer__actions mt-4">
          {currentStep > 1 && (
            <Button
              title="Back"
              type="secondary"
              handleClick={handlePrevious}
            />
          )}
          {currentStep < 4 ? (
            <Button title="Next" type="primary" handleClick={handleNext} />
          ) : (
            <Button
              title="Create Offer"
              type="primary"
              handleClick={handleCreateOffer} 
            />
          )}
        </div>
      </div>

      <Snackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        autoHideDuration={4000}
        message="Please fill all required fields."
      />
    </div>
  );
};

export default PostOffer;
