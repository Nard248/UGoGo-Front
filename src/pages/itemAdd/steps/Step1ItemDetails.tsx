import React, { useState, useEffect, useRef } from 'react';
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
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
const widthRef = useRef<HTMLInputElement>(null);
const heightRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (itemFormData.dimensions && (!length || !width || !height)) {
      const [l, w, h] = itemFormData.dimensions.split('x');
      setLength(l || "");
      setWidth(w || "");
      setHeight(h || "");
    }
  }, [itemFormData.dimensions]);

  useEffect(() => {
    if (length && width && height) {
      const dimensionsStr = `${length}x${width}x${height}`;
      setItemFormData((prev) => ({ ...prev, dimensions: dimensionsStr }));
    }
  }, [length, width, height, setItemFormData]);

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

    if (id === "weight") {
      setItemFormData((prev) => ({ ...prev, weight: Number(value) }));
    } else if (id === "name") {
      setItemFormData((prev) => ({ ...prev, name: value }));
    }
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

          <Label title="Dimensions">
  <div className="dimensions-group">
    <div className="dimension-input">
      <input
        type="number"
        id="length"
        value={length}
        onChange={(e) => setLength(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            widthRef.current?.focus();
          }
        }}
        placeholder="Length"
      />
      <span className="unit">cm</span>
    </div>
    <div className="dimension-input">
      <input
        type="number"
        id="width"
        ref={widthRef}
        value={width}
        onChange={(e) => setWidth(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            heightRef.current?.focus();
          }
        }}
        placeholder="Width"
      />
      <span className="unit">cm</span>
    </div>
    <div className="dimension-input">
      <input
        type="number"
        id="height"
        ref={heightRef}
        value={height}
        onChange={(e) => setHeight(e.target.value)}
        placeholder="Height"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
          }
        }}
      />
      <span className="unit">cm</span>
    </div>
  </div>
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
