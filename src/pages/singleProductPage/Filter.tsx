import { Slider } from '@mui/material';
import closeIcon from './../../assets/icons/closeIcon.svg';
import './Filter.scss'
import React, {FC, useEffect, useState} from "react";
import {Input} from "../../components/input/Input";
import {Label} from "../../components/label/Label";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import Checkbox from "@mui/material/Checkbox/Checkbox";
import { Button } from '../../components/button/Button';
import { getCategories } from '../../api/route';

interface IFilter {
    onClose?: () => void,
    onApply: (params: Record<string, any>) => void
}

export const Filter: FC<IFilter> = ({onClose, onApply}) => {
    const [value, setValue] = useState<number[]>([0, 100]);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [departureAfter, setDepartureAfter] = useState<any>(null);
    const [arrivalBefore, setArrivalBefore] = useState<any>(null);
    const [weight, setWeight] = useState('');
    const [space, setSpace] = useState('');
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
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
            document.body.style.overflow = '';
        }
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
        if (departureAfter) params.departure_after = dayjs(departureAfter).toISOString();
        if (arrivalBefore) params.arrival_before = dayjs(arrivalBefore).toISOString();
        if (weight) params.weight = weight;
        if (space) params.space = space;
        if (selectedCategories.length) params.categories = selectedCategories;
        onApply(params);
        onClose && onClose();
    };

    const handleClear = () => {
        setValue([0, 100]);
        setMinPrice('');
        setMaxPrice('');
        setDepartureAfter(null);
        setArrivalBefore(null);
        setWeight('');
        setSpace('');
        setSelectedCategories([]);
    };

    return (
        <div className="filter">
            <div className="filter__popup">
                <div className="filter__header">
                    <div className="filter__headerContent">
                        <button className="filter__headerClose" onClick={onClose}>
                            <img src={closeIcon} alt="Close icon"/>
                        </button>
                        <span>
                            Filter
                        </span>
                    </div>
                </div>
                <div className="filter__content ">
                    <div className="flex flex-col gap-[1rem]">
                        <span>
                            Price range
                        </span>
                        <span>
                            Price before fees
                        </span>
                        <div className="flex flex-col gap-[2rem] w-3/6">
                            <Slider
                                getAriaLabel={() => 'Price range'}
                                value={value}
                                onChange={handleSliderChange}
                                valueLabelDisplay="auto"
                                sx={{
                                    color: '#F9A34B',
                                    '&.Mui-checked': {
                                        color: '#F9A34B',
                                    },
                                }}
                            />
                            <div className="flex gap-[17.8rem]">
                                <div>
                                    <Label title={'Minimum'} htmlFor={'minimum'}
                                           classnames={''}>
                                        <Input
                                            id={'minimum'}
                                            type={'text'}
                                            classnames={'inputField'}
                                            value={minPrice}
                                            handleChange={e => setMinPrice(e.target.value)}
                                            />
                                    </Label>
                                </div>
                                <div>
                                    <Label title={'Maximum'} htmlFor={'maximum'}
                                           classnames={''}>
                                        <Input
                                            id={'maximum'}
                                            type={'text'}
                                            classnames={'inputField'}
                                            value={maxPrice}
                                            handleChange={e => setMaxPrice(e.target.value)}
                                            />
                                    </Label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between gap-[10rem]">
                        <div className="flex flex-col gap-[2rem] w-3/6">
                            <span>
                                Departure date & time
                            </span>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    value={departureAfter}
                                    onChange={(newValue) => setDepartureAfter(newValue)}
                                    slotProps={{ textField: { sx: { width: '100%' } } }}
                                />
                            </LocalizationProvider>
                        </div>
                        <div className="flex flex-col gap-[2rem] w-3/6">
                            <span>
                                Arrival date & time
                            </span>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    value={arrivalBefore}
                                    onChange={(newValue) => setArrivalBefore(newValue)}
                                    slotProps={{ textField: { sx: { width: '100%' } } }}
                                />
                            </LocalizationProvider>
                        </div>
                    </div>
                    <div className="flex flex-col items-start gap-[1rem]">
                        {categories.map(cat => (
                            <div key={cat.id} className="flex flex-row-reverse items-center gap-[.8rem]">
                                <Label title={cat.name} htmlFor={`category-${cat.id}`} classnames={''}>
                                    <Checkbox
                                        id={`category-${cat.id}`}
                                        checked={selectedCategories.includes(cat.id)}
                                        onChange={() => {
                                            setSelectedCategories(prev => prev.includes(cat.id) ? prev.filter(c => c !== cat.id) : [...prev, cat.id]);
                                        }}
                                        sx={{
                                            color: '#F9A34B',
                                            padding: '.5rem',
                                            '&.Mui-checked': {
                                                color: '#F9A34B',
                                            },
                                        }}
                                    />
                                </Label>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between gap-[10rem]">
                        <div className="flex flex-col gap-[2rem] w-3/6">
                            <span>
                                Weight and dimensions
                            </span>
                            <div className="flex gap-[1.6rem]">
                                <Input
                                    id={'wight'}
                                    type={'text'}
                                    classnames={'inputField'}
                                    value={weight}
                                    handleChange={e => setWeight(e.target.value)}
                                />
                                <Input
                                    id={'dimension'}
                                    type={'text'}
                                    classnames={'inputField'}
                                    value={space}
                                    handleChange={e => setSpace(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <Button title={'Clear'} type={'secondary'} handleClick={handleClear}/>
                        <Button title={'Apply filter'} type={'primary'} handleClick={handleApply}/>
                    </div>
                </div>
            </div>
        </div>
    )
}