import {FC} from "react";
import warningIcon from './../../assets/icons/warning.svg';
import checkIcon from './../../assets/icons/check.svg';
import classNames from "classnames";

interface IAlertMessage {
    type: 'success' | 'warning' | 'error';
    text: string;
    className?: string;
}

export const AlertMessage: FC<IAlertMessage> = ({type, text, className}) => {
    return (
        <div className={classNames(
            `flex items-center gap-4 rounded-xl px-[1.4rem] py-[2rem]`,
            type === "warning"? 'bg-[#FFE6D0]' : 'bg-[#DFF5F5]',
            className
        )}>
            <div className={classNames(
                `flex p-1.5 rounded-full`,
                type === "warning"? 'bg-[#F9A34B]' : 'bg-[#73B2B2]'
            )}>
                <img src={type === 'warning' ? warningIcon : checkIcon} alt="Message Icon" className="w-full"/>
            </div>
            <div className="flex items-center">
                {text}
            </div>
        </div>
    )
}