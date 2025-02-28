import React from "react";
import {Button} from "../../components/button/Button";
import tickBig from './../../assets/icons/tick-big.svg'
import {useNavigate} from "react-router-dom";

export const TwoFactorVerification = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col gap-[3.3rem]">
            <div className="emailVerificationContainer flex flex-col">
                <div className="flex flex-col gap-[1rem] text-center">
                    <h1 className="text-[4rem] text-bold">
                        Two-factor authentication
                    </h1>
                </div>
                <div className="flex flex-col border border-solid border-[#D5D7DA] p-[3rem] gap-[2.2rem]">
                    <div className="flex flex-col items-center gap-[2.2rem]">
                        <div className="flex gap-[.8rem] max-w-[50rem] items-center">
                            <img src={tickBig} alt="Tick Icon"/>
                        </div>
                        <div className="flex flex-col gap-[1.5rem]">
                            <span className="text-[1.6rem] font-medium text-center">
                                Two-factor authentication enabled
                            </span>
                            <span className="text-[1.4rem] font-medium text-center text-[#808080]">
                                Your account is now 100% secure against unauthorized logins.
                            </span>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <Button title={'Submit'} type={'primary'} classNames={'text-[1.4rem]'} handleClick={() => navigate('/')}/>
                    </div>
                </div>
            </div>
        </div>
    )
}