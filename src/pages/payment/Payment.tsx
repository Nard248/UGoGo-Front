import { AlertMessage } from "../../components/alertMessage/AlertMessage"
import {Button} from "../../components/button/Button";
import visaLogo from './../../assets/icons/visa-logo.svg'
import moreIcon from './../../assets/icons/more.svg'
import warning from './../../assets/icons/warning.svg'
import {Divider} from "../../components/divider/Divider";
import Checkbox from "@mui/material/Checkbox/Checkbox";

export const Payment = () => {
    const addPaymentMethod = () => {

    }

    return (
        <div className="flex flex-col gap-[35px] w-full">
            <h1 className="text-[2rem] font-medium">
                Checkout
            </h1>
            <div className="flex gap-16 w-full">
                <div className="flex flex-col gap-14 w-[50%]">
                    <AlertMessage
                        type={'warning'}
                        text={
                        'Your booking is on hold until 01/01/25 12:00 AM. If your reserve change we will get back to you.'
                        }
                    />
                    <div className="flex flex-col px-2.5 py-7 border border-solid border-[#D5D7DA] rounded-xl">
                        <h3 className="mb-5 text-xl font-medium	">
                            Book Information
                        </h3>
                        <AlertMessage
                            type={'success'}
                            text={
                                'Congratulations! We have sent your book details to the traveler'
                            }
                            className={'mb-[39px]'}
                        />
                        <table>
                            <tr className="text-left">
                                <th>Full name</th>
                                <th>Email</th>
                                <th>Phone number</th>
                            </tr>
                            <tr className="text-left">
                                <td>John Doe</td>
                                <td>john.do@gmail.com</td>
                                <td>+1010101010</td>
                            </tr>
                        </table>
                    </div>
                    <div className="flex flex-col">
                        <h3 className={'text-[2rem] text-medium mb-[2.4rem]'}>
                            Payment Details
                        </h3>
                        <span className="text-[1.6rem] mb-[4.3rem]">
                            Add and manage your payment methods using our secure payment system.
                        </span>
                        <div className="flex py-3.5 px-2 border-solid border-y border-y-[#B3B3B3] mb-[2.9rem] justify-between">
                            <div className="flex gap-2.5">
                                <div className="flex rounded border-[#F5F5F5] py-2.5 px-2">
                                    <img src={visaLogo} alt="Visa Logo"/>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1.5">
                                        <span>
                                            VISA
                                        </span>
                                        <span>
                                            .......8888
                                        </span>
                                    </div>
                                    <div>
                                        Expiration: 08/28
                                    </div>
                                </div>
                            </div>
                            <div className="flex cursor-pointer">
                                <img src={moreIcon} alt="Dots"/>
                            </div>
                        </div>
                        <div>
                            <Button title={'Add payment method'} type={'primary'} handleClick={addPaymentMethod} />
                        </div>
                    </div>
                    <div className="flex py-8 px-7 border-solid border border-[#D5D7DA] rounded-xl">
                        <div className="flex gap-4 items-start">
                            <div className="flex rounded-full bg-[#FFE6D0] py-4 px-3.5">
                                <img src={warning} alt=""/>
                            </div>
                            <div className="flex flex-col gap-4">
                                <span>
                                    Cancellation Policy
                                </span>
                                <span>
                                    Cancellations before delivery. (We will alert for the next cancellation, penalty fee will be deducted of 20%)
                                </span>
                                <a href={'/'} className="underline text-[#559999]">
                                    See more details
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-[73px] w-[40%]">
                    <div className="flex flex-col border border-solid border-[#D5D7DA] rounded-xl">
                        <div className="bg-[#FFF1E7] py-[2.1rem] px-[2.4rem] rounded-t-xl">
                            <h3 className="">
                                Summary
                            </h3>
                        </div>
                        <div className="flex flex-col gap-[1.2rem] py-[4.5rem] px-[1.8rem] border-t border-solid border-[#D5D7DA]">
                            <div className="flex justify-between ">
                                <span className="">Total item</span>
                                <span className="">1 Item</span>
                            </div>
                            <div className="flex justify-between ">
                                <span className="">Pickup location</span>
                                <span className="">Yerevan, K. Ulnetsi 30, 22, 0037</span>
                            </div>
                            <div className="flex justify-between ">
                                <span className=" ">Direction</span>
                                <span className="">Moscow, Russia</span>
                            </div>
                            <div className="flex justify-between ">
                                <span className=" ">Flight date</span>
                                <span className="">Mon, 4 Feb 2024 - 10:00</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col border border-solid border-[#D5D7DA] rounded-xl">
                        <div className="bg-[#FFF1E7] py-[2.1rem] px-[2.4rem] rounded-t-xl">
                            <h3 className="">
                                Price Details
                            </h3>
                        </div>
                        <div className="flex flex-col gap-[1.2rem] py-[4.5rem] px-[1.8rem] border-t border-solid border-[#D5D7DA]">
                            <div className="flex justify-between ">
                                <span className="">Delivery fee</span>
                                <span className="">$10</span>
                            </div>
                            <div className="flex justify-between ">
                                <span className="">Commission fee</span>
                                <span className="">$1</span>
                            </div>
                            <Divider size={'small'} appearance={'neutral'} />
                            <div className="flex justify-between ">
                                <span className=" ">Total</span>
                                <span className="">$11</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col border border-solid border-[#D5D7DA] rounded-xl px-[4.2rem] py-[3rem] gap-[3.4rem]">
                        <div className="flex">
                            <div className="flex">
                                <Checkbox defaultChecked
                                  sx={{
                                      color: '#F9A34B',
                                      padding: '.5rem',
                                      '&.Mui-checked': {
                                          color: '#F9A34B',
                                      },
                                  }}
                                />
                            </div>
                            <span className="text-[1.6rem] font-normal leading-5">
                                By clicking this, I agree to UGOGO
                                <a href="/" className="text-[#D96A1D]"> Terms & Conditions </a>
                                and <a href="/" className="text-[#D96A1D]">Privacy Policy</a>
                            </span>
                        </div>
                        <Button title={'Pay for my booking'} type={'primary'} handleClick={() => {}} />
                    </div>
                </div>
            </div>
        </div>
    )
}