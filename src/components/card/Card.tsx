import {FC, ReactNode} from "react";
import './Card.scss'
import logo from './../../assets/icons/item.svg'

type Props = {
    id: number,
    title: string;
    iconSrc: string;
    iconName: string;
    iconNode?: ReactNode;
    selected?: boolean;
    handleCardClick: (id: number) => void;
}

export const Card: FC<Props> = ({id, title, iconSrc, iconName, iconNode, selected, handleCardClick}) => {

    return (
        <div className={`card cursor-pointer ${selected ? 'selected' : ''}`} onClick={() => handleCardClick(id)}>
            <div className="card__icon">
                {iconNode
                    ? iconNode
                    : <img src={iconSrc || logo} alt={iconName} className="card__icon-image" onError={(e) => { (e.target as HTMLImageElement).src = logo; }}/>}
            </div>
            <span className="card__title">
                {title}
            </span>
        </div>
    )
}