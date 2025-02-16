import avatar from "../../assets/images/avatar.svg";
import pencil from "../../assets/icons/pencil.svg";
import './AddProfileInfo.scss';
import {Divider} from "../../components/divider/Divider";
import {Input} from "../../components/input/Input";
import {Label} from "../../components/label/Label";
import React from "react";
import {Button} from "../../components/button/Button";

export const AddProfileInfo = () => {
    return (
        <div className="w-full flex flex-col gap-[4rem]">
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
                <h3 className="text-[2rem]">
                    Add your personal data
                </h3>
                <div className="flex gap-[5rem]">
                    <div className="flex flex-col border border-solid border-[#D5D7DA] rounded-xl w-3/6">
                        <div className="flex items-center justify-between bg-[#FFF1E7] py-[2.1rem] px-[2.4rem] rounded-t-xl">
                            <h3 className="text-[1.6rem]">
                                Price Details
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
                            className="flex flex-col gap-[1.2rem] py-[4.5rem] px-[1.8rem] border-t border-solid border-[#D5D7DA]">
                            <Label title={'Country'} htmlFor={'country'}
                                   classnames={'label'}>
                                <Input type={'text'} placeholder={'Armenia'} id={'country'}
                                       classnames={'inputField'}
                                       handleChange={() => {}}
                                />
                            </Label>
                            <Label title={'State'} htmlFor={'state'}
                                   classnames={'label'}>
                                <Input type={'text'} placeholder={'Yerevan'} id={'state'}
                                       classnames={'inputField'}
                                       handleChange={() => {}}
                                />
                            </Label>
                            <Label title={'City'} htmlFor={'city'}
                                   classnames={'label'}>
                                <Input type={'text'} placeholder={'Yerevan'} id={'city'}
                                       classnames={'inputField'}
                                       handleChange={() => {}}
                                />
                            </Label>
                            <Label title={'Postal code'} htmlFor={'postalCode'}
                                   classnames={'label'}>
                                <Input type={'text'} placeholder={'0000'} id={'postalCode'}
                                       classnames={'inputField'}
                                       handleChange={() => {}}
                                />
                            </Label>
                        </div>
                    </div>
                    <div className="flex flex-col gap-[3rem] w-full">
                        <div className="flex flex-col border border-solid border-[#D5D7DA] rounded-xl w-full">
                            <div
                                className="flex items-center justify-between bg-[#FFF1E7] py-[2.1rem] px-[2.4rem] rounded-t-xl">
                                <h3 className="">
                                    Price Details
                                </h3>
                                <div className="flex items-center gap-[.3rem] cursor-pointer">
                                    <div className="flex">
                                        <img src={pencil} alt="Message"/>
                                    </div>
                                    <button className="bg-transparent border-none underline text-[1.6rem]">Edit</button>
                                </div>
                            </div>
                            <div
                                className="flex gap-[1.2rem] py-[4.5rem] px-[1.8rem] border-t border-solid border-[#D5D7DA]">
                                <div
                                    className="flex flex-col gap-[1.2rem] w-full">
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
                                <div
                                    className="flex flex-col gap-[1.2rem] w-full">
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
                                        <Input type={'text'} placeholder={'Birthdate'} id={'birthdate'}
                                               classnames={'inputField'}
                                               handleChange={() => {
                                               }}
                                        />
                                    </Label>
                                    <Label title={'Gender'} htmlFor={'gender'}
                                           classnames={'label'}>
                                        <Input type={'text'} placeholder={'Gender'} id={'gender'}
                                               classnames={'inputField'}
                                               handleChange={() => {
                                               }}
                                        />
                                    </Label>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <div className="flex w-2/6 items-center justify-between">
                                <Button title={'Cancel'} type={'tertiary'} handleClick={() => {
                                }}/>
                                <Button title={'Confirm'} type={'primary'} handleClick={() => {
                                }}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}