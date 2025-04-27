import checkIcon from './../../assets/icons/check.svg'
import warning from './../../assets/icons/warning.svg'
import {Button} from "../../components/button/Button";
import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {confirmSession} from "../../api/route";
import {Loading} from "../../components/loading/Loading";

export const PaymentConfirmation = ({isError = false}: {isError?: boolean}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isSuccess, setIsSuccess] = useState(false);

    const getConfirmation = async (session_id: string) => {
        const data = await confirmSession({session_id});

        setIsSuccess(data.data.status === 'success')
    }

    useEffect(() => {
        if (isError) return;

        const session_id = searchParams.get('session_id');
        if (!session_id) return;
        getConfirmation(session_id);
    }, [])

    return (
        !isError && !isSuccess ?
            <Loading />
            :
            <div className="flex flex-col items-center my-0 mx-auto">
                <div className="flex bg-[#73B2B2] rounded-full w-[7.2rem] h-[7.2rem] mb-[1.3rem]">
                    <img src={isError ? warning : checkIcon} alt="Check icon"/>
                </div>
                <h2 className="text-[2.8rem] font-semibold mb-[1.1rem]">
                    Payment Successful
                </h2>
                <span className="text-[2.2rem] font-medium mb-[3.9rem]">
                    Thank you for trusting us!
                </span>
                <Button title={'Back to the homepage'} type={'primary'} handleClick={() => {}} />
            </div>
    )
}