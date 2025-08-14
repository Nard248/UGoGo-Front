import { FC } from "react";
import classNames from "classnames";
import { Avatar, Box, Rating } from "@mui/material";
import offerCardImage from './../../assets/images/offer.svg';
import avatar from './../../assets/images/avatar.svg';
import airplaneDark from './../../assets/icons/airplaneDark.svg';
import { Button } from "../button/Button";
import './OfferCard.scss';
import { useNavigate } from "react-router-dom";

interface IOfferCard {
    data?: any;
    withRate?: boolean;
    withOfferStatus?: boolean;
    primaryButtonText?: string;
    secondaryButtonText?: string;
    size?: 'small' | 'medium' | 'large';
    onPrimaryClick?: () => void;
    onSecondaryClick?: () => void;
    isOwnOffer?: boolean;
}

const formatDate = (date: Date) => {
    return `${date.getDay().toString().padStart(2, '0')}.${date.getMonth().toString().padStart(2, '0')}.${date.getFullYear()}`
}

const formatTime = (date: Date) => {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

export const OfferCard: FC<IOfferCard> = ({data, primaryButtonText, secondaryButtonText, size = 'large', onPrimaryClick, onSecondaryClick, withOfferStatus = true, withRate = true, isOwnOffer = false}) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (data?.id) {
      navigate(`/offer/${data.id}`, { state: { offer: data } });
    }
  };
    return (
        <div  className={classNames(`offerCard border border-[#AEE6E6] offerCard-${size}`)}>
            <div className="offerCard__image" onClick={handleClick}  style={{ cursor: "pointer" }}>
                {isOwnOffer && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs z-10">
                        Your Offer
                    </div>
                )}
                {data?.verified &&
                    <div className="offerCard__imageFlag">
                        <span>
                        {data?.verified}
                        </span>
                    </div>
                }
                <img src={offerCardImage} alt="Offer card" className="offerCard__imageSvg" />
            </div>
            <div className="offerCard__details flex flex-col gap-3.5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar alt="Avatar" src={avatar} />
                        <span className="text-[#808080]">
                            {data?.user_flight?.user?.full_name || "Unknown User"}
                        </span>
                    </div>
                    {withRate &&
                        <div className="rate flex items-center gap-3">
                            <Rating
                                name="hover-feedback"
                                precision={0.5}
                                max={5}
                            />
                            <span>5 (435)</span>
                        </div>
                    }
                </div>
                <div className="flex items-center justify-between">
                    <h3 className="offerCard__flightNumber">
                        {data?.user_flight?.flight?.from_airport?.city?.country?.country_name || ""}, {data?.user_flight?.flight?.from_airport?.city?.city_name || ""}
                    </h3>
                    <div className="w-[1.7rem] h-[1.7rem]">
                        <img src={airplaneDark} alt=""/>
                    </div>
                    <h3 className="offerCard__flightNumber text-end">
                        {data?.user_flight?.flight?.to_airport?.city?.country?.country_name || ""}, {data?.user_flight?.flight?.to_airport?.city?.city_name || ""}
                    </h3>
                </div>
                <div className="offerCard__date">
                    <div className="flex flex-col gap-[1rem]">
                        <span>
                            {data?.user_flight?.flight?.departure_datetime ? formatTime(new Date(data.user_flight.flight.departure_datetime)) : ""}
                        </span>
                        <span>
                            {data?.user_flight?.flight?.departure_datetime ? formatDate(new Date(data.user_flight.flight.departure_datetime)) : ""}
                        </span>
                    </div>
                    <div className="flex flex-col gap-[1rem]">
                        <span>
                            {data?.user_flight?.flight?.arrival_datetime ? formatTime(new Date(data.user_flight.flight.arrival_datetime)) : ""}
                        </span>
                        <span>{data?.user_flight?.flight?.arrival_datetime ? formatDate(new Date(data.user_flight.flight.arrival_datetime)) : ""}</span>
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
                    <span>{data.available_weight || "0"} kg, {data.available_space || "0"} m³</span>
                </div>
                {/*<div className="offerCard__userActions">*/}
                {/*    <button className="button">*/}
                {/*        <img src={message} alt="Message Icon" />*/}
                {/*    </button>*/}
                {/*    <button className="button">*/}
                {/*        <img src={moreBtn} alt="More buttons Icon" />*/}
                {/*    </button>*/}
                {/*</div>*/}
                <div className={classNames(`cardActions flex items-center mt-[3rem] ${!primaryButtonText || !primaryButtonText ? 'justify-center' : 'justify-between'}`)}>
                    {primaryButtonText && <Button title={primaryButtonText} type={'primary'} outline={true} {...(onPrimaryClick && { handleClick: onPrimaryClick })} />}
                    {secondaryButtonText && <Button title={secondaryButtonText} type={'primary'} {...(onSecondaryClick && { handleClick: onSecondaryClick })} />}
                </div>
            </div>
        </div>
    );
};
