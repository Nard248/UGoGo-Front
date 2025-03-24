import {OfferCard} from "../../components/offerCard/OfferCard";
import {Button} from "../../components/button/Button";

export const Requests = () => {
    return (
        <div className="flex flex-col gap-[6rem] w-full">
            <h3 className="text-[2rem] font-medium">
                My requests
            </h3>
            <div className="grid grid-cols-3 gap-[5.7rem] justify-items-center">
                <OfferCard primaryButtonText={'Decline'} secondaryButtonText={'Accept'}/>
                <OfferCard primaryButtonText={'Decline'} secondaryButtonText={'Accept'}/>
                <OfferCard primaryButtonText={'Decline'} secondaryButtonText={'Accept'}/>
                <OfferCard primaryButtonText={'Decline'} secondaryButtonText={'Accept'}/>
                <OfferCard primaryButtonText={'Decline'} secondaryButtonText={'Accept'}/>
                <OfferCard primaryButtonText={'Decline'} secondaryButtonText={'Accept'}/>
                <OfferCard primaryButtonText={'Decline'} secondaryButtonText={'Accept'}/>
                <OfferCard primaryButtonText={'Decline'} secondaryButtonText={'Accept'}/>
                <OfferCard primaryButtonText={'Decline'} secondaryButtonText={'Accept'}/>
                <OfferCard primaryButtonText={'Decline'} secondaryButtonText={'Accept'}/>
            </div>
            <div className="flex justify-end gap-[4rem]">
                <Button title={'How it works'} type={'secondary'} handleClick={() => {}} />
                <Button title={'Find offers'} type={'primary'} handleClick={() => {}} />
            </div>
        </div>
    )
}