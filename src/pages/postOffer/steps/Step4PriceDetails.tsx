// import React from "react";
// import { IOfferCreateForm } from "../../../types/global";
// import { Label } from "../../../components/label/Label";
// import { Input } from "../../../components/input/Input";
// import "./Steps.scss";

// interface Props {
//   offerFormData: IOfferCreateForm;
//   setOfferFormData: React.Dispatch<React.SetStateAction<IOfferCreateForm>>;
//   errors: Record<string, boolean>;
//   setErrors: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
// }

// const Step4PriceDetails: React.FC<Props> = ({
//   offerFormData,
//   setOfferFormData,
//   errors,
// }) => {
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { id, value } = e.target;
//     setOfferFormData((prev) => ({      
//       ...prev,
//       [id]: { value, errorMessage: null }, 
//     }));
//   };
  

//   const pMin = 25 + offerFormData.available_weight.value * 2;
//   const pMax = Math.round(pMin * 1.5 * 100) / 100; // round to 2 decimals

//   return (
//     <div className="step-price-details">
//   <div className="step-title">Item details</div>

//   <div className="step-body">
//     <Label title="Price ($)" htmlFor="price">
//       <Input
//         id="price"
//         type="number"
//         // placeholder="20"
//           placeholder={`$${pMin.toFixed(2)} – $${pMax.toFixed(2)}`}

//         value={offerFormData.price?.value || ""}
//         handleChange={handleChange}
//         classnames={errors.price ? "error" : ""}
//       />
//     </Label>
      

//     <Label title="Item Description" htmlFor="description">
//       <Input
//         id="description"
//         type="textarea"
//         placeholder="Describe the item..."
//         value={offerFormData.description?.value || ""}
//         handleChange={handleChange}
//       />
//     </Label>
//   </div>
// </div>

//   );
// };

// export default Step4PriceDetails;

import React from "react";
import { IOfferCreateForm } from "../../../types/global";
import { Label } from "../../../components/label/Label";
import { Input } from "../../../components/input/Input";
import "./Steps.scss";

interface Props {
  offerFormData: IOfferCreateForm;
  setOfferFormData: React.Dispatch<React.SetStateAction<IOfferCreateForm>>;
  errors: Record<string, boolean>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

const Step4PriceDetails: React.FC<Props> = ({
  offerFormData,
  setOfferFormData,
  errors,
}) => {
  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    // Assuming price is stored as { value, errorMessage }
    setOfferFormData((prev) => ({
      ...prev,
      [id]: { value, errorMessage: null },
    }));
  };

const handleDescriptionChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { value } = e.target;
  setOfferFormData((prev) => ({
    ...prev,
    description: { value, errorMessage: null },
  }));
};

  const pMin = 25 + (Number(offerFormData.available_weight?.value) || 0) * 2;
  const pMax = Math.round(pMin * 1.5 * 100) / 100; // round to 2 decimals

  return (
    <div className="step-price-details">
      <div className="step-title">Item details</div>

      <div className="step-body">
        <Label title="Price ($)" htmlFor="price">
          <Input
            id="price"
            type="number"
            placeholder={`$${pMin.toFixed(2)} – $${pMax.toFixed(2)}`}
            value={offerFormData.price?.value || ""}
            handleChange={handlePriceChange}
            classnames={errors.price ? "error" : ""}
          />
        </Label>

        <Label title="Item Description" htmlFor="description">
         <Input
  id="description"
  type="textarea"
  placeholder="Describe the item..."
  value={offerFormData.description?.value || ""}
  handleChange={handleDescriptionChange}
  classnames={errors.description ? "error" : ""}
/>

        </Label>
      </div>
    </div>
  );
};

export default Step4PriceDetails;
