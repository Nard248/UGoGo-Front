import {FC} from "react";
import './Button.scss'

type Props = {
    title: string;
    type: 'primary' | 'secondary' | 'tertiary';
    disabled?: boolean;
    classNames?: string;
    handleClick: () => void;
}

export const Button: FC<Props> = ({type, title, disabled, classNames, handleClick}) => {
    return (
        <button className={`button button-${type} ${classNames ? classNames : ''} ${disabled ? 'disabled pointer-events-none' : ''}`} onClick={handleClick} disabled={disabled}>
            {title}
        </button>
    )
}