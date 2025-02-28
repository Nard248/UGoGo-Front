import {Divider} from "../divider/Divider";
import avatar from "../../assets/images/avatar.svg";
import settingsIcon from "../../assets/icons/settings.svg";
import { logout } from "../../api/route";
import {useNavigate} from "react-router-dom";

export const ProfilePopover = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const refreshToken = localStorage.getItem('refresh');
        if (!refreshToken) {
            return
        }

        try {
            await logout(refreshToken);
            localStorage.removeItem('access')
            localStorage.removeItem('refresh')
            navigate('/login')
        } catch (e) {
            console.error(e)
        }

    }

    return (
        <div className="flex flex-col border border-solid border-[#D5D7DA] rounded-[1rem] absolute top-[70%] left-[90%] min-w-[300px] translate-x-[-50%] bg-[#fff]">
            <div className="profile__avatar px-[2.1rem] py-[1.6rem]">
                <div className="profile__avatar__image">
                    <img src={avatar} alt="Avatar" className="profile__avatar__image"/>
                </div>
                <div className="profile__avatar__details">
                    <div className="profile__avatar__details__name">
                        John Doe
                    </div>
                    <div className="profile__avatar__details__rate">
                        <span className="profile__avatar__details__rate__value">
                            John.doe@gmail.com
                        </span>
                    </div>
                </div>
            </div>
            <Divider appearance={'neutral'} size={'small'} className="mt-[1.6rem]" />
            <div className="flex flex-col gap-[.8rem] px-[2.1rem] py-[1.6rem]">
                <div className="flex items-center gap-[.8rem] cursor-pointer">
                    <div className="flex">
                        <img src={settingsIcon} alt="settings icon"/>
                    </div>
                    <span className="text-[1.4rem] text-[#808080]">
                        My account
                    </span>
                </div>
                <div className="flex items-center gap-[.8rem] cursor-pointer">
                    <div className="flex">
                        <img src={settingsIcon} alt="settings icon"/>
                    </div>
                    <span className="text-[1.4rem] text-[#808080]">
                        Settings
                    </span>
                </div>
                <div className="flex items-center gap-[.8rem] cursor-pointer">
                    <div className="flex">
                        <img src={settingsIcon} alt="settings icon"/>
                    </div>
                    <span className="text-[1.4rem] text-[#808080]" onClick={handleLogout}>
                        Logout
                    </span>
                </div>
            </div>
        </div>
    )
}