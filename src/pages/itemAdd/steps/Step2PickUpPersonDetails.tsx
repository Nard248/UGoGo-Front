import React, { useEffect, useState } from 'react';
import { Label } from "../../../components/label/Label";
import { Input } from "../../../components/input/Input";
import { Button } from "../../../components/button/Button";
import { IItemCreate } from "../../../types/global";
import './StepItemDetails.scss';

const Step2PickUpPersonDetails = ({
  itemFormData,
  setItemFormData,
  nextStep,
  prevStep,
}: {
  itemFormData: IItemCreate;
  setItemFormData: React.Dispatch<React.SetStateAction<IItemCreate>>;
  nextStep: () => void;
  prevStep: () => void;
}) => {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const { pickup_name, pickup_surname, pickup_phone, pickup_email } = itemFormData;
    const valid =
      !!pickup_name?.trim() &&
      !!pickup_surname?.trim() &&
      !!pickup_phone?.trim() &&
      !!pickup_email?.trim();
    setIsValid(valid);
  }, [itemFormData]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = event.target;
    setItemFormData((prevData: IItemCreate) => ({
      ...prevData,
      [id]: value,
    }));
  };
  
  return (
    <div className="step-pickup-person-details">
      <div className="pickup-header">Pick-up person details</div>

      <div className="form-content">
        <Label title="Name" htmlFor="pickup_name">
          <Input
            type="text"
            id="pickup_name"
            value={itemFormData.pickup_name || ''}
            handleChange={handleChange}
            placeholder="John"
          />
        </Label>

        <Label title="Surname" htmlFor="pickup_surname">
          <Input
            type="text"
            id="pickup_surname"
            value={itemFormData.pickup_surname || ''}
            handleChange={handleChange}
            placeholder="Doe"
          />
        </Label>

        <Label title="Phone" htmlFor="pickup_phone">
          <Input
            type="text"
            id="pickup_phone"
            value={itemFormData.pickup_phone || ''}
            handleChange={handleChange}
            placeholder="Phone number"
          />
        </Label>

        <Label title="Email" htmlFor="pickup_email">
          <Input
            type="email"
            id="pickup_email"
            value={itemFormData.pickup_email || ''}
            handleChange={handleChange}
            placeholder="Email"
          />
        </Label>
      </div>

      <div className="button-group">
        <Button title="Back" handleClick={prevStep} type="secondary" />
        <Button title="Next" handleClick={nextStep} type="primary" disabled={!isValid} />
      </div>
    </div>
  );
};

export default Step2PickUpPersonDetails;
