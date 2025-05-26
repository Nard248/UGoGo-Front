import { FC } from "react";
import classNames from "classnames";
import { Avatar, Box, Rating } from "@mui/material";
import offerCardImage from './../../assets/images/offer.svg';
import avatar from './../../assets/images/avatar.svg';
import message from './../../assets/icons/message.svg';
import moreBtn from './../../assets/icons/more.svg';
import { Button } from "../button/Button";
import './OfferCard.scss';

interface IOfferCard {
    data?: any;
    primaryButtonText?: string;
    secondaryButtonText?: string;
    size?: 'small' | 'medium' | 'large';
    onPrimaryClick?: () => void;
    onSecondaryClick?: () => void;
}

export const OfferCard: FC<IOfferCard> = ({data, primaryButtonText, secondaryButtonText, size = 'large', onPrimaryClick, onSecondaryClick}) => {
    console.log(data);
    return (
        <div className={classNames(`offerCard border border-[#AEE6E6] offerCard-${size}`)}>
            <div className="offerCard__image">
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
                            {data.user?.full_name || "Unknown User"}
                        </span>
                    </div>
                    <div className="rate flex items-center gap-3">
                        <Rating
                            name="hover-feedback"
                            precision={0.5}
                            max={5}
                        />
                        <span>5 (435)</span>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <h3 className="offerCard__flightNumber">
                        {data.user_flight.flight.from_airport.city.country.country_name}, {data.user_flight.flight.from_airport.city.city_name}
                    </h3>
                    <h3 className="offerCard__flightNumber">
                        {data.user_flight.flight.to_airport.city.country.country_name}, {data.user_flight.flight.to_airport.city.city_name}
                    </h3>
                </div>
                <div className="offerCard__date">
                    <span>{`${new Date(data.departure_datetime).getHours()}:${new Date(data.departure_datetime).getMinutes().toString().padStart(2, '0')}` || "N/A"}</span>
                    <span>{`${new Date(data.arrival_datetime).getHours()}:${new Date(data.arrival_datetime).getMinutes().toString().padStart(2, '0')}` || "N/A"}</span>
                </div>
                <div className="offerCard__direction flex items-center justify-between">
                    <div className='from'>
                        <span className="country">
                            {data.from_airport?.city?.city_name || "Unknown City"}
                        </span>,
                        <span className="city">
                            {data.from_airport?.airport_name || "Unknown Airport"}
                        </span>
                    </div>
                    <div className='to'>
                        <span className="country">
                            {data.to_airport?.airport_name || "Unknown Destination"}
                        </span>
                    </div>
                </div>
                <div className="offerCard__time">
                    <span>{data.departure_datetime?.split('T')[1] || "N/A"}</span>
                    <span>{data.arrival_datetime?.split('T')[1] || "N/A"}</span>
                </div>
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
                <div className={classNames(`cardActions flex items-center mt-[3rem] ${!primaryButtonText || !primaryButtonText ? 'justify-end' : 'justify-between'}`)}>
                    {primaryButtonText && <Button title={primaryButtonText} type={'primary'} outline={true} {...(onPrimaryClick && { handleClick: onPrimaryClick })} />}
                    {secondaryButtonText && <Button title={secondaryButtonText} type={'primary'} {...(onSecondaryClick && { handleClick: onSecondaryClick })} />}
                </div>
            </div>
        </div>
    );
};
