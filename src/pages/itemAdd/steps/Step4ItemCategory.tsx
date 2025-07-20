import React, { useState, useEffect } from "react";
import { IItemCreate } from "../../../types/global";
import { Card } from "../../../components/card/Card";
import { getCategories } from "../../../api/route"; 
import "./StepItemDetails.scss";

interface ICategory {
  id: number;
  name: string;
  icon_path: string;
}

const Step4ItemCategory = ({
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
  const [categories, setCategories] = useState<ICategory[]>([]);


  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data); 
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryClick = (id: number) => {
    setItemFormData((prevData) => ({
      ...prevData,
      category_ids: prevData.category_ids?.includes(id)
        ? prevData.category_ids.filter((catId) => catId !== id)
        : [...(prevData.category_ids || []), id],
    }));
  };

  const isSelected = (id: number) => itemFormData.category_ids?.includes(id);

  const canProceed = () => (itemFormData.category_ids ?? []).length > 0;

  const handleNext = () => {
    if (canProceed()) {
      nextStep();
    }
  };

  return (
    <div className="step-item-category">
      <div className="section">
        <div className="section-header">Item preferred category</div>
        <div className="section-content">
          {categories.map(({ id, name, icon_path }) => (
            <Card
              key={id}
              id={id}
              title={name}
              iconSrc={icon_path}
              iconName={name}
              selected={isSelected(id)}
              handleCardClick={() => handleCategoryClick(id)}
            />
          ))}
        </div>
      </div>
      <div className="button-group">
        <button onClick={prevStep} className="button button-secondary">
          Back
        </button>
        <button
          onClick={handleNext}
          className={`button button-primary ${!canProceed() ? "disabled" : ""}`}
          disabled={!canProceed()}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step4ItemCategory;
