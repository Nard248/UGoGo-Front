import { FC } from "react";
import classNames from "classnames";
import { Avatar, Rating } from "@mui/material";
import offerCardImage from "./../../assets/images/offer.svg";
import avatar from "./../../assets/images/avatar.svg";
import "./OfferCardMini.scss";
import { Button } from "../button/Button"; 

interface IOfferCardMini {
    data?: any;
}

export const OfferCardMini: FC<IOfferCardMini> = ({ data }) => {
    return (
        <div className={classNames("offerCardMini border border-[#AEE6E6]")}>            
            <div className="offerCardMini__image">
                <img src={offerCardImage} alt="Offer card" className="offerCardMini__imageSvg" />
            </div>
            <div className="offerCardMini__details">
                <div className="offerCardMini__header">
                    <Avatar alt="Avatar" src={avatar} />
                    <span className="offerCardMini__username">Ed Sheeren</span>
                    <div className="offerCardMini__rating">
                        <Rating name="read-only" value={5} readOnly max={1} />
                        <span>5 (435)</span>
                    </div>
                </div>
                <div className="offerCardMini__direction">
                    <span>Armenia, Yerevan</span>
                    <span>Moscow, Russia</span>
                </div>
                <div className="offerCardMini__date">
                    <span>12.12.2024</span>
                    <span>21.12.2024</span>
                </div>
                <Button title="Learn more" type="primary" classNames="offerCardMini__button" />
            </div>
        </div>
    );
};
