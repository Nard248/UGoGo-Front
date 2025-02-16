import {Label} from "../../components/label/Label";
import {Input} from "../../components/input/Input";
import './PostOffer.scss';
import {Button} from "../../components/button/Button";
import React, {ChangeEvent, useEffect, useState} from "react";
import {Select} from "../../components/select/Select";
import {creatOffer, getAirports, getCategories} from "../../api/route";
import {IOfferCreateForm} from "../../types/global";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, {Dayjs} from "dayjs";
import {OfferCard} from "../../components/offerCard/OfferCard";
import {FAQ} from "../../components/faq/FAQ";
import {Divider} from "../../components/divider/Divider";

export const PostOffer = () => {
    const [airports, setAirports] = useState<any[]>();
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<number[] | null>()
    const [offerFormData, setOfferFormData] = useState<IOfferCreateForm>({} as IOfferCreateForm)

    const handleCardClick = (id: number) => {
        if (selectedCategories?.includes(id)) {
            const _selectedCategories = selectedCategories.filter(item => item !== id);
            setSelectedCategories(_selectedCategories);
            return;
        }
        const _selectedCategories = selectedCategories?.length ? [...selectedCategories, id] : [id];
        setSelectedCategories(_selectedCategories);
        setOfferFormData(prevState => ({
            ...prevState,
            category_ids: {
                value: _selectedCategories,
                errorMessage: null
            }
        }))
    }

    const getAirportsData = async () => {
        const data = await getAirports();
        setAirports(data.data.results)
    }

    const getCategoriesData = async () => {
        const data = await getCategories();
        setCategories(data.data)
    }

    useEffect(() => {
        getAirportsData();
        getCategoriesData();
    }, [])

    const handleFlightChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const {value} = event.target;
        if (!value) {
            return;
        }
        setOfferFormData(prevState => ({
            ...prevState,
            flight_number: {
                value: value,
                errorMessage: null
            }
        }))
    }

    const onSelectChange = (event: ChangeEvent<HTMLSelectElement>, type: string) => {
        const {value} = event.target;
        if (!value) {
            return;
        }

        setOfferFormData(prevState => ({
            ...prevState,
            [type === 'to' ? 'to_airport_id' : 'from_airport_id']: {
                value: value,
                errorMessage: null
            }
        }))
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {

    }

    const handlePriceChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const {value} = event.target;
        if (!value) {
            return;
        }

        setOfferFormData(prevState => ({
            ...prevState,
            price: {
                value: +value,
                errorMessage: null
            }
        }))
    }

    const handleWeightChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const {value} = event.target;
        if (!value) {
            return;
        }

        setOfferFormData(prevState => ({
            ...prevState,
            available_weight: {
                value: +value,
                errorMessage: null
            }
        }))
    }

    const handleDimensionsChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const {value} = event.target;
        if (!value) {
            return;
        }

        setOfferFormData(prevState => ({
            ...prevState,
            available_dimensions: {
                value: value,
                errorMessage: null
            }
        }))
    }

    const handleDateChange = (event: Dayjs | null, type: string) => {
        const value = event?.toDate();
        if (!value) {
            return;
        }

        setOfferFormData(prevState => ({
            ...prevState,
            [type === 'start' ? 'arrival_datetime' : 'departure_datetime']: {
                value: value,
                errorMessage: null
            }
        }))
    }

    const onConfirm = async () => {
        console.log({offerFormData});
        const sendingData = {
            flight_number: offerFormData.flight_number.value,
            from_airport_id: offerFormData.from_airport_id.value,
            to_airport_id: offerFormData.to_airport_id.value,
            departure_datetime: offerFormData.departure_datetime.value,
            arrival_datetime: offerFormData.arrival_datetime.value,
            category_ids: offerFormData.category_ids?.value,
            // available_dimensions: offerFormData.available_dimensions.value,
            available_space: 1,
            // allow_fragile: true,
            available_weight: offerFormData.available_weight.value,
            price: offerFormData.price.value
        }
        const data = await creatOffer(sendingData);
        console.log({data});
    }

    const onAddCategory = () => {

    }

    const onFlightAdd = () => {

    }

    return (
        <div className="postOffer">
                <div className="flex justify-between items-center mb-[2.1rem]">
                    <h1 className="font-medium text-[2rem]">Create a new flight</h1>
                    <Button type={'primary'} title={'+ Add flight'} handleClick={onFlightAdd}></Button>
                </div>
                <div className="postOffer__content flex justify-between gap-20">
                    <div className="postOffer__flightDetails">
                        <div className="postOffer__flightDetails__form postOffer__form">
                            <div className="postOffer__flightDetails__form__header postOffer__header">
                                <h3 className="postOffer__flightDetails__form__header__title postOffer__title">Flight
                                    details</h3>
                            </div>
                            <div className="postOffer__flightDetails__form__content">
                                <Label title={'Flight number'} htmlFor={'flightNumber'}
                                       classnames={'postOffer__label'}>
                                    <Input type={'text'} placeholder={'LH123'} id={'flightNumber'}
                                           classnames={'postOffer__input'}
                                           handleChange={handleFlightChange}
                                    />
                                </Label>
                            </div>
                            <div className="postOffer__flightDetails__form__content">
                                <Label title={'Departure'} htmlFor={'departure'}
                                       classnames={'postOffer__label'}>
                                    <Select options={airports || []} id={'departure'} placeholder={'Yerevan (EVN)'}
                                            classnames={'postOffer__input cursor-pointer'}
                                            handleSelectChange={(event) => onSelectChange(event, 'from')}
                                    />
                                </Label>
                            </div>
                            <div className="postOffer__flightDetails__form__content">
                                <Label title={'Destination'} htmlFor={'destination'}
                                       classnames={'postOffer__label'}>
                                    <Select options={airports || []} placeholder={'Moscow (SVO)'} id={'destination'}
                                            classnames={'postOffer__input cursor-pointer'}
                                            handleSelectChange={(event) => onSelectChange(event, 'to')}
                                    />
                                </Label>
                            </div>
                            <div className="postOffer__flightDetails__form__content">
                                <Label title={'Departure Date and Time'} htmlFor={'departureTime'}
                                       classnames={'postOffer__label'}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            slotProps={{
                                                day: {
                                                    sx: {
                                                        fontSize: '1.4rem',
                                                        '&.Mui-selected': {},
                                                        '&:hover': {},
                                                    },
                                                },
                                                toolbar: {
                                                    sx: {
                                                        '.MuiTypography-root': {
                                                            fontSize: '1.4rem',
                                                            backgroundColor: 'red'
                                                        },
                                                    },
                                                },
                                                textField: {
                                                    sx: {
                                                        width: '100%',
                                                        input: {
                                                            width: '100%',
                                                            fontSize: '1.4rem',
                                                            padding: '0',
                                                        },
                                                        '.MuiOutlinedInput-root': {
                                                            borderRadius: '.8rem',
                                                            padding: '1rem',
                                                            marginTop: '6px'
                                                        },
                                                    },
                                                },
                                            }}
                                            minDate={dayjs()}
                                            onChange={(event) => handleDateChange(event, 'start')}
                                        />
                                    </LocalizationProvider>
                                </Label>
                            </div>
                            <div className="postOffer__flightDetails__form__content">
                                <Label title={'Arrival Date and Time'} htmlFor={'arrivalTime'}
                                       classnames={'postOffer__label'}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            slotProps={{
                                                day: {
                                                    sx: {
                                                        fontSize: '1.4rem',
                                                        '&.Mui-selected': {},
                                                        '&:hover': {},
                                                    },
                                                },
                                                toolbar: {
                                                    sx: {
                                                        '.MuiTypography-root': {
                                                            fontSize: '1.4rem',
                                                            backgroundColor: 'red'
                                                        },
                                                    },
                                                },
                                                textField: {
                                                    sx: {
                                                        width: '100%',
                                                        input: {
                                                            width: '100%',
                                                            fontSize: '1.4rem',
                                                            padding: '0',
                                                        },
                                                        '.MuiOutlinedInput-root': {
                                                            borderRadius: '.8rem',
                                                            padding: '1rem',
                                                            marginTop: '6px'
                                                        },
                                                    },
                                                },
                                            }}
                                            minDate={dayjs(offerFormData.departure_datetime?.value) || dayjs()}
                                            onChange={(event) => handleDateChange(event, 'end')}
                                        />
                                    </LocalizationProvider>
                                </Label>
                            </div>
                        </div>
                        <div className="postOffer__flightDetails__notes">
                            <div className="postOffer__flightDetails__notes__content">
                                <Label title={'Details'} htmlFor={'details'}
                                       classnames={'postOffer__label'}>
                                    <Input type={'textarea'}
                                           placeholder={'Want to add something specific about the flight?'}
                                           id={'Details'} classnames={'postOffer__input'}
                                           handleChange={handleInputChange}
                                    />
                                </Label>
                            </div>
                        </div>
                    </div>
                    <div className="postOffer__detailedForm grow shrink">
                        {!!categories.length &&
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
                                        <OfferCard/>
                                        {/*{categories?.map(({id, name, icon_path}) => (*/}
                                        {/*    <Card key={id} id={id} title={name} iconSrc={icon_path} iconName={name}*/}
                                        {/*          selected={selectedCategories?.includes(id)} handleCardClick={handleCardClick}/>*/}
                                        {/*))}*/}
                                    </div>
                                </div>
                            </div>
                        }
                        <div className="postOffer__detailedForm__itemDetails">
                            <div className="postOffer__detailedForm__itemDetails__form postOffer__form">
                                <div className="postOffer__detailedForm__itemDetails__form__header postOffer__header">
                                    <h3 className="postOffer__detailedForm__itemDetails__form__header__title postOffer__title">Item
                                        details</h3>
                                </div>
                                <div className="postOffer__detailedForm__itemDetails__form__content">
                                    <div className="postOffer__detailedForm__itemDetails__form__content__item">
                                        <Label title={'Weight'} htmlFor={'weight'}
                                               classnames={'postOffer__label'}>
                                            <Input type={'text'} placeholder={'1 kg'}
                                                   id={'weight'} classnames={'postOffer__input'}
                                                   handleChange={handleWeightChange}
                                            />
                                        </Label>
                                    </div>
                                    <div className="postOffer__detailedForm__itemDetails__form__content__item">
                                        <Label title={'Available Dimensions'} htmlFor={'availableDimensions'}
                                               classnames={'postOffer__label'}>
                                            <Input type={'text'} placeholder={'Length x Width x Height'}
                                                   id={'availableDimensions'} classnames={'postOffer__input'}
                                                   handleChange={handleDimensionsChange}
                                            />
                                        </Label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="postOffer__detailedForm__priceDetails gap-32">
                            <div className="postOffer__detailedForm__priceDetails__form postOffer__form w-full">
                                <div className="postOffer__detailedForm__itemDetails__form__header postOffer__header">
                                    <h3 className="postOffer__detailedForm__itemDetails__form__header__title postOffer__title">Item
                                        details</h3>
                                </div>
                                <div className="postOffer__detailedForm__itemDetails__form__content">
                                    <div className="postOffer__detailedForm__itemDetails__form__content__item">
                                        <Label title={'Price details'} htmlFor={'priceDetails'}
                                               classnames={'postOffer__label'}>
                                            <Input type={'number'} placeholder={'20 $'}
                                                   id={'priceDetails'}
                                                   classnames={'postOffer__input'}
                                                   handleChange={handlePriceChange}
                                            />
                                        </Label>
                                    </div>
                                </div>
                            </div>
                            <div className="postOffer__detailedForm__itemDetails__form__content__item w-full">
                                <Label title={'Details'} htmlFor={'details'}
                                       classnames={'postOffer__label'}>
                                    <Input type={'textarea'}
                                           placeholder={'Want to add something specific about the item?'}
                                           id={'details'}
                                           classnames={'postOffer__input h-full'}
                                           handleChange={handleInputChange}
                                    />
                                </Label>
                            </div>
                        </div>
                        <div className="postOffer__actions">
                            <Button
                                title={'Confirm'}
                                type={'tertiary'}
                                classNames={'postOffer__actionsConfirm'}
                                handleClick={onConfirm}
                            />
                        </div>
                    </div>
                </div>
    </div>
    )
}