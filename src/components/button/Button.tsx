import {FC} from "react";
import filterIcon from './../../assets/icons/filterIcon.svg'
import './Button.scss'

type Props = {
    title: string;
    type: 'primary' | 'secondary' | 'tertiary';
    disabled?: boolean;
    classNames?: string;
    icon?: string;
    alt?: string;
    handleClick: () => void;
}

export const Button: FC<Props> = ({type, title, disabled, icon, alt, classNames, handleClick}) => {
    return (
        <button className={`button button-${type} ${classNames ? classNames : ''} ${disabled ? 'disabled pointer-events-none' : ''}`} onClick={handleClick} disabled={disabled}>
            {icon &&
                <img src={filterIcon} alt={alt}/>
            }
            {title}
        </button>
    )
}