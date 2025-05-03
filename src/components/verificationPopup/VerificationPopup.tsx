import { FC } from "react";
import warning from "../../assets/icons/warning.svg";
import checkIcon from "../../assets/icons/check.svg";
import {Button} from "../button/Button";

interface IConfirmationPopup {
    isError: boolean;
    message: string;
    buttonText: string;
    onClick: () => void;
}

export const VerificationPopup: FC<IConfirmationPopup> = ({isError, message, buttonText, onClick}) => {
    return (
        <div className="flex items-center absolute left-0 top-0 w-full h-full bg-[#cecece7d]">
            <div className="w-[50%] gap-[2rem] flex flex-col items-center justify-center my-0 mx-auto border border-solid border-[#D3D3D4] rounded-[.8rem] p-[5rem] bg-[#fff]">
                <div className="flex bg-[#73B2B2] rounded-full w-[7.2rem] h-[7.2rem] mb-[1.3rem]">
                    <img src={isError ? warning : checkIcon} alt="Check icon"/>
                </div>
                <h2 className="text-[1.8rem] font-normal mb-[1.1rem]">
                    {message}
                </h2>
                <div className="flex justify-center gap-[5rem]">
                    <Button title={buttonText} type={'primary'} handleClick={onClick}/>
                </div>
            </div>
        </div>
    )
}