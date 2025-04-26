import React, { useState, useEffect } from 'react';
import { Label } from "../../../components/label/Label";
import { Input } from "../../../components/input/Input";
import { Button } from "../../../components/button/Button";
import { IItemCreate } from "../../../types/global";
import './StepItemDetails.scss';

const Step1ItemDetails = ({
  itemFormData,
  setItemFormData,
  nextStep,
}: {
  itemFormData: IItemCreate;
  setItemFormData: React.Dispatch<React.SetStateAction<IItemCreate>>;
  nextStep: () => void;
}) => {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const { name, dimensions, weight } = itemFormData;
    const weightNumber = parseFloat(String(weight));
    const valid = !!name && !!dimensions && !isNaN(weightNumber) && weightNumber > 0;
    setIsValid(valid);
  }, [itemFormData]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = event.target;

    setItemFormData((prevData: IItemCreate) => ({
      ...prevData,
      [id]: id === 'weight' ? Number(value) : value,
    }));
  };

  return (
    <div className="step-item-details-wrapper">
  <div className="step-item-details">
    <div className="step-header">Item details</div>

    <div className="step-body">
      <Label title="Name" htmlFor="name">
        <Input
          type="text"
          id="name"
          value={itemFormData.name || ""}
          handleChange={handleChange}
          placeholder="Item name"
        />
      </Label>

      <Label title="Dimensions" htmlFor="dimensions">
        <Input
          type="text"
          id="dimensions"
          value={itemFormData.dimensions || ""}
          handleChange={handleChange}
          placeholder="Length x Width x Height"
        />
      </Label>

      <Label title="Weight" htmlFor="weight">
        <Input
          type="number"
          id="weight"
          value={itemFormData.weight || ""}
          handleChange={handleChange}
          placeholder="Item weight (kg)"
        />
      </Label>
    </div>

    <div className="step-footer">
      <Button
        type="primary"
        title="Next"
        handleClick={nextStep}
        disabled={!isValid}
      />
    </div>
  </div>
</div>
  );
};

export default Step1ItemDetails;

