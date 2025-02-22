import React from "react";
import {Input} from "../../components/input/Input";
import {Button} from "../../components/button/Button";
import loginLogo from "../../assets/images/logo.png";

export const ResetPassword = () => {
    return (
        <div className="container">
            <div className="leftSection">
                <img
                    src={loginLogo}
                    alt="UGOGO Plane Logo"
                    className="logo"
                />
            </div>
            <div className="flex flex-col gap-[10rem] flex-1">
                <div className="flex flex-col gap-[1rem]">
                    <h1 className="text-[2.8rem] font-bold">Reset Password</h1>
                    <span className="text-[1.6rem] text-[#040308] font-normal">
                        Choose a new password for your account
                    </span>
                </div>
                <div className="flex flex-col gap-[3rem]">
                    <div className={`inputHolder `}>
                            <Input
                                type={'password'}
                                placeholder={'Your new password'}
                                classnames={'inputField'}
                                handleChange={() => {}}
                            />
                    </div>
                    <div className={`inputHolder `}>
                            <Input
                                type={'password'}
                                placeholder={'Confirm your new password'}
                                classnames={'inputField'}
                                handleChange={() => {}}
                            />
                    </div>
                    <Button title={'Reset password'} type={'primary'}
                            handleClick={() => {}}/>
                    <Button title={'Back to login'} type={'primary'}
                            handleClick={() => {}}/>
                </div>
            </div>
        </div>
    )
}