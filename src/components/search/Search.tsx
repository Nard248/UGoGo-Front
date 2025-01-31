import {FC} from "react";
import searchIcon from './../../assets/icons/search.svg';
import './Search.scss';

export const Search: FC = () => {
    return (
        <div className="search-bar">
            <div className="search-field">
                <label>Where</label>
                <input type="text" placeholder="Search destinations"/>
            </div>
            <div className="divider"></div>
            <div className="search-field">
                <label>Date</label>
                <input type="text" placeholder="Add date and time"/>
            </div>
            <div className="divider"></div>
            <div className="search-field">
                <label>Item</label>
                <input type="text" placeholder="Search by item name"/>
            </div>
            <button className="search-button">
                <img src={searchIcon} alt="Search Icon"/>
            </button>
        </div>
    )
}