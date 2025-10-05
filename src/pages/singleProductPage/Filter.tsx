import { Slider } from "@mui/material";
import closeIcon from "./../../assets/icons/closeIcon.svg";
import "./Filter.scss";
import React, { FC, useEffect, useState } from "react";
import { Input } from "../../components/input/Input";
import { Label } from "../../components/label/Label";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import Checkbox from "@mui/material/Checkbox/Checkbox";
import { Button } from "../../components/button/Button";
import { getCategories } from "../../api/route";

interface IFilter {
  onClose?: () => void;
  onApply: (params: Record<string, any>) => void;
}

export const Filter: FC<IFilter> = ({ onClose, onApply }) => {
  const [value, setValue] = useState<number[]>([0, 100]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
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

  const handleSliderChange = (_: any, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setValue(newValue);
      setMinPrice(String(newValue[0]));
      setMaxPrice(String(newValue[1]));
    }
  };

  const handleApply = () => {
    const params: Record<string, any> = {};
    if (minPrice) params.min_price = minPrice;
    if (maxPrice) params.max_price = maxPrice;
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
    setValue([0, 100]);
    setMinPrice("");
    setMaxPrice("");
    setDepartureAfter(null);
    setArrivalBefore(null);
    setWeight("");
    setSpace("");
    setSelectedCategories([]);
  };
  const handleMinPriceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newMin = Number(e.target.value) || 0;
    setMinPrice(e.target.value);
    setValue([newMin, value[1]]);
  };

  const handleMaxPriceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newMax = Number(e.target.value) || 0;
    setMaxPrice(e.target.value);
    setValue([value[0], newMax]);
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
          <div className="flex flex-col gap-[1rem]">
            <span>Price range</span>
            <span>Price before fees</span>
            <div className="flex flex-col gap-[2rem] w-full md:w-3/6">
              <Slider
                getAriaLabel={() => "Price range"}
                value={value}
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
                sx={{
                  color: "#F9A34B",
                  "&.Mui-checked": {
                    color: "#F9A34B",
                  },
                }}
              />
              <div className="flex flex-col sm:flex-row gap-[1.6rem] sm:gap-[4rem]">
                <div className="w-full sm:w-auto">
                  <Label title={"Minimum"} htmlFor={"minimum"} classnames={""}>
                    <Input
                      id={"minimum"}
                      type={"text"}
                      classnames={"inputField"}
                      value={minPrice}
                      handleChange={handleMinPriceChange}
                    />
                  </Label>
                </div>
                <div className="w-full sm:w-auto">
                  <Label title={"Maximum"} htmlFor={"maximum"} classnames={""}>
                    <Input
                      id={"maximum"}
                      type={"text"}
                      classnames={"inputField"}
                      value={maxPrice}
                      handleChange={handleMaxPriceChange}
                    />
                  </Label>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between gap-[2rem] md:gap-[4rem]">
            <div className="flex flex-col gap-[2rem] w-full md:w-1/2">
              <span>Departure date & time</span>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  value={departureAfter}
                  onChange={(newValue) => setDepartureAfter(newValue)}
                  slotProps={{ textField: { sx: { width: "100%" } } }}
                />
              </LocalizationProvider>
            </div>
            <div className="flex flex-col gap-[2rem] w-full md:w-1/2">
              <span>Arrival date & time</span>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
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
