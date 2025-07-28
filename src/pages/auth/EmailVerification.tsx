import React, {useRef, useState, KeyboardEvent, useEffect} from "react";
import {emailVerification} from "../../api/route";
import {Button} from "../../components/button/Button";
import {Link} from "../../components/link/Link";
import './EmailVerification.scss'
import {useNavigate} from "react-router-dom";
import classNames from "classnames";

export const EmailVerification = () => {
    const navigate = useNavigate();
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

    const obfuscateEmail = (email: string) => {
        if(!email) {
            return;
        }
        const [name, domain] = email.split("@");
        const [domainName, domainExt] = domain.split(".");

        const obfuscatedName = name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
        const obfuscatedDomain = domainName[0] + "*".repeat(domainName.length - 2) + domainName[domainName.length - 1];

        return `${obfuscatedName}@${obfuscatedDomain}.${domainExt}`;
    };

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

    const verify = async () => {
        if (!email) return;

        try {
            const verifyCode = code.join("");
            const data = await emailVerification({email, email_verification_code: verifyCode});
            localStorage.removeItem('email');
            navigate('/')
        } catch (e) {
            setError(true);
            console.log(e);
        }
    }

    return (
        <div className="flex flex-col gap-[3.3rem]">
            <div className="emailVerificationContainer flex flex-col">
                <div className="flex flex-col gap-[1rem] text-center">
                    <h1 className="text-[4rem] text-bold">
                        Verify your Email
                    </h1>
                    <span className="text-[1.6rem]">
                    We have sent a verification email to {obfuscateEmail(email || '')}.
                </span>
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
                    <div className="w-3/6 text-[#666666] font-normal text-[1.4rem]">
                        It may take a minute to receive your code.
                        Haven't receive it? <Link title={'Resend a new code'} href={''} type={'tertiary'}
                                                  outline={true}/>.
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-[8rem]">
                <div className="flex justify-end">
                    <Button title={'Submit'} type={'primary'} classNames={'text-[1.4rem]'} disabled={isDisabled || !email} handleClick={verify}/>
                </div>
                <div className="flex flex-col gap-[3rem]">
                    <span className="text-[1.6rem] text-[#040308] font-normal">
                        Didn’t receive the email? Check spam or promotion folder or
                    </span>
                    <Button title={'Resend email'} type={'primary'} classNames={"w-full text-[1.4rem]"}
                            handleClick={() => {
                            }}/>
                </div>
            </div>
        </div>
    )
}