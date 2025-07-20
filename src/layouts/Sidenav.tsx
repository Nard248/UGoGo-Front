import { Tooltip, tooltipClasses } from '@mui/material';
// <<<<<<< HEAD
import calendarIcon from './../assets/icons/calendar.svg';
import plusIcon from './../assets/icons/plus.svg';
import accountBalanceWallet from './../assets/icons/account_balance-wallet.svg';
import libBooks from './../assets/icons/lib_books.svg';
import settings from './../assets/icons/settings.svg';
import sidebarMessage from './../assets/icons/sidebar_message.svg';
import star from './../assets/icons/star.svg';
import burger from './../assets/icons/burger.svg';
// =======
// import { useNavigate } from 'react-router-dom';
// import { useState } from 'react';

// import accountIcon from './../assets/icons/account_circle.svg';
// import accountHoverIcon from './../assets/icons/account_circle_hover.svg';
// import requestsIcon from './../assets/icons/requests.svg';
// import requestsHoverIcon from './../assets/icons/requestsHover.svg';
// import itemsIcon from './../assets/icons/items.svg';
// import itemHoverIcon from './../assets/icons/itemsHover.svg';
// import flightsIcon from './../assets/icons/flights.svg';
// import flightsHoverIcon from './../assets/icons/flightsHover.svg';
// import logoutIcon from './../assets/icons/logout.svg';
// import logoutHoverIcon from './../assets/icons/logoutHover.svg';

// import { logout } from '../api/route';
import './Sidenav.scss';
import {useState} from "react";

export const Sidenav = () => {
// <<<<<<< HEAD
    const [opened, setOpened] = useState(false);

    return (
        <div className="sidenav">
            <button className="sidenav__iconButton" onClick={() => setOpened(!opened)}>
                <img src={burger} alt="Burger Icon"/>
            </button>
            {opened &&
                <>
                    <Tooltip title="Add item" placement="bottom"
                             slotProps={{
                                 popper: {
                                     sx: {
                                         [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                                             {
                                                 marginTop: '5px',
                                                 fontSize: '14px'
                                             },
                                     }
                                 }
                             }}
                    >
                        <button className="sidenav__iconButton">
                            <img src={plusIcon} alt="Plus Icon"/>
                        </button>
                    </Tooltip>
                    <Tooltip title="Calendar" placement="bottom"
                             slotProps={{
                                 popper: {
                                     sx: {
                                         [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                                             {
                                                 marginTop: '5px',
                                                 fontSize: '14px'
                                             },
                                     }
                                 }
                             }}
                    >
                        <button className="sidenav__iconButton">
                            <img src={calendarIcon} alt="Plus Icon"/>
                        </button>
                    </Tooltip>
                    <Tooltip title="Library books" placement="bottom"
                             slotProps={{
                                 popper: {
                                     sx: {
                                         [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                                             {
                                                 marginTop: '5px',
                                                 fontSize: '14px'
                                             },
                                     }
                                 }
                             }}
                    >
                        <button className="sidenav__iconButton">
                            <img src={libBooks} alt="Library books"/>
                        </button>
                    </Tooltip>
                    <Tooltip title="Message" placement="bottom"
                             slotProps={{
                                 popper: {
                                     sx: {
                                         [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                                             {
                                                 marginTop: '5px',
                                                 fontSize: '14px'
                                             },
                                     }
                                 }
                             }}
                    >
                        <button className="sidenav__iconButton">
                            <img src={sidebarMessage} alt="Plus Icon"/>
                        </button>
                    </Tooltip>
                    <Tooltip title="Account Balance Wallet" placement="bottom"
                             slotProps={{
                                 popper: {
                                     sx: {
                                         [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                                             {
                                                 marginTop: '5px',
                                                 fontSize: '14px'
                                             },
                                     }
                                 }
                             }}
                    >
                        <button className="sidenav__iconButton">
                            <img src={accountBalanceWallet} alt="Plus Icon"/>
                        </button>
                    </Tooltip>
                    <Tooltip title="Rate" placement="bottom"
                             slotProps={{
                                 popper: {
                                     sx: {
                                         [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                                             {
                                                 marginTop: '5px',
                                                 fontSize: '14px'
                                             },
                                     }
                                 }
                             }}
                    >
                        <button className="sidenav__iconButton">
                            <img src={star} alt="Rate Icon"/>
                        </button>
                    </Tooltip>
                    <Tooltip title="Settings" placement="bottom"
                             slotProps={{
                                 popper: {
                                     sx: {
                                         [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                                             {
                                                 marginTop: '5px',
                                                 fontSize: '14px'
                                             },
                                     }
                                 }
                             }}
                    >
                        <button className="sidenav__iconButton">
                            <img src={settings} alt="Settings Icon"/>
                        </button>
                    </Tooltip>
                </>
            }
                    </div>
      )}


  {/* const navigate = useNavigate();

  const [hoverStates, setHoverStates] = useState({
    account: accountIcon,
    requests: requestsIcon,
    items: itemsIcon,
    flights: flightsIcon,
    logout: logoutIcon
  });

  const [isOpen, setIsOpen] = useState(false); 

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false); 
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      if (refreshToken) {
        await logout(refreshToken);
      }
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
      navigate("/login");
    } finally {
      setIsOpen(false);
    }
  };

  const navItems = [
    {
      key: 'account',
      label: 'My Account',
      path: '/add-profile-info',
      icon: accountIcon,
      hoverIcon: accountHoverIcon
    },
    {
      key: 'requests',
      label: 'My Requests',
      path: '/requests',
      icon: requestsIcon,
      hoverIcon: requestsHoverIcon
    },
    {
      key: 'items',
      label: 'My Items',
      path: '/items',
      icon: itemsIcon,
      hoverIcon: itemHoverIcon
    },
    {
      key: 'flights',
      label: 'My Flights',
      path: '/offers',
      icon: flightsIcon,
      hoverIcon: flightsHoverIcon
    },
    {
      key: 'logout',
      label: 'Logout',
      path: '',
      icon: logoutIcon,
      hoverIcon: logoutHoverIcon,
      isLogout: true
    }
  ];

  return (
    <div>
      <button className="burgerToggle" onClick={toggleMenu}>
        ☰
      </button>

      {isOpen && (
        <div className="sidenav">
          {navItems.map((item) => (
            <Tooltip
              key={item.key}
              title={item.label}
              placement="bottom"
              slotProps={{
                popper: {
                  sx: {
                    [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]: {
                      marginTop: '5px',
                      fontSize: '14px'
                    }
                  }
                }
              }}
            >
              <button
                className="sidenav__iconButton"
                onClick={() =>
                  item.isLogout ? handleLogout() : handleNavigation(item.path)
                }
                onMouseEnter={() =>
                  setHoverStates((prev) => ({
                    ...prev,
                    [item.key]: item.hoverIcon
                  }))
                }
                onMouseLeave={() =>
                  setHoverStates((prev) => ({
                    ...prev,
                    [item.key]: item.icon
                  }))
                }
              >
                <img
                  src={hoverStates[item.key as keyof typeof hoverStates]}
                  alt={item.label}
                />
              </button>
            </Tooltip>
          ))}
>>>>>>> origin/feature/offer-creation-by-steps
//  
        </div>
      )}
    </div>
  );
}; */}
