import React, {ChangeEvent, FC, Suspense, useState} from 'react';
import loginLogo from './../../assets/images/logo.png'
import './Login.scss';
import {Input} from "../../components/input/Input";
import {Label} from "../../components/label/Label";
import {NavLink, useNavigate} from 'react-router-dom';
import { Button } from '../../components/button/Button';
import {ILogin, ILoginForm, User} from "../../types/global";
import {login} from "../../api/route";
import {Loading} from "../../components/loading/Loading";

export const Login: FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loginForm, setLoginForm] = useState<ILoginForm>({
        email: {
            value: undefined,
            errorMessage: null
        },
        password: {
            value: undefined,
            errorMessage: null
        },
        rememberMe: false
    })
    const [user, setUser] = useState<User>({ name: "NULL", email: "NULL" });

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement> ) => {
        const {value} = event.target;
        const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!value.match(validRegex)) {
            setLoginForm(prevState => ({
                ...prevState,
                email: {
                    ...prevState.email,
                    errorMessage: 'Invalid email format'
                }
            }))
            return
        }
        setLoginForm(prevState => ({
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
        if (value.length < 6) {
            setLoginForm(prevState => ({
                ...prevState,
                password: {
                    ...prevState.password,
                    errorMessage: 'Password must be at least 6 characters long'
                }
            }))
            return
        }
        setLoginForm(prevState => ({
            ...prevState,
            password: {
                value,
                errorMessage: null
            }
        }))
    }

    const onLogin = async () => {
        if (!loginForm.email.value || !loginForm.password.value) {
            return
        }
        setIsLoading(true);
        const formData: ILogin = {
            email: loginForm.email.value,
            password: loginForm.password.value
        }
        const {data} = await login(formData);
        if (!data?.isEmailVerified) {
            localStorage.setItem('email', loginForm.email.value);
            navigate('/email-verification');
        }

        if(data.refresh) {
            localStorage.setItem('refresh', data.refresh);
            localStorage.setItem('access', data.access);
            setIsLoading(false);
            navigate('/')
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
                        <form className="flex flex-col gap-[22px]">
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
                            <Button title={'Login'} type={'primary'} disabled={!loginForm.email.value || !loginForm.password.value} classNames={'loginButton'} handleClick={onLogin} />
                        </form>

                        <div className="rememberMeContainer">
                            <input type="checkbox" id="rememberMe" className="cursor-pointer" />
                            <label htmlFor="rememberMe" className="rememberMeLabel">
                                Remember me
                            </label>
                            <NavLink to="/forgot-password" className="forgotPasswordLink">Forgot password?</NavLink>
                        </div>

                        <div className="dividerContainer">
                            <div className="login__divider" />
                            <span className="orText">Or</span>
                            <div className="login__divider" />
                        </div>

                        <button className="socialButton">
                            Sign in with Google
                        </button>
                        <button className="socialButton">
                            Sign in with Facebook
                        </button>
                        <button className="socialButton">
                            Sign in with Apple
                        </button>
                    </div>
                </div>
            </Suspense>
    );
}