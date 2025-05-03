import {FC, useState} from "react";
import {Link} from "../components/link/Link";
import {Avatar, Badge} from "@mui/material";
import avatar from './../assets/images/avatar.svg'
import logo from './../assets/images/logo.svg'
import message from './../assets/icons/message.svg'
import './Header.scss';
import {ProfilePopover} from "../components/profilePopover/profilePopover";

interface IHeader {
    withNavItems?: boolean;
}

export const Header: FC<IHeader> = ({withNavItems = true}) => {
    const [isPopoverOpened, setIsPopoverOpened] = useState(false)
    const isLoggedIn = !!localStorage.getItem('access');

    return (
        <header className="header w-full relative">
            <a href={'/'} className="header-logo">
                <img src={logo} alt="UGOGO Logo" />
            </a>
            {withNavItems &&
                <nav className="nav">
                    <a href="/">Home</a>
                    <a href="/post-offer">Post an offer</a>
                    <a href="/search-result">Find an offer</a>
                    <a href="#">Contact Us</a>
                </nav>
            }
            {isLoggedIn ?
                <div className="flex items-center gap-5">
                    <Badge className={'cursor-pointer'}>
                        <img  src={message} alt="Message"/>
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
                    <Link title={'Login'} href={'login'} type={'primary'}/>
                    <Link title={'Register'} href={'registration'} type={'secondary'}/>
                </div>
            }
        </header>
    );
}