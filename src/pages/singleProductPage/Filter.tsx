import closeIcon from "./../../assets/icons/closeIcon.svg";
import "./Filter.scss";
import React, { FC, useEffect, useState } from "react";
import { Input } from "../../components/input/Input";
import { Label } from "../../components/label/Label";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import Checkbox from "@mui/material/Checkbox/Checkbox";
import { Button } from "../../components/button/Button";
import { getCategories } from "../../api/route";

interface IFilter {
  onClose?: () => void;
  onApply: (params: Record<string, any>) => void;
}

export const Filter: FC<IFilter> = ({ onClose, onApply }) => {
  const [departureAfter, setDepartureAfter] = useState<any>(null);
  const [arrivalBefore, setArrivalBefore] = useState<any>(null);
  const [weight, setWeight] = useState("");
  const [space, setSpace] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchCategories();
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleApply = () => {
    const params: Record<string, any> = {};
    if (departureAfter)
      params.departure_after = dayjs(departureAfter).toISOString();
    if (arrivalBefore)
      params.arrival_before = dayjs(arrivalBefore).toISOString();
    if (weight) params.weight = weight;
    if (space) params.space = space;
    if (selectedCategories.length) params.categories = selectedCategories;
    onApply(params);
    onClose && onClose();
  };

  const handleClear = () => {
    setDepartureAfter(null);
    setArrivalBefore(null);
    setWeight("");
    setSpace("");
    setSelectedCategories([]);
  };
  return (
    <div className="filter">
      <div className="filter__popup">
        <div className="filter__header">
          <div className="filter__headerContent">
            <button className="filter__headerClose" onClick={onClose}>
              <img src={closeIcon} alt="Close icon" />
            </button>
            <span>Filter</span>
          </div>
        </div>
        <div className="filter__content">
          <div className="flex flex-col md:flex-row justify-between gap-[2rem] md:gap-[4rem]">
            <div className="flex flex-col gap-[2rem] w-full md:w-1/2">
              <span>Departure date</span>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={departureAfter}
                  onChange={(newValue) => setDepartureAfter(newValue)}
                  slotProps={{ textField: { sx: { width: "100%" } } }}
                />
              </LocalizationProvider>
            </div>
            <div className="flex flex-col gap-[2rem] w-full md:w-1/2">
              <span>Arrival date</span>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={arrivalBefore}
                  onChange={(newValue) => setArrivalBefore(newValue)}
                  slotProps={{ textField: { sx: { width: "100%" } } }}
                />
              </LocalizationProvider>
            </div>
          </div>
          <div className="flex flex-col items-start gap-[1rem]">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex flex-row-reverse items-center gap-[.8rem]"
              >
                <Label
                  title={cat.name}
                  htmlFor={`category-${cat.id}`}
                  classnames={""}
                >
                  <Checkbox
                    id={`category-${cat.id}`}
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => {
                      setSelectedCategories((prev) =>
                        prev.includes(cat.id)
                          ? prev.filter((c) => c !== cat.id)
                          : [...prev, cat.id]
                      );
                    }}
                    sx={{
                      color: "#F9A34B",
                      padding: ".5rem",
                      "&.Mui-checked": {
                        color: "#F9A34B",
                      },
                    }}
                  />
                </Label>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row justify-between gap-[2rem] md:gap-[4rem]">
            <div className="flex flex-col gap-[2rem] w-full md:w-1/2">
              <span>Weight and dimensions</span>
              <div className="flex flex-col sm:flex-row gap-[1.6rem]">
                <Input
                  id={"wight"}
                  type={"text"}
                  classnames={"inputField"}
                  placeholder="Weight (kg)"
                  value={weight}
                  handleChange={(e) => setWeight(e.target.value)}
                />
                <Input
                  id={"dimension"}
                  type={"text"}
                  classnames={"inputField"}
                  placeholder="Space (m³)"
                  value={space}
                  handleChange={(e) => setSpace(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-[1.6rem] sm:gap-[2rem]">
            <Button
              title={"Clear"}
              type={"secondary"}
              handleClick={handleClear}
              classNames="w-full sm:w-auto"
            />
            <Button
              title={"Apply filter"}
              type={"primary"}
              handleClick={handleApply}
              classNames="w-full sm:w-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
