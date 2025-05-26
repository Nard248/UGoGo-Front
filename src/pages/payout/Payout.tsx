import { Label } from "../../components/label/Label"
import {Input} from "../../components/input/Input";
import {Button} from "../../components/button/Button";
import plusIcon from "./../../assets/icons/plus.svg"
import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {createPortal} from "react-dom";
import {SelectItemPopup} from "../../components/selectItemPopup/SelectItemPopup";
import {AddCardPopup} from "./AddCardPopup";
import {IBankCard, IPayout} from "../../types/global";
import {createBankCard, getBankCard, payout} from "../../api/route";

export const Payout = () => {
    const [isAddCardPopupOpen, setIsAddCardPopupOpen] = useState(false);
    const [cards, setCards] = useState<IBankCard[]>([]);
    const [selectedCard, setSelectedCard] = useState<IBankCard | null>(null);
    const [formData, setFormData] = useState<IPayout>({} as IPayout);

    const getCards = async () => {
        const cards = await getBankCard();
        console.log({cards});
        setCards(cards);
    }
    useEffect(() => {
        getCards()
    }, [])

    const openAddCardPopup = () => {
        setIsAddCardPopupOpen(true);
    }

    const onCardCreate = async (data: IBankCard) => {
        const createdCard = await createBankCard(data);
        console.log({createdCard});
    }

    const onPayout = async () => {
        console.log(formData);
        const data = await payout(formData);
        console.log({data});
    }

    return (
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
                                    className={`flex flex-col max-w-[40rem] w-full p-[2rem] gap-[1rem] max-h-[13.5rem] h-full justify-evenly rounded-[1rem] bg-amber-500 text-white text-[2rem] ${card.card_id === selectedCard?.card_id ? 'ml-[5rem]' : ''}`} onClick={() => {
                                    setSelectedCard(card);
                                    setFormData({...formData, card_id: card.card_id || 0})
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
                                        **** **** **** 6749
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
                        <div className="flex justify-between">
                            <span>
                                Total Balance
                            </span>
                            <span>
                                200 USD
                            </span>
                        </div>
                        <Label title="Amount to transfer" htmlFor="amount">
                            <Input type="number" placeholder="USD" handleChange={(e) => setFormData({...formData, transfer_amount: +e.target.value})}/>
                        </Label>
                        <Button type="primary" title="Transfer to the card" handleClick={onPayout}/>
                    </div>
                </div>
            </div>
            {isAddCardPopupOpen && createPortal(<AddCardPopup onClick={onCardCreate} onClose={() => setIsAddCardPopupOpen(false)} />, document.body)}
        </div>
    )
}