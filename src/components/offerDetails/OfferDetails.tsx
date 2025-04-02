import airplane from './../../assets/icons/airplane.svg'
import './OfferDetails.scss'

interface IOfferDetails {
    flightNumber?: string;
    fromCity?: string;
    toCity?: string;
}

export const OfferDetails = ({ flightNumber, fromCity, toCity }: IOfferDetails) => {
    return (
        <div className="offerDetails">
            <div className="offerDetails__flight">
                <span className="offerDetails__flightNumber">{flightNumber || "LH123"}</span>
            </div>
            <div className="offerDetails__route">
                <div className="offerDetails__route__location">
                        <span className="offerDetails__route__location__label">
                            From
                        </span>
                    <span className="offerDetails__route__location__title">
                            {fromCity}
                        </span>
                </div>
                <div className="offerDetails__route__icon">
                    <div className="offerDetails__route__icon__divider"/>
                    <div className="offerDetails__route__icon__img">
                        <img src={airplane} alt="Airplane icon"/>
                    </div>
                    <div className="offerDetails__route__icon__divider"/>
                </div>
                <div className="offerDetails__route__location">
                        <span className="offerDetails__route__location__label">
                            To
                        </span>
                    <span className="offerDetails__route__location__title">
                            {toCity}
                        </span>
                </div>
            </div>
        </div>
    )
}