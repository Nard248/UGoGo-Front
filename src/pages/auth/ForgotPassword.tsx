import React from "react";
import {Input} from "../../components/input/Input";
import {Button} from "../../components/button/Button";
import loginLogo from "../../assets/images/logo.png";

export const ForgotPassword = () => {
    return (
        <div className="container">
            <div className="leftSection">
                <img
                    src={loginLogo}
                    alt="UGOGO Plane Logo"
                    className="logo"
                />
            </div>
            <div className="flex flex-col gap-[10rem]">
                <div className="flex flex-col gap-[1rem]">
                    <h1 className="text-[2.8rem] font-bold">Forgot Password</h1>
                    <span className="text-[1.6rem] text-[#040308] font-normal">
                        Enter the email you used to create your account so we can send you instructions on how to reset your password.
                    </span>
                </div>
                <div className="flex flex-col gap-[3rem]">
                    <div className={`inputHolder `}>
                            <Input
                                id={'password'}
                                type={'text'}
                                placeholder={'olivia@untitledui.com'}
                                classnames={'inputField'}
                                handleChange={() => {}}
                            />
                    </div>
                    <Button title={'Send'} type={'primary'}
                            handleClick={() => {}}/>
                    <Button title={'Back to Login'} type={'primary'}
                            handleClick={() => {}}/>
                </div>
            </div>
        </div>
    )
}