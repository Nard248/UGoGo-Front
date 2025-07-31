// import {ChangeEvent, FC, useEffect, useState} from "react";
// import {OfferDetails} from "../../components/offerDetails/OfferDetails";
// import packageIcon from "./../../assets/icons/package.svg";
// import {Button} from "../../components/button/Button";
// import {getItems, getSingleProduct} from "../../api/route";
// import {Input} from "../../components/input/Input";
// import {Label} from "../../components/label/Label";
// import {useLocation, useParams, useSearchParams} from "react-router-dom";
// import "./SingleProductPage.scss";
// import {createPortal} from "react-dom";
// import {SelectItemPopup} from "../../components/selectItemPopup/SelectItemPopup";
// import useDebouncedCallback from "../../hooks/useDebounceCallback";

// export const SingleProductPage: FC = () => {
//     const [searchParams, setSearchParams] = useSearchParams();
//     const {id} = useParams();
//     const location = useLocation();
//     const offerData = location.state?.offerData;

//     const [data, setData] = useState(null);
//     const [items, setItems] = useState<any[]>([]);
//     const [isItemPopupOpened, setIsItemPopupOpened] = useState(false);
//     const [comments, setComments] = useState<string | null>(null);

//     useEffect(() => {
//         window.scrollTo(0, 0);
//     }, []);

//     useEffect(() => {
//         getSingleProduct(`${id}`).then(data => {
//             setData(data.data.offer)
//         })
//     }, [])

//     useEffect(() => {
//         if (searchParams.get('modal') === 'book') {
//             setIsItemPopupOpened(true);
//             getItemsQuery();
//         }
//     }, [])

//     let timeout: any;

//     const handleInputChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
//         clearTimeout(timeout);
//         timeout = setTimeout(() => {
//             setComments(e.target.value)
//         }, 300);

//     }

//     const getItemsQuery = async () => {
//         const data = await getItems();
//         setItems(data.data.results || []);
//     }

//     const onBook = async () => {
//         const offerData = localStorage.getItem('offer');
//         if (offerData) {
//             const updatedOfferData = {...JSON.parse(offerData), comments};
//             localStorage.setItem('offer', JSON.stringify(updatedOfferData))
//         }
//         setSearchParams('modal=book');
//         await getItemsQuery();
//         setIsItemPopupOpened(true)
//     }

//     const onBookClose = () => {
//         searchParams.delete('modal');
//         setSearchParams(searchParams);
//         setIsItemPopupOpened(false);
//     }

//     // const {price, available_space, available_weight, user_flight, user} =
//     //     offerData;
//     // const {from_airport, to_airport, departure_datetime, arrival_datetime} =
//     // user_flight?.flight || {};

//     return (
//         <>
//             <div className="singleProductPage">
//                 <div className="px-16">
//                     <OfferDetails
//                         flightNumber={offerData?.user_flight?.flight_number}
//                         fromCity={offerData?.flight?.from_airport?.city.city_name}
//                         toCity={offerData?.to_airport?.city.city_name}
//                     />
//                 </div>
//                 <div className="px-16">
//                     <div className="singleProductPage__productInfo">
//                         <div className="singleProductPage__productInfo__header postOffer__header">
//                             <h3 className="singleProductPage__productInfo__header__title singleProductPage__title">
//                                 Flight & Item Details
//                             </h3>
//                         </div>
//                         <div className="singleProductPage__productInfo__table">
//                             <div className="singleProductPage__productInfo__table__item">
//                                 <div className="singleProductPage__productInfo__table__item__title">
//                                     <div className="singleProductPage__productInfo__table__item__title__icon">
//                                         <img src={packageIcon} alt="Package icon"/>
//                                     </div>
//                                     Available space for packages
//                                 </div>
//                                 <div className="singleProductPage__productInfo__table__item__info">
//                                     {offerData?.available_weight || "N/A"} kg / {offerData?.available_space || "N/A"} m³
//                                 </div>
//                             </div>
//                             <div className="singleProductPage__productInfo__table__item">
//                                 <div className="singleProductPage__productInfo__table__item__title">
//                                     <div className="singleProductPage__productInfo__table__item__title__icon">
//                                         <img src={packageIcon} alt="Package icon"/>
//                                     </div>
//                                     Departure date & time
//                                 </div>
//                                 <div className="singleProductPage__productInfo__table__item__info">
//                                     {offerData?.departure_datetime || "N/A"}
//                                 </div>
//                             </div>
//                             <div className="singleProductPage__productInfo__table__item">
//                                 <div className="singleProductPage__productInfo__table__item__title">
//                                     <div className="singleProductPage__productInfo__table__item__title__icon">
//                                         <img src={packageIcon} alt="Package icon"/>
//                                     </div>
//                                     Arival date & time
//                                 </div>
//                                 <div className="singleProductPage__productInfo__table__item__info">
//                                     {offerData?.arrival_datetime || "N/A"}
//                                 </div>
//                             </div>
//                             <div className="singleProductPage__productInfo__table__item">
//                                 <div className="singleProductPage__productInfo__table__item__title">
//                                     <div className="singleProductPage__productInfo__table__item__title__icon">
//                                         <img src={packageIcon} alt="Package icon"/>
//                                     </div>
//                                     Items can not be transported
//                                 </div>
//                                 <div className="singleProductPage__productInfo__table__item__info">
//                                     item, item, item, item
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="bg-[--primary-background] h-[55px]"></div>
//                 <div className="px-16">
//                     <div className="singleProductPage__notes">
//                         <div className="singleProductPage__notes__title">
//                             <p></p>
//                         </div>
//                         <div className="singleProductPage__notes__content">
//                             <div className="singleProductPage__notes__content__area">
//                                 <Label
//                                     title={"Additional notes from traveler"}
//                                     htmlFor={"notes"}
//                                     classnames={"singleProductPage__notes__title"}
//                                 >
//                                     <Input
//                                         type={"textarea"}
//                                         placeholder={"Enter a description..."}
//                                         id={"notes"}
//                                         classnames={"postOffer__input"}
//                                         handleChange={handleInputChange}
//                                     />
//                                 </Label>
//                             </div>
//                             <div className="flex flex-col singleProductPage__flightItemsDetails">
//                                 <div className="singleProductPage__productInfo__header postOffer__header">
//                                     <h3 className="singleProductPage__productInfo__header__title singleProductPage__title">
//                                         Price Details
//                                     </h3>
//                                 </div>
//                                 <div className="singleProductPage__flightItemsDetails__content">
//                                     <div
//                                         className="flex justify-between singleProductPage__flightItemsDetails__content__item">
//                                       <span className="singleProductPage__flightItemsDetails__content__itemTitle">
//                                         Delivery fee
//                                       </span>
//                                         <span className="singleProductPage__flightItemsDetails__content__itemValue">
//                                             ${offerData?.price || 0}
//                                         </span>
//                                     </div>
//                                     <div className="flex justify-between singleProductPage__flightItemsDetails__content__item">
//                                       <span className="singleProductPage__flightItemsDetails__content__itemTitle">
//                                         Commission fee
//                                       </span>
//                                       <span className="singleProductPage__flightItemsDetails__content__itemValue">
//                                         $1
//                                       </span>
//                                     </div>
//                                     <div className="flex justify-between singleProductPage__flightItemsDetails__content__itemTotal">
//                                       <span
//                                           className="singleProductPage__flightItemsDetails__content__itemTitle singleProductPage__flightItemsDetails__content__itemTotal__title">
//                                         Total
//                                       </span>
//                                       <span className="singleProductPage__flightItemsDetails__content__itemValue">
//                                         {" "} ${(offerData?.price ? Number(offerData?.price) + 1 : 1).toFixed(2)}
//                                       </span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="flex justify-end pt-9">
//                             <Button
//                                 classNames="singleProductPage__notes__content__button"
//                                 title={"Book flight"}
//                                 type={"primary"}
//                                 handleClick={onBook}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             {isItemPopupOpened && createPortal(<SelectItemPopup data={items} onClose={onBookClose}/>, document.body)}
//         </>
//     )
// }
import { ChangeEvent, FC, useEffect, useState } from "react";
import { OfferDetails } from "../../components/offerDetails/OfferDetails";
import packageIcon from "./../../assets/icons/package.svg";
import { Button } from "../../components/button/Button";
import { getItems, getSingleProduct } from "../../api/route";
import { Input } from "../../components/input/Input";
import { Label } from "../../components/label/Label";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import "./SingleProductPage.scss";
import { createPortal } from "react-dom";
import { SelectItemPopup } from "../../components/selectItemPopup/SelectItemPopup";

interface OfferDataType {
  id: number;
  price: string;
  available_space: string;
  available_weight: string;
  departure_datetime: string;
  arrival_datetime: string;
  user_flight: {
    flight_number: string;
    flight: {
      departure_datetime: string;
      arrival_datetime: string;
      from_airport: {
        airport_code: string;
        airport_name: string;
        city: {
          city_name: string;
          country: {
            country_name: string;
          };
        };
      };
      to_airport: {
        airport_code: string;
        airport_name: string;
        city: {
          city_name: string;
          country: {
            country_name: string;
          };
        };
      };
    };
  };
  user: {
    full_name: string;
    email: string;
    is_email_verified: boolean;
    passport_verification_status: string;
  };
  // Add more fields here as necessary
}

export const SingleProductPage: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  // Get passed offer data from navigation state, key is "offer"
  const passedOfferData = location.state?.offer as OfferDataType | undefined;

  const [offerData, setOfferData] = useState<OfferDataType | null>(passedOfferData || null);
  const [items, setItems] = useState<any[]>([]);
  const [isItemPopupOpened, setIsItemPopupOpened] = useState(false);
  const [comments, setComments] = useState<string | null>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // If no offerData passed, fetch it by id
  useEffect(() => {
    if (!offerData && id) {
      getSingleProduct(id).then((res) => {
        setOfferData(res.data.offer);
      });
    }
  }, [id, offerData]);

  // Open popup if modal=book in URL
  useEffect(() => {
    if (searchParams.get("modal") === "book") {
      setIsItemPopupOpened(true);
      getItemsQuery();
    }
  }, [searchParams]);

  let timeout: any;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setComments(e.target.value);
    }, 300);
  };

  const getItemsQuery = async () => {
    const data = await getItems();
    setItems(data.data.results || []);
  };

  const onBook = async () => {
    // Save comments + offer to localStorage
    if (offerData) {
      const storedOffer = localStorage.getItem("offer");
      const updatedOfferData = storedOffer ? { ...JSON.parse(storedOffer), comments } : { ...offerData, comments };
      localStorage.setItem("offer", JSON.stringify(updatedOfferData));
    }
    setSearchParams({ modal: "book" });
    await getItemsQuery();
    setIsItemPopupOpened(true);
  };

  const onBookClose = () => {
    searchParams.delete("modal");
    setSearchParams(searchParams);
    setIsItemPopupOpened(false);
  };

  // Formatting helper
  const formatDateTime = (dateStr?: string) => {    
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleString();
  };

  if (!offerData) {
    return <div className="singleProductPage px-16">Loading offer data...</div>;
  }

  const {
    price,
    available_space,
    available_weight,
    // departure_datetime,
    // arrival_datetime,
    user_flight,
    user,
  } = offerData;

//   const { flight_number, flight } = user_flight || {};
const {
  flight_number,
  flight: {
    departure_datetime,
    arrival_datetime,
    from_airport,
    to_airport,
  },
} = user_flight;
//   const { from_airport, to_airport } = flight || {};

  return (
    <>
      <div className="singleProductPage">
        <div className="px-16">
          <OfferDetails
            flightNumber={flight_number}
            fromCity={from_airport?.city.city_name}
            toCity={to_airport?.city.city_name}
          />
        </div>
        <div className="px-16">
          <div className="singleProductPage__productInfo">
            <div className="singleProductPage__productInfo__header postOffer__header">
              <h3 className="singleProductPage__productInfo__header__title singleProductPage__title">
                Flight & Item Details
              </h3>
            </div>
            <div className="singleProductPage__productInfo__table">
              <div className="singleProductPage__productInfo__table__item">
                <div className="singleProductPage__productInfo__table__item__title">
                  <div className="singleProductPage__productInfo__table__item__title__icon">
                    <img src={packageIcon} alt="Package icon" />
                  </div>
                  Available space for packages
                </div>
                <div className="singleProductPage__productInfo__table__item__info">
                  {available_weight || "N/A"} kg / {available_space || "N/A"} m³
                </div>
              </div>

              <div className="singleProductPage__productInfo__table__item">
                <div className="singleProductPage__productInfo__table__item__title">
                  <div className="singleProductPage__productInfo__table__item__title__icon">
                    <img src={packageIcon} alt="Package icon" />
                  </div>
                  Departure date & time
                </div>
                <div className="singleProductPage__productInfo__table__item__info">
                  {formatDateTime(departure_datetime)}
                  {/* {formatDateTime(user_flight?.flight?.departure_datetime)} */}
                </div>
              </div>

              <div className="singleProductPage__productInfo__table__item">
                <div className="singleProductPage__productInfo__table__item__title">
                  <div className="singleProductPage__productInfo__table__item__title__icon">
                    <img src={packageIcon} alt="Package icon" />
                  </div>
                  Arrival date & time
                </div>
                <div className="singleProductPage__productInfo__table__item__info">
                  {/* {formatDateTime(arrival_datetime)} */}
                  {formatDateTime(user_flight?.flight?.arrival_datetime)}
                </div>
              </div>

              {/* <div className="singleProductPage__productInfo__table__item">
                <div className="singleProductPage__productInfo__table__item__title">
                  <div className="singleProductPage__productInfo__table__item__title__icon">
                    <img src={packageIcon} alt="Package icon" />
                  </div>
                  Items cannot be transported
                </div>
                <div className="singleProductPage__productInfo__table__item__info">
                  item, item, item, item
                </div>
              </div> */}
            </div>
          </div>
        </div>

        <div className="bg-[--primary-background] h-[55px]"></div>

        <div className="px-16">
          <div className="singleProductPage__notes">
            <div className="singleProductPage__notes__title">
              <p></p>
            </div>
            <div className="singleProductPage__notes__content">
              <div className="singleProductPage__notes__content__area">
                <Label title={"Additional notes from traveler"} htmlFor={"notes"} classnames={"singleProductPage__notes__title"}>
                  <Input
                    type={"textarea"}
                    placeholder={"Enter a description..."}
                    id={"notes"}
                    classnames={"postOffer__input"}
                    handleChange={handleInputChange}
                  />
                </Label>
              </div>

              <div className="flex flex-col singleProductPage__flightItemsDetails">
                <div className="singleProductPage__productInfo__header postOffer__header">
                  <h3 className="singleProductPage__productInfo__header__title singleProductPage__title">Price Details</h3>
                </div>
                <div className="singleProductPage__flightItemsDetails__content">
                  <div className="flex justify-between singleProductPage__flightItemsDetails__content__item">
                    <span className="singleProductPage__flightItemsDetails__content__itemTitle">Delivery fee</span>
                    <span className="singleProductPage__flightItemsDetails__content__itemValue">${price || 0}</span>
                  </div>

                  <div className="flex justify-between singleProductPage__flightItemsDetails__content__item">
                    <span className="singleProductPage__flightItemsDetails__content__itemTitle">Commission fee</span>
                    <span className="singleProductPage__flightItemsDetails__content__itemValue">$1</span>
                  </div>

                  <div className="flex justify-between singleProductPage__flightItemsDetails__content__itemTotal">
                    <span className="singleProductPage__flightItemsDetails__content__itemTitle singleProductPage__flightItemsDetails__content__itemTotal__title">
                      Total
                    </span>
                    <span className="singleProductPage__flightItemsDetails__content__itemValue">
                      ${(price ? Number(price) + 1 : 1).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-9">
              <Button classNames="singleProductPage__notes__content__button" title={"Book flight"} type={"primary"} handleClick={onBook} />
            </div>
          </div>
        </div>
      </div>

      {isItemPopupOpened && createPortal(<SelectItemPopup data={items} onClose={onBookClose} />, document.body)}
    </>
  );
};
