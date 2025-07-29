import { FC } from "react";
import warning from "../../assets/icons/warning.svg";
import checkIcon from "../../assets/icons/check.svg";
import {Button} from "../button/Button";

interface IConfirmationPopup {
    isError: boolean;
    message: string;
    primaryButtonText: string;
    primaryButtonClick: () => void;
    secondaryButtonText?: string;
    secondaryButtonClick?: () => void;
}

export const ConfirmationPopup: FC<IConfirmationPopup> = ({isError, message, primaryButtonText, primaryButtonClick, secondaryButtonText, secondaryButtonClick}) => {
    return (
        <div className="flex items-center absolute left-0 top-0 w-full h-full bg-[#cecece7d]">
            <div className="flex flex-col items-center justify-center my-0 mx-auto border border-solid border-[#D3D3D4] rounded-[.8rem] p-[5rem] bg-[#fff]">
                <div className="flex bg-[#73B2B2] rounded-full w-[7.2rem] h-[7.2rem] mb-[1.3rem]">
                    <img src={isError ? warning : checkIcon} alt="Check icon"/>
                </div>
                <h2 className="text-[2.8rem] font-semibold mb-[1.1rem]">
                    {message}
                </h2>
                <span className="text-[2.2rem] font-medium mb-[3.9rem]">
                    Thank you for trusting us!
                </span>
                <div className="flex justify-between gap-[5rem]">
                    {secondaryButtonText && <Button title={secondaryButtonText} type={'secondary'} handleClick={secondaryButtonClick}/>}
                    <Button title={primaryButtonText} type={'primary'} handleClick={primaryButtonClick}/>
                </div>
            </div>
        </div>
    )
}