import React, {ChangeEvent, Suspense, useState} from "react";
import loginLogo from "../../assets/images/logo.png";
import {NavLink, useNavigate} from "react-router-dom";
import {Label} from "../../components/label/Label";
import {Input} from "../../components/input/Input";
import {IRegister, IRegisterForm} from "../../types/global";
import {register} from "../../api/route";
import {Loading} from "../../components/loading/Loading";
import './Login.scss';

export const Registration = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [registerForm, setRegisterForm] = useState<IRegisterForm>({
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
    })

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
        if (value.length < 6) {
            setRegisterForm(prevState => ({
                ...prevState,
                password: {
                    ...prevState.password,
                    errorMessage: 'Password must be at least 6 characters long'
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

    const onRegister = async () => {
        if (!registerForm.fullName.value || !registerForm.email.value || !registerForm.password.value) {
            return
        }
        setIsLoading(true);
        const formData: IRegister = {
            full_name: registerForm.email.value,
            email: registerForm.email.value,
            password: registerForm.password.value
        }

        try {
            const {data} = await register(formData);
            if (data.tokens.access) {
                localStorage.setItem('token', data.tokens.access);
                setIsLoading(false);
                navigate('/post-offer')
            }
        } catch (e) {
            console.log(e);
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
                        <div className="flex flex-col gap-[22px]">
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
                            </div>
                            <button className="loginButton" onClick={onRegister}
                                    disabled={!registerForm.fullName.value || !registerForm.email.value || !registerForm.password.value}>Continue
                            </button>
                        </div>
                        <div className="rememberMeContainer">
                            <input type="checkbox" id="rememberMe" className="cursor-pointer"/>
                            <label htmlFor="rememberMe" className="rememberMeLabel">
                                I agree with UGOGO's Terms of Service, Privacy Policy, and default Notification
                                Settings.
                            </label>
                        </div>

                        <div className="dividerContainer">
                            <div className="divider"/>
                            <span className="orText">Or</span>
                            <div className="divider"/>
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
    )
}