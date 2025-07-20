import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Step1ItemDetails from './steps/Step1ItemDetails';
import Step2PickUpPersonDetails from './steps/Step2PickUpPersonDetails';
import Step3ItemImage from './steps/Step3ItemImage';
import Step4ItemCategory from './steps/Step4ItemCategory';

import { IItemCreate } from "../../types/global";
import { createItem } from "../../api/route";

import "./ItemAdd.scss";

export const ItemAdd: React.FC = () => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [itemFormData, setItemFormData] = useState<IItemCreate>({} as IItemCreate);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    <Step1ItemDetails
      key="step1"
      itemFormData={itemFormData}
      setItemFormData={setItemFormData}
      nextStep={nextStep}
    />,
    <Step2PickUpPersonDetails
      key="step2"
      itemFormData={itemFormData}
      setItemFormData={setItemFormData}
      nextStep={nextStep}
      prevStep={prevStep}
    />,
    <Step3ItemImage
      key="step3"
      itemFormData={itemFormData}
      setItemFormData={setItemFormData}
      nextStep={nextStep}
      prevStep={prevStep}
    />,
    <Step4ItemCategory
      key="step4"
      itemFormData={itemFormData}
      setItemFormData={setItemFormData}
      nextStep={nextStep}
      prevStep={prevStep}
    />,
  ];

  async function nextStep() {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      // Append fields if present
      if (itemFormData.name) formData.append('name', itemFormData.name);
      if (itemFormData.weight !== undefined) formData.append('weight', String(itemFormData.weight));
      if (itemFormData.dimensions) formData.append('dimensions', itemFormData.dimensions);

      if (itemFormData.fragile !== undefined) formData.append('fragile', String(itemFormData.fragile));
      if (itemFormData.description) formData.append('description', itemFormData.description);

      if (itemFormData.pickup_name) formData.append('pickup_name', itemFormData.pickup_name);
      if (itemFormData.pickup_surname) formData.append('pickup_surname', itemFormData.pickup_surname);
      if (itemFormData.pickup_phone) formData.append('pickup_phone', itemFormData.pickup_phone);
      if (itemFormData.pickup_email) formData.append('pickup_email', itemFormData.pickup_email);
      if (itemFormData.state) formData.append('state', itemFormData.state);

      if (itemFormData.category_ids && itemFormData.category_ids.length) {
        itemFormData.category_ids.forEach(id => {
          formData.append('category_ids[]', id.toString());
        });
      }

      if (itemFormData.pictures && itemFormData.pictures.length) {
        itemFormData.pictures.forEach(pic => {
          if (pic.file instanceof File) {
            formData.append('uploaded_pictures', pic.file);
          }
        });
      }

      // Debug: log form data key-values
Array.from(formData.entries()).forEach(([key, value]) => {
  console.log(key, value);
});

      await createItem(formData);

      navigate('/single-product-page?modal=book');
    } catch (e) {
      console.error("Error creating item:", e);
      setError("There was an error creating the item.");
    } finally {
      setLoading(false);
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }

  return (
    <div className="item-add-container">
      <div className="step-form">{steps[currentStep - 1]}</div>

      <div className="step-navigation">
        {currentStep > 1 && (
          <button type="button" onClick={prevStep} disabled={loading}>
            Previous
          </button>
        )}

        {currentStep < steps.length && (
          <button type="button" onClick={nextStep} disabled={loading}>
            Next
          </button>
        )}

        {currentStep === steps.length && (
          <button type="button" onClick={nextStep} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};
