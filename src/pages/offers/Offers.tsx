import {OfferCard} from "../../components/offerCard/OfferCard";
import {Button} from "../../components/button/Button";
import {useLocation, useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";
import {getMyOffers} from "../../api/route";
import {Loading} from "../../components/loading/Loading";
import {getSearchedData} from "../../components/search/SearchService";
import {EmptyState} from "../../components/emptyState/EmptyState";
import {useNotification} from "../../components/notification/NotificationProvider";

export const Offers = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { showSuccess, showError } = useNotification();
    const [notificationMessage, setNotificationMessage] = useState(
        location.state?.notification || ""
    );
    const [offers, setOffers] = useState([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getMyFlights = async () => {
        try {
            const {data} = await getMyOffers();
            setOffers(data);
        } catch (error) {
            showError('Failed to load your offers. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        setIsLoading(true)
        getMyFlights();
    }, []);


    useEffect(() => {
        if (notificationMessage) {
            showSuccess(notificationMessage);
            setNotificationMessage("");
        }
    }, [notificationMessage, showSuccess]);

    return (
        <>
            <div className="flex flex-col gap-[6rem] w-full">
                <h3 className="text-[2rem] font-medium">My offers</h3>
                
                {isLoading ? (
                    <div className="flex justify-center items-center min-h-[20rem] w-full">
                        <Loading/>
                    </div>
                ) : offers.length > 0 ? (
                    <div className="grid grid-cols-3 gap-[5.7rem] justify-items-center">
                        {offers.map((offer: any) => (
                            <OfferCard
                                key={offer.id}
                                withRate={false}
                                data={offer}
                                isOwnOffer={true}
                                // No buttons for user's own offers
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        illustration="no-offers"
                        title="No offers yet"
                        description="You haven't created any flight offers. Start by posting your travel route to help others ship their items."
                        primaryAction={{
                            label: "Create your first offer",
                            onClick: () => navigate('/post-offer')
                        }}
                        secondaryAction={{
                            label: "Learn how it works",
                            onClick: () => navigate('/features')
                        }}
                    />
                )}
                {/*<div className="flex justify-end gap-[4rem]">*/}
                {/*    <Button*/}
                {/*        title={"How it works"}*/}
                {/*        type={"secondary"}*/}
                {/*        handleClick={() => {*/}
                {/*        }}*/}
                {/*    />*/}
                {/*</div>*/}
            </div>
        </>
    );
};
