import {ChangeEvent, FC, useState} from "react";
import close from "../../assets/icons/closeIcon.svg";
import {Button} from "../../components/button/Button";
import {Label} from "../../components/label/Label";
import {Input} from "../../components/input/Input";
import {IBankCard} from "../../types/global";



interface IConfirmationPopup {
    buttonText?: string;
    onClick: (data: IBankCard) => void;
    onClose: () => void;
}

function formatCardNumber(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    const groups = digits.match(/.{1,4}/g);
    return groups ? groups.join(" ") : "";
}

function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export const AddCardPopup: FC<IConfirmationPopup> = ({onClick, onClose}) => {
    const [formData, setFormData] = useState<IBankCard>({} as IBankCard)

    const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const formatted = formatCardNumber(e.target.value)
        e.target.value = formatted;
        setFormData({...formData, card_number: e.target.value.split(' ').join('')});
    }

    const handleExpDateChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const formatted = formatExpiry(e.target.value)
        e.target.value = formatted;
        setFormData({...formData, expiration_date: e.target.value})
    }

    return (
        <div
            className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex justify-center items-center w-full h-full bg-[#d0e3eb8c]">
            <div
                className="flex flex-col p-[3rem] gap-[2rem] w-[90rem] max-h-[60rem] rounded-[.8rem] border-[#D5D7DA] border-solid border bg-[#fff]">
                <div className="flex items-center justify-end">
                    <div className="w-[2rem] h-[2rem] cursor-pointer" onClick={onClose}>
                        <img src={close} alt="Close"/>
                    </div>
                </div>
                <div className="flex w-full justify-between">
                    <div className="flex w-full rounded-full items-center mb-[1.3rem]">
                        <div
                            className="flex flex-col max-w-[40rem] w-full p-[2rem] gap-[1rem] max-h-[13.5rem] h-full justify-evenly rounded-[1rem] bg-amber-500 text-white text-[2rem]">
                            <div className="flex justify-between items-center">
                                <span>
                                    VISA
                                </span>
                                <span>
                                    NFC
                                </span>
                            </div>
                            <div className="flex items-center">
                                **** **** **** 6749
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center gap-[5rem]">
                        <div className="flex flex-col gap-[1rem] w-full">
                            <Label title="Card number" htmlFor="amount">
                                <Input type="text" handleChange={(e) => handleCardNumberChange(e)} />
                            </Label>
                            <Label title="Name on card" htmlFor="amount">
                                <Input type="text" handleChange={(e) => setFormData({...formData, card_holder_name: e.target.value})}/>
                            </Label>
                            <div className="flex items-end gap-[1.5rem]">
                                <div className="flex flex-col gap-[1.5rem]">
                                    <Label title="Valid through" htmlFor="amount">
                                        <Input type="text" handleChange={(e) => handleExpDateChange(e)}/>
                                    </Label>
                                </div>
                                <Button type="primary" title="Add card" handleClick={() => onClick(formData)}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}