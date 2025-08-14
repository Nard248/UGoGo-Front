import { FC, useState, useEffect } from "react";
import { Search } from "../../components/search/Search";
import { OfferCard } from "../../components/offerCard/OfferCard";
import { Button } from "../../components/button/Button";
import { Filter } from "../singleProductPage/Filter";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { searchOffer, getAllOffers, advancedSearchOffer } from "../../api/route";
import { Loading } from "../../components/loading/Loading";
import {getSearchedData} from "../../components/search/SearchService";
import {EmptyState} from "../../components/emptyState/EmptyState";
import {useNotification} from "../../components/notification/NotificationProvider";

export const SearchResult: FC = () => {
    const [isFilterOpened, setIsFilterOpened] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasFiltersApplied, setHasFiltersApplied] = useState<boolean>(false);
    const navigate = useNavigate();
    const { showError, showInfo } = useNotification();

    useEffect(() => {
        const searchedData = getSearchedData();
        if (searchedData) {
            setSearchResults(searchedData)
            setIsLoading(false);
            return
        }
        const fetchOffers = async () => {
            setIsLoading(true);
            try {
                const response = await getAllOffers();
                setSearchResults(response.data);
            } catch (error) {
                console.error("Error fetching offers:", error);
                showError('Failed to load offers. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOffers();
    }, []);

    const handleSearchResults = async (searchParams: { origin_airport: string; destination_airport: string; takeoff_date: string }) => {
        setIsSearching(true);
        setIsLoading(true);
        setHasFiltersApplied(false);

        try {
            const response = await searchOffer(searchParams);
            setSearchResults(response.data);
        } catch (error) {
            console.error("Search Error:", error);
            showError('Search failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterApply = async (params: Record<string, any>) => {
        setIsLoading(true);
        setHasFiltersApplied(true);
        try {
            const response = await advancedSearchOffer(params);
            setSearchResults(response.data);
        } catch (error) {
            console.error('Advanced search error:', error);
            showError('Filter search failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearFilters = async () => {
        setHasFiltersApplied(false);
        setIsLoading(true);
        try {
            const response = await getAllOffers();
            setSearchResults(response.data);
            showInfo('Filters cleared. Showing all available offers.');
        } catch (error) {
            console.error('Error loading offers:', error);
            showError('Failed to load offers. Please try again.');
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

                <div className="flex flex-col gap-[7.8rem] w-full max-w-[120rem] mx-auto px-[2rem] relative">
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
                        <EmptyState
                            illustration="empty-search"
                            title={isSearching ? "No matching offers found" : "No offers available"}
                            description={
                                isSearching 
                                    ? "We couldn't find any offers matching your search criteria. Try adjusting your search parameters or browse all available offers."
                                    : hasFiltersApplied 
                                        ? "No offers match your current filters. Try adjusting your filter settings or clear them to see all offers."
                                        : "There are currently no offers available. Check back later or create an alert to be notified when new offers are posted."
                            }
                            primaryAction={{
                                label: hasFiltersApplied ? "Clear filters" : "Browse all offers",
                                onClick: hasFiltersApplied ? handleClearFilters : () => {
                                    setIsSearching(false);
                                    setHasFiltersApplied(false);
                                    handleClearFilters();
                                }
                            }}
                            secondaryAction={{
                                label: "Post your offer",
                                onClick: () => navigate('/post-offer')
                            }}
                        />
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