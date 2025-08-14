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
      title: "Flight Details",
      subtitle: "Tell us about your journey",
      description: "Share your flight information so senders can see when and where you're traveling. This helps them understand if your route matches their shipping needs.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2S10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="#73B2B2"/>
        </svg>
      ),
      tips: [
        "Use your actual flight number for accuracy",
        "Double-check departure and arrival times",
        "Select the correct airports from the dropdown"
      ]
    },
    2: {
      title: "Item Categories",
      subtitle: "What can you carry?",
      description: "Choose the types of items you're comfortable transporting. This helps match you with the right senders and ensures you only carry items you're okay with.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z" fill="#73B2B2"/>
          <path d="M9 8V17H11V8H9ZM13 8V17H15V8H13Z" fill="#73B2B2"/>
        </svg>
      ),
      tips: [
        "Select categories you're comfortable with",
        "Consider airline restrictions for certain items",
        "You can choose multiple categories"
      ]
    },
    3: {
      title: "Space & Weight",
      subtitle: "Define your available capacity",
      description: "Let senders know how much space and weight you have available in your luggage. Be realistic about your limits to ensure a smooth experience.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6H16C16 3.79 14.21 2 12 2S8 3.79 8 6H6C4.9 6 4 6.9 4 8V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8C20 6.9 19.1 6 18 6ZM10 6C10 4.9 10.9 4 12 4S14 4.9 14 6H10ZM18 20H6V8H8V10C8 10.55 8.45 11 9 11S10 10.55 10 10V8H14V10C14 10.55 14.45 11 15 11S16 10.55 16 10V8H18V20Z" fill="#73B2B2"/>
          <path d="M12 12C13.1 12 14 12.9 14 14V16C14 17.1 13.1 18 12 18C10.9 18 10 17.1 10 16V14C10 12.9 10.9 12 12 12Z" fill="#73B2B2"/>
        </svg>
      ),
      tips: [
        "Measure dimensions carefully (H x W x L)",
        "Consider fragile items need extra space",
        "Leave some buffer for your own items"
      ]
    },
    4: {
      title: "Pricing",
      subtitle: "Set your delivery fee",
      description: "Set a fair price for your delivery service. Consider the distance, item type, and your effort. Competitive pricing helps you get more requests.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22S22 17.52 22 12S17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12S7.59 4 12 4S20 7.59 20 12S16.41 20 12 20Z" fill="#73B2B2"/>
          <path d="M12.5 6H11V8.5H9V10H11V15H12.5V10H15V8.5H12.5V6Z" fill="#73B2B2"/>
          <path d="M11 16H12.5V17.5H11V16Z" fill="#73B2B2"/>
        </svg>
      ),
      tips: [
        "Research similar routes for competitive pricing",
        "Consider item fragility in your pricing",
        "Higher ratings allow for premium pricing"
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