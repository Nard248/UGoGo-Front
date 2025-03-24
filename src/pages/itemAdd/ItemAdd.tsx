import React, {ChangeEvent, FC, useEffect, useState} from "react";
import './ItemAdd.scss';
import {Label} from "../../components/label/Label";
import {Input} from "../../components/input/Input";
import {Button} from "../../components/button/Button";
import {Card} from "../../components/card/Card";
import {ImageComponent} from "../../components/image/Image";
import iconSvg from './../../assets/icons/item.svg'
import {ImageLabel} from "../../components/image/ImageLabel";
import {createItem, getCategories} from "../../api/route";
import {IItemCreate} from "../../types/global";
import {useNavigate} from "react-router-dom";

export const ItemAdd: FC = () => {
    const navigate = useNavigate();
    const [selectedCategories, setSelectedCategories] = useState<number[] | null>()
    const [categories, setCategories] = useState<any[]>([]);
    const [files, setFiles] = useState<any[]>([]);
    const [itemFormData, setItemFormData] = useState<IItemCreate>(
        {} as IItemCreate
    );

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

    const onImageUpload = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement
        if (!target.files?.length) {
            return
        }
        const files = Array.from(target.files).map((file) => {
            return {
                ...file,
                blob: URL.createObjectURL(file)
            };
        })

        setFiles(files)
    }

    const onAddCategory = () => {

    }

    const onConfirm = async () => {
        setItemFormData({...itemFormData, category_ids: categories.map(item => item.id)})
        try {
            const data = await createItem(itemFormData);
            navigate('/single-product-page?modal=book');
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div className="postOffer">
            <div className="flex justify-between items-center mb-[2.1rem]">
                <h1 className="font-medium text-[2rem]">Add an item</h1>
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
                            <Label title={'Dimensions'} htmlFor={'dimensions'}
                                   classnames={'postOffer__label'}>
                                <Input type={'text'} placeholder={'Length x Width x Height'} id={'dimensions'}
                                       classnames={'postOffer__input'}
                                       handleChange={(event) => setItemFormData({...itemFormData, dimensions: event.target.value})}
                                />
                            </Label>
                        </div>
                        <div className="postOffer__flightDetails__form__content">
                            <Label title={'Name'} htmlFor={'name'}
                                   classnames={'postOffer__label'}>
                                <Input type={'text'} placeholder={'Laptop'} id={'name'}
                                       classnames={'postOffer__input'}
                                       handleChange={(event) => setItemFormData({...itemFormData, name: event.target.value})}
                                />
                            </Label>
                        </div>
                        <div className="postOffer__flightDetails__form__content">
                            <Label title={'Wight'} htmlFor={'wight'}
                                   classnames={'postOffer__label'}>
                                <Input type={'text'} placeholder={'1 kg'} id={'wight'}
                                       classnames={'postOffer__input'}
                                       handleChange={(event) => setItemFormData({...itemFormData, weight: +event.target.value})}
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
                            <Label title={'Name'} htmlFor={'pickUpName'}
                                   classnames={'postOffer__label'}>
                                <Input type={'text'} placeholder={'John'} id={'pickUpName'}
                                       classnames={'postOffer__input'}
                                       handleChange={(event) => setItemFormData({...itemFormData, pickup_name: event.target.value})}
                                />
                            </Label>
                        </div>
                        <div className="postOffer__flightDetails__form__content">
                            <Label title={'Surname'} htmlFor={'surname'}
                                   classnames={'postOffer__label'}>
                                <Input type={'text'} placeholder={'Doe'} id={'surname'}
                                       classnames={'postOffer__input'}
                                       handleChange={(event) => setItemFormData({...itemFormData, pickup_surname: event.target.value})}
                                />
                            </Label>
                        </div>
                        <div className="postOffer__flightDetails__form__content">
                            <Label title={'Phone'} htmlFor={'phone'}
                                   classnames={'postOffer__label'}>
                                <Input type={'text'} placeholder={'Phone'} id={'phone'}
                                       classnames={'postOffer__input'}
                                       handleChange={(event) => setItemFormData({...itemFormData, pickup_phone: event.target.value})}
                                />
                            </Label>
                        </div>
                        <div className="postOffer__flightDetails__form__content">
                            <Label title={'Email'} htmlFor={'email'}
                                   classnames={'postOffer__label'}>
                                <Input type={'text'} placeholder={'Email'} id={'email'}
                                       classnames={'postOffer__input'}
                                       handleChange={(event) => setItemFormData({...itemFormData, pickup_email: event.target.value})}
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
                                <ImageLabel upload={onImageUpload}/>
                                {!!files.length && files.map(file => (
                                    <ImageComponent src={file.blob} alt={'item'}/>
                                ))}
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
                                   handleChange={(event) => setItemFormData({...itemFormData, description: event.target.value})}
                            />
                        </Label>
                        <span>
                            Enter specific details about an item
                        </span>
                    </div>
                </div>
                <div className="postOffer__actions">
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

