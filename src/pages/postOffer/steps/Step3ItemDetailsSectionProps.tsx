import React from "react";
import { IOfferCreateForm } from "../../../types/global";
import { Label } from "../../../components/label/Label";
import { Input } from "../../../components/input/Input";
import "./Steps.scss";

interface Step3ItemDetailsSectionProps {
  offerFormData: IOfferCreateForm;
  setOfferFormData: React.Dispatch<React.SetStateAction<IOfferCreateForm>>;
  errors: Record<string, boolean>;
}

const Step3ItemDetailsSection: React.FC<Step3ItemDetailsSectionProps> = ({
  offerFormData,
  setOfferFormData,
  errors,
}) => {
  const handleWeightChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const weight = e.target.value;
    setOfferFormData((prevData) => ({
      ...prevData,
      available_weight: {
        value: weight,
        errorMessage: prevData.available_weight?.errorMessage || "",
      },
    }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.value;
    setOfferFormData((prevData) => ({
      ...prevData,
      name: { value: name },
    }));
  };
      
  const handleDimensionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setOfferFormData((prevData) => {
      const currentDimensions =
        typeof prevData.available_dimensions?.value === "object" &&
        prevData.available_dimensions?.value
          ? prevData.available_dimensions.value
          : { height: "", width: "", length: "" };

      return {
        ...prevData,
        available_dimensions: {
          ...prevData.available_dimensions,
          value: {
            ...currentDimensions,
            [id]: value,
          },
          errorMessage: prevData.available_dimensions?.errorMessage || "",
        },
      };
    });
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    nextField: string
  ) => {
    if (e.key === "Enter") {
      document.getElementById(nextField)?.focus();
    }
  };

  return (
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
              title="Dimensions"
              htmlFor="availableDimensions"
              classnames="postOffer__label"
            >
              <div className="postOffer__dimensionsWrapper">
                {["length", "width", "height"].map((dimension, idx) => (
                  <div key={dimension} className="postOffer__inputWrapper">
                    <input
                      type="number"
                      placeholder={
                        dimension.charAt(0).toUpperCase() + dimension.slice(1)
                      }
                      id={dimension}
                      value={
                        offerFormData.available_dimensions?.value?.[
                          dimension
                        ] || ""
                      }
                      className={`postOffer__dimensionInput ${
                        errors.available_dimensions ? "error" : ""
                      }`}
                      onChange={handleDimensionsChange}
                      onKeyDown={(e) =>
                        idx === 0
                          ? handleKeyDown(e, "width")
                          : idx === 1
                          ? handleKeyDown(e, "height")
                          : undefined
                      }
                    />
                    <span className="postOffer__unit">cm</span>
                  </div>
                ))}
              </div>
            </Label>
          </div>

          {/* Name */}
          <div className="postOffer__detailedForm__itemDetails__form__content__item">
            <Label title="Name" htmlFor="name" classnames="postOffer__label">
              <div className="postOffer__inputWrapper">
                <Input
                  type="text"
                  id="name"
                  placeholder="Item name"
                  value={offerFormData.name?.value || ""}
                  handleChange={handleNameChange}
                  classnames="postOffer__input"
                />
              </div>
            </Label>
          </div>

          {/* Weight */}
          <div className="postOffer__detailedForm__itemDetails__form__content__item">
            <Label
              title="Weight"
              htmlFor="weight"
              classnames="postOffer__label"
            >
              <div className="postOffer__inputWrapper">
                <Input
                  type="text"
                  placeholder="1"
                  id="weight"
                  value={offerFormData.available_weight?.value || ""}
                  classnames={`postOffer__input ${
                    errors.available_weight ? "error" : ""
                  }`}
                  handleChange={handleWeightChange}
                />
                <span className="postOffer__kg">kg</span>
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
                checked={offerFormData.is_fragile || false}
                onChange={() =>
                  setOfferFormData((prevData) => ({
                    ...prevData,
                    is_fragile: !prevData.is_fragile,
                  }))
                }
                className="mr-2"
              />
              Fragile
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3ItemDetailsSection;
