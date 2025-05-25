import './Balance.scss'
import {Button} from "../../components/button/Button";
import {useNavigate} from "react-router-dom";

export const Balance = () => {
    const navigate = useNavigate();

    return (
        <div className="faq flex flex-col gap-[1.8rem] w-full ">
            <div className="faq__header flex items-center justify-center">
                <h1 className="faq__title">Balance</h1>
            </div>
            <div className="faq__content flex flex-col gap-[4.2rem]">
                <div className="flex flex-col border-b border-solid pb-[1rem] font-semibold">
                    <h2 className="text-[1.8rem] text-[#00000082]">
                        Total balances
                    </h2>
                    <div className="faq__rowQuestion flex items-center justify-between">
                        <span className="faq__rowText text-[3.6rem]">
                            200 USD
                        </span>
                        <Button type="primary" title="Transfer to the card" classNames="text-[1.8rem]" handleClick={() => navigate('/payout')}/>
                    </div>
                </div>
                <div className="flex flex-col font-semibold gap-[1rem]">
                    <h2 className="text-[2.4rem]">
                        Transactions
                    </h2>
                    <div className="flex flex-col gap-[3rem]">
                        <div className="flex flex-col">
                            <h3 className="text-[1.8rem] text-[#00000082]">Today</h3>
                            <div className="faq__row">
                                <div className="faq__rowQuestion flex items-center justify-between">
                        <span className="faq__rowText">
                            How do I create a package listing?
                        </span>
                                    <span className="faq__rowText">
                                        +30 USD
                                    </span>
                                </div>
                            </div>
                            <div className="faq__row">
                                <div className="faq__rowQuestion flex items-center justify-between">
                        <span className="faq__rowText">
                            What happens if my package isn't delivered?
                        </span>
                                    <span className="faq__rowText">
                                        +30 USD
                                    </span>
                                </div>
                            </div>
                            <div className="faq__row">
                                <div className="faq__rowQuestion flex items-center justify-between">
                        <span className="faq__rowText">
                            How does UGOGO ensure user safety?
                        </span>
                                    <span className="faq__rowText">
                                        +30 USD
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-[1.8rem] text-[#00000082]">April 20</h3>
                            <div className="faq__row">
                                <div className="faq__rowQuestion flex items-center justify-between">
                        <span className="faq__rowText">
                            How do I create a package listing?
                        </span>
                                    <span className="faq__rowText">
                                        +30 USD
                                    </span>
                                </div>
                            </div>
                            <div className="faq__row">
                                <div className="faq__rowQuestion flex items-center justify-between">
                        <span className="faq__rowText">
                            What happens if my package isn't delivered?
                        </span>
                                    <span className="faq__rowText">
                                        +30 USD
                                    </span>
                                </div>
                            </div>
                            <div className="faq__row">
                                <div className="faq__rowQuestion flex items-center justify-between">
                        <span className="faq__rowText">
                            How does UGOGO ensure user safety?
                        </span>
                                    <span className="faq__rowText">
                                        +30 USD
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}