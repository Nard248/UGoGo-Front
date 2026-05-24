import React, {ChangeEvent, FC, Suspense, useState, useEffect} from 'react';
import loginLogo from './../../assets/images/logo.png'
import './Login.scss';
import {Input} from "../../components/input/Input";
import {Label} from "../../components/label/Label";
import {NavLink, useNavigate} from 'react-router-dom';
import { Button } from '../../components/button/Button';
import {ILogin, ILoginForm, User} from "../../types/global";
import {login} from "../../api/route";
import {Loading} from "../../components/loading/Loading";
import {storeUserDetails, setUserIdFromToken, setAuthTokens} from "../../utils/auth";

export const Login: FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [loginForm, setLoginForm] = useState<ILoginForm>({
        email: {
            value: undefined,
            errorMessage: null
        },
        password: {
            value: undefined,
            errorMessage: null
        },
        rememberMe: true
    })
    const [user, setUser] = useState<User>({ name: "NULL", email: "NULL" });
    const [emailDebounce, setEmailDebounce] = useState<string>('');
    const [passwordDebounce, setPasswordDebounce] = useState<string>('');

    // Debounced email validation
    useEffect(() => {
        const timer = setTimeout(() => {
            if (emailDebounce) {
                const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
                if (!emailDebounce.match(validRegex)) {
                    setLoginForm(prevState => ({
                        ...prevState,
                        email: {
                            ...prevState.email,
                            errorMessage: 'Invalid email format'
                        }
                    }))
                } else {
                    setLoginForm(prevState => ({
                        ...prevState,
                        email: {
                            value: emailDebounce,
                            errorMessage: null
                        }
                    }))
                }
            }
        }, 800);

        return () => clearTimeout(timer);
    }, [emailDebounce]);

    // Debounced password validation
    useEffect(() => {
        const timer = setTimeout(() => {
            if (passwordDebounce) {
                if (passwordDebounce.length < 6) {
                    setLoginForm(prevState => ({
                        ...prevState,
                        password: {
                            ...prevState.password,
                            errorMessage: 'Password must be at least 6 characters long'
                        }
                    }))
                } else {
                    setLoginForm(prevState => ({
                        ...prevState,
                        password: {
                            value: passwordDebounce,
                            errorMessage: null
                        }
                    }))
                }
            }
        }, 800);

        return () => clearTimeout(timer);
    }, [passwordDebounce]);

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement> ) => {
        const {value} = event.target;
        setEmailDebounce(value);
        setLoginError(null);
        // Clear error while typing
        setLoginForm(prevState => ({
            ...prevState,
            email: {
                ...prevState.email,
                errorMessage: null
            }
        }))
    }

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement> ) => {
        const {value} = event.target;
        setPasswordDebounce(value);
        setLoginError(null);
        // Clear error while typing
        setLoginForm(prevState => ({
            ...prevState,
            password: {
                ...prevState.password,
                errorMessage: null
            }
        }))
    }

    const onLogin = async (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
        }

        if (!loginForm.email.value || !loginForm.password.value) {
            return
        }

        setLoginError(null);
        setIsSubmitting(true);

        try {
            const formData: ILogin = {
                email: loginForm.email.value,
                password: loginForm.password.value
            }
            const {data} = await login(formData);

            // Check if login was successful (has refresh token)
            if(data?.refresh && data?.access) {
                // Store tokens in localStorage (Remember me) or sessionStorage
                setAuthTokens(data.access, data.refresh, loginForm.rememberMe);

                // Persist user_id immediately from the JWT so chat/ownership
                // checks work without waiting on /users/me (fixes cold-login race)
                setUserIdFromToken(data.access);

                // Store user details, then decide routing. The token response does
                // not reliably include an email-verification flag, so we use the
                // authoritative `is_email_verified` from /users/me. Default to
                // allowing access if it can't be determined (don't block on a
                // transient fetch failure).
                setIsLoading(true);
                let details: any = null;
                try {
                    details = await storeUserDetails();
                } catch (error) {
                    console.error('Failed to store user details:', error);
                }

                const isEmailVerified = details?.is_email_verified ?? true;
                if (!isEmailVerified) {
                    localStorage.setItem('email', loginForm.email.value);
                    navigate('/email-verification');
                    return;
                }

                navigate('/')
            } else {
                setLoginError('Invalid email or password. Please try again.');
            }
        } catch (error: any) {
            console.error('Login error:', error);

            // Extract error message from various possible response structures
            let errorMessage = 'Invalid email or password. Please try again.';

            if (error?.response?.data) {
                const errorData = error.response.data;
                if (typeof errorData === 'string') {
                    errorMessage = errorData;
                } else if (errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData.detail) {
                    errorMessage = errorData.detail;
                } else if (errorData.error) {
                    errorMessage = errorData.error;
                } else if (errorData.non_field_errors) {
                    errorMessage = Array.isArray(errorData.non_field_errors)
                        ? errorData.non_field_errors[0]
                        : errorData.non_field_errors;
                }
            } else if (error?.message) {
                errorMessage = error.message;
            }

            setLoginError(errorMessage);
        } finally {
            // On success we navigate away; on failure re-enable the button
            setIsSubmitting(false);
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
                            <h1 className="title-wrapper">Welcome</h1>
                            <div className="subTitle text-[#878787]">
                                New to <strong className="text-[#000]">UGO<span className="text-[#F9A34B]">GO</span></strong>?&nbsp;
                                <NavLink to="/registration" className="signupLink text-[#F9A34B]">Sign up</NavLink>
                            </div>
                        </div>
                        {loginError && (
                            <div className="loginError">
                                {loginError}
                            </div>
                        )}
                        <form className="flex flex-col gap-[22px]" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
                            <div className={`inputHolder ${loginForm.email.errorMessage ? 'error' : ''}`}>
                                <Label title={'Email address'} htmlFor={'email'}
                                       classnames={'label'}>
                                    <Input
                                        id={'email'}
                                        type={'email'}
                                        placeholder={'Email address'}
                                        classnames={'inputField'}
                                        errorMessage={loginForm.email.errorMessage}
                                        handleChange={handleEmailChange}/>
                                </Label>
                            </div>
                            <div className={`inputHolder ${loginForm.password.errorMessage ? 'error' : ''}`}>
                                <Label title={'Password'} htmlFor={'password'}
                                       classnames={'label'}>
                                    <Input
                                        id={'password'}
                                        type={'password'}
                                        placeholder={'Password'}
                                        classnames={'inputField'}
                                        errorMessage={loginForm.password.errorMessage}
                                        handleChange={handlePasswordChange}
                                    />
                                </Label>
                            </div>
                            <Button title={isSubmitting ? 'Logging in…' : 'Login'} type={'primary'} disabled={!loginForm.email.value || !loginForm.password.value || isSubmitting} classNames={'loginButton'} handleClick={onLogin} />
                        </form>

                        <div className="rememberMeContainer">
                            <input type="checkbox" id="rememberMe" className="cursor-pointer" checked={loginForm.rememberMe} onChange={(e) => setLoginForm(prev => ({ ...prev, rememberMe: e.target.checked }))} />
                            <label htmlFor="rememberMe" className="rememberMeLabel">
                                Remember me
                            </label>
                            <NavLink to="/forgot-password" className="forgotPasswordLink">Forgot password?</NavLink>
                        </div>
                    </div>
                </div>
            </Suspense>
    );
}