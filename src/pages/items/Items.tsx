import {OfferCard} from "../../components/offerCard/OfferCard";
import {Button} from "../../components/button/Button";

export const Items = () => {
    return (
        <div className="flex flex-col gap-[6rem] w-full">
            <div className="flex justify-between">
                <h3 className="text-[2rem] font-medium">
                    My items
                </h3>
                <Button title={'Add item'} type={'primary'} handleClick={() => {}} />
            </div>
            <div className="grid grid-cols-3 gap-[5.7rem] justify-items-center">
                <OfferCard primaryButtonText={'Find an offer'} secondaryButtonText={'Edit item'}/>
                <OfferCard primaryButtonText={'Find an offer'} secondaryButtonText={'Edit item'}/>
                <OfferCard primaryButtonText={'Find an offer'} secondaryButtonText={'Edit item'}/>
                <OfferCard primaryButtonText={'Find an offer'} secondaryButtonText={'Edit item'}/>
                <OfferCard primaryButtonText={'Find an offer'} secondaryButtonText={'Edit item'}/>
                <OfferCard primaryButtonText={'Find an offer'} secondaryButtonText={'Edit item'}/>
                <OfferCard primaryButtonText={'Find an offer'} secondaryButtonText={'Edit item'}/>
                <OfferCard primaryButtonText={'Find an offer'} secondaryButtonText={'Edit item'}/>
            </div>
            <div className="flex justify-end gap-[4rem]">
                <Button title={'How it works'} type={'secondary'} handleClick={() => {}} />
                <Button title={'Find offers'} type={'primary'} handleClick={() => {}} />
            </div>
        </div>
    )
}