import { Tooltip, tooltipClasses } from '@mui/material';
import calendarIcon from './../assets/icons/calendar.svg';
import plusIcon from './../assets/icons/plus.svg';
import accountBalanceWallet from './../assets/icons/account_balance-wallet.svg';
import libBooks from './../assets/icons/lib_books.svg';
import settings from './../assets/icons/settings.svg';
import sidebarMessage from './../assets/icons/sidebar_message.svg';
import star from './../assets/icons/star.svg';
import burger from './../assets/icons/burger.svg';
import './Sidenav.scss';
import {useState} from "react";

export const Sidenav = () => {
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
    )
}