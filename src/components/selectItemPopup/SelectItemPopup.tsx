import { Button } from "../button/Button";
import { FC, useState } from "react";
import plusIcon from './../../assets/icons/plus.svg';
import closeIcon from './../../assets/icons/closeIcon.svg';
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import './SelectItemPopup.scss';

interface ISelectItemPopup {
    data: any[];
    onClose: () => void;
}

export const SelectItemPopup: FC<ISelectItemPopup> = ({ data, onClose }) => {
    const navigate = useNavigate();
    const [selectedItem, setSelectedItem] = useState<number | null>(null);

    const handleCardClick = (id: number) => {
        if (id === selectedItem) {
            setSelectedItem(null);
            return;
        }
        setSelectedItem(id);
    };

    const onConfirm = () => {
        const item = data.find(item => item.id === selectedItem);
        localStorage.setItem('selectedItem', JSON.stringify(item));
        navigate('/payment');
    };

    return (
        <div className="selectItemPopup__overlay" onClick={onClose}>
            <div className="selectItemPopup__container" onClick={(e) => e.stopPropagation()}>
                <div className="selectItemPopup__header">
                    <h3>My items</h3>
                    <button className="selectItemPopup__closeBtn" onClick={onClose}>
                        <img src={closeIcon} alt="Close" />
                    </button>
                </div>

                <div className="selectItemPopup__content">
                    <div className="selectItemPopup__itemsGrid">
                        {data.map((item) => (
                            <button
                                key={item.id}
                                className={classNames(
                                    "selectItemPopup__item",
                                    {
                                        'selectItemPopup__item--selected': selectedItem === item.id,
                                        'selectItemPopup__item--disabled': item.verified?.toLowerCase().trim() !== 'verified'
                                    }
                                )}
                                disabled={item.verified?.toLowerCase().trim() !== 'verified'}
                                onClick={() => handleCardClick(item.id)}
                            >
                                <div className="selectItemPopup__itemImage">
                                    {item.verified && (
                                        <div className="offerCard__imageFlag">
                                            <span>{item.verified}</span>
                                        </div>
                                    )}
                                    <img src={item?.pictures?.[0]?.image} alt={item.name} />
                                </div>
                                <span className="selectItemPopup__itemName">{item.name}</span>
                            </button>
                        ))}

                        <button
                            className="selectItemPopup__item selectItemPopup__item--add"
                            onClick={() => navigate('/add-item')}
                        >
                            <div className="selectItemPopup__itemImage">
                                <img src={plusIcon} alt="Add" />
                            </div>
                            <span className="selectItemPopup__itemName">Add new item</span>
                        </button>
                    </div>
                </div>

                <div className="selectItemPopup__footer">
                    <Button title={'Confirm'} type={'primary'} handleClick={onConfirm} disabled={!selectedItem} />
                </div>
            </div>
        </div>
    );
}