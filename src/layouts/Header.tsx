import {FC} from "react";
import {Link} from "../components/link/Link";
import {Avatar, Badge} from "@mui/material";
import avatar from './../assets/images/avatar.svg'
import logo from './../assets/images/logo.svg'
import notification from './../assets/icons/notification.svg'
import './Header.scss';

interface IHeader {
    withNavItems?: boolean;
}

export const Header: FC<IHeader> = ({withNavItems = true}) => {
    const isLoggedIn = !!localStorage.getItem('token')
    return (
        <header className="header w-full">
            <a href={'/single-product-page'} className="header-logo">
                <img src={logo} alt="UGOGO Logo" />
            </a>
            {withNavItems &&
                <nav className="nav">
                    <a href="#">Home</a>
                    <a href="#">How it works</a>
                    <a href="#">Post an offer</a>
                    <a href="#">Find an offer</a>
                    <a href="#">Price</a>
                    <a href="#">Contact Us</a>
                </nav>
            }
            {isLoggedIn ?
                <div className="flex items-center gap-5">
                    <Badge>
                        <img src={notification} alt="Notifications"/>
                    </Badge>
                    <Avatar alt="Avatar image" src={avatar}/>
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