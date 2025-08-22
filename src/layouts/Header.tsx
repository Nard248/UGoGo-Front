
// import { FC, useState } from "react";
// import { Avatar, Badge } from "@mui/material";
// import avatar from "./../assets/images/avatar.svg";
// import logo from "./../assets/images/logo.svg";
// import { ProfilePopover } from "../components/profilePopover/profilePopover";
// import { Button } from "../components/button/Button";
// import classNames from "classnames";
// import { useLocation, useNavigate } from "react-router-dom";
// import message from './../assets/icons/message.svg'
// import { useChat } from "../stores/ChatContext";
// import "./Header.scss";

// interface IHeader {
//   withNavItems?: boolean;
// }

// export const Header: FC<IHeader> = ({ withNavItems = true }) => {
//   const [isPopoverOpened, setIsPopoverOpened] = useState(false);
//   const isLoggedIn = !!localStorage.getItem("access");
//   const { pathname } = useLocation();
//   const navigate = useNavigate();
  
//   // Get chat state - will be available due to ChatProvider wrapping the entire app
//   const { state } = useChat();
  
//   // Calculate total unread messages with safety check
//   const totalUnread = state && state.unreadCounts 
//     ? Object.values(state.unreadCounts).reduce((sum, count) => sum + count, 0)
//     : 0;

// // <<<<<<< HEAD
// //     return (
// //         <header className="header w-full relative">
// //             <a href={'/'} className="header-logo">
// //                 <img src={logo} alt="UGOGO Logo" />
// //             </a>
// //             {withNavItems &&
// //                 <nav className="nav">
// //                     <a href="/">Home</a>
// //                     <a href="/post-offer">Post an offer</a>
// //                     <a href="/search-result">Find an offer</a>
// //                     <a href="#">Contact Us</a>
// //                 </nav>
// //             }
// //             {isLoggedIn ?
// // =======
//   return (
//     <header className="header w-full relative">
//       <a href={"/"} className="header-logo">
//         <img src={logo} alt="UGOGO Logo" />
//       </a>
//       {withNavItems && (
//         <nav className="nav">
//           <a className={classNames({
//               selectedLink: pathname === '/'
//           })} href="/">Home</a>
//           {/*<a className={classNames({*/}
//           {/*    //selectedLink:*/}
//           {/*})} href="#">How it works</a>*/}
//           <a className={classNames({
//               selectedLink: pathname === '/post-offer'
//           })} href="/post-offer">Post an offer</a>
//           <a className={classNames({
//               selectedLink: pathname === '/search-result'
//           })} href="/search-result">Find an offer</a>
//           {/*<a className={classNames({*/}
//           {/*    //selectedLink:*/}
//           {/*})} href="#">Price</a>*/}
//           <a className={classNames({
//               selectedLink: pathname === '/contact-us'
//           })} href="/contact-us">Contact Us</a>
//         </nav>
//       )}
//       {isLoggedIn ?
//                 <div className="flex items-center gap-5">
//                     <Badge 
//                         badgeContent={totalUnread} 
//                         color="error"
//                         className={'cursor-pointer message-icon'}
//                         onClick={() => navigate('/messages')}
//                         sx={{
//                             '& .MuiBadge-badge': {
//                                 backgroundColor: '#f7b05b',
//                                 color: 'white',
//                                 fontWeight: 'bold',
//                                 fontSize: '11px',
//                                 minWidth: '18px',
//                                 height: '18px'
//                             }
//                         }}
//                     >
//                         <img 
//                             src={message} 
//                             alt="Messages"
//                             style={{ 
//                                 width: '24px', 
//                                 height: '24px',
//                                 cursor: 'pointer'
//                             }}
//                             title="Messages"
//                         />
//                     </Badge>
//                     <div>
//                         <Avatar alt="Avatar image" src={avatar} className="cursor-pointer" onClick={() => setIsPopoverOpened(!isPopoverOpened)}/>
//                         {isPopoverOpened &&
//                             <ProfilePopover />
//                         }
//                     </div>
//                 </div>
//                 :
//                 <div className="auth-buttons">
//                 <a href="/login">
//                   <Button title="Login" type="primary" classNames="login" />
//                 </a>
//                 <a href="/registration">
//                   <Button title="Register" type="secondary" classNames="register" />
//                 </a>
//               </div>
        
//             }
//     </header>
//   );
// };
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
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 🍔 Burger
  const isLoggedIn = !!localStorage.getItem("access");
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { state } = useChat();
  const totalUnread = state && state.unreadCounts 
    ? Object.values(state.unreadCounts).reduce((sum, count) => sum + count, 0)
    : 0;

  return (
    <header className="header w-full relative">
      {/* Logo */}
      <a href={"/"} className="header-logo">
        <img src={logo} alt="UGOGO Logo" />
      </a>

      {/* Nav (hidden on mobile) */}
      {withNavItems && (
        <nav className="nav">
          <a className={classNames({ selectedLink: pathname === '/' })} href="/">Home</a>
          <a className={classNames({ selectedLink: pathname === '/post-offer' })} href="/post-offer">Post an offer</a>
          <a className={classNames({ selectedLink: pathname === '/search-result' })} href="/search-result">Find an offer</a>
          <a className={classNames({ selectedLink: pathname === '/contact-us' })} href="/contact-us">Contact Us</a>
        </nav>
      )}

      {/* Right side (messages + avatar + burger) */}
      {isLoggedIn ? (
        <div className="flex items-center gap-5">
          <Badge
            badgeContent={totalUnread}
            color="error"
            className={"cursor-pointer message-icon"}
            onClick={() => navigate('/messages')}
          >
            <img src={message} alt="Messages" style={{ width: '24px', height: '24px' }} />
          </Badge>

          <div>
            <Avatar alt="Avatar image" src={avatar} className="cursor-pointer" onClick={() => setIsPopoverOpened(!isPopoverOpened)} />
            {isPopoverOpened && <ProfilePopover />}
          </div>

          {/* 🍔 Burger button (mobile only) */}
          <button
            className={classNames("burger-btn", { open: isMenuOpen })}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      ) : (
        <div className="auth-buttons">
          <a href="/login"><Button title="Login" type="primary" classNames="login" /></a>
          <a href="/registration"><Button title="Register" type="secondary" classNames="register" /></a>

          {/* Burger for guests */}
          <button
            className={classNames("burger-btn", { open: isMenuOpen })}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      )}

      {/* Drawer Menu */}
      <div className={classNames("mobile-menu", { open: isMenuOpen })}>
        <nav className="mobile-nav">
          <a href="/" onClick={() => setIsMenuOpen(false)}>Home</a>
          <a href="/post-offer" onClick={() => setIsMenuOpen(false)}>Post an offer</a>
          <a href="/search-result" onClick={() => setIsMenuOpen(false)}>Find an offer</a>
          <a href="/contact-us" onClick={() => setIsMenuOpen(false)}>Contact Us</a>
        </nav>

        {!isLoggedIn && (
          <div className="mobile-auth">
            <a href="/login" onClick={() => setIsMenuOpen(false)}>
              <Button title="Login" type="primary" classNames="login" />
            </a>
            <a href="/registration" onClick={() => setIsMenuOpen(false)}>
              <Button title="Register" type="secondary" classNames="register" />
            </a>
          </div>
        )}
      </div>

      {/* Overlay */}
      {isMenuOpen && <div className="menu-overlay" onClick={() => setIsMenuOpen(false)} />}
    </header>
  );
};
