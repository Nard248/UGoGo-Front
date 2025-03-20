import avatar from "../../assets/images/avatar.svg";
import pencil from "../../assets/icons/pencil.svg";
import React from "react";
import {Label} from "../../components/label/Label";
import {Input} from "../../components/input/Input";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {Select} from "../../components/select/Select";
import {Button} from "../../components/button/Button";
import {FormControl, RadioGroup, FormLabel, Radio } from "@mui/material";
import {FormControlLabel} from "@mui/material";
import Checkbox from "@mui/material/Checkbox/Checkbox";

export const Transaction = () => {
    return (
        <div className="flex flex-col gap-[4rem] w-full">
            <div className="profile">
                <div className="profile__avatar">
                    <div className="profile__avatar__image">
                        <img src={avatar} alt="Avatar" className="profile__avatar__image"/>
                    </div>
                    <div className="profile__avatar__details">
                        <div className="profile__avatar__details__name">
                            John Doe
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-[.3rem] cursor-pointer">
                    <div className="flex">
                        <img src={pencil} alt="Message"/>
                    </div>
                    <button className="bg-transparent border-none underline text-[1.6rem]">Edit</button>
                </div>
            </div>
            <div className="flex flex-col gap-[2.7rem]">
                <h2 className="font-medium text-[2rem]">
                    Add your personal data
                </h2>
                <div className="flex items-center gap-[5rem]">
                    <div className="flex flex-col border border-solid border-[#D5D7DA] rounded-xl w-[30%]">
                        <div
                            className="flex items-center justify-between bg-[#FFF1E7] py-[2.1rem] px-[2.4rem] rounded-t-xl border-b border-solid border-[#D5D7DA]">
                            <h3 className="text-[1.6rem]">
                                Address information
                            </h3>
                            <div className="flex items-center gap-[.3rem] cursor-pointer">
                                <div className="flex">
                                    <img src={pencil} alt="Message"/>
                                </div>
                                <button className="bg-transparent border-none underline text-[1.6rem]">
                                    Edit
                                </button>
                            </div>
                        </div>
                        <div
                            className="flex flex-col gap-[1.2rem] py-[4.5rem] px-[1.8rem]">
                            <Label title={'Country'} htmlFor={'country'}
                                   classnames={'label'}>
                                <Input type={'text'} placeholder={'Armenia'} id={'country'}
                                       classnames={'inputField'}
                                       handleChange={() => {
                                       }}
                                />
                            </Label>
                            <Label title={'State'} htmlFor={'state'}
                                   classnames={'label'}>
                                <Input type={'text'} placeholder={'Yerevan'} id={'state'}
                                       classnames={'inputField'}
                                       handleChange={() => {
                                       }}
                                />
                            </Label>
                            <Label title={'City'} htmlFor={'city'}
                                   classnames={'label'}>
                                <Input type={'text'} placeholder={'Yerevan'} id={'city'}
                                       classnames={'inputField'}
                                       handleChange={() => {
                                       }}
                                />
                            </Label>
                            <Label title={'Postal code'} htmlFor={'postalCode'}
                                   classnames={'label'}>
                                <Input type={'text'} placeholder={'0000'} id={'postalCode'}
                                       classnames={'inputField'}
                                       handleChange={() => {
                                       }}
                                />
                            </Label>
                        </div>
                    </div>
                    <div className="flex flex-col items-end w-[70%] gap-[5.7rem]">
                        <div className="flex flex-col w-full border border-solid border-[#D5D7DA] rounded-xl">
                            <div
                                className="flex items-center justify-between bg-[#FFF1E7] py-[2.1rem] px-[2.4rem] rounded-t-xl border-b border-solid border-[#D5D7DA]">
                                <h3 className="text-[1.6rem]">
                                    Personal information
                                </h3>
                                <div className="flex items-center gap-[.3rem] cursor-pointer">
                                    <div className="flex">
                                        <img src={pencil} alt="Message"/>
                                    </div>
                                    <button className="bg-transparent border-none underline text-[1.6rem]">
                                        Edit
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="flex flex-col gap-[1.2rem] py-[4.5rem] px-[1.8rem] w-3/6">
                                    <Label title={'Name'} htmlFor={'name'}
                                           classnames={'label'}>
                                        <Input type={'text'} placeholder={'Name'} id={'name'}
                                               classnames={'inputField'}
                                               handleChange={() => {
                                               }}
                                        />
                                    </Label>
                                    <Label title={'Surname'} htmlFor={'surname'}
                                           classnames={'label'}>
                                        <Input type={'text'} placeholder={'Surname'} id={'surname'}
                                               classnames={'inputField'}
                                               handleChange={() => {
                                               }}
                                        />
                                    </Label>
                                    <Label title={'Phone Number'} htmlFor={'phoneNumber'}
                                           classnames={'label'}>
                                        <Input type={'text'} placeholder={'Phone Number'} id={'phoneNumber'}
                                               classnames={'inputField'}
                                               handleChange={() => {
                                               }}
                                        />
                                    </Label>
                                </div>
                                <div className="flex flex-col gap-[1.2rem] py-[4.5rem] px-[1.8rem] w-3/6">
                                    <Label title={'Email'} htmlFor={'email'}
                                           classnames={'label'}>
                                        <Input type={'text'} placeholder={'Email'} id={'email'}
                                               classnames={'inputField'}
                                               handleChange={() => {
                                               }}
                                        />
                                    </Label>
                                    <Label title={'Birthdate'} htmlFor={'birthdate'}
                                           classnames={'label'}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker label="12/12/12"/>
                                        </LocalizationProvider>
                                    </Label>
                                    <Label title={'Gender'} htmlFor={'gender'}
                                           classnames={'label'}>
                                        <Select options={[{}]} id={'gender'} placeholder={'Gender'}
                                                classnames={'cursor-pointer'}
                                                handleSelectChange={(event) => {
                                                }}
                                        />
                                    </Label>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between w-3/6">
                            <Button type={'secondary'} title={'Cancel'} handleClick={() => {}}></Button>
                            <Button type={'primary'} title={'Confirm'} handleClick={() => {}}></Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-[2.7rem]">
                <h2 className="font-medium text-[2rem]">
                    Add your payment data
                </h2>
                <div className="flex flex-col gap-[3.2rem]"></div>
                <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="female"
                        name="radio-buttons-group"
                    >
                        <FormControlLabel value="creditDebitCard" control={<Radio sx={{
                            color: '#F9A34B',
                            padding: '.5rem',
                            '&.Mui-checked': {
                                color: '#F9A34B',
                            },
                        }} />} label="Credit or Debit card" />
                    </RadioGroup>
                </FormControl>
                <div className="flex flex-col">
                    <Label title={'Card number'} htmlFor={'cardNumber'}
                           classnames={''}>
                        <Input
                            id={'cardNumber'}
                            type={'text'}
                            icon={'mastercard'}
                            classnames={''}
                            handleChange={() => {
                            }}
                        />
                    </Label>
                </div>
                <div className="flex flex-col">
                    <Label title={'Cardholder name'} htmlFor={'cardholderName'}
                           classnames={''}>
                        <Input
                            id={'cardholderName'}
                            type={'text'}
                            classnames={'inputField'}
                            handleChange={() => {
                            }}
                        />
                    </Label>
                </div>
                <div className="flex flex-col">
                    <div className="flex flex-col">
                        <div className="flex items-center">
                            <div className="flex flex-col">
                                <Label title={'Cardholder name'} htmlFor={'cardholderName'}
                                       classnames={''}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker label="Basic date picker"/>
                                    </LocalizationProvider>
                                </Label>
                            </div>
                            <div className="flex flex-col">
                                <Label title={'CVV'} htmlFor={'cvv'}
                                       classnames={''}>
                                    <Input
                                        id={'cvv'}
                                        type={'text'}
                                        classnames={'inputField'}
                                        handleChange={() => {
                                        }}
                                    />
                                </Label>
                            </div>
                        </div>
                        <div className="flex">
                            <Checkbox defaultChecked
                                      sx={{
                                          color: '#F9A34B',
                                          padding: '.5rem',
                                          '&.Mui-checked': {
                                              color: '#F9A34B',
                                          },
                                      }}
                            />
                        </div>
                    </div>
                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="female"
                            name="radio-buttons-group"
                        >
                            <FormControlLabel value="paypal" control={<Radio sx={{
                                color: '#F9A34B',
                                padding: '.5rem',
                                '&.Mui-checked': {
                                    color: '#F9A34B',
                                },
                            }}/>} label="Paypal"/>
                        </RadioGroup>
                    </FormControl>
                </div>

            </div>
        </div>
    )
}