import { useState, useEffect } from "react";
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
import { logout, getUserDetails } from "../../api/route";

interface User {
  name: string;
  email: string;
}

export const ProfilePopover: React.FC = () => {
  const navigate = useNavigate();

  const [requestsIconState, setRequestsIcon] = useState(requestsIcon);
  const [itemsIconState, setItemsIcon] = useState(itemsIcon);
  const [flightsIconState, setFlightsIconState] = useState(flightsIcon);
  const [accountIconState, setAccountIcon] = useState(accountIcon);
  const [logoutIconState, setLogoutIcon] = useState(logoutIcon);

  const [user, setUser] = useState<User>({ name: "NULL", email: "NULL" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserDetails();
        if (userData) {
          setUser({ name: userData.full_name, email: userData.email });
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh");
      if (!refreshToken) {
        console.log("No refresh token found. Logging out...");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        navigate("/login");
        return;
      }

      await logout(refreshToken);
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col border border-solid border-[#D5D7DA] rounded-[1rem] absolute top-[70%] left-[90%] min-w-[300px] translate-x-[-50%] bg-[#fff]">
      <div className="profile__avatar px-[2.1rem] py-[1.6rem]">
        <div className="profile__avatar__image">
          <img src={avatar} alt="Avatar" className="profile__avatar__image" />
        </div>
        <div className="profile__avatar__details">
          <div className="profile__avatar__details__name">{user.name}</div>
          <div className="profile__avatar__details__rate">
            <span className="profile__avatar__details__rate__value">
              {user.email}
            </span>
          </div>
        </div>
      </div>
      <Divider appearance="neutral" size="small" className="mt-[1.6rem]" />
      <div className="flex flex-col gap-[.8rem] px-[2.1rem] py-[1.6rem] ">

      <div
          className="flex items-center gap-[.8rem] cursor-pointer"
          onClick={() => navigate("/add-profile-info")}
          onMouseEnter={() => setAccountIcon(accountHoverIcon)}
          onMouseLeave={() => setAccountIcon(accountIcon)}
        >
          <img src={accountIconState} alt="Account Icon" className="w-[20px] h-[20px]" />
          <span className="text-[1.4rem] text-[#808080] hover:text-[#F9A34B]">
            My Account
          </span>
        </div>

        <div
          className="flex items-center gap-[.8rem] cursor-pointer"
          onClick={() => navigate("/requests")}
          onMouseEnter={() => setRequestsIcon(requestsHoverIcon)}
          onMouseLeave={() => setRequestsIcon(requestsIcon)}
        >
          <img src={requestsIconState} alt="Requests Icon" className="w-[20px] h-[20px]" />
          <span className="text-[1.4rem] text-[#808080] hover:text-[#F9A34B]">
            My Requests
          </span>
        </div>

        <div
          className="flex items-center gap-[.8rem] cursor-pointer"
          onClick={() => navigate("/items")}
          onMouseEnter={() => setItemsIcon(itemHoverIcon)}
          onMouseLeave={() => setItemsIcon(itemsIcon)}
        >
          <img src={itemsIconState} alt="Items Icon" className="w-[20px] h-[20px]" />
          <span className="text-[1.4rem] text-[#808080] hover:text-[#F9A34B]">
            My Items
          </span>
        </div>

        <div
          className="flex items-center gap-[.8rem] cursor-pointer"
          onClick={() => navigate("/offers")}
          onMouseEnter={() => setFlightsIconState(flightsHoverIcon)}
          onMouseLeave={() => setFlightsIconState(flightsIcon)}
        >
          <img src={flightsIconState} alt="Flights Icon" className="w-[20px] h-[20px]" />
          <span className="text-[1.4rem] text-[#808080] hover:text-[#F9A34B]">
            My Flights
          </span>
        </div>


        <Divider appearance="neutral" size="small" className="mt-[1.6rem]" />

        <div
          className="flex items-center gap-[.8rem] cursor-pointer"
          onClick={handleLogout}
          onMouseEnter={() => setLogoutIcon(logoutHoverIcon)}
          onMouseLeave={() => setLogoutIcon(logoutIcon)}
        >
          <img src={logoutIconState} alt="Logout Icon" className="w-[20px] h-[20px]" />
          <span className="text-[1.4rem] text-[#808080] hover:text-[#F9A34B]">
            Logout
          </span>
        </div>
      </div>
    </div>
  );
};
