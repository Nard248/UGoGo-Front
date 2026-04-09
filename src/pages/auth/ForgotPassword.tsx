import React, { useState } from "react";
import { Input } from "../../components/input/Input";
import { Button } from "../../components/button/Button";
import loginLogo from "../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../api/route";

export const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!email) {
            setError('Please enter your email address.');
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            await forgotPassword(email);
            setSuccess(true);
        } catch (err: any) {
            const errorData = err?.response?.data;
            if (errorData?.email) {
                setError(Array.isArray(errorData.email) ? errorData.email[0] : errorData.email);
            } else {
                setError('Failed to send reset link. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="container">
                <div className="leftSection">
                    <img src={loginLogo} alt="UGOGO Plane Logo" className="logo" />
                </div>
                <div className="flex flex-col gap-[10rem]">
                    <div className="flex flex-col gap-[1rem]">
                        <h1 className="text-[2.8rem] font-bold">Check Your Email</h1>
                        <span className="text-[1.6rem] text-[#040308] font-normal">
                            We've sent password reset instructions to <strong>{email}</strong>.
                            Please check your inbox and follow the link to reset your password.
                        </span>
                    </div>
                    <div className="flex flex-col gap-[3rem]">
                        <Button
                            title={'Back to Login'}
                            type={'primary'}
                            classNames={'text-[1.4rem]'}
                            handleClick={() => navigate('/login')}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="leftSection">
                <img src={loginLogo} alt="UGOGO Plane Logo" className="logo" />
            </div>
            <div className="flex flex-col gap-[10rem]">
                <div className="flex flex-col gap-[1rem]">
                    <h1 className="text-[2.8rem] font-bold">Forgot Password</h1>
                    <span className="text-[1.6rem] text-[#040308] font-normal">
                        Enter the email you used to create your account so we can send you instructions on how to reset your password.
                    </span>
                </div>
                <div className="flex flex-col gap-[3rem]">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-[1.4rem]">
                            {error}
                        </div>
                    )}
                    <div className="inputHolder">
                        <Input
                            id={'email'}
                            type={'email'}
                            placeholder={'Enter your email address'}
                            classnames={'inputField'}
                            value={email}
                            handleChange={(e) => {
                                setEmail(e.target.value);
                                setError(null);
                            }}
                        />
                    </div>
                    <Button
                        title={isLoading ? 'Sending...' : 'Send'}
                        type={'primary'}
                        classNames={'text-[1.4rem]'}
                        handleClick={handleSend}
                        disabled={isLoading || !email}
                    />
                    <Button
                        title={'Back to Login'}
                        type={'primary'}
                        outline={true}
                        classNames={'text-[1.4rem]'}
                        handleClick={() => navigate('/login')}
                    />
                </div>
            </div>
        </div>
    );
};
