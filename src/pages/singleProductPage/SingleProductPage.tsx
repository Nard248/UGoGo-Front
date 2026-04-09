import { FC, useEffect, useMemo, useState } from "react";
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
  has_user_request?: boolean;
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

const loadingContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "50vh",
  gap: "2rem",
};

const loadingTextStyle: React.CSSProperties = { fontSize: "1.4rem", color: "#666" };

const pricingBoxStyle: React.CSSProperties = {
  padding: '1.5rem',
  backgroundColor: '#F0F9FF',
  borderRadius: '8px',
  marginBottom: '1.5rem',
  border: '1px solid #AEE6E6',
};

const pricingTitleStyle: React.CSSProperties = {
  fontSize: '1.6rem',
  fontWeight: '600',
  color: '#1B3A4B',
  marginBottom: '1rem',
};

const pricingTextStyle: React.CSSProperties = {
  fontSize: '1.4rem',
  color: '#4A5568',
  lineHeight: '1.6',
  marginBottom: '0.8rem',
};

const pricingListStyle: React.CSSProperties = {
  fontSize: '1.4rem',
  color: '#4A5568',
  marginLeft: '2rem',
  lineHeight: '1.8',
};

const pricingExampleStyle: React.CSSProperties = {
  fontSize: '1.3rem',
  color: '#6B7280',
  marginTop: '1rem',
  fontStyle: 'italic',
};

const requestSentStyle: React.CSSProperties = {
  padding: '1rem 2rem',
  backgroundColor: '#F3F4F6',
  borderRadius: '8px',
  color: '#6B7280',
  fontSize: '1.4rem',
  fontWeight: '500',
};

const volumeHintStyle: React.CSSProperties = { cursor: "help", borderBottom: "1px dotted #666" };

export const SingleProductPage: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { id } = useParams<{ id: string }>();

  const [offerData, setOfferData] = useState<OfferDataType | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [isItemPopupOpened, setIsItemPopupOpened] = useState(false);

  // Fetch offer data and scroll to top after loading
  useEffect(() => {
    if (id) {
      window.scrollTo(0, 0);
      getSingleProduct(id).then((res) => {
        setOfferData(res.data.offer);
        // Scroll to top after data renders
        setTimeout(() => window.scrollTo(0, 0), 0);
      }).catch(() => {
        // Failed to fetch offer
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

  // Check if current user is the offer owner (memoized to avoid repeated localStorage reads)
  const ownOffer = useMemo(() => {
    if (!offerData) return false;

    if (offerData.is_owner !== undefined) return offerData.is_owner;

    const userId = localStorage.getItem("user_id");
    const userEmail = localStorage.getItem("user_email");

    if (userId && offerData.courier_id && parseInt(userId) === offerData.courier_id) return true;

    const userDetails = localStorage.getItem("userDetails");
    if (userDetails) {
      try {
        const currentUser = JSON.parse(userDetails);
        if (currentUser.id && offerData.courier_id && currentUser.id === offerData.courier_id) return true;
      } catch { /* ignore parse error */ }
    }

    if (userId && offerData.user_flight?.user?.id && parseInt(userId) === offerData.user_flight.user.id) return true;

    if (userEmail && offerData.user_flight?.user?.email &&
        userEmail.toLowerCase() === offerData.user_flight.user.email.toLowerCase()) return true;

    return false;
  }, [offerData]);

  if (!offerData) {
    return (
      <div className="singleProductPage px-16" style={loadingContainerStyle}>
        <Loading />
        <span style={loadingTextStyle}>Loading offer data...</span>
      </div>
    );
  }

  const {
    price,
    available_space,
    available_weight,
    user_flight,
  } = offerData;

const {
  flight_number,
  flight: {
    departure_datetime,
    arrival_datetime,
    from_airport,
    to_airport,
  },
} = user_flight;

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
                          <span style={volumeHintStyle}>
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
                  <div style={pricingBoxStyle}>
                    <h4 style={pricingTitleStyle}>
                      Automatic Pricing
                    </h4>
                    <p style={pricingTextStyle}>
                      The price for this delivery will be automatically calculated based on your item's weight:
                    </p>
                    <ul style={pricingListStyle}>
                      <li><strong>$25 per kilogram</strong> (minimum 1kg charge)</li>
                      <li>Platform commission: 10%</li>
                      <li>Traveler receives: 90% of delivery fee</li>
                    </ul>
                    <p style={pricingExampleStyle}>
                      Example: A 2.5kg item = $62.50 total
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {!ownOffer && (
              <div className="flex justify-end pt-9 pb-16">
                {offerData.has_user_request ? (
                  <div style={requestSentStyle}>
                    You have already sent a request to this offer.
                  </div>
                ) : (
                  <Button classNames="singleProductPage__notes__content__button" title={"Send request"} type={"primary"} handleClick={onBook} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isItemPopupOpened && createPortal(<SelectItemPopup data={items} onClose={onBookClose} />, document.body)}
    </>
  );
};
