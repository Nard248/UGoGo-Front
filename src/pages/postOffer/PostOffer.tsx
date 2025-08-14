import React, { useState, useEffect } from "react";
import Step1FlightDetails from "./steps/Step1FlightDetails";
import Step2ItemCategory from "./steps/Step2ItemCategory";
import Step4ItemDetails from "./steps/Step4PriceDetails";
import { Button } from "../../components/button/Button";
import { IOfferCreateForm } from "../../types/global";
import { getAirports, creatOffer } from "../../api/route"; 
import { useNavigate } from "react-router-dom"; 
import { AxiosError } from "axios"; 
import Step3ItemDetailsSectionProps from "./steps/Step3ItemDetailsSectionProps";
import { StepInfo } from "./components/StepInfo";
import { useNotification } from "../../components/notification/NotificationProvider";

import "./PostOffer.scss";

const PostOffer: React.FC = () => {
  const [airports, setAirports] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [offerFormData, setOfferFormData] = useState<IOfferCreateForm>(
    {} as IOfferCreateForm
  );
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate(); 
  const { showSuccess, showError, showWarning } = useNotification();

  const getAirportsData = async () => {
    try {
      const data = await getAirports();
      setAirports(data.data.results);
    } catch (error) {
      showError('Failed to load airports. Please refresh the page.');
    }
  };

  useEffect(() => {
    getAirportsData();
  }, []);

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
      showSuccess(`Step ${currentStep} completed!`);
    } else {
      showWarning('Please fill in all required fields before continuing.');
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
        const name = offerFormData.name?.value;

        return !!weight && isDimensionsFilled && !!name;

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
    if (!validateStep(4)) {
      showWarning('Please complete all required information.');
      return;
    }

    setIsSubmitting(true);

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
      available_dimensions: `${offerFormData.available_dimensions?.value?.height}x${offerFormData.available_dimensions?.value?.length}x${offerFormData.available_dimensions?.value?.width}`,
      available_space: 1,
      available_weight: offerFormData.available_weight?.value,
      price: offerFormData.price?.value,
      is_fragile: offerFormData.is_fragile,
    };

    try {
      const data = await creatOffer(sendingData);
      if (data) {
        showSuccess('🎉 Offer created successfully! Redirecting to your offers...');
        setTimeout(() => {
          navigate("/offers", {
            state: { notification: "Your offer has been posted successfully!" },
          });
        }, 1500);
      }
    } catch (error) {
      const axiosError = error as AxiosError; 
      console.error(
        "Error creating offer:",
        axiosError.response?.data || axiosError
      );
      showError('Failed to create offer. Please check your information and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepTitle = () => {
    const titles = {
      1: "Flight Details",
      2: "Item Categories", 
      3: "Space & Weight",
      4: "Pricing"
    };
    return titles[currentStep as keyof typeof titles];
  };

  return (
    <div className="post-offer">
      <div className="post-offer__container">
        {/* Left Sidebar - Step Information */}
        <div className="post-offer__sidebar">
          <StepInfo currentStep={currentStep} totalSteps={4} />
        </div>

        {/* Right Content - Forms */}
        <div className="post-offer__content">
          <div className="post-offer__header">
            <h1 className="post-offer__title">Create Your Offer</h1>
            <p className="post-offer__subtitle">
              {getStepTitle()} - Complete the information below
            </p>
          </div>

          <div className="post-offer__form-container">
            <div className="post-offer__form" key={currentStep}>
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
            </div>

            <div className="post-offer__actions">
              {currentStep > 1 && (
                <Button
                  title="Previous"
                  type="secondary"
                  handleClick={handlePrevious}
                  icon="arrow-left"
                  disabled={isSubmitting}
                />
              )}
              
              <div className="post-offer__actions-spacer"></div>
              
              {currentStep < 4 ? (
                <Button 
                  title="Continue" 
                  type="primary" 
                  handleClick={handleNext}
                  icon="arrow-right"
                />
              ) : (
                <Button
                  title={isSubmitting ? "Creating..." : "Create Offer"}
                  type="primary"
                  handleClick={handleCreateOffer}
                  disabled={isSubmitting}
                  icon="check"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostOffer;