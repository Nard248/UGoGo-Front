import { Avatar } from "../avatar/Avatar";
import rateIcon from "../../assets/icons/rate.svg";
import messageIcon from "../../assets/icons/message.svg";
import './Profile.scss'

export const Profile = () => {
    return (
        <div className="profile">
            <div className="profile__avatar">
                <div className="profile__avatar__image">
                    <Avatar
                        firstName="John"
                        lastName="Doe"
                        size="medium"
                        className="profile__avatar__image"
                    />
                </div>
                <div className="profile__avatar__details">
                    <div className="profile__avatar__details__name">
                        John Doe
                    </div>
                    <div className="profile__avatar__details__rate">
                        <img src={rateIcon} alt="Rate icon"/>
                        <span className="profile__avatar__details__rate__value">
                            5 (435)
                        </span>
                    </div>
                </div>
            </div>
            <div className="profile__message">
                <img src={messageIcon} alt="Message"/>
            </div>
        </div>
    )
}