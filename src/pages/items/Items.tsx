import {OfferCard} from "../../components/offerCard/OfferCard";
import {Button} from "../../components/button/Button";
import { useNavigate } from "react-router";
import {getItems} from "../../api/route";
import {useEffect, useState} from "react";
import { Loading } from "../../components/loading/Loading";

export const Items = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        getItemsQuery();
    }, [])

    const getItemsQuery = async () => {
        const data = await getItems();
        setItems(data.data.results || []);
    }

    const findOffer = () => {

    }

    return (
        items.length ?
        <div className="flex flex-col gap-[6rem] w-full">
            <div className="flex justify-between">
                <h3 className="text-[2rem] font-medium">
                    My items
                </h3>
                <Button title={'Add item'} type={'primary'} handleClick={() => {navigate("/add-item")}} />
            </div>
            <div className="grid grid-cols-3 gap-[5.7rem] justify-items-center">
                {items.map((item) => (
                        <OfferCard onSecondaryClick={findOffer} secondaryButtonText={'Delete'} data={item}/>
                    ))
                }
            </div>
            <div className="flex justify-end gap-[4rem]">
                <Button title={'How it works'} type={'secondary'} handleClick={() => {}} />
                <Button title={'Find offers'} type={'primary'} handleClick={() => {}} />
            </div>
        </div>
:
    <Loading />
    )
}
