import React, {useRef, useState, KeyboardEvent, useEffect, FC} from "react";
import {Button} from "../../components/button/Button";
import classNames from "classnames";
import closeIcon from './../../assets/icons/closeIcon.svg';
import './VerificationPopup.scss'

type VerificationPopup = {
    onClick: (code: string) => void
    onClose: () => void
}

export const VerificationPopup: FC<VerificationPopup> = ({onClick, onClose}) => {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef<HTMLInputElement[]>([]);
    const [email, setEmail] = useState<string | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const _email = localStorage.getItem('email');
        if (!_email) {
            return;
        }
        setEmail(_email);

    }, [])


    const isDisabled = code.some((digit) => digit === "");


    const handleChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < code.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const onPayout = () => {
        const verifyCode = code.join("");
        onClick(verifyCode)
    }

    return (
        <div
            className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex justify-center items-center w-full h-full bg-[#d0e3eb8c]">
            <div
                className="flex flex-col p-[3rem] gap-[2rem] w-[90rem] max-h-[60rem] rounded-[.8rem] border-[#D5D7DA] border-solid border bg-[#fff]">
                <div className="w-full flex justify-end items-center">
                    <div className="w-[2rem] h-[2rem] cursor-pointer" onClick={onClose}>
                        <img src={closeIcon} alt=""/>
                    </div>
                </div>
            <div className="emailVerificationContainer flex flex-col">
                <div className="flex flex-col items-center gap-[1rem] text-center">
                    <h1 className="text-[2.5rem] font-bold max-w-[50%]">
                        A 6-digit code has been sent to your phone number.
                        Please enter the code.
                    </h1>
                </div>
                <div className="flex flex-col border border-solid border-[#D5D7DA] p-[3rem] gap-[6rem]">
                    <div className="flex flex-col gap-[3rem]">
                        <h2 className="text-[2rem] text-center">
                            Enter 6-digit code
                        </h2>
                        <div className="grid grid-cols-7 gap-[.8rem] max-w-[50rem] items-center">
                            {code.map((digit: string, index: number) => (
                                <>
                                    {index === 3 &&
                                        <span className="text-[6rem] text-center text-[#D5D7DA]">-</span>
                                    }
                                    <input
                                        key={index}
                                        ref={(el: HTMLInputElement) => ((inputRefs.current[index]) = el)}
                                        type={'text'}
                                        placeholder={'0'}
                                        className={
                                        classNames(
                                            'input text-center',
                                                error ? '!text-[#D32F2F] !border-[#D32F2F]' : null
                                            )}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                    />
                                </>
                            ))}
                        </div>
                        {error &&
                            <span className="text-center text-[1.4rem] text-[#D32F2F]">Invalid verification code.</span>
                        }
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-[8rem]">
                <div className="flex justify-center">
                    <Button title={'Submit'} type={'primary'} classNames={'text-[1.4rem]'} disabled={isDisabled || !email} handleClick={onPayout}/>
                </div>
            </div>
        </div>
        </div>
    )
}