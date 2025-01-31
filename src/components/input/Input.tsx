import {ChangeEvent, FC} from "react";
import './Input.scss'

type Props = {
    id?: string;
    name?: string;
    type: string;
    placeholder?: string;
    classnames?: string;
    handleChange: (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void;
    errorMessage?: string | null;
}

export const Input: FC<Props> = ({id, name, type, placeholder, classnames, handleChange, errorMessage}) => {
    return (
        <>
            {type === 'textarea' ?
                <textarea name="notes" onChange={(event) => handleChange(event)}
                          className={`textarea ${classnames ? classnames : ''}`} placeholder={placeholder}/>
                :
                <input id={id} name={name} type={type} placeholder={placeholder}
                       className={`input ${classnames ? classnames : ''}`} onChange={(event) => handleChange(event)}/>
            }
            {errorMessage &&
                <span className="errorMessage">{errorMessage}</span>
            }
        </>
    )
}