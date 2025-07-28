import { Label } from "../../components/label/Label"
import {Input} from "../../components/input/Input";
import {Button} from "../../components/button/Button";
import plusIcon from "./../../assets/icons/plus.svg"
import {useEffect, useState} from "react";
import {createPortal} from "react-dom";
import {AddCardPopup} from "./AddCardPopup";
import {IBankCard, IPayout} from "../../types/global";
import {createBankCard, getBankCard, payout, verifyPayout} from "../../api/route";
import {VerificationPopup} from "./VerificationPopup";
import {Loading} from "../../components/loading/Loading";
import {AlertMessage} from "../../components/alertMessage/AlertMessage";

function maskCardNumber(cardNumber: string): string {
    const visibleDigits = 4;
    const maskedSection = '*'.repeat(cardNumber.length - visibleDigits);
    const visibleSection = cardNumber.slice(-visibleDigits);
    return maskedSection + visibleSection;
}

export const Payout = () => {
    const [isAddCardPopupOpen, setIsAddCardPopupOpen] = useState(false);
    const [isVerificationPopupOpen, setIsVerificationPopupOpen] = useState(false);
    const [cards, setCards] = useState<IBankCard[]>([]);
    const [selectedCard, setSelectedCard] = useState<IBankCard | null>(null);
    const [formData, setFormData] = useState<IPayout>({} as IPayout);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState<string | null>(null);
    const [amountError, setAmountError] = useState<string | null>(null);
    const [balance, setBalance] = useState<number | null>(null)
    const [currency, setCurrency] = useState("USD")

    const getCards = async () => {
        const cards = await getBankCard();
        setCards(cards);
    }
    useEffect(() => {
        const cachedUser = localStorage.getItem("userDetails");
        if (cachedUser) {
            const {balance} = JSON.parse(cachedUser);
            setBalance(+balance);
        }

        getCards()
    }, [])

    const openAddCardPopup = () => {
        setIsAddCardPopupOpen(true);
    }

    const onCardCreate = async (data: IBankCard) => {
        try {
            await createBankCard(data);
            setIsAddCardPopupOpen(false);
            await getCards()
        } catch (e) {
            console.log(e);
        }
    }

    const onVerify = async () => {
        setIsLoading(true)
        try {
            const isVerified = await verifyPayout();
            setIsVerificationPopupOpen(true);
        } catch (e: any) {
            setIsError(e.response.data.message)
            console.log(e);
        }
        setIsLoading(false)
    }

    const onPayout = async (code: string) => {
        setFormData({...formData, verification_code: code})
        try {
            await payout({...formData, verification_code: code});
        } catch (e) {
            console.log(e);
        }
        setIsVerificationPopupOpen(false);
    }

    useEffect(() => {
        if (!isError) {
            return;
        }

        setTimeout(() => {
            setIsError(null)
        }, 3000)
    }, [isError])

    const handleAmountChange = (e: (React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>)) => {
        if (+e.target.value > (balance ?? 0)) {
            setAmountError('Amount is greater than your balance')
        } else {
            amountError && setAmountError(null)
        }
        setFormData({...formData, transfer_amount: +e.target.value});
    }

    return (
        isLoading ?
            <Loading />
            :
            <>
                {isError &&
                    <div className="fixed top-0 right-0 w-full p-[1rem]">
                        <AlertMessage type={'error'} text={isError} className={"text-[1.8rem]"}/>
                    </div>
                }
                <div className="flex flex-col gap-[2.5rem] w-full">
                    <h1 className="text-[3.6rem] font-semibold text-center">
                        PayOut
                    </h1>
                    <div className="flex flex-col gap-[2rem]">
                        <h2 className="text-[2.5rem] font-normal">
                            Select the card you want to transfer to
                        </h2>
                        <div className="flex justify-between gap-[2rem]">
                            <div className="flex flex-wrap flex-1 gap-[2rem]">
                                {!!cards.length &&
                                    cards.map(card => (
                                        <div
                                            key={card.id}
                                            className={`flex flex-col max-w-[40rem] w-full p-[2rem] gap-[1rem] max-h-[13.5rem] h-full justify-evenly rounded-[1rem] bg-amber-500 text-white text-[2rem] cursor-pointer ${card.id === selectedCard?.id ? 'ml-[5rem]' : ''}`}
                                            onClick={() => {
                                                setSelectedCard(card);
                                                setFormData({...formData, id: card.id || 0})
                                            }}>
                                            <div className="flex justify-between items-center">
                                            <span>
                                                VISA
                                            </span>
                                                <span>
                                                    NFC
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                {maskCardNumber(card.card_number)}
                                            </div>
                                        </div>
                                    ))
                                }
                                <div
                                    className="flex flex-col border border-solid border-[#F9A34B] max-w-[40rem] w-full p-[2rem] gap-[1rem] max-h-[13.5rem] h-full justify-evenly rounded-[1rem] text-[2rem] items-center cursor-pointer"
                                    onClick={openAddCardPopup}
                                >
                                    <div className="flex justify-between items-center w-[4rem] h-[4rem]">
                                        <img src={plusIcon} alt="Plus icon" className="w-full"/>
                                    </div>
                                    <div className="flex items-center">
                                        Add new card
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-[3rem] w-[40%]">
                                <div className="flex justify-between text-[1.6rem]">
                                <span>
                                    Total Balance
                                </span>
                                    <span className="font-semibold">
                                    {balance} {currency}
                                </span>
                                </div>
                                <Label title="Amount to transfer" htmlFor="amount">
                                    <Input type="number" placeholder="USD" errorMessage={amountError} handleChange={handleAmountChange}/>
                                </Label>
                                <Button type="primary" title="Transfer to the card" classNames={"text-[1.4rem]"} disabled={!formData.transfer_amount || !formData.id || amountError !== null} handleClick={onVerify}/>
                            </div>
                        </div>
                    </div>

                    {isAddCardPopupOpen && createPortal(<AddCardPopup onClick={onCardCreate} onClose={() => setIsAddCardPopupOpen(false)} />, document.body)}
                    {isVerificationPopupOpen && createPortal(<VerificationPopup onClick={onPayout} onClose={() => setIsVerificationPopupOpen(false)} />, document.body)}
                </div>
            </>
    )
}