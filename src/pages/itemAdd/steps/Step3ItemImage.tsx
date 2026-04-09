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
    <div className="step-form-content">
      <ImageLabel upload={onImageUpload} />
      <div className="uploaded-images">
        {!!itemFormData.pictures?.length &&
          itemFormData.pictures.map((picture, index) => (
            <div key={index} className="relative inline-block">
              <ImageComponent
                src={picture.image_path}
                alt="Item"
              />
              <button
                type="button"
                onClick={() => {
                  if (picture.image_path.startsWith('blob:')) {
                    URL.revokeObjectURL(picture.image_path);
                  }
                  setItemFormData(prev => ({
                    ...prev,
                    pictures: prev.pictures?.filter((_, i) => i !== index),
                  }));
                }}
                className="absolute top-[0.4rem] right-[0.4rem] w-[2.4rem] h-[2.4rem] bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center border-2 border-white cursor-pointer"
                title="Remove image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          ))}
      </div>

      <Label title="Description" htmlFor="description">
        <Input
          type="textarea"
          placeholder="Enter a description..."
          id="description"
          value={itemFormData.description || ""}
          handleChange={handleDescriptionChange}
        />
      </Label>
      <span className="helper-text">Enter specific details about an item</span>
    </div>
  );
};

export default Step3ItemDetails;
