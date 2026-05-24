import React, {ChangeEvent, Suspense, useState} from "react";
import loginLogo from "../../assets/images/logo.png";
import {NavLink, useNavigate} from "react-router-dom";
import {Label} from "../../components/label/Label";
import {Input} from "../../components/input/Input";
import {IRegister, IRegisterForm} from "../../types/global";
import {register} from "../../api/route";
import {Loading} from "../../components/loading/Loading";
import './Login.scss';

const getPasswordStrength = (password: string): { level: number; label: string; color: string } => {
    if (!password) return { level: 0, label: '', color: '#D3D3D4' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { level: 1, label: 'Weak', color: '#F04438' };
    if (score <= 3) return { level: 2, label: 'Fair', color: '#F9A34B' };
    if (score === 4) return { level: 3, label: 'Good', color: '#4CAF50' };
    return { level: 4, label: 'Strong', color: '#2E7D32' };
};

const initialState = {
    email: {
        value: undefined,
        errorMessage: null
    },
    password: {
        value: undefined,
        errorMessage: null
    },
    fullName: {
        value: undefined,
        errorMessage: null
    }
}

export const Registration = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [registerForm, setRegisterForm] = useState<IRegisterForm>(initialState)
    const [registerError, setRegisterError] = useState<string | null>(null);
    const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
    const [passwordValue, setPasswordValue] = useState('');
    const passwordStrength = getPasswordStrength(passwordValue);

    const handleNameChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement> ) => {
        const {value} = event.target;

        setRegisterForm(prevState => ({
            ...prevState,
            fullName: {
                ...prevState.email,
                value,
                errorMessage: null
            }
        }))
    }

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement> ) => {
        const {value} = event.target;
        const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!value.match(validRegex)) {
            setRegisterForm(prevState => ({
                ...prevState,
                email: {
                    ...prevState.email,
                    errorMessage: 'Invalid email format'
                }
            }))
            return
        }
        setRegisterForm(prevState => ({
            ...prevState,
            email: {
                ...prevState.email,
                value,
                errorMessage: null
            }
        }))
    }

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement> ) => {
        const {value} = event.target;
        setPasswordValue(value);
        if (value.length < 8) {
            setRegisterForm(prevState => ({
                ...prevState,
                password: {
                    ...prevState.password,
                    errorMessage: 'Password must be at least 8 characters long'
                }
            }))
            return
        }
        setRegisterForm(prevState => ({
            ...prevState,
            password: {
                value,
                errorMessage: null
            }
        }))
    }

    const onRegister = async (e?: React.MouseEvent) => {
        if (e) e.preventDefault();
        if (!registerForm.fullName.value || !registerForm.email.value || !registerForm.password.value) {
            return
        }
        if (!agreedToTerms) {
            setRegisterError("Please agree to UGOGO's Terms of Service to continue.");
            return;
        }
        setRegisterError(null);
        setIsLoading(true);
        const formData: IRegister = {
            full_name: registerForm.fullName.value,
            email: registerForm.email.value,
            password: registerForm.password.value
        }

        try {
            const {data} = await register(formData);
            if (data.user) {
                localStorage.setItem('email', registerForm.email.value);
                navigate('/email-verification')
                return;
            }
            setIsLoading(false);
            setRegisterError('Registration failed. Please try again.');
        } catch (error: any) {
            setIsLoading(false);

            // Surface the backend error instead of failing silently
            let errorMessage = 'Registration failed. Please try again.';
            const errorData = error?.response?.data;
            if (errorData) {
                if (typeof errorData === 'string') {
                    errorMessage = errorData;
                } else if (errorData.email) {
                    errorMessage = Array.isArray(errorData.email) ? errorData.email[0] : errorData.email;
                } else if (errorData.password) {
                    errorMessage = Array.isArray(errorData.password) ? errorData.password[0] : errorData.password;
                } else if (errorData.detail) {
                    errorMessage = errorData.detail;
                } else if (errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData.error) {
                    errorMessage = errorData.error;
                } else if (errorData.non_field_errors) {
                    errorMessage = Array.isArray(errorData.non_field_errors) ? errorData.non_field_errors[0] : errorData.non_field_errors;
                }
            } else if (error?.message) {
                errorMessage = error.message;
            }
            setRegisterError(errorMessage);
        }
    }

    return (
        isLoading ?
            <Loading />
            :
        <Suspense fallback={<Loading />}>
            <div className="container">
                    <div className="leftSection">
                        <img
                            src={loginLogo}
                            alt="UGOGO Plane Logo"
                            className="logo"
                        />
                    </div>
                    <div className="rightSection">
                        <div className="title">
                            <h1 className="title-wrapper">Create an Account</h1>
                            <div className="subTitle text-[#878787]">
                                Already have an account?&nbsp;
                                <NavLink to="/login" className="signupLink text-[#F9A34B]">Sign in</NavLink>
                            </div>
                        </div>
                        {registerError && (
                            <div className="loginError">
                                {registerError}
                            </div>
                        )}
                        <form className="flex flex-col gap-[22px]">
                            <div>
                                <Label title={'Full Name'} htmlFor={'fullName'}
                                       classnames={'label'}>
                                    <Input type={'text'} placeholder={'Full Name'} id={'fullName'}
                                           classnames={'inputField'}
                                           handleChange={handleNameChange}
                                    />
                                </Label>
                            </div>
                            <div>
                                <Label title={'Email address'} htmlFor={'email'}
                                       classnames={'label'}>
                                    <Input type={'email'} placeholder={'Email address'} id={'email'}
                                           classnames={'inputField'}
                                           handleChange={handleEmailChange}
                                    />
                                </Label>
                            </div>
                            <div>
                                <Label title={'Password'} htmlFor={'password'}
                                       classnames={'label'}>
                                    <Input type={'password'} placeholder={'Password'} id={'password'}
                                           classnames={'inputField'}
                                           handleChange={handlePasswordChange}
                                    />
                                </Label>
                                {passwordValue && (
                                    <div className="flex flex-col gap-[0.4rem] mt-[0.8rem]">
                                        <div className="flex gap-[0.4rem]">
                                            {[1, 2, 3, 4].map(i => (
                                                <div
                                                    key={i}
                                                    className="h-[0.4rem] flex-1 rounded-full"
                                                    style={{
                                                        backgroundColor: i <= passwordStrength.level ? passwordStrength.color : '#E0E0E0'
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-[1.2rem]" style={{ color: passwordStrength.color }}>
                                            {passwordStrength.label}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <button className="loginButton" onClick={onRegister}
                                    disabled={!registerForm.fullName.value || !registerForm.email.value || !registerForm.password.value || !agreedToTerms}>Continue
                            </button>
                        </form>
                        <div className="rememberMeContainer">
                            <input type="checkbox" id="rememberMe" className="cursor-pointer" checked={agreedToTerms} onChange={(e) => { setAgreedToTerms(e.target.checked); setRegisterError(null); }}/>
                            <label htmlFor="rememberMe" className="rememberMeLabel">
                                I agree with UGOGO's Terms of Service, Privacy Policy, and default Notification
                                Settings.
                            </label>
                        </div>
                    </div>
                </div>
        </Suspense>
    )
}