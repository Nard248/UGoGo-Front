import React, { useState, useEffect } from "react";
import { Card } from "../../../components/card/Card";
import { getCategories } from "../../../api/route";
import "./Steps.scss";
import { IOfferCreateForm } from "../../../types/global";

interface ICategory {
  id: number;
  name: string;
  icon_path: string;
}

interface Step2ItemCategoryProps {
  offerFormData: IOfferCreateForm;
  setOfferFormData: React.Dispatch<React.SetStateAction<IOfferCreateForm>>;
  errors: Record<string, boolean>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

const Step2ItemCategory: React.FC<Step2ItemCategoryProps> = ({
  offerFormData,
  setOfferFormData,
  errors,
  setErrors,
}) => {
  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data); 
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (id: number) => {
    setOfferFormData((prevData) => {
      const { value = [] } = prevData.category_ids || {}; 
      const isSelected = value.includes(id);
      const updated = isSelected
        ? value.filter((catId: number) => catId !== id) 
        : [...value, id];
  
      return {
        ...prevData,
        category_ids: {
          value: updated,
          errorMessage: prevData.category_ids?.errorMessage || "",
        },
      };
    });
  };
      
  const isSelected = (id: number) =>
    offerFormData.category_ids?.value?.includes(id);
  
  return (
    <div className="offer-step-category">
      <div className="offer-step-category__section">
        <div className="offer-step-category__header">Item preferred category</div>
        <div className="offer-step-category__content">
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
    </div>
  );
};

export default Step2ItemCategory;
