import { FC } from "react";
import classNames from "classnames";
import { Box, Rating } from "@mui/material";
import { Avatar } from "../avatar/Avatar";
import offerCardImage from "./../../assets/images/offer.svg";
import airplaneDark from "./../../assets/icons/airplaneDark.svg";
import { Button } from "../button/Button";
import "./OfferCard.scss";
import { useNavigate } from "react-router-dom";

interface IOfferCard {
  data?: any;
  withRate?: boolean;
  withOfferStatus?: boolean;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  size?: "small" | "medium" | "large";
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  isOwnOffer?: boolean;
  customUser?: any;
  onCardClick?: () => void;
}

const formatDate = (date: Date) => {
  return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}.${date.getFullYear()}`;
};

const formatTime = (date: Date) => {
  return `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
};

export const OfferCard: FC<IOfferCard> = ({
  data,
  primaryButtonText,
  secondaryButtonText,
  size = "large",
  onPrimaryClick,
  onSecondaryClick,
  withOfferStatus = true,
  withRate = true,
  isOwnOffer = false,
  customUser,
  onCardClick,
}) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (onCardClick) {
      onCardClick();
    } else if (data?.id) {
      navigate(`/offer/${data.id}`, { state: { offer: data } });
    }
  };

  const displayUser = customUser || data?.user_flight?.user || data?.user;
  return (
    <div
      className={classNames(
        `offerCard border border-[#AEE6E6] offerCard-${size}`
      )}
    >
      <div
        className="offerCard__image"
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        {isOwnOffer && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs z-10">
            Your Offer
          </div>
        )}
        {data?.verified && (
          <div className="offerCard__imageFlag">
            <span>{data?.verified}</span>
          </div>
        )}
        <img
          src={
            data?.user_flight?.flight?.from_airport?.airport_picture_url ||
            offerCardImage
          }
          alt="Offer card"
          className="offerCard__imageSvg"
        />
      </div>
      <div className="offerCard__details flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar
              firstName={displayUser?.first_name || displayUser?.full_name || "User"}
              lastName={displayUser?.last_name}
              size="small"
            />
            <span className="text-[#808080]">
              {displayUser?.first_name && displayUser?.last_name
                ? `${displayUser.first_name} ${displayUser.last_name}`
                : displayUser?.full_name || "Unknown User"}
            </span>
          </div>
          {withRate && (
            <div className="rate flex items-center gap-3">
              <Rating name="hover-feedback" precision={0.5} max={5} />
              <span>5 (435)</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <h3 className="offerCard__flightNumber">
            {data?.user_flight?.flight?.from_airport?.city?.country
              ?.country_name || ""}
            , {data?.user_flight?.flight?.from_airport?.city?.city_name || ""}
          </h3>
          <div className="w-[1.7rem] h-[1.7rem]">
            <img src={airplaneDark} alt="" />
          </div>
          <h3 className="offerCard__flightNumber text-end">
            {data?.user_flight?.flight?.to_airport?.city?.country
              ?.country_name || ""}
            , {data?.user_flight?.flight?.to_airport?.city?.city_name || ""}
          </h3>
        </div>
        <div className="offerCard__date">
          <div className="flex flex-col gap-[1rem]">
            <span>
              {data?.user_flight?.flight?.departure_datetime
                ? formatTime(
                    new Date(data.user_flight.flight.departure_datetime)
                  )
                : ""}
            </span>
            <span>
              {data?.user_flight?.flight?.departure_datetime
                ? formatDate(
                    new Date(data.user_flight.flight.departure_datetime)
                  )
                : ""}
            </span>
          </div>
          <div className="flex flex-col gap-[1rem]">
            <span>
              {data?.user_flight?.flight?.arrival_datetime
                ? formatTime(new Date(data.user_flight.flight.arrival_datetime))
                : ""}
            </span>
            <span>
              {data?.user_flight?.flight?.arrival_datetime
                ? formatDate(new Date(data.user_flight.flight.arrival_datetime))
                : ""}
            </span>
          </div>
        </div>
        {/*<div className="offerCard__direction flex items-center justify-between">*/}
        {/*    <div className='from'>*/}
        {/*        <span className="country">*/}
        {/*            {data.user_flight.flight.from_airport?.city?.city_name || "Unknown City"}*/}
        {/*        </span>,*/}
        {/*        <span className="city">*/}
        {/*            {data.user_flight.flight.from_airport?.airport_name || "Unknown Airport"}*/}
        {/*        </span>*/}
        {/*    </div>*/}
        {/*    <div className='to'>*/}
        {/*        <span className="country">*/}
        {/*            {data.user_flight.flight.to_airport?.airport_name || "Unknown Destination"}*/}
        {/*        </span>*/}
        {/*    </div>*/}
        {/*</div>*/}
        <div className="offerCard__space flex items-center justify-between">
          <span>Available space</span>
          <span>
            {data.available_weight || "0"} kg, {data.available_dimensions || "N/A"}
          </span>
        </div>
        <div className="offerCard__pricing" style={{
          padding: '1rem',
          backgroundColor: '#F0F9FF',
          borderRadius: '6px',
          marginTop: '0.5rem',
          fontSize: '1.2rem',
          color: '#4A5568',
          textAlign: 'center',
          border: '1px solid #AEE6E6'
        }}>
          <strong>Pricing: $25/kg</strong> (min 1kg)
        </div>
        <div
          className={classNames(
            `cardActions flex items-center mt-[3rem] ${
              !primaryButtonText || !primaryButtonText
                ? "justify-center"
                : "justify-between"
            }`
          )}
        >
          {primaryButtonText && (
            <Button
              title={primaryButtonText}
              type={"primary"}
              outline={true}
              {...(onPrimaryClick && { handleClick: onPrimaryClick })}
            />
          )}
          {secondaryButtonText && (
            <Button
              title={secondaryButtonText}
              type={"primary"}
              {...(onSecondaryClick && { handleClick: onSecondaryClick })}
            />
          )}
        </div>
      </div>
    </div>
  );
};
