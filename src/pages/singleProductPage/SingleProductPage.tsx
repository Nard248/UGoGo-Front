import {ChangeEvent, FC, useEffect, useState} from "react";
import {OfferDetails} from "../../components/offerDetails/OfferDetails";
import packageIcon from './../../assets/icons/package.svg';
import {Button} from "../../components/button/Button";
import {getSingleProduct} from "../../api/route";
import './SingleProductPage.scss'
import {Input} from "../../components/input/Input";
import {Label} from "../../components/label/Label";

export const SingleProductPage: FC = () => {
    const [data, setData] = useState(null)

    useEffect(() => {
        getSingleProduct('3').then(data => {
            setData(data.data.offer)
        })
    }, [])

    const handleInputChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {

    }

    const onBook = () => {

    }

    return (
        <div className="singleProductPage">
            <div className="px-16">
                <div className="singleProductPage__actions flex justify-end gap-8">
                    {/*<Button classNames="singleProductPage__actions__button border-none" title={'Filter'}*/}
                    {/*        type={'tertiary'}/>*/}
                    {/*<Button classNames="singleProductPage__actions__button" title={'Book flight'} type={'primary'}/>*/}
                </div>
                <OfferDetails/>
                {/*<Profile/>*/}
            </div>
            <div className="px-16">
                <div className="singleProductPage__productInfo">
                    <div className="singleProductPage__productInfo__header postOffer__header">
                        <h3 className="singleProductPage__productInfo__header__title singleProductPage__title">
                            Flight & Item Details
                        </h3>
                    </div>
                    <div className="singleProductPage__productInfo__table">
                        <div className="singleProductPage__productInfo__table__item">
                            <div className="singleProductPage__productInfo__table__item__title">
                                <div className="singleProductPage__productInfo__table__item__title__icon">
                                    <img src={packageIcon} alt="Package icon"/>
                                </div>
                                Available space for packages
                            </div>
                            <div className="singleProductPage__productInfo__table__item__info">
                                kg 5
                            </div>
                        </div>
                        <div className="singleProductPage__productInfo__table__item">
                            <div className="singleProductPage__productInfo__table__item__title">
                                <div className="singleProductPage__productInfo__table__item__title__icon">
                                    <img src={packageIcon} alt="Package icon"/>
                                </div>
                                Departure date & time
                            </div>
                            <div className="singleProductPage__productInfo__table__item__info">
                                21:25 12/12/2025
                            </div>
                        </div>
                        <div className="singleProductPage__productInfo__table__item">
                            <div className="singleProductPage__productInfo__table__item__title">
                                <div className="singleProductPage__productInfo__table__item__title__icon">
                                    <img src={packageIcon} alt="Package icon"/>
                                </div>
                                Arival date & time
                            </div>
                            <div className="singleProductPage__productInfo__table__item__info">
                                21:25 12/12/2025
                            </div>
                        </div>
                        <div className="singleProductPage__productInfo__table__item">
                            <div className="singleProductPage__productInfo__table__item__title">
                                <div className="singleProductPage__productInfo__table__item__title__icon">
                                    <img src={packageIcon} alt="Package icon"/>
                                </div>
                                Items can not be transported
                            </div>
                            <div className="singleProductPage__productInfo__table__item__info">
                                item, item, item, item
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-[--primary-background] h-[55px]"></div>
            <div className="px-16">
                <div className="singleProductPage__notes">
                    <div className="singleProductPage__notes__title">
                        <p>

                        </p>
                    </div>
                    <div className="singleProductPage__notes__content">
                        <div className="singleProductPage__notes__content__area">
                            <Label title={'Additional notes from traveler'} htmlFor={'notes'} classnames={'singleProductPage__notes__title'}>
                                <Input type={'textarea'}
                                       placeholder={'Enter a description...'}
                                       id={'notes'} classnames={'postOffer__input'}
                                       handleChange={handleInputChange}
                                />
                            </Label>
                        </div>
                        <div className="flex flex-col singleProductPage__flightItemsDetails">
                            <div className="singleProductPage__productInfo__header postOffer__header">
                                <h3 className="singleProductPage__productInfo__header__title singleProductPage__title">
                                    Flight & Item Details
                                </h3>
                            </div>
                            <div className="singleProductPage__flightItemsDetails__content">
                                <div className="flex justify-between singleProductPage__flightItemsDetails__content__item">
                                    <span className="singleProductPage__flightItemsDetails__content__itemTitle">Delivery fee</span>
                                    <span className="singleProductPage__flightItemsDetails__content__itemValue">$10</span>
                                </div>
                                <div className="flex justify-between singleProductPage__flightItemsDetails__content__item">
                                    <span className="singleProductPage__flightItemsDetails__content__itemTitle">Commission fee</span>
                                    <span className="singleProductPage__flightItemsDetails__content__itemValue">$1</span>
                                </div>
                                <div className="flex justify-between singleProductPage__flightItemsDetails__content__itemTotal">
                                    <span className="singleProductPage__flightItemsDetails__content__itemTitle singleProductPage__flightItemsDetails__content__itemTotal__title">Total</span>
                                    <span className="singleProductPage__flightItemsDetails__content__itemValue">$11</span>
                                </div>
                            </div>
                            <div className=""></div>
                        </div>
                    </div>
                    <div className="flex justify-end pt-9">
                        <Button classNames="singleProductPage__notes__content__button" title={'Book flight'}
                                type={'primary'}
                                handleClick={onBook}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}