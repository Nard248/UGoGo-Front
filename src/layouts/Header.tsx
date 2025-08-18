
import { FC, useState } from "react";
import { Avatar, Badge } from "@mui/material";
import avatar from "./../assets/images/avatar.svg";
import logo from "./../assets/images/logo.svg";
import { ProfilePopover } from "../components/profilePopover/profilePopover";
import { Button } from "../components/button/Button";
import classNames from "classnames";
import { useLocation, useNavigate } from "react-router-dom";
import message from './../assets/icons/message.svg'
import { useChat } from "../stores/ChatContext";
import "./Header.scss";

interface IHeader {
  withNavItems?: boolean;
}

export const Header: FC<IHeader> = ({ withNavItems = true }) => {
  const [isPopoverOpened, setIsPopoverOpened] = useState(false);
  const isLoggedIn = !!localStorage.getItem("access");
  const { pathname } = useLocation();
  const navigate = useNavigate();
  
  // Get chat state - will be available due to ChatProvider wrapping the entire app
  const { state } = useChat();
  
  // Calculate total unread messages with safety check
  const totalUnread = state && state.unreadCounts 
    ? Object.values(state.unreadCounts).reduce((sum, count) => sum + count, 0)
    : 0;

// <<<<<<< HEAD
//     return (
//         <header className="header w-full relative">
//             <a href={'/'} className="header-logo">
//                 <img src={logo} alt="UGOGO Logo" />
//             </a>
//             {withNavItems &&
//                 <nav className="nav">
//                     <a href="/">Home</a>
//                     <a href="/post-offer">Post an offer</a>
//                     <a href="/search-result">Find an offer</a>
//                     <a href="#">Contact Us</a>
//                 </nav>
//             }
//             {isLoggedIn ?
// =======
  return (
    <header className="header w-full relative">
      <a href={"/"} className="header-logo">
        <img src={logo} alt="UGOGO Logo" />
      </a>
      {withNavItems && (
        <nav className="nav">
          <a className={classNames({
              selectedLink: pathname === '/'
          })} href="/">Home</a>
          {/*<a className={classNames({*/}
          {/*    //selectedLink:*/}
          {/*})} href="#">How it works</a>*/}
          <a className={classNames({
              selectedLink: pathname === '/post-offer'
          })} href="/post-offer">Post an offer</a>
          <a className={classNames({
              selectedLink: pathname === '/search-result'
          })} href="/search-result">Find an offer</a>
          {/*<a className={classNames({*/}
          {/*    //selectedLink:*/}
          {/*})} href="#">Price</a>*/}
          <a className={classNames({
              selectedLink: pathname === '/contact-us'
          })} href="/contact-us">Contact Us</a>
        </nav>
      )}
      {isLoggedIn ?
                <div className="flex items-center gap-5">
                    <Badge 
                        badgeContent={totalUnread} 
                        color="error"
                        className={'cursor-pointer message-icon'}
                        onClick={() => navigate('/messages')}
                        sx={{
                            '& .MuiBadge-badge': {
                                backgroundColor: '#f7b05b',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '11px',
                                minWidth: '18px',
                                height: '18px'
                            }
                        }}
                    >
                        <img 
                            src={message} 
                            alt="Messages"
                            style={{ 
                                width: '24px', 
                                height: '24px',
                                cursor: 'pointer'
                            }}
                            title="Messages"
                        />
                    </Badge>
                    <div>
                        <Avatar alt="Avatar image" src={avatar} className="cursor-pointer" onClick={() => setIsPopoverOpened(!isPopoverOpened)}/>
                        {isPopoverOpened &&
                            <ProfilePopover />
                        }
                    </div>
                </div>
                :
                <div className="auth-buttons">
                <a href="/login">
                  <Button title="Login" type="primary" classNames="login" />
                </a>
                <a href="/registration">
                  <Button title="Register" type="secondary" classNames="register" />
                </a>
              </div>
        
            }
    </header>
  );
};
