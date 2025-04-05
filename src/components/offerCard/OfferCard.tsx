import { FC } from "react";
import { Avatar, Box, Rating } from "@mui/material";
import offerCardImage from './../../assets/images/offer.svg';
import avatar from './../../assets/images/avatar.svg';
import message from './../../assets/icons/message.svg';
import moreBtn from './../../assets/icons/more.svg';
import { Button } from "../button/Button";
import './OfferCard.scss';
import { useNavigate } from "react-router-dom";

interface IOfferCard {
    primaryButtonText: string;
    secondaryButtonText: string;
    offerData: {
        price?: string;
        available_space?: string;
        available_weight?: string;
        user_flight?: {
            flight: {
                departure_datetime?: string;
                arrival_datetime?: string;
                from_airport?: {
                    airport_name?: string;
                    city?: {
                        city_name?: string;
                    };
                };
                to_airport?: {
                    airport_name?: string;
                };
            };
        };
        user?: {
            full_name?: string;
            email?: string;
        };
    };
}

export const OfferCard: FC<IOfferCard> = ({ primaryButtonText, secondaryButtonText, offerData }) => {
    const { price, available_space, available_weight, user_flight, user,  } = offerData;
    const { from_airport, to_airport, departure_datetime, arrival_datetime } = user_flight?.flight || {};

    const navigate = useNavigate();

    const handlePrimaryButtonClick = () => {
        const uniqueIdentifier = JSON.stringify(offerData);
        
        navigate(`/offer/${encodeURIComponent(uniqueIdentifier)}`, { state: { offerData } });
    };
    
    return (
        <div className="offerCard border border-[#AEE6E6]">
            <div className="offerCard__image">
                <div className="offerCard__imageFlag">
                </div>
                <img src={offerCardImage} alt="Offer card" className="offerCard__imageSvg" />
            </div>
            <div className="offerCard__details flex flex-col gap-3.5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar alt="Avatar" src={avatar} />
                        <span className="text-[#808080]">
                            {user?.full_name || "Unknown User"} 
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
                        Flight number
                    </h3>
                    <span className="offerCard__flight">
                        {user_flight?.flight?.departure_datetime || "N/A"} 
                        </span>
                </div>
                <div className="offerCard__date">
                    <span>{departure_datetime?.split('T')[0] || "N/A"}</span> 
                </div>
                <div className="offerCard__direction flex items-center justify-between">
                    <div className='from'>
                        <span className="country">
                            {from_airport?.city?.city_name || "Unknown City"} 
                        </span>,
                        <span className="city">
                            {from_airport?.airport_name || "Unknown Airport"} 
                        </span>
                    </div>
                    <div className='to'>
                        <span className="country">
                            {to_airport?.airport_name || "Unknown Destination"}
                        </span>
                    </div>
                </div>
                <div className="offerCard__time">
                    <span>{departure_datetime?.split('T')[1] || "N/A"}</span>
                    <span>{arrival_datetime?.split('T')[1] || "N/A"}</span>
                </div>
                <div className="offerCard__space flex items-center justify-between">
                    <span>Available space</span>
                    <span>{available_weight || "0"} kg, {available_space || "0"} m³</span> 
                </div>
                <div className="offerCard__userActions">
                    <button className="button">
                        <img src={message} alt="Message Icon" />
                    </button>
                    <button className="button">
                        <img src={moreBtn} alt="More buttons Icon" />
                    </button>
                </div>
                <div className="cardActions flex items-center justify-between mt-[3rem]">
                    <Button title={primaryButtonText} type={'primary'} outline={true} handleClick={handlePrimaryButtonClick} />
                    <Button title={secondaryButtonText} type={'primary'} handleClick={() => {}} />
                </div>
            </div>
        </div>
    );
};
