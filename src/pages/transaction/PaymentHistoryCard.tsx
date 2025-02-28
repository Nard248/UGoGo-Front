import classNames from "classnames";
import planIcon from './../../assets/icons/plan.svg'

export const PaymentHistoryCard = () => {
    return (
        <div className={classNames(
            `flex items-center gap-[2.6rem] rounded-xl border border-solid border-[#D5D7DA] px-[3.2rem] py-[2.3rem] w-3/6`,
        )}>
            <div className={classNames(
                `flex p-1.5 rounded-full`,
            )}>
                <img src={planIcon} alt="Message Icon" className="w-full"/>
            </div>
            <div className="flex flex-col w-full gap-[1rem]">
                <span className="text-[2rem] font-medium">
                    Paid on Jan 20
                </span>
                <div className="flex justify-between items-center text-[1.4rem]">
                    <span className="">
                        Jan 23 Yerevan - Moscow
                    </span>
                    <span className="font-bold">
                        -20$
                    </span>
                </div>
            </div>
        </div>
    )
}