import { IItemCreate } from "../../../types/global";
import { ImageLabel } from "../../../components/image/ImageLabel";
import { ImageComponent } from "../../../components/image/Image";
import { Card } from "../../../components/card/Card";
import { Label } from "../../../components/label/Label";
import { Input } from "../../../components/input/Input";
import "./StepItemDetails.scss";
import { getCategories } from "../../../api/route"; 
import React, { useState, useEffect } from "react";

interface ICategory {
  id: number;
  name: string;
  icon_path: string;
}

const Step3ItemDetails = ({
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

  // const onImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files) {
  //     const files = Array.from(event.target.files);
  //     setItemFormData((prevData) => ({
  //       ...prevData,
  //       pictures: [
  //         ...(prevData.pictures || []),
  //         ...files.map((file) => ({
  //           image_path: URL.createObjectURL(file),
  //         })),
  //       ],
  //     }));
  //   }
  // };
const onImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files) {
    const files = Array.from(event.target.files);
    setItemFormData(prev => ({
      ...prev,
      pictures: [
        ...(prev.pictures || []),
        ...files.map(file => ({
          file, // store the actual file object here
          image_path: URL.createObjectURL(file), // for preview only
        })),
      ],
    }));
  }
};


  const handleCategoryClick = (id: number) => {
    setItemFormData((prevData) => ({
      ...prevData,
      category_ids: prevData.category_ids?.includes(id)
        ? prevData.category_ids.filter((catId) => catId !== id)
        : [...(prevData.category_ids || []), id],
    }));
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setItemFormData((prevData) => ({
      ...prevData,
      description: event.target.value,
    }));
  };

  const isSelected = (id: number) => itemFormData.category_ids?.includes(id);

  const canProceed = () => {
    return (itemFormData.pictures?.length ?? 0) > 0;
  };

  const handleNext = () => {
    if (canProceed()) {
      nextStep();
    }
  };

  return (
    <div className="step-item-details">
      <div className="section">
        <div className="section-header">Item image</div>
        <div className="section-content">
          <ImageLabel upload={onImageUpload} />
          <div className="uploaded-images">
            {!!itemFormData.pictures?.length &&
              itemFormData.pictures.map((picture, index) => (
                <ImageComponent
                  key={index}
                  src={picture.image_path}
                  alt="Item"
                />
              ))}
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">Item description</div>
        <div className="section-content">
          <Label title="Description" htmlFor="description">
            <Input
              type="textarea"
              placeholder="Enter a description..."
              id="description"
              value={itemFormData.description || ""}
              handleChange={handleDescriptionChange}
            />
          </Label>
          <span>Enter specific details about an item</span>
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

export default Step3ItemDetails;
