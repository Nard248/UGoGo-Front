import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Step1ItemDetails from './steps/Step1ItemDetails';
import Step2PickUpPersonDetails from './steps/Step2PickUpPersonDetails';
import Step3ItemImage from './steps/Step3ItemImage';
import Step4ItemCategory from './steps/Step4ItemCategory';
import { StepInfo } from './components/StepInfo';
import { Button } from '../../components/button/Button';
import { useNotification } from '../../components/notification/NotificationProvider';

import { IItemCreate } from "../../types/global";
import { createItem } from "../../api/route";

import "./ItemAdd.scss";

export const ItemAdd: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning } = useNotification();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [itemFormData, setItemFormData] = useState<IItemCreate>({} as IItemCreate);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!itemFormData.name && 
               !!itemFormData.weight && 
               !!itemFormData.dimensions;
      case 2:
        return !!itemFormData.pickup_name &&
               !!itemFormData.pickup_surname &&
               !!itemFormData.pickup_phone &&
               !!itemFormData.pickup_email;
      case 3:
        return true; // Images are optional
      case 4:
        return !!itemFormData.category_ids && itemFormData.category_ids.length > 0;
      default:
        return true;
    }
  };

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

  async function handleSubmit() {
    if (!validateStep(4)) {
      showWarning('Please complete all required information.');
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

      showSuccess('🎉 Item created successfully! Redirecting to your items...');
      setTimeout(() => {
        navigate('/items', {
          state: { notification: "Your item has been posted successfully!" },
        });
      }, 1500);
    } catch (e) {
      console.error("Error creating item:", e);
      setError("There was an error creating the item.");
      showError('Failed to create item. Please check your information and try again.');
    } finally {
      setLoading(false);
    }
  }

  const getStepTitle = () => {
    const titles = {
      1: "Item Details",
      2: "Pickup Person", 
      3: "Item Images",
      4: "Categories"
    };
    return titles[currentStep as keyof typeof titles];
  };

  const steps = [
    <Step1ItemDetails
      key="step1"
      itemFormData={itemFormData}
      setItemFormData={setItemFormData}
      nextStep={handleNext}
    />,
    <Step2PickUpPersonDetails
      key="step2"
      itemFormData={itemFormData}
      setItemFormData={setItemFormData}
      nextStep={handleNext}
      prevStep={handlePrevious}
    />,
    <Step3ItemImage
      key="step3"
      itemFormData={itemFormData}
      setItemFormData={setItemFormData}
      nextStep={handleNext}
      prevStep={handlePrevious}
    />,
    <Step4ItemCategory
      key="step4"
      itemFormData={itemFormData}
      setItemFormData={setItemFormData}
      nextStep={handleSubmit}
      prevStep={handlePrevious}
    />,
  ];

  return (
    <div className="item-add">
      <div className="item-add__container">
        {/* Left Sidebar - Step Information */}
        <div className="item-add__sidebar">
          <StepInfo currentStep={currentStep} totalSteps={4} />
        </div>

        {/* Right Content - Forms */}
        <div className="item-add__content">
          <div className="item-add__header">
            <h1 className="item-add__title">Create Your Item Request</h1>
            <p className="item-add__subtitle">
              {getStepTitle()} - Complete the information below
            </p>
          </div>

          <div className="item-add__form-container">
            <div className="item-add__form" key={currentStep}>
              {steps[currentStep - 1]}
            </div>

            <div className="item-add__actions">
              {currentStep > 1 && (
                <Button
                  title="Previous"
                  type="secondary"
                  handleClick={handlePrevious}
                  icon="arrow-left"
                  disabled={loading}
                />
              )}
              
              <div className="item-add__actions-spacer"></div>
              
              {currentStep < 4 ? (
                <Button 
                  title="Continue" 
                  type="primary" 
                  handleClick={handleNext}
                  icon="arrow-right"
                />
              ) : (
                <Button
                  title={loading ? "Creating..." : "Create Item"}
                  type="primary"
                  handleClick={handleSubmit}
                  disabled={loading}
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
