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
import { FC, useEffect, useState } from "react";
import { OfferDetails } from "../../components/offerDetails/OfferDetails";
import packageIcon from "./../../assets/icons/package.svg";
import { Button } from "../../components/button/Button";
import { getItems, getSingleProduct } from "../../api/route";
import { useParams, useSearchParams } from "react-router-dom";
import "./SingleProductPage.scss";
import { createPortal } from "react-dom";
import { SelectItemPopup } from "../../components/selectItemPopup/SelectItemPopup";
import { Tooltip } from "@mui/material";
import { Loading } from "../../components/loading/Loading";

const parseAndCalculateVolume = (dimensions: string | undefined) => {
  if (!dimensions) return null;

  const parts = dimensions.split("x").map((part) => parseFloat(part.trim()));

  if (parts.length !== 3 || parts.some(isNaN)) return null;

  const [height, length, width] = parts;
  const volumeCm3 = height * length * width;
  const volumeM3 = volumeCm3 / 1_000_000;

  return { volumeCm3, volumeM3, height, length, width };
};

const formatVolumeCm3 = (volume: number) => {
  return volume >= 1000 ? volume.toLocaleString() : volume.toString();
};

interface OfferDataType {
  id: number;
  courier_id: number;
  price: string;
  available_space: string;
  available_weight: string;
  available_dimensions?: string;
  departure_datetime: string;
  arrival_datetime: string;
  notes?: string;
  is_owner?: boolean;
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
    user: {
      id: number;
      email: string;
      first_name: string;
      last_name: string;
      full_name: string;
    };
  };
  // Add more fields here as necessary
}

export const SingleProductPage: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { id } = useParams<{ id: string }>();

  const [offerData, setOfferData] = useState<OfferDataType | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [isItemPopupOpened, setIsItemPopupOpened] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Always fetch offer data from API to ensure we have user information
  useEffect(() => {
    if (id) {
      getSingleProduct(id).then((res) => {
        setOfferData(res.data.offer);
      }).catch((error) => {
        console.error('Failed to fetch offer:', error);
      });
    }
  }, [id]);

  // Open popup if modal=book in URL
  useEffect(() => {
    if (searchParams.get("modal") === "book") {
      setIsItemPopupOpened(true);
      getItemsQuery();
    }
  }, [searchParams]);

  const getItemsQuery = async () => {
    const data = await getItems();
    setItems(data.data.results || []);
  };

  const onBook = async () => {
    // Save offer to localStorage
    if (offerData) {
      localStorage.setItem("offer", JSON.stringify(offerData));
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

  // Check if current user is the offer owner
  const isOwnOffer = () => {
    if (!offerData) {
      return false;
    }

    // First priority: Check if API provides is_owner field
    if (offerData.is_owner !== undefined) {
      return offerData.is_owner;
    }

    // Second priority: Compare courier_id with user_id
    const userId = localStorage.getItem("user_id");
    if (userId && offerData.courier_id) {
      const isOwner = parseInt(userId) === offerData.courier_id;
      if (isOwner) {
        return true;
      }
    }

    // Third priority: Compare courier_id with userDetails.id
    const userDetails = localStorage.getItem("userDetails");
    if (userDetails) {
      try {
        const currentUser = JSON.parse(userDetails);
        if (currentUser.id && offerData.courier_id) {
          const isOwner = currentUser.id === offerData.courier_id;
          if (isOwner) {
            return true;
          }
        }
      } catch (error) {
        console.error('Error parsing userDetails:', error);
      }
    }

    // Fourth priority: Compare with user_flight.user.id
    if (userId && offerData.user_flight?.user?.id) {
      const isOwner = parseInt(userId) === offerData.user_flight.user.id;
      if (isOwner) {
        return true;
      }
    }

    // Fifth priority: Compare emails with user_flight.user.email
    const userEmail = localStorage.getItem("user_email");
    if (userEmail && offerData.user_flight?.user?.email) {
      const isOwner = userEmail.toLowerCase() === offerData.user_flight.user.email.toLowerCase();
      if (isOwner) {
        return true;
      }
    }

    // If we can't determine, default to false (show button)
    return false;
  };

  if (!offerData) {
    return (
      <div className="singleProductPage px-16" style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        gap: "2rem"
      }}>
        <Loading />
        <span style={{ fontSize: "1.4rem", color: "#666" }}>Loading offer data...</span>
      </div>
    );
  }

  const {
    price,
    available_space,
    available_weight,
    // departure_datetime,
    // arrival_datetime,
    user_flight,
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
                  {available_weight || "N/A"} kg /{" "}
                  {(() => {
                    const volumeData = parseAndCalculateVolume(offerData.available_dimensions);
                    if (volumeData) {
                      return (
                        <Tooltip
                          title={
                            <>
                              <div>{volumeData.volumeM3.toFixed(4)} m³</div>
                              <div>{volumeData.height} x {volumeData.length} x {volumeData.width} cm</div>
                            </>
                          }
                          arrow
                          placement="top"
                        >
                          <span style={{ cursor: "help", borderBottom: "1px dotted #666" }}>
                            {formatVolumeCm3(volumeData.volumeCm3)} cm³
                          </span>
                        </Tooltip>
                      );
                    }
                    return `${available_space || "N/A"} m³`;
                  })()}
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

              {offerData.notes && (
                <div className="singleProductPage__productInfo__table__item">
                  <div className="singleProductPage__productInfo__table__item__title">
                    <div className="singleProductPage__productInfo__table__item__title__icon">
                      <img src={packageIcon} alt="Package icon" />
                    </div>
                    Additional notes from traveler
                  </div>
                  <div className="singleProductPage__productInfo__table__item__info">
                    {offerData.notes}
                  </div>
                </div>
              )}

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
            <div className="singleProductPage__notes__content">
              <div className="flex flex-col singleProductPage__flightItemsDetails">
                <div className="singleProductPage__productInfo__header postOffer__header">
                  <h3 className="singleProductPage__productInfo__header__title singleProductPage__title">Pricing Information</h3>
                </div>
                <div className="singleProductPage__flightItemsDetails__content">
                  <div style={{
                    padding: '1.5rem',
                    backgroundColor: '#F0F9FF',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                    border: '1px solid #AEE6E6'
                  }}>
                    <h4 style={{
                      fontSize: '1.6rem',
                      fontWeight: '600',
                      color: '#1B3A4B',
                      marginBottom: '1rem'
                    }}>
                      Automatic Pricing
                    </h4>
                    <p style={{
                      fontSize: '1.4rem',
                      color: '#4A5568',
                      lineHeight: '1.6',
                      marginBottom: '0.8rem'
                    }}>
                      The price for this delivery will be automatically calculated based on your item's weight:
                    </p>
                    <ul style={{
                      fontSize: '1.4rem',
                      color: '#4A5568',
                      marginLeft: '2rem',
                      lineHeight: '1.8'
                    }}>
                      <li><strong>$25 per kilogram</strong> (minimum 1kg charge)</li>
                      <li>Platform commission: 10%</li>
                      <li>Courier receives: 90% of delivery fee</li>
                    </ul>
                    <p style={{
                      fontSize: '1.3rem',
                      color: '#6B7280',
                      marginTop: '1rem',
                      fontStyle: 'italic'
                    }}>
                      Example: A 2.5kg item = $62.50 total
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {!isOwnOffer() && (
              <div className="flex justify-end pt-9 pb-16">
                <Button classNames="singleProductPage__notes__content__button" title={"Send request"} type={"primary"} handleClick={onBook} />
              </div>
            )}
          </div>
        </div>
      </div>

      {isItemPopupOpened && createPortal(<SelectItemPopup data={items} onClose={onBookClose} />, document.body)}
    </>
  );
};
