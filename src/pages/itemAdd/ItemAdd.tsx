import React, { useState, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import Step1ItemDetails from './steps/Step1ItemDetails';
import Step2PickUpPersonDetails from './steps/Step2PickUpPersonDetails';
import Step3ItemImage from './steps/Step3ItemImage';
import Step4ItemCategory from './steps/Step4ItemCategory';

import { IItemCreate } from "../../types/global"; 
import { createItem } from "../../api/route"; 
import "./ItemAdd.scss";
export const ItemAdd: FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [itemFormData, setItemFormData] = useState<IItemCreate>({} as IItemCreate);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const nextStep = async () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        } else {
            try {
                await createItem(itemFormData); 
                navigate('/single-product-page?modal=book');
            } catch (e) {
                console.error("Error creating item:", e);
                setError("There was an error creating the item.");
            }
        }
    };
        
    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

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

    return (
        <div className="item-add-container">
            <div className="step-form">
                {steps[currentStep - 1]}
            </div>
            <div className="step-navigation">
                {currentStep > 1 }
                {currentStep < steps.length }
                {currentStep === steps.length}
            </div>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};
