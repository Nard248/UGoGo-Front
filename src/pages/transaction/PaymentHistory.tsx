import {PaymentHistoryCard} from "./PaymentHistoryCard";


export const PaymentHistory = () => {
    return (
        <div className="flex flex-col gap-[35px] w-full">
            <h1 className="text-[2rem] font-medium">
                Payment history
            </h1>
            <span className="text-[1.6rem] font-medium">
                2024
            </span>
            <div className="flex flex-col gap-[3.5rem] w-full">
                <PaymentHistoryCard />
                <PaymentHistoryCard />
                <PaymentHistoryCard />
            </div>
        </div>
    )
}