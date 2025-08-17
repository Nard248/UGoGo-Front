import React from 'react';
import './StepInfo.scss';

interface StepInfoProps {
  currentStep: number;
  totalSteps: number;
}

interface StepData {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  tips: string[];
}

export const StepInfo: React.FC<StepInfoProps> = ({ currentStep, totalSteps }) => {
  const stepsData: Record<number, StepData> = {
    1: {
      title: "Item Details",
      subtitle: "Describe what you're sending",
      description: "Provide accurate details about your item including dimensions, weight, and whether it's fragile. This helps travelers understand what they'll be carrying.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 6H16V4C16 2.89 15.11 2 14 2H10C8.89 2 8 2.89 8 4V6H4C3.45 6 3 6.45 3 7S3.45 8 4 8H5V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V8H20C20.55 8 21 7.55 21 7S20.55 6 20 6ZM10 4H14V6H10V4ZM17 19H7V8H17V19Z" fill="#73B2B2"/>
          <path d="M12 10C11.45 10 11 10.45 11 11V17C11 17.55 11.45 18 12 18C12.55 18 13 17.55 13 17V11C13 10.45 12.55 10 12 10Z" fill="#73B2B2"/>
          <path d="M9 10C8.45 10 8 10.45 8 11V17C8 17.55 8.45 18 9 18C9.55 18 10 17.55 10 17V11C10 10.45 9.55 10 9 10Z" fill="#73B2B2"/>
          <path d="M15 10C14.45 10 14 10.45 14 11V17C14 17.55 14.45 18 15 18C15.55 18 16 17.55 16 17V11C16 10.45 15.55 10 15 10Z" fill="#73B2B2"/>
        </svg>
      ),
      tips: [
        "Measure dimensions accurately (Height x Width x Length)",
        "Weigh your item if possible for accuracy",
        "Mark as fragile if it needs special handling",
        "Include a clear description of the item"
      ]
    },
    2: {
      title: "Pickup Person",
      subtitle: "Who will collect the item?",
      description: "Provide contact details of the person who will hand over the item to the traveler. This ensures smooth coordination at the departure location.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 12C14.21 12 16 10.21 16 8S14.21 4 12 4 8 5.79 8 8 9.79 12 12 12ZM12 6C13.1 6 14 6.9 14 8S13.1 10 12 10 10 9.1 10 8 10.9 6 12 6Z" fill="#73B2B2"/>
          <path d="M12 13C9.33 13 4 14.34 4 17V20H20V17C20 14.34 14.67 13 12 13ZM18 18H6V17C6 16.23 9.13 15 12 15S18 16.23 18 17V18Z" fill="#73B2B2"/>
          <path d="M21 10H19V7H17V10H14V12H17V15H19V12H21V10Z" fill="#73B2B2"/>
        </svg>
      ),
      tips: [
        "Double-check phone number for accuracy",
        "Include country code for international numbers",
        "Verify email address is correct",
        "Inform the pickup person about the arrangement"
      ]
    },
    3: {
      title: "Item Images",
      subtitle: "Show what you're sending",
      description: "Upload clear photos of your item from different angles. This helps travelers see exactly what they'll be carrying and builds trust.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z" fill="#73B2B2"/>
          <path d="M11.5 13.5L8.5 17L6 14L3 18H21L15 9L11.5 13.5Z" fill="#73B2B2"/>
          <circle cx="8" cy="8.5" r="1.5" fill="#73B2B2"/>
        </svg>
      ),
      tips: [
        "Take photos in good lighting",
        "Show the item from multiple angles",
        "Include packaging if already packed",
        "Show any special features or fragile parts"
      ]
    },
    4: {
      title: "Categories",
      subtitle: "Classify your item",
      description: "Select the categories that best describe your item. This helps travelers find items they're comfortable carrying and ensures proper handling.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7V11C2 16.55 5.84 21.74 11 23C16.16 21.74 20 16.55 20 11V7L12 2ZM12 4.18L18 7.13V11.28C18 15.53 15.41 19.44 12 20.49C8.59 19.44 6 15.53 6 11.28V7.13L12 4.18Z" fill="#73B2B2"/>
          <path d="M7 11L10 14L17 7L15.59 5.59L10 11.17L8.41 9.59L7 11Z" fill="#73B2B2"/>
        </svg>
      ),
      tips: [
        "Select all relevant categories",
        "Consider airline restrictions",
        "Be honest about item contents",
        "Choose specific categories when possible"
      ]
    }
  };

  const currentStepData = stepsData[currentStep];

  return (
    <div className="step-info">
      <div className="step-info__progress">
        <div className="step-info__progress-bar">
          <div 
            className="step-info__progress-fill" 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <span className="step-info__progress-text">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      <div className="step-info__content">
        <div className="step-info__icon">
          {currentStepData.icon}
        </div>
        
        <h2 className="step-info__title">{currentStepData.title}</h2>
        <p className="step-info__subtitle">{currentStepData.subtitle}</p>
        <p className="step-info__description">{currentStepData.description}</p>

        <div className="step-info__tips">
          <h3>💡 Tips</h3>
          <ul>
            {currentStepData.tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="step-info__steps">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div 
            key={index} 
            className={`step-info__step ${
              index + 1 === currentStep ? 'active' : ''
            } ${index + 1 < currentStep ? 'completed' : ''}`}
          >
            <div className="step-info__step-number">
              {index + 1 < currentStep ? '✓' : index + 1}
            </div>
            <span className="step-info__step-label">
              {stepsData[index + 1]?.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};