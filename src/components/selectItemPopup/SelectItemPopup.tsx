import { Button } from "../button/Button";
import { FC, useState } from "react";
import plusIcon from './../../assets/icons/plus.svg';
import closeIcon from './../../assets/icons/closeIcon.svg';
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { validateRequest } from "../../api/route";
import './SelectItemPopup.scss';

interface ISelectItemPopup {
    data: any[];
    onClose: () => void;
}

export const SelectItemPopup: FC<ISelectItemPopup> = ({ data, onClose }) => {
    const navigate = useNavigate();
    const [selectedItem, setSelectedItem] = useState<number | null>(null);
    const [isValidating, setIsValidating] = useState<boolean>(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    const handleCardClick = (id: number) => {
        if (id === selectedItem) {
            setSelectedItem(null);
            return;
        }
        setSelectedItem(id);
        setValidationError(null);
    };

    const onConfirm = async () => {
        const item = data.find(item => item.id === selectedItem);
        const offerData = localStorage.getItem('offer');

        if (!item || !offerData) {
            setValidationError('Missing item or offer data');
            return;
        }

        const offer = JSON.parse(offerData);
        setIsValidating(true);
        setValidationError(null);

        try {
            // Validate the request with backend
            const response = await validateRequest({
                offer_id: offer.id,
                item_id: item.id
            });

            const validationData = response.data;

            if (!validationData.valid) {
                // Show validation errors
                setValidationError(validationData.errors.join('. '));
                setIsValidating(false);
                return;
            }

            // Store validation data including calculated price
            localStorage.setItem('selectedItem', JSON.stringify(item));
            localStorage.setItem('validationData', JSON.stringify(validationData));

            // Navigate to payment page
            navigate('/payment');
        } catch (error: any) {
            console.error('Validation error:', error);
            const errorMessage = error.response?.data?.errors?.join('. ') ||
                                 error.response?.data?.error ||
                                 'Failed to validate request. Please try again.';
            setValidationError(errorMessage);
            setIsValidating(false);
        }
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
                    {validationError && (
                        <div style={{
                            width: '100%',
                            padding: '1.2rem',
                            marginBottom: '1.5rem',
                            backgroundColor: '#FEE2E2',
                            border: '1px solid #FCA5A5',
                            borderRadius: '6px',
                            color: '#991B1B',
                            fontSize: '1.4rem',
                            lineHeight: '1.5'
                        }}>
                            {validationError}
                        </div>
                    )}
                    <Button
                        title={isValidating ? 'Validating...' : 'Confirm'}
                        type={'primary'}
                        handleClick={onConfirm}
                        disabled={!selectedItem || isValidating}
                    />
                </div>
            </div>
        </div>
    );
}