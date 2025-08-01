import { FC, useState, useEffect } from "react";
import { Search } from "../../components/search/Search";
import { OfferCard } from "../../components/offerCard/OfferCard";
import { Button } from "../../components/button/Button";
import { Filter } from "../singleProductPage/Filter";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { searchOffer, getAllOffers, advancedSearchOffer } from "../../api/route";
import { Loading } from "../../components/loading/Loading";

export const SearchResult: FC = () => {
    const [isFilterOpened, setIsFilterOpened] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOffers = async () => {
            setIsLoading(true);
            try {
                const response = await getAllOffers();
                setSearchResults(response.data);
            } catch (error) {
                console.error("Error fetching offers:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOffers();
    }, []);

    const handleSearchResults = async (searchParams: { origin_airport: string; destination_airport: string; takeoff_date: string }) => {
        setIsSearching(true);
        setIsLoading(true);

        try {
            const response = await searchOffer(searchParams);
            setSearchResults(response.data);
        } catch (error) {
            console.error("Search Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterApply = async (params: Record<string, any>) => {
        setIsLoading(true);
        try {
            const response = await advancedSearchOffer(params);
            setSearchResults(response.data);
        } catch (error) {
            console.error('Advanced search error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrimaryButtonClick = (item: any) => {
        localStorage.setItem('offer', JSON.stringify(item));
        navigate(`/offer/${item.id}`, { state: { item } });
    };

    return (
        <>
            <div className="flex flex-col w-full gap-[7.8rem]">
                <div className="flex justify-center w-full">
                    <Search onSearchResults={handleSearchResults} />
                </div>

                <div className="flex justify-center w-full">
                    <h1 className="text-[4rem]">
                        {isSearching ? "Search Results" : "Available Offers"}
                    </h1>
                </div>

                <div className="flex flex-col gap-[7.8rem] w-full max-w-[120rem] mx-auto px-[2rem]">
                    <div className="flex justify-end w-full">
                        <Button
                            title={'Filter'}
                            type={'tertiary'}
                            handleClick={() => setIsFilterOpened(true)}
                            icon={'filterIcon'}
                            alt={"Filter Icon"}
                        />
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center min-h-[20rem] w-full">
                            <Loading />
                        </div>
                    ) : searchResults.length > 0 ? (
                        <div className="grid grid-cols-3 gap-[5.7rem] w-full">
                            {searchResults.map((item, index) => (
                                <OfferCard
                                    key={index}
                                    withRate={false}
                                    secondaryButtonText={'View & Book'}
                                    onSecondaryClick={() => handlePrimaryButtonClick(item)}
                                    data={item}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex justify-center items-center min-h-[20rem] w-full">
                            <h1>No offers found</h1>
                        </div>
                    )}
                </div>
            </div>

            {isFilterOpened && createPortal(
                <Filter onClose={() => setIsFilterOpened(false)} onApply={handleFilterApply} />,
                document.body
            )}
        </>
    );
};