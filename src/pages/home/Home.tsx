import { FC, useCallback, useEffect, useState } from "react";
import { Search } from "../../components/search/Search";
import airplaneIcon from "../../assets/icons/airplaneIcon.svg";
import briefcaseIcon from "../../assets/icons/briefcaseIcon.svg";
import locationIcon from "../../assets/icons/locationIcon.svg";
import paymentIcon from "../../assets/icons/payment.svg";
import directionsWalk from "../../assets/icons/directions_walk.svg";
import addlocationIcon from "../../assets/icons/add_location_alt.svg";
import mopedIcon from "../../assets/icons/moped.svg";
import { OfferCardMini } from "../../components/offerCard/OfferCardMini";
import { Button } from "../../components/button/Button";
import { Divider } from "../../components/divider/Divider";
import checkedIcon from "../../assets/icons/checked.svg";
import { useNavigate } from "react-router-dom";
import { getUserDetails, searchOffer } from "../../api/route";
import { setSearchedResult } from "../../components/search/SearchService";
import { getAllOffers } from "../../api/route";
import "./home.scss";

const checkmark = <img src={checkedIcon} alt="Checked" />;

export const Home: FC = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      const userDetails = localStorage.getItem("userDetails");

      const promises: Promise<any>[] = [
        getAllOffers().catch(() => null),
      ];

      if (!userDetails) {
        promises.push(getUserDetails().catch(() => null));
      }

      const [offersResponse, userData] = await Promise.all(promises);

      if (offersResponse?.data) {
        setOffers(offersResponse.data.slice(0, 3));
      }

      if (userData) {
        const userObject = {
          id: userData.id,
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          balance: userData.balance,
        };
        localStorage.setItem("userDetails", JSON.stringify(userObject));
        window.dispatchEvent(new Event("userDetailsUpdated"));
      }
    };

    fetchInitialData();
  }, []);

  const handleClick = useCallback(() => {
    navigate("/search-result");
  }, [navigate]);

  const onOfferSearch = useCallback(async (searchParams: {
    origin_airport?: string;
    destination_airport?: string;
    takeoff_date?: string;
  }) => {
    try {
      const response = await searchOffer(searchParams);
      setSearchedResult(response.data);
      navigate("/search-result");
    } catch (error) {
      console.error("Search Error:", error);
    }
  }, [navigate]);

  return (
    <div className="home">
      <Search onSearchResults={onOfferSearch} />
      <div className="hero">
        <div className="hero-content">
          <h1>
            YOUR <strong>JOURNEY</strong>, OUR <strong>DELIVERY</strong>
          </h1>
          <p>
            Post your package or travel route, match instantly, and ship
            securely
          </p>
          <div className="hero-buttons">
            {/* <Button title="Find items" type="primary" /> */}
            <Button
              title="Find flights"
              type="secondary"
              handleClick={handleClick}
            />
          </div>
        </div>
        <div className="hero-divider"></div>
      </div>

      <div className="trusted-section">
        <h2>Trusted by thousands of users worldwide</h2>
        <div className="trusted-icons">
          <div className="icon-circle orange">
            <img src={airplaneIcon} alt="Airplane" />
          </div>
          <div className="icon-circle blue">
            <img src={briefcaseIcon} alt="Briefcase" />
          </div>
          <div className="icon-circle teal">
            <img src={locationIcon} alt="Location" />
          </div>
        </div>
      </div>

      <div className="solutions-section">
        <h2>Multiple solutions to meet your delivery challenges</h2>
        <Divider
          appearance="neutral"
          size="normal"
          className="divider-solutions"
        />

        <div className="solutions-grid">
          <div className="vertical-divider"></div>
          <div className="horizontal-divider"></div>

          <div className="solution">
            <img src={addlocationIcon} alt="Travel Route" className="icon" />
            <div className="solution-text">
              <h3>Post your travel route and earn extra cash</h3>
              <p>
                Traveling soon? Post your route details and get matched with
                senders who need items delivered along your journey. Earn extra
                money effortlessly while making your trips more productive.
              </p>
            </div>
          </div>

          <div className="solution">
            <img src={directionsWalk} alt="List Package" className="icon" />
            <div className="solution-text">
              <h3>List your package and find trusted travelers</h3>
              <p>
                Have a package to send? Simply list the item details, pickup,
                and destination locations. Our platform connects you with
                verified travelers heading your way for secure and reliable
                delivery.
              </p>
            </div>
          </div>

          <div className="solution">
            <img src={mopedIcon} alt="Updates" className="icon" />
            <div className="solution-text">
              <h3>Receive updates and confirm delivery easily</h3>
              <p>
                Your payment is held safely in escrow and only released once
                both parties confirm delivery. This ensures a secure transaction
                for senders and shippers alike.
              </p>
            </div>
          </div>

          <div className="solution">
            <img src={paymentIcon} alt="Secure Payment" className="icon" />
            <div className="solution-text">
              <h3>Pay and hold funds in escrow until delivery confirmation</h3>
              <p>
                Track your package in real-time and stay informed at every step
                of the journey. Once delivered, confirm the receipt and leave
                feedback for the traveler.
              </p>
            </div>
          </div>
        </div>

        <div className="buttons">
          <Button
            title="Add Items"
            type="primary"
            classNames="custom-button"
            handleClick={() => navigate('/items')}
          />
          <Button
            title="Find flights"
            type="secondary"
            classNames="custom-button secondary-button"
            handleClick={handleClick}
          />
        </div>
      </div>

      <div className="popular-routes">
        <h2>Popular Routes</h2>
        <div className="routes-container">
          {offers.map((offer) => (
            <OfferCardMini key={offer.id} data={offer} />
          ))}
        </div>
      </div>

      <Divider
        appearance="neutral"
        size="normal"
        className="divider-popular-routes"
      />

      <div className="account-selection">
        <h2>Which UGOGO Account is Right for You?</h2>
        <div className="account-options">
          <div className="account-card">
            <div className="account-header">Sender</div>
            <div className="account-body">
              <p>
                Send your packages safely and affordably by connecting with
                verified travelers heading to your destination. UGOGO simplifies
                the process, offering secure payments and real-time updates.
              </p>
            </div>
            <div className="account-divider"></div>
            <div className="account-features">
              <h3>FEATURES</h3>
              <ul>
                <li>
                  {checkmark}
                  Affordable Shipping
                </li>
                <li>{checkmark} Trusted Travelers</li>
                <li>{checkmark} Real-Time Tracking</li>
                <li>{checkmark} Escrow Payment System</li>
                <li>{checkmark} Flexible Options</li>
              </ul>
            </div>
          </div>

          <div className="account-card">
            <div className="account-header">Shipper</div>
            <div className="account-body">
              <p>
                Earn extra income by delivering packages on your travel route.
                With UGOGO, you can maximize your trips and help senders deliver
                their items securely.
              </p>
            </div>
            <div className="account-divider"></div>
            <div className="account-features">
              <h3>FEATURES</h3>
              <ul>
                <li>{checkmark} Earn While Traveling</li>
                <li>{checkmark} Flexible Opportunities</li>
                <li>{checkmark}Verified Senders</li>
                <li>{checkmark} Simple Posting</li>
                <li>{checkmark} Build Your Reputation</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="dark-background"></div>{" "}
      </div>
    </div>
  );
};
