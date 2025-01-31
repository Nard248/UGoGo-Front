import {FC} from "react";
import './Card.scss'
import logo from './../../assets/icons/item.svg'

type Props = {
    id: number,
    title: string;
    iconSrc: string;
    iconName: string;
    selected?: boolean;
    handleCardClick: (id: number) => void;
}

export const Card: FC<Props> = ({id, title, iconSrc, iconName, selected, handleCardClick}) => {

    return (
        <div className={`card cursor-pointer ${selected ? 'selected' : ''}`} onClick={() => handleCardClick(id)}>
            <div className="card__icon">
                <img src={logo} alt={iconName} className="card__icon-image"/>
            </div>
            <span className="card__title">
                {title}
            </span>
        </div>
    )
}