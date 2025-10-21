import {Button} from "../../components/button/Button";
import warning from './../../assets/icons/warning.svg'
import {Divider} from "../../components/divider/Divider";
import Checkbox from "@mui/material/Checkbox/Checkbox";
import {useEffect, useState} from "react";
import {Loading} from "../../components/loading/Loading";
import { IPay } from "../../types/global";
import { pay } from "../../api/route";
import {ConfirmationPopup} from "../../components/confirmationPopup/ConfirmationPopup";
import {useNavigate} from "react-router-dom";
import "./Payment.scss";

export const Payment = () => {
    const navigate = useNavigate();
    const [isError, setIsError] = useState(false);
    const [item, setItem] = useState(null);
    const [offerData, setOfferData] = useState<any>(null);
    const [validationData, setValidationData] = useState<any>(null);

    useEffect(() => {
        const storageData = localStorage.getItem('selectedItem');
        const offerStorageData = localStorage.getItem('offer');
        const validationStorageData = localStorage.getItem('validationData');

        if (!storageData) return;

        const data = JSON.parse(storageData);
        setItem(data);

        if (offerStorageData) {
            const offer = JSON.parse(offerStorageData);
            setOfferData(offer);
        }

        if (validationStorageData) {
            const validation = JSON.parse(validationStorageData);
            setValidationData(validation);
        }
    }, []);

    const onPay = async () => {
        const itemData = localStorage.getItem('selectedItem');
        const offerData = localStorage.getItem('offer');
        if (!itemData || !offerData) {
            return
        }

        const {id: itemId} = JSON.parse(itemData);
        const {id: offerId, comments} = JSON.parse(offerData);

        try {
            const payload: IPay = {
                item: itemId,
                offer: offerId,
                comments: comments
            }

            const data = (await pay(payload)).data;

            if (data.checkout_url) {
                window.location.href = data.checkout_url
            }
        } catch (e) {
            setIsError(true);
            console.log(e);
        }
    }

    return (
        item ?
        <div className="payment-page">
            <h1 className="payment-page__title">
                Checkout
            </h1>
            <div className="payment-page__content">
                <div className="payment-page__left-column">
                    {/*<AlertMessage*/}
                    {/*    type={'warning'}*/}
                    {/*    text={*/}
                    {/*        'Your booking is on hold until 01/01/25 12:00 AM. If your reserve change we will get back to you.'*/}
                    {/*    }*/}
                    {/*/>*/}
                    <div className="payment-page__card">
                        <div className="payment-page__card-header">
                            <h3>
                                Price Details
                            </h3>
                        </div>
                        <div className="payment-page__card-body">
                            {validationData && validationData.price_calculation ? (
                                <>
                                    <div className="payment-page__price-row" style={{
                                        fontSize: '1.3rem',
                                        color: '#6B7280',
                                        marginBottom: '0.8rem'
                                    }}>
                                        <span>Weight: {validationData.price_calculation.weight}kg × ${validationData.price_calculation.base_rate}/kg</span>
                                    </div>
                                    <div className="payment-page__price-row">
                                        <span>Delivery fee</span>
                                        <span>${validationData.price_calculation.total_price}</span>
                                    </div>
                                    <div className="payment-page__price-row">
                                        <span>Platform commission (10%)</span>
                                        <span>${validationData.price_calculation.platform_commission}</span>
                                    </div>
                                    <Divider size={'small'} appearance={'neutral'}/>
                                    <div className="payment-page__price-row payment-page__price-row--total">
                                        <span>Total</span>
                                        <span>{validationData.price_calculation.display.total}</span>
                                    </div>
                                    <div className="payment-page__price-row" style={{
                                        fontSize: '1.3rem',
                                        color: '#6B7280',
                                        marginTop: '0.8rem'
                                    }}>
                                        <span>Courier receives: {validationData.price_calculation.display.courier}</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {(() => {
                                        const deliveryFee = Number(offerData?.price) || 0;
                                        const commission = deliveryFee * 0.10; // 10% commission
                                        const total = deliveryFee;
                                        const courierReceives = deliveryFee * 0.90; // Courier gets 90%

                                        return (
                                            <>
                                                <div className="payment-page__price-row">
                                                    <span>Delivery fee</span>
                                                    <span>${deliveryFee.toFixed(2)}</span>
                                                </div>
                                                <div className="payment-page__price-row">
                                                    <span>Platform commission (10%)</span>
                                                    <span>${commission.toFixed(2)}</span>
                                                </div>
                                                <Divider size={'small'} appearance={'neutral'}/>
                                                <div className="payment-page__price-row payment-page__price-row--total">
                                                    <span>Total</span>
                                                    <span>${total.toFixed(2)}</span>
                                                </div>
                                                <div className="payment-page__price-row" style={{
                                                    fontSize: '1.3rem',
                                                    color: '#6B7280',
                                                    marginTop: '0.8rem'
                                                }}>
                                                    <span>Courier receives: ${courierReceives.toFixed(2)}</span>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="payment-page__card payment-page__cancellation">
                        <div className="payment-page__cancellation-icon">
                            <img src={warning} alt=""/>
                        </div>
                        <div className="payment-page__cancellation-content">
                            <span>
                                Cancellation Policy
                            </span>
                            <span>
                                Cancellations before delivery. (We will alert for the next cancellation, penalty fee will be deducted of 20%)
                            </span>
                            <a href={'/'}>
                                See more details
                            </a>
                        </div>
                    </div>
                </div>
                <div className="payment-page__right-column">
                    <div className="payment-page__terms">
                        <div className="payment-page__terms-checkbox">
                            <Checkbox defaultChecked
                                      sx={{
                                          color: '#F9A34B',
                                          padding: '.5rem',
                                          '&.Mui-checked': {
                                              color: '#F9A34B',
                                          },
                                      }}
                            />
                            <span>
                                By clicking this, I agree to UGOGO
                                <a href="/"> Terms & Conditions </a>
                                and <a href="/">Privacy Policy</a>
                            </span>
                        </div>
                        <Button title={'Pay for my booking'} type={'primary'} handleClick={onPay}/>
                    </div>
                </div>
            </div>
            {isError &&
                <ConfirmationPopup
                    isError={true}
                    secondaryButtonText={'Cancel'}
                    secondaryButtonClick={() => setIsError(false)}
                    primaryButtonText={'Redirect to Verify'}
                    primaryButtonClick={() => navigate('/profile-verification')}
                    message={'You are not verified!'}
                />
            }
        </div>
        :
        <Loading/>
    )
}