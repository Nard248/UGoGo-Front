import React from "react";
import {Input} from "../../components/input/Input";
import './EmailVerification.scss'
import {Button} from "../../components/button/Button";
import {Link} from "../../components/link/Link";

export const EmailVerification = () => {
    return (
        <div className="flex flex-col gap-[3.3rem]">
            <div className="container flex flex-col">
                <div className="flex flex-col gap-[1rem] text-center">
                    <h1 className="text-[4rem] text-bold">
                        Verify your Email
                    </h1>
                    <span className="text-[1.6rem]">
                    We have sent a verification email to n****e@e***e.com.
                </span>
                </div>
                <div className="flex flex-col border border-solid border-[#D5D7DA] p-[3rem] gap-[6rem]">
                    <div className="flex flex-col gap-[3rem]">
                        <h2 className="text-[2rem] text-center">
                            Enter 6-digit code
                        </h2>
                        <div className="grid grid-cols-7 gap-[.8rem] max-w-[50rem]">
                            <Input
                                id={'password'}
                                type={'text'}
                                placeholder={'0'}
                                classnames={'emailVerificationInput'}
                                handleChange={() => {
                                }}
                            />
                            <Input
                                id={'password'}
                                type={'text'}
                                placeholder={'0'}
                                classnames={'emailVerificationInput'}
                                handleChange={() => {
                                }}
                            />
                            <Input
                                id={'password'}
                                type={'text'}
                                placeholder={'0'}
                                classnames={'emailVerificationInput'}
                                handleChange={() => {
                                }}
                            />
                            <span className="text-[6rem] text-center text-[#D5D7DA]">-</span>
                            <Input
                                id={'password'}
                                type={'text'}
                                placeholder={'0'}
                                classnames={'emailVerificationInput'}
                                handleChange={() => {
                                }}
                            />
                            <Input
                                id={'password'}
                                type={'text'}
                                placeholder={'0'}
                                classnames={'emailVerificationInput'}
                                handleChange={() => {
                                }}
                            />
                            <Input
                                id={'password'}
                                type={'text'}
                                placeholder={'0'}
                                classnames={'emailVerificationInput'}
                                handleChange={() => {
                                }}
                            />
                        </div>
                    </div>
                    <div className="w-3/6 text-[#666666] font-normal text-[1.4rem]">
                        It may take a minute to receive your code.
                        Haven't receive it? <Link title={'Resend a new code'} href={''} type={'tertiary'}
                                                  outline={true}/>.
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-[8rem]">
                <div className="flex justify-end">
                    <Button title={'Submit'} type={'primary'} handleClick={() => {
                    }}/>
                </div>
                <div className="flex flex-col gap-[3rem]">
                    <span className="text-[1.6rem] text-[#040308] font-normal">
                        Didn’t receive the email? Check spam or promotion folder or
                    </span>
                    <Button title={'Resend email'} type={'primary'} classNames={"w-full"} handleClick={() => {
                    }}/>
                </div>
            </div>
        </div>
    )
}