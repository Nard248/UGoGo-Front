import { OfferCard } from "../../components/offerCard/OfferCard";
import { Button } from "../../components/button/Button";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {getMyOffers} from "../../api/route";

export const Offers = () => {
    const location = useLocation();
    const [notificationMessage, setNotificationMessage] = useState(
        location.state?.notification || ""
    );
    const [offers, setOffers] = useState([]);

    const getMyFlights = async () => {
        const {data} = await getMyOffers();
        console.log(data);
        setOffers(data)
    }

    useEffect(() => {
        getMyFlights();
    }, []);


    useEffect(() => {
        if (notificationMessage) {
            const timer = setTimeout(() => {
                setNotificationMessage(""); // Hide notification after 2 seconds
            }, 2000);
            return () => clearTimeout(timer); // Cleanup timeout on component unmount
        }
    }, [notificationMessage]);

    return (
        <>
            {notificationMessage && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg text-center animate-fade-out">
                    <p>{notificationMessage}</p>
                </div>
            )}
            <div className="flex flex-col gap-[6rem] w-full">
                <h3 className="text-[2rem] font-medium">My offers</h3>
                <div className="grid grid-cols-3 gap-[5.7rem] justify-items-center">
                    {offers.length > 0 && offers.map((offer: any) => (
                        <OfferCard
                            withRate={false}
                            primaryButtonText={"Accept"}
                            secondaryButtonText={"Decline"}
                            data={offer}
                        />
                    ))}
                </div>
                <div className="flex justify-end gap-[4rem]">
                    <Button
                        title={"How it works"}
                        type={"secondary"}
                        handleClick={() => {}}
                    />
                </div>
            </div>
        </>
    );
};
