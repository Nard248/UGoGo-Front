import {useState, useEffect, useRef, FC} from "react";
import { useNavigate } from "react-router-dom";
import { Divider } from "../divider/Divider";
import { Avatar } from "../avatar/Avatar";
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
import sentIcon from "../../assets/icons/airplaneIcon.svg";
import sentHoverIcon from "../../assets/icons/airplane.svg";
import warning from "../../assets/icons/warning.svg";
import { logout } from "../../api/route";
import { useProfilePicture } from "../../hooks/useProfilePicture";
import { clearUserData } from "../../utils/auth";
import {User} from "../../types/global";



export const ProfilePopover: FC = () => {
  const navigate = useNavigate();
  const popoverRef = useRef<HTMLDivElement>(null);

  const [requestsIconState, setRequestsIcon] = useState(requestsIcon);
  const [sentIconState, setSentIcon] = useState(sentIcon);
  const [itemsIconState, setItemsIcon] = useState(itemsIcon);
  const [flightsIconState, setFlightsIconState] = useState(flightsIcon);
  const [accountIconState, setAccountIcon] = useState(accountIcon);
  const [logoutIconState, setLogoutIcon] = useState(logoutIcon);

  const [isPopoverOpen, setIsPopoverOpen] = useState(true);

  const [user, setUser] = useState<User>({ email: "", balance: 0 });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<string>("");
  const [isPassportUploaded, setIsPassportUploaded] = useState<boolean>(false);

  // Profile picture hook
  const { pictureUrl, loading: pictureLoading } = useProfilePicture();

  const loadUserData = () => {
    const cachedUser = localStorage.getItem("userDetails");
    if (cachedUser) {
      const userData = JSON.parse(cachedUser);
      setUser(userData);

      // Handle both old format (name) and new format (first_name, last_name)
      if (userData.first_name || userData.last_name) {
        setFirstName(userData.first_name || "");
        setLastName(userData.last_name || "");
      } else if (userData.name) {
        // Fallback: split the name if it's in the old format
        const nameParts = userData.name.split(" ");
        setFirstName(nameParts[0] || "");
        setLastName(nameParts.slice(1).join(" ") || "");
      }

      // Load verification status
      setVerificationStatus(userData.passport_verification_status || "");
      setIsPassportUploaded(userData.is_passport_uploaded || false);
    }
  };

  useEffect(() => {
    loadUserData();

    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsPopoverOpen(false);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "userDetails") {
        loadUserData();
      }
    };

    const handleUserUpdate = () => {
      loadUserData();
    };

    const handleLogout = () => {
      // Clear local state when user logs out
      setUser({ email: "", balance: 0 });
      setFirstName("");
      setLastName("");
      setVerificationStatus("");
      setIsPassportUploaded(false);
      setIsPopoverOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userDetailsUpdated", handleUserUpdate);
    window.addEventListener("userLoggedOut", handleLogout);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userDetailsUpdated", handleUserUpdate);
      window.removeEventListener("userLoggedOut", handleLogout);
    };

  }, []);
  


  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh");
      if (refreshToken) {
        // Try to logout on the server
        await logout(refreshToken);
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      // Always clear user data (localStorage + caches) regardless of server response
      await clearUserData();
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
        <div ref={popoverRef}  className="flex flex-col border border-solid border-[#D5D7DA] rounded-[1rem] absolute top-[70%] right-[1rem] min-w-[300px] bg-[#fff] z-10">
          <div className="profile__avatar px-[2.1rem] py-[1.6rem]">
            <div className="profile__avatar__image">
              <Avatar
                firstName={firstName || "User"}
                lastName={lastName}
                size="medium"
                className="profile__avatar__image"
                profilePictureUrl={pictureUrl}
                loading={pictureLoading}
              />
            </div>
            <div className="profile__avatar__details">
              <div className="profile__avatar__details__name">{firstName} {lastName}</div>
              <div className="profile__avatar__details__rate">
                <span className="profile__avatar__details__rate__value">
                  {user.email}
                </span>
              </div>
              <div className="mt-[0.5rem]">
                <span className="text-[1.3rem] font-semibold text-[#008080]">
                  Balance: ${user.balance || '0.00'}
                </span>
              </div>
            </div>
          </div>
          {/* Show pending banner when passport uploaded and status is pending - NOT clickable */}
          {isPassportUploaded && verificationStatus === 'pending' && (
            <div className="mx-[2.1rem] mb-[1.6rem] bg-yellow-50 border border-yellow-300 rounded-lg p-3 flex items-center gap-[0.8rem]">
              <img src={warning} alt="Warning" className="w-[1.6rem] h-[1.6rem]" />
              <div className="flex flex-col">
                <span className="text-[1.3rem] font-semibold text-yellow-900">
                  Verification Pending
                </span>
                <span className="text-[1.1rem] text-yellow-700">
                  Your verification is being reviewed
                </span>
              </div>
            </div>
          )}

          {/* Show clickable warning when passport NOT uploaded OR rejected */}
          {verificationStatus && verificationStatus !== 'verified' && (!isPassportUploaded || verificationStatus === 'rejected') && (
            <div
              className="mx-[2.1rem] mb-[1.6rem] bg-yellow-50 border border-yellow-300 rounded-lg p-3 flex items-center gap-[0.8rem] cursor-pointer hover:bg-yellow-100 transition-colors"
              onClick={() => handleNavigation('/profile-verification')}
            >
              <img src={warning} alt="Warning" className="w-[1.6rem] h-[1.6rem]" />
              <div className="flex flex-col">
                <span className="text-[1.3rem] font-semibold text-yellow-900">
                  Not Verified
                </span>
                <span className="text-[1.1rem] text-yellow-700">
                  Click to complete verification
                </span>
              </div>
            </div>
          )}
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
            >
              <img
                src={coin}
                alt="Payout Icon"
                className="w-[20px] h-[20px]"
              />
              <span className="text-[1.4rem] text-[#808080] hover:text-[#F9A34C]">
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
              <span className="text-[1.4rem] text-[#808080] hover:text-[#F9A34D]">
                My Requests
              </span>
            </div>

            <div
              className="flex items-center gap-[.8rem] cursor-pointer"
              onClick={() => handleNavigation("/sent-requests")}
              onMouseEnter={() => setSentIcon(sentHoverIcon)}
              onMouseLeave={() => setSentIcon(sentIcon)}
            >
              <img
                src={sentIconState}
                alt="Sent Requests Icon"
                className="w-[20px] h-[20px]"
              />
              <span className="text-[1.4rem] text-[#808080] hover:text-[#F9A34B]">
                Sent Requests
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
