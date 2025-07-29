import {useState, useEffect, useRef, FC} from "react";
import { useNavigate } from "react-router-dom";
import { Divider } from "../divider/Divider";
import avatar from "../../assets/images/avatar.svg";
import flightsIcon from "../../assets/icons/flights.svg";
import flightsHoverIcon from "../../assets/icons/flightsHover.svg";
import requestsIcon from "../../assets/icons/requests.svg";
import requestsHoverIcon from "../../assets/icons/requestsHover.svg";
import itemsIcon from "../../assets/icons/items.svg";
import itemHoverIcon from "../../assets/icons/itemsHover.svg";
import accountIcon from "../../assets/icons/account_circle.svg";
import accountHoverIcon from "../../assets/icons/account_circle_hover.svg";
import logoutIcon from "../../assets/icons/logout.svg";
import logoutHoverIcon from "../../assets/icons/logoutHover.svg";
import coin from "../../assets/icons/coin.svg";
import { logout, getUserDetails } from "../../api/route";
import {User} from "../../types/global";



export const ProfilePopover: FC = () => {
  const navigate = useNavigate();
  const popoverRef = useRef<HTMLDivElement>(null);

  const [requestsIconState, setRequestsIcon] = useState(requestsIcon);
  const [itemsIconState, setItemsIcon] = useState(itemsIcon);
  const [flightsIconState, setFlightsIconState] = useState(flightsIcon);
  const [accountIconState, setAccountIcon] = useState(accountIcon);
  const [logoutIconState, setLogoutIcon] = useState(logoutIcon);

  const [isPopoverOpen, setIsPopoverOpen] = useState(true);

  const [user, setUser] = useState<User>({ name: "NULL", email: "NULL", balance: 0 });

  useEffect(() => {
    const cachedUser = localStorage.getItem("userDetails");
    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsPopoverOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);
  


  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh");
      if (!refreshToken) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("email");
        localStorage.removeItem("userDetails");
        navigate("/login");
        return;
      }

      await logout(refreshToken);
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("email");
      localStorage.removeItem("userDetails");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("email");
      localStorage.removeItem("userDetails");
      navigate("/login");
    }
  };

  const handleNavigation = (path: string) => {
    setIsPopoverOpen(false);
    navigate(path);
  };
  
  return (
    <>
      {isPopoverOpen && (
        <div ref={popoverRef}  className="flex flex-col border border-solid border-[#D5D7DA] rounded-[1rem] absolute top-[70%] left-[90%] min-w-[300px] translate-x-[-50%] bg-[#fff] z-10">
          <div className="profile__avatar px-[2.1rem] py-[1.6rem]">
            <div className="profile__avatar__image">
              <img
                src={avatar}
                alt="Avatar"
                className="profile__avatar__image"
              />
            </div>
            <div className="profile__avatar__details">
              <div className="profile__avatar__details__name">{user.name}</div>
              <div className="profile__avatar__details__rate">
                <span className="profile__avatar__details__rate__value">
                  {user.email}
                </span>
              </div>
              <div className="flex items-center profile__avatar__details__rate__value">
                <span>Balance</span>
                <span> - </span>
                <span>{user.balance || 0} USD</span>
                </div>
            </div>
          </div>
          <Divider appearance="neutral" size="small" className="mt-[1.6rem]" />
          <div className="flex flex-col gap-[.8rem] px-[2.1rem] py-[1.6rem] ">
            <div
              className="flex items-center gap-[.8rem] cursor-pointer"
              onClick={() => handleNavigation("/add-profile-info")}
              onMouseEnter={() => setAccountIcon(accountHoverIcon)}
              onMouseLeave={() => setAccountIcon(accountIcon)}
            >
              <img
                src={accountIconState}
                alt="Account Icon"
                className="w-[20px] h-[20px]"
              />
              <span className="text-[1.4rem] text-[#808080] hover:text-[#F9A34B]">
                My Account
              </span>
            </div>

            <div
              className="flex items-center gap-[.8rem] cursor-pointer"
              onClick={() => handleNavigation("/payout")}
              onMouseEnter={() => setRequestsIcon(coin)}
              onMouseLeave={() => setRequestsIcon(coin)}
            >
              <img
                src={coin}
                alt="Requests Icon"
                className="w-[20px] h-[20px]"
              />
              <span className="text-[1.4rem] text-[#808080] hover:text-[#F9A34B]">
                Payout
              </span>
            </div>

            <div
              className="flex items-center gap-[.8rem] cursor-pointer"
              onClick={() => handleNavigation("/requests")}
              onMouseEnter={() => setRequestsIcon(requestsHoverIcon)}
              onMouseLeave={() => setRequestsIcon(requestsIcon)}
            >
              <img
                src={requestsIconState}
                alt="Requests Icon"
                className="w-[20px] h-[20px]"
              />
              <span className="text-[1.4rem] text-[#808080] hover:text-[#F9A34B]">
                My Requests
              </span>
            </div>

            <div
              className="flex items-center gap-[.8rem] cursor-pointer"
              onClick={() => handleNavigation("/items")}
              onMouseEnter={() => setItemsIcon(itemHoverIcon)}
              onMouseLeave={() => setItemsIcon(itemsIcon)}
            >
              <img
                src={itemsIconState}
                alt="Items Icon"
                className="w-[20px] h-[20px]"
              />
              <span className="text-[1.4rem] text-[#808080] hover:text-[#F9A34B]">
                My Items
              </span>
            </div>

            <div
              className="flex items-center gap-[.8rem] cursor-pointer"
              onClick={() => handleNavigation("/offers")}
              onMouseEnter={() => setFlightsIconState(flightsHoverIcon)}
              onMouseLeave={() => setFlightsIconState(flightsIcon)}
            >
              <img
                src={flightsIconState}
                alt="Flights Icon"
                className="w-[20px] h-[20px]"
              />
              <span className="text-[1.4rem] text-[#808080] hover:text-[#F9A34B]">
                My Flights
              </span>
            </div>
          </div>
          <Divider
            appearance="neutral"
            size="small"
          />
          <div className="flex flex-col gap-[.8rem] px-[2.1rem] py-[1.6rem]">
            <div
              className="flex items-center gap-[.8rem] cursor-pointer"
              onClick={handleLogout}
              onMouseEnter={() => setLogoutIcon(logoutHoverIcon)}
              onMouseLeave={() => setLogoutIcon(logoutIcon)}
            >
              <img
                src={logoutIconState}
                alt="Logout Icon"
                className="w-[20px] h-[20px]"
              />
              <span className="text-[1.4rem] text-[#808080] hover:text-[#F9A34B]">
                Logout
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
