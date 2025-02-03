import {Avatar, Box, Rating} from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import offerCardImage from './../../assets/images/offer.svg'
import avatar from './../../assets/images/avatar.svg'
import message from './../../assets/icons/message.svg'
import moreBtn from './../../assets/icons/more.svg'
import {Button} from "../button/Button";
import './OfferCard.scss';

export const OfferCard = () => {
    return (
        <div className="offerCard border border-[#AEE6E6]">
            <div className="offerCard__image">
                <div className="offerCard__imageFlag">
                    {/*Open*/}
                </div>
                <img src={offerCardImage} alt="Offer card" className="offerCard__imageSvg"/>
            </div>
            <div className="offerCard__details flex flex-col gap-3.5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar alt="Avatar" src={avatar}/>
                        <span className="text-[#808080]">
                            Edd Sheeren
                        </span>
                    </div>
                    <div className="rate flex items-center gap-3">
                        <Rating
                            name="hover-feedback"
                            // value={value}
                            precision={0.5}
                            max={1}
                            // getLabelText={getLabelText}
                            // onChange={(event, newValue) => {
                            //     setValue(newValue);
                            // }}
                            // onChangeActive={(event, newHover) => {
                            //     setHover(newHover);
                            // }}
                            // emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                        />

                        {/*{value !== null && (*/}
                        {/*    <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>*/}
                        {/*)}*/}
                        <span>
                            5 (435)
                        </span>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <h3 className="offerCard__flightNumber">
                        Flight number
                    </h3>
                    <span className="offerCard__flight">
                        LH123
                    </span>
                </div>
                <div className="offerCard__date">
                    <span>12.12.2024</span>
                </div>
                <div className="offerCard__direction flex items-center justify-between">
                    <div className='from'>
                        <span className="country">
                            Armenia
                        </span>,
                        <span className="city">
                            Yerevan
                        </span>
                    </div>
                    <div className='to'>
                        <span className="country">
                            Russia
                        </span>,
                        <span className="city">
                            Moscow
                        </span>
                    </div>
                </div>
                <div className="offerCard__date">
                    <span>13:30</span>
                    <span>15:30</span>
                </div>
                <div className="offerCard__space flex items-center justify-between">
                    <span>Available space</span>
                    <span>kg 12, 5x4x3</span>
                </div>
                <div className="offerCard__userActions">
                    <button className="button">
                        <img src={message} alt="Message Icon"/>
                    </button>
                    <button className="button">
                        <img src={moreBtn} alt="More buttons Icon"/>
                    </button>
                </div>
                <div className="cardActions flex items-center justify-between">
                    <Button title={'Send a request'} type={'primary'} handleClick={() => {}} />
                    <Button title={'Learn more'} type={'primary'} handleClick={() => {}} />
                </div>
            </div>
        </div>
    )
}