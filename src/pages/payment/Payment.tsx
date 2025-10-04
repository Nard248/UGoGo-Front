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

    useEffect(() => {
        const storageData = localStorage.getItem('selectedItem');
        if (!storageData) return;

        const data = JSON.parse(storageData);
        setItem(data);
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
                            <div className="payment-page__price-row">
                                <span>Delivery fee</span>
                                <span>$10</span>
                            </div>
                            <div className="payment-page__price-row">
                                <span>Commission fee</span>
                                <span>$1</span>
                            </div>
                            <Divider size={'small'} appearance={'neutral'}/>
                            <div className="payment-page__price-row payment-page__price-row--total">
                                <span>Total</span>
                                <span>$11</span>
                            </div>
                        </div>
                    </div>
                    <div className="payment-page__card payment-page__book-info">
                        <h3>
                            Book Information
                        </h3>
                        {/*<AlertMessage*/}
                        {/*    type={'success'}*/}
                        {/*    text={*/}
                        {/*        'Congratulations! We have sent your book details to the traveler'*/}
                        {/*    }*/}
                        {/*    className={'mb-[39px]'}*/}
                        {/*/>*/}
                        <table>
                            <tr>
                                <th>Full name</th>
                                <th>Email</th>
                                <th>Phone number</th>
                            </tr>
                            <tr>
                                <td>John Doe</td>
                                <td>john.do@gmail.com</td>
                                <td>+1010101010</td>
                            </tr>
                        </table>
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
                    <div className="payment-page__card">
                        <div className="payment-page__card-header">
                            <h3>
                                Summary
                            </h3>
                        </div>
                        <div className="payment-page__card-body">
                            <div className="payment-page__summary-row">
                                <span>Total item</span>
                                <span>1 Item</span>
                            </div>
                            <div className="payment-page__summary-row">
                                <span>Pickup location</span>
                                <span>Yerevan, K. Ulnetsi 30, 22, 0037</span>
                            </div>
                            <div className="payment-page__summary-row">
                                <span>Direction</span>
                                <span>Moscow, Russia</span>
                            </div>
                            <div className="payment-page__summary-row">
                                <span>Flight date</span>
                                <span>Mon, 4 Feb 2024 - 10:00</span>
                            </div>
                        </div>
                    </div>
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