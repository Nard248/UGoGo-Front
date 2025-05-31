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
            {
                'bg-[#DFF5F5]': type === 'success',
                'bg-[#FFE6D0]': type === 'warning',
                'bg-[#FFCDD2]': type === 'error'
            },
            className
        )}>
            <div className={classNames(
                `flex p-1.5 rounded-full`,
                {
                    'bg-[#73B2B2]': type === 'success',
                    'bg-[#F9A34B]': type === 'warning',
                    'bg-[#FFCDD2]': type === 'error'
                }

            )}>
                <img src={type === 'success' ? checkIcon : warningIcon} alt="Message Icon" className="w-full"/>
            </div>
            <div className={classNames("flex items-center", {
                'text-[#D32F2F]': type === 'error'
            })}>
                {text}
            </div>
        </div>
    )
}