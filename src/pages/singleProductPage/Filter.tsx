import { Slider } from '@mui/material';
import closeIcon from './../../assets/icons/closeIcon.svg';
import './Filter.scss'
import React, {FC, useState} from "react";
import {Input} from "../../components/input/Input";
import {Label} from "../../components/label/Label";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker, DateTimePicker, LocalizationProvider, TimePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import Checkbox from "@mui/material/Checkbox/Checkbox";
import { Button } from '../../components/button/Button';

interface IFilter {
    onClose?: () => void
}

export const Filter: FC<IFilter> = ({onClose}) => {
    const [value, setValue] = useState<number[]>([20, 37]);

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
                                getAriaLabel={() => 'Temperature range'}
                                value={value}
                                // onChange={handleChange}
                                valueLabelDisplay="auto"
                                // getAriaValueText={valuetext}
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
                                            // errorMessage={loginForm.email.errorMessage}
                                            handleChange={() => {
                                            }}
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
                                            // errorMessage={loginForm.email.errorMessage}
                                            handleChange={() => {
                                            }}
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
                            <div className="flex gap-[1.6rem]">
                                <div className="">
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker label="Basic date picker"/>
                                    </LocalizationProvider>
                                </div>
                                <div className="w-2/6">
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <TimePicker label="Basic time picker"/>
                                    </LocalizationProvider>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-[2rem] w-3/6">
                            <span>
                                Arrival date & time
                            </span>
                            <div className="flex gap-[1.6rem]">
                                <div className="">
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker label="Basic date picker"/>
                                    </LocalizationProvider>
                                </div>
                                <div className="w-2/6">
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <TimePicker label="Basic time picker"/>
                                    </LocalizationProvider>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-start gap-[1rem]">
                        <div className="flex flex-row-reverse items-center gap-[.8rem]">
                            <Label title={'Personal items'} htmlFor={'personalItems'}
                                   classnames={''}>
                                <Checkbox id={'personalItems'}
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
                        <div className="flex flex-row-reverse items-center gap-[.8rem]">
                            <Label title={'Packaged Food'} htmlFor={'packagedFood'}
                                   classnames={''}>
                                <Checkbox id={'packagedFood'}
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
                        <div className="flex flex-row-reverse items-center gap-[.8rem]">
                            <Label title={'Lightweight'} htmlFor={'lightweight'}
                                   classnames={''}>
                                <Checkbox
                                    id={'lightweight'}
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
                        <div className="flex flex-row-reverse items-center gap-[.8rem]">
                            <Label title={'Household items'} htmlFor={'householdItems'}
                                   classnames={''}>
                                <Checkbox
                                    id={'householdItems'}
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
                        <div className="flex flex-row-reverse items-center gap-[.8rem]">
                            <Label title={'Electronic Accessories'} htmlFor={'electronicAccessories'}
                                   classnames={''}>
                                <Checkbox
                                    id={'electronicAccessories'}
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
                                    // errorMessage={loginForm.email.errorMessage}
                                    handleChange={() => {
                                    }}
                                />
                                <Input
                                    id={'dimension'}
                                    type={'text'}
                                    classnames={'inputField'}
                                    // errorMessage={loginForm.email.errorMessage}
                                    handleChange={() => {
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <Button title={'Clear'} type={'secondary'} handleClick={() => {
                        }}/>
                        <Button title={'Apply filter'} type={'primary'} handleClick={() => {
                        }}/>
                    </div>
                </div>
            </div>
        </div>
    )
}