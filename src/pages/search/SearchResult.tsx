import { FC, useState, useEffect } from "react";
import { Search } from "../../components/search/Search";
import { OfferCard } from "../../components/offerCard/OfferCard";
import { Button } from "../../components/button/Button";
import { Filter } from "../singleProductPage/Filter";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { searchOffer, getAllOffers } from "../../api/route"; 

export const SearchResult: FC = () => {
    const [isFilterOpened, setIsFilterOpened] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<any[]>([]); 
    const [isSearching, setIsSearching] = useState<boolean>(false); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const response = await getAllOffers(); 
                setSearchResults(response.data); 
            } catch (error) {
                console.error("Error fetching offers:", error);
            }
        };

        fetchOffers();
    }, []);

    const handleSearchResults = async (searchParams: { origin_airport: string; destination_airport: string; takeoff_date: string }) => {
        setIsSearching(true);

        try {
            const response = await searchOffer(searchParams);
            setSearchResults(response.data); 
        } catch (error) {
            console.error("Search Error:", error);
        }
    };

    const handlePrimaryButtonClick = (item: any) => {
        localStorage.setItem('offer', JSON.stringify(item));
        navigate(`/offer/${item.id}`, { state: { item } });
    };

    return (
        <>
            <div className="flex flex-col w-full items-center gap-[7.8rem]">
                <Search onSearchResults={handleSearchResults} />
                
                <h1 className="text-[4rem]">
                    {isSearching ? "Search Results" : "Available Offers"}
                </h1>

                <div className="flex flex-col gap-[7.8rem]">
                    <div className="flex justify-end w-full gap-[3.1rem]">
                        <Button 
                            title={'Filter'} 
                            type={'tertiary'} 
                            handleClick={() => setIsFilterOpened(true)} 
                            icon={'filterIcon'} 
                            alt={"Filter Icon"} 
                        />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-[5.7rem]">
                        {searchResults.length > 0 ? (
                            searchResults.map((item, index) => (
                                <OfferCard 
                                    key={index}
                                    secondaryButtonText={'View & Book'}
                                    onSecondaryClick={() => handlePrimaryButtonClick(item)}
                                    data={item}
                                />
                            ))
                        ) : (
                            <h1>No offers found</h1>
                        )}
                    </div>
                </div>
            </div>

            {isFilterOpened && createPortal(
                <Filter onClose={() => setIsFilterOpened(false)} />,
                document.body
            )}
        </>
    );
};
