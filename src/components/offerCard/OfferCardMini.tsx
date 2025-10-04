// import { FC } from "react";
// import classNames from "classnames";
// import { Avatar } from "@mui/material";
// import offerCardImage from "./../../assets/images/offer.svg";
// import avatar from "./../../assets/images/avatar.svg";
// import "./OfferCardMini.scss";
// import { Button } from "../button/Button";
// import { useNavigate } from "react-router";

// interface IOfferCardMini {
//   data?: any;
// }

// export const OfferCardMini: FC<IOfferCardMini> = ({ data }) => {
//   const navigate = useNavigate();

//   const handleLearnMore = () => {
//     navigate(`/search-result`);
//   };

//   return (
//     <div className={classNames("offerCardMini border border-[#AEE6E6]")}>
//       <div className="offerCardMini__image">
//         <img
//           src={offerCardImage}
//           alt="Offer card"
//           className="offerCardMini__imageSvg"
//         />
//       </div>
//       <div className="offerCardMini__details">
//         <div className="offerCardMini__header">
//           <Avatar alt="Avatar" src={avatar} />
//           <span className="offerCardMini__username">Ed Sheeren</span>
//         </div>
//         <div className="offerCardMini__direction">
//           <span>Armenia, Yerevan</span>
//           <span>Moscow, Russia</span>
//         </div>
//         <div className="offerCardMini__date">
//           <span>12.12.2024</span>
//           <span>21.12.2024</span>
//         </div>
//         <Button
//           title="Learn more"
//           type="primary"
//           classNames="offerCardMini__button"
//           handleClick={handleLearnMore} 
//         />
//       </div>
//     </div>
//   );
// };
import { FC } from "react";
import classNames from "classnames";
import { Avatar } from "../avatar/Avatar";
import offerCardImage from "./../../assets/images/offer.svg";
import "./OfferCardMini.scss";
import { Button } from "../button/Button";
import { useNavigate } from "react-router";

interface IOfferCardMini {
  data?: any; 
}

export const OfferCardMini: FC<IOfferCardMini> = ({ data }) => {
  const navigate = useNavigate();
  const handleLearnMore = () => {
    if (data?.id) {
      navigate(`/offer/${data.id}`);
    } else {
      navigate(`/search-result`);
    }
  };

  if (!data) return null;

  const { user_flight } = data;

  return (
    <div className={classNames("offerCardMini border border-[#AEE6E6]")}>
      <div className="offerCardMini__image">
         <img
          src={
            data?.user_flight?.flight?.from_airport?.airport_picture_url ||
            offerCardImage
          }
          />
      </div>

      <div className="offerCardMini__details">
        <div className="offerCardMini__header">
          <Avatar
            firstName={user_flight?.user?.full_name || "User"}
            size="small"
          />
          <span className="offerCardMini__username">{user_flight?.user?.full_name || "Unknown"}</span>
        </div>

        <div className="offerCardMini__direction">
          <span>{user_flight?.flight?.from_airport?.city?.city_name || "Unknown"}</span>
          <span>{user_flight?.flight?.to_airport?.city?.city_name || "Destination"}</span>
        </div>

        <div className="offerCardMini__date">
          <span>{new Date(user_flight?.flight?.departure_datetime || "").toLocaleDateString()}</span>
          <span>{new Date(user_flight?.flight?.arrival_datetime || "").toLocaleDateString()}</span>
        </div>

        <Button
          title="Learn more"
          type="primary"
          classNames="offerCardMini__button"
          handleClick={handleLearnMore} 
        />
      </div>
    </div>
  );
};
