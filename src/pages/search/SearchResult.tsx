import {FC, useState} from "react";
import {Search} from "../../components/search/Search";
import { OfferCard } from "../../components/offerCard/OfferCard";
import {Button} from "../../components/button/Button";
import { Filter } from "../singleProductPage/Filter";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";

export const SearchResult: FC = () => {
    const [isFilterOpened, setIsFilterOpened] = useState<boolean>(false);
    const navigate = useNavigate();

    return (
        <>
            <div className="flex flex-col w-full items-center gap-[7.8rem]">
                <Search/>
                <h1 className="text-[4rem]">
                    Offers for you
                </h1>
                <div className="flex flex-col gap-[7.8rem]">
                    <div className="flex justify-end w-full gap-[3.1rem]">
                        <Button title={'Filter'} type={'tertiary'} handleClick={() => setIsFilterOpened(true)} icon={'filterIcon'} alt={"Filter Icon"}/>
                        {/* <Button title={'Post an item'} type={'primary'} handleClick={() => { navigate("/items")
                        }}/> */}
                    </div>
                    <div className="grid grid-cols-3 gap-[5.7rem]">
                        <OfferCard primaryButtonText={'Send a request'} secondaryButtonText={'Learn more'} />
                        <OfferCard primaryButtonText={'Send a request'} secondaryButtonText={'Learn more'} />
                        <OfferCard primaryButtonText={'Send a request'} secondaryButtonText={'Learn more'} />
                        <OfferCard primaryButtonText={'Send a request'} secondaryButtonText={'Learn more'} />
                        <OfferCard primaryButtonText={'Send a request'} secondaryButtonText={'Learn more'} />
                        <OfferCard primaryButtonText={'Send a request'} secondaryButtonText={'Learn more'} />
                        <OfferCard primaryButtonText={'Send a request'} secondaryButtonText={'Learn more'} />
                        <OfferCard primaryButtonText={'Send a request'} secondaryButtonText={'Learn more'} />
                    </div>
                </div>
            </div>
            {isFilterOpened && createPortal(
                <Filter onClose={() => setIsFilterOpened(false)} />,
                document.body
            )}
        </>
    )
}