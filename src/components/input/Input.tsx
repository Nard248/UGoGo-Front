import {ChangeEvent, FC} from "react";
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
    /**
     * Optional value for controlled inputs. If provided the component behaves
     * like a controlled component and the value will be passed to the
     * underlying input element.
     */
    // value?: string;
    handleChange: (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void;
    // handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    errorMessage?: string | null;
    value?: string | number; // ✅ ADD THIS
}

export const Input: FC<Props> = ({id, name, type, icon, placeholder, classnames, value, handleChange, errorMessage}) => {
    return (
        <div className={classNames("flex flex-col gap-[0.5rem]")}>
            {type === 'textarea' ?
                <textarea
                    name="notes"
                    value={value}
                    onChange={(event) => handleChange(event)}
                    className={`textarea ${classnames ? classnames : ''}`}
                    placeholder={placeholder}
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
                            type={type}
                            placeholder={placeholder}
                            className={`input !border-none !pr-0 !pl-[1rem]`}
                            value={value}
                            onChange={(event) => handleChange(event)}
                        />
                    </div>
                    :
                    <input
                        id={id}
                        name={name}
                        type={type}
                        placeholder={placeholder}
                        className={classNames(`input ${classnames ? classnames : ''}`, {
                            'error': errorMessage,
                            'text-[#F04438]': errorMessage
                        })}
                        value={value}
                        onChange={(event) => handleChange(event)}
                    />
            }
            {errorMessage &&
                <span className="text-[1.4rem] text-[#F04438] font-normal ml-[.5rem]">{errorMessage}</span>
            }
        </div>
    )
}