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
    const [offers, setOffers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getMyFlights = async () => {
        try {
            const {data} = await getMyOffers();
            // Sort offers by date (latest first)
            const sortedOffers = [...data].sort((a: any, b: any) => {
                // Try to sort by created_at or created date field
                const dateA = a.created_at || a.created || a.departure_datetime;
                const dateB = b.created_at || b.created || b.departure_datetime;

                if (dateA && dateB) {
                    return new Date(dateB).getTime() - new Date(dateA).getTime();
                }
                // Fallback to ID-based sorting (higher ID = more recent)
                return (b.id || 0) - (a.id || 0);
            });
            setOffers(sortedOffers);
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
            // Clear the location state to prevent re-triggering
            navigate(location.pathname, { replace: true, state: {} });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notificationMessage]);

    return (
        <>
            <div className="flex flex-col gap-[6rem] w-full px-[1.6rem] md:px-16">
                <h3 className="text-[2rem] font-medium">My offers</h3>

                {isLoading ? (
                    <div className="flex justify-center items-center min-h-[20rem] w-full">
                        <Loading/>
                    </div>
                ) : offers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2rem] md:gap-[3rem] lg:gap-[5.7rem] justify-items-center">
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
