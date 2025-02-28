import {OfferCard} from "../../components/offerCard/OfferCard";
import {Button} from "../../components/button/Button";

export const Offers = () => {
    return (
        <div className="flex flex-col gap-[6rem] w-full">
            <h3 className="text-[2rem] font-medium">
                My offers
            </h3>
            <div className="grid grid-cols-3 gap-[5.7rem] justify-items-center">
                <OfferCard primaryButtonText={'Accept'} secondaryButtonText={'Decline'}/>
                <OfferCard primaryButtonText={'Accept'} secondaryButtonText={'Decline'}/>
                <OfferCard primaryButtonText={'Accept'} secondaryButtonText={'Decline'}/>
                <OfferCard primaryButtonText={'Accept'} secondaryButtonText={'Decline'}/>
                <OfferCard primaryButtonText={'Accept'} secondaryButtonText={'Decline'}/>
                <OfferCard primaryButtonText={'Accept'} secondaryButtonText={'Decline'}/>
                <OfferCard primaryButtonText={'Accept'} secondaryButtonText={'Decline'}/>
                <OfferCard primaryButtonText={'Accept'} secondaryButtonText={'Decline'}/>
            </div>
            <div className="flex justify-end gap-[4rem]">
                <Button title={'How it works'} type={'secondary'} handleClick={() => {}} />
            </div>
        </div>
    )
}