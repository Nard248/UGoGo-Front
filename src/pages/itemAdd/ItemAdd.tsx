import React, {ChangeEvent, FC, useEffect, useState} from "react";
import './ItemAdd.scss';
import {Label} from "../../components/label/Label";
import {Input} from "../../components/input/Input";
import {Button} from "../../components/button/Button";
import {Card} from "../../components/card/Card";
import {ImageComponent} from "../../components/image/Image";
import iconSvg from './../../assets/icons/item.svg'
import {ImageLabel} from "../../components/image/ImageLabel";
import {Sidenav} from "../../layouts/Sidenav";
import {getCategories} from "../../api/route";

export const ItemAdd: FC = () => {
    const [selectedCategories, setSelectedCategories] = useState<number[] | null>()
    const [categories, setCategories] = useState<any[]>([]);

    const handleCardClick = (id: number) => {
        if (selectedCategories?.includes(id)) {
            const _selectedCategories = selectedCategories.filter(item => item !== id);
            setSelectedCategories(_selectedCategories);
            return;
        }
        const _selectedCategories = selectedCategories?.length ? [...selectedCategories, id] : [id];
        setSelectedCategories(_selectedCategories);
    }

    const getCategoriesData = async () => {
        const data = await getCategories();
        setCategories(data.data)
    }

    useEffect(() => {
        getCategoriesData();
    }, [])

    const handleInputChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {

    }

    const onAddCategory = () => {

    }

    const onDraftSave = () => {

    }

    const onConfirm = () => {

    }

    const onItemAdd = () => {

    }

    return (
        <div className="postOffer">
            <div className="flex justify-between items-center mb-[2.1rem]">
                <h1 className="font-medium text-[2rem]">Add an item</h1>
                <Button type={'primary'} title={'Add item'} handleClick={onItemAdd}></Button>
            </div>
            <div className="postOffer__content flex justify-between gap-20">
                <div className="postOffer__flightDetails">
                    <div className="postOffer__flightDetails__form postOffer__form">
                        <div className="postOffer__flightDetails__form__header postOffer__header">
                            <h3 className="postOffer__flightDetails__form__header__title postOffer__title">
                                Item details
                            </h3>
                        </div>
                        <div className="postOffer__flightDetails__form__content">
                            <Label title={'Flight number'} htmlFor={'flightNumber'}
                                   classnames={'postOffer__label'}>
                                <Input type={'text'} placeholder={'LH123'} id={'flightNumber'}
                                       classnames={'postOffer__input'}
                                       handleChange={handleInputChange}
                                />
                            </Label>
                        </div>
                        <div className="postOffer__flightDetails__form__content">
                            <Label title={'Departure'} htmlFor={'departure'}
                                   classnames={'postOffer__label'}>
                                <Input type={'text'} placeholder={'Yerevan (EVN)'} id={'departure'}
                                       classnames={'postOffer__input'}
                                       handleChange={handleInputChange}
                                />
                            </Label>
                        </div>
                        <div className="postOffer__flightDetails__form__content">
                            <Label title={'Destination'} htmlFor={'destination'}
                                   classnames={'postOffer__label'}>
                                <Input type={'text'} placeholder={'Moscow (SVO)'} id={'destination'}
                                       classnames={'postOffer__input'}
                                       handleChange={handleInputChange}
                                />
                            </Label>
                        </div>
                        <div className="postOffer__flightDetails__form__content">
                            <Label title={'Destination'} htmlFor={'destination'}
                                   classnames={'postOffer__label'}>
                                <Input type={'text'} placeholder={'Moscow (SVO)'} id={'destination'}
                                       classnames={'postOffer__input'}
                                       handleChange={handleInputChange}
                                />
                            </Label>
                        </div>
                    </div>
                    <div className="postOffer__flightDetails__form postOffer__form">
                        <div className="postOffer__flightDetails__form__header postOffer__header">
                            <h3 className="postOffer__flightDetails__form__header__title postOffer__title">
                                Pick-up person details
                            </h3>
                        </div>
                        <div className="postOffer__flightDetails__form__content">
                            <Label title={'Name'} htmlFor={'name'}
                                   classnames={'postOffer__label'}>
                                <Input type={'text'} placeholder={'John'} id={'name'}
                                       classnames={'postOffer__input'}
                                       handleChange={handleInputChange}
                                />
                            </Label>
                        </div>
                        <div className="postOffer__flightDetails__form__content">
                            <Label title={'Surname'} htmlFor={'surname'}
                                   classnames={'postOffer__label'}>
                                <Input type={'text'} placeholder={'Doe'} id={'surname'}
                                       classnames={'postOffer__input'}
                                       handleChange={handleInputChange}
                                />
                            </Label>
                        </div>
                        <div className="postOffer__flightDetails__form__content">
                            <Label title={'Phone'} htmlFor={'phone'}
                                   classnames={'postOffer__label'}>
                                <Input type={'text'} placeholder={'Phone'} id={'phone'}
                                       classnames={'postOffer__input'}
                                       handleChange={handleInputChange}
                                />
                            </Label>
                        </div>
                        <div className="postOffer__flightDetails__form__content">
                            <Label title={'Email'} htmlFor={'email'}
                                   classnames={'postOffer__label'}>
                                <Input type={'text'} placeholder={'Email'} id={'email'}
                                       classnames={'postOffer__input'}
                                       handleChange={handleInputChange}
                                />
                            </Label>
                        </div>
                    </div>
                </div>
                <div className="postOffer__detailedForm grow shrink">
                    <div className="postOffer__detailedForm__prefferedCategory">
                        <div className="postOffer__detailedForm__prefferedCategory__form postOffer__form">
                            <div className="postOffer__detailedForm__prefferedCategory__form__header postOffer__header">
                                <h3 className="postOffer__detailedForm__prefferedCategory__form__header__title postOffer__title">Item
                                    image</h3>
                            </div>
                            <div className="postOffer__detailedForm__prefferedCategory__form__content">
                                <ImageLabel/>
                                <ImageComponent src={iconSvg} alt={'item'}/>
                                <ImageComponent src={iconSvg} alt={'item'}/>
                            </div>
                        </div>
                    </div>
                    <div className="postOffer__detailedForm__itemDetails">
                        <div className="postOffer__detailedForm__prefferedCategory">
                            <div className="postOffer__detailedForm__prefferedCategory__form postOffer__form">
                                <div
                                    className="postOffer__detailedForm__prefferedCategory__form__header postOffer__header">
                                    <h3 className="postOffer__detailedForm__prefferedCategory__form__header__title postOffer__title">Item
                                        preferred category</h3>
                                    <Button
                                        title={'Add category'}
                                        type={'tertiary'}
                                        classNames={'postOffer__button'}
                                        handleClick={onAddCategory}
                                    />
                                </div>
                                <div className="postOffer__detailedForm__prefferedCategory__form__content">
                                    {categories?.map(({id, name, icon_path}) => (
                                        <Card key={id} id={id} title={name} iconSrc={icon_path} iconName={name}
                                              selected={selectedCategories?.includes(id)} handleCardClick={handleCardClick}/>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="postOffer__detailedForm__priceDetails">
                        <div className="postOffer__detailedForm__itemDetails__form__content__item w-full">
                            <Label title={'Description'} htmlFor={'availableDimensions'}
                               classnames={'postOffer__label'}>
                            <Input type={'textarea'} placeholder={'Enter a description...'}
                                   id={'availableDimensions'}
                                   classnames={'postOffer__input'}
                                   handleChange={handleInputChange}
                            />
                        </Label>
                        <span>
                            Enter specific details about an item
                        </span>
                    </div>
                </div>
                <div className="postOffer__actions">
                    <Button
                        title={'Save draft'}
                        type={'tertiary'}
                        classNames={'postOffer__actionsConfirm'}
                        handleClick={onDraftSave}
                    />
                    <Button
                        title={'Confirm'}
                        type={'primary'}
                        classNames={'postOffer__actionsConfirm'}
                        handleClick={onConfirm}
                    />
                </div>
            </div>
            </div>
        </div>

    )
}