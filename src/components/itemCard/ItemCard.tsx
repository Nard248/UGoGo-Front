import { FC } from "react";
import classNames from "classnames";
import { Avatar } from "../avatar/Avatar";
import itemCardImage from "./../../assets/images/offer.svg";
import { Button } from "../button/Button";
import "./ItemCard.scss";

interface IItemCard {
  data?: any;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  size?: "small" | "medium" | "large";
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  onClick?: () => void;
}

export const ItemCard: FC<IItemCard> = ({
  data,
  primaryButtonText,
  secondaryButtonText,
  size = "large",
  onPrimaryClick,
  onSecondaryClick,
  onClick,
}) => {
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={classNames(
        `itemCard border border-[#AEE6E6] itemCard-${size}`
      )}
    >
      <div
        className="itemCard__image"
        onClick={handleCardClick}
        style={{ cursor: onClick ? "pointer" : "default" }}
      >
        {data?.verified && (
          <div className="itemCard__imageFlag">
            <span>{data?.verified}</span>
          </div>
        )}
        <img
          src={data?.pictures?.[0]?.image || itemCardImage}
          alt={data?.name || "Item"}
          className="itemCard__imageSvg"
        />
      </div>
      <div className="itemCard__details flex flex-col gap-3.5">
        <div className="flex items-center gap-3">
          <Avatar
            firstName={data?.user?.full_name || "User"}
            size="small"
            profilePictureUrl={data?.user?.profile_picture_url}
          />
          <span className="text-[#808080]">
            {data?.user?.full_name || "Unknown User"}
          </span>
        </div>

        <h3 className="itemCard__name">{data?.name || "Unnamed Item"}</h3>

        {data?.description && (
          <p className="itemCard__description">{data.description}</p>
        )}

        <div className="itemCard__details-row flex items-center justify-between">
          <span>Item dimensions</span>
          <span>{data?.dimensions || "N/A"}</span>
        </div>

        <div className="itemCard__details-row flex items-center justify-between">
          <span>Weight</span>
          <span>{data?.weight || "0"} kg</span>
        </div>

        <div
          className={classNames(
            `cardActions flex items-center mt-[3rem] ${
              !primaryButtonText && !secondaryButtonText
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
