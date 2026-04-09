import React, { useState } from "react";
import { Input } from "../../components/input/Input";
import { Button } from "../../components/button/Button";
import loginLogo from "../../assets/images/logo.png";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../api/route";

export const ResetPassword = () => {
    const navigate = useNavigate();
    const { uid, token } = useParams<{ uid: string; token: string }>();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    if (!uid || !token) {
        return (
            <div className="container">
                <div className="leftSection">
                    <img src={loginLogo} alt="UGOGO Plane Logo" className="logo" />
                </div>
                <div className="flex flex-col gap-[10rem] flex-1">
                    <div className="flex flex-col gap-[1rem]">
                        <h1 className="text-[2.8rem] font-bold">Invalid Reset Link</h1>
                        <span className="text-[1.6rem] text-[#040308] font-normal">
                            This password reset link is invalid or has expired. Please request a new one.
                        </span>
                    </div>
                    <div className="flex flex-col gap-[3rem]">
                        <Button
                            title={'Go to Forgot Password'}
                            type={'primary'}
                            handleClick={() => navigate('/forgot-password')}
                        />
                        <Button
                            title={'Back to Login'}
                            type={'primary'}
                            outline={true}
                            handleClick={() => navigate('/login')}
                        />
                    </div>
                </div>
            </div>
        );
    }

    const handleReset = async () => {
        setError(null);

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsLoading(true);
        try {
            await resetPassword({
                uid,
                token,
                new_password: newPassword,
                confirm_password: confirmPassword,
            });
            setSuccess(true);
        } catch (err: any) {
            const errorData = err?.response?.data;
            if (errorData) {
                const messages = Object.values(errorData).flat();
                setError(messages.join(' ') || 'Failed to reset password.');
            } else {
                setError('Failed to reset password. The link may have expired.');
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
                <div className="flex flex-col gap-[10rem] flex-1">
                    <div className="flex flex-col gap-[1rem]">
                        <h1 className="text-[2.8rem] font-bold">Password Reset Successful</h1>
                        <span className="text-[1.6rem] text-[#040308] font-normal">
                            Your password has been reset successfully. You can now log in with your new password.
                        </span>
                    </div>
                    <div className="flex flex-col gap-[3rem]">
                        <Button
                            title={'Back to Login'}
                            type={'primary'}
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
            <div className="flex flex-col gap-[10rem] flex-1">
                <div className="flex flex-col gap-[1rem]">
                    <h1 className="text-[2.8rem] font-bold">Reset Password</h1>
                    <span className="text-[1.6rem] text-[#040308] font-normal">
                        Choose a new password for your account
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
                            type={'password'}
                            placeholder={'Your new password'}
                            classnames={'inputField'}
                            value={newPassword}
                            handleChange={(e) => {
                                setNewPassword(e.target.value);
                                setError(null);
                            }}
                        />
                    </div>
                    <div className="inputHolder">
                        <Input
                            type={'password'}
                            placeholder={'Confirm your new password'}
                            classnames={'inputField'}
                            value={confirmPassword}
                            handleChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setError(null);
                            }}
                        />
                    </div>
                    <Button
                        title={isLoading ? 'Resetting...' : 'Reset password'}
                        type={'primary'}
                        handleClick={handleReset}
                        disabled={isLoading || !newPassword || !confirmPassword}
                    />
                    <Button
                        title={'Back to login'}
                        type={'primary'}
                        outline={true}
                        handleClick={() => navigate('/login')}
                    />
                </div>
            </div>
        </div>
    );
};
