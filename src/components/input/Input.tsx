import {ChangeEvent, FC, useState} from "react";
import masterCardLogo from './../../assets/icons/mastercard.svg'
import './Input.scss'
import classNames from "classnames";

type Props = {
    id?: string;
    name?: string;
    type: string;
    icon?: string;
    placeholder?: string;
    classnames?: string;
    handleChange: (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void;
    errorMessage?: string | null;
    value?: string | number;
    disabled?: boolean;
    showPasswordToggle?: boolean;
}

export const Input: FC<Props> = ({id, name, type, icon, placeholder, classnames, value, handleChange, errorMessage, disabled, showPasswordToggle}) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === 'password';
    const inputType = isPasswordField && showPassword ? 'text' : type;

    const PasswordToggle = () => (
        <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-[1.2rem] top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-[0.4rem] flex items-center"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
            {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                </svg>
            )}
        </button>
    );

    return (
        <div className={classNames("flex flex-col gap-[0.5rem]")}>
            {type === 'textarea' ?
                <textarea
                    name="notes"
                    value={value}
                    onChange={(event) => handleChange(event)}
                    className={`textarea ${classnames ? classnames : ''}`}
                    placeholder={placeholder}
                    disabled={disabled}
                />
                :
                icon ?
                    <div className={`flex items-center border border-solid border-[#D3D3D4] rounded-[.8rem] pl-[2rem] ${classnames ? classnames : ''}`}>
                        <div className="flex">
                            <img src={masterCardLogo} alt="icon"/>
                        </div>
                        <input
                            id={id}
                            name={name}
                            type={inputType}
                            placeholder={placeholder}
                            className={`input !border-none !pr-0 !pl-[1rem]`}
                            value={value}
                            onChange={(event) => handleChange(event)}
                            disabled={disabled}
                        />
                    </div>
                    :
                    isPasswordField && showPasswordToggle !== false ? (
                        <div className="relative">
                            <input
                                id={id}
                                name={name}
                                type={inputType}
                                placeholder={placeholder}
                                className={classNames(`input ${classnames ? classnames : ''}`, {
                                    'error': errorMessage,
                                    'text-[#F04438]': errorMessage
                                })}
                                style={{ paddingRight: '4rem' }}
                                value={value}
                                onChange={(event) => handleChange(event)}
                                disabled={disabled}
                            />
                            <PasswordToggle />
                        </div>
                    ) : (
                        <input
                            id={id}
                            name={name}
                            type={inputType}
                            placeholder={placeholder}
                            className={classNames(`input ${classnames ? classnames : ''}`, {
                                'error': errorMessage,
                                'text-[#F04438]': errorMessage
                            })}
                            value={value}
                            onChange={(event) => handleChange(event)}
                            disabled={disabled}
                        />
                    )
            }
            {errorMessage &&
                <span className="text-[1.4rem] text-[#F04438] font-normal ml-[.5rem]">{errorMessage}</span>
            }
        </div>
    )
}
