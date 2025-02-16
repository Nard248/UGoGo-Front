import checkIcon from './../../assets/icons/check.svg'
import {Button} from "../../components/button/Button";

export const PaymentConfirmation = () => {
    return (
        <div className="flex flex-col items-center my-0 mx-auto">
            <div className="flex bg-[#73B2B2] rounded-full w-[7.2rem] h-[7.2rem] mb-[1.3rem]">
                <img src={checkIcon} alt="Check icon"/>
            </div>
            <h2 className="text-[2.8rem] font-semibold mb-[1.1rem]">
                Payment Successful
            </h2>
            <span className="text-[2.2rem] font-medium mb-[3.9rem]">
                Thank you for trusting us!
            </span>
            <Button title={'Back to the homepage'} type={'primary'} handleClick={() => {}} />
        </div>
    )
}