import checkIcon from './../../assets/icons/check.svg'
import warning from './../../assets/icons/warning.svg'
import {Button} from "../../components/button/Button";
import {useSearchParams} from "react-router-dom";
import {useEffect, useState, useRef} from "react";
import {confirmSession} from "../../api/route";
import {Loading} from "../../components/loading/Loading";
import {chatAPI} from "../../api/chat";
import WebSocketService from "../../services/websocket.service";

export const PaymentConfirmation = ({isError = false}: {isError?: boolean}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isSuccess, setIsSuccess] = useState(false);
    const messageSentRef = useRef(false);

    const sendAutomaticMessage = async () => {
        // Prevent duplicate messages
        if (messageSentRef.current) return;

        try {
            const offerData = localStorage.getItem('offer');
            const itemData = localStorage.getItem('selectedItem');

            if (!offerData) {
                console.log('No offer data found, skipping auto-message');
                return;
            }

            const offer = JSON.parse(offerData);
            const item = itemData ? JSON.parse(itemData) : null;

            // Get courier user ID from offer
            const courierUserId = offer.courier_id || offer.user_flight?.user?.id;

            if (!courierUserId) {
                console.log('No courier ID found, skipping auto-message');
                return;
            }

            // Mark as sent to prevent duplicates
            messageSentRef.current = true;

            // Create or get thread with courier
            const threadResponse = await chatAPI.ensureThread(courierUserId);
            const thread = threadResponse.data;

            // Build flight details string
            const fromAirport = offer.user_flight?.flight?.from_airport?.airport_name || 'N/A';
            const toAirport = offer.user_flight?.flight?.to_airport?.airport_name || 'N/A';
            const departureDate = offer.user_flight?.flight?.departure_datetime
                ? new Date(offer.user_flight.flight.departure_datetime).toLocaleDateString()
                : 'N/A';

            // Compose the message
            const message = `Hi! I just sent you a request for your flight from ${fromAirport} to ${toAirport} on ${departureDate}. Looking forward to working with you!`;

            // Connect to WebSocket and send message
            await WebSocketService.connect(courierUserId.toString());
            await WebSocketService.sendMessage(courierUserId.toString(), message);

            console.log('✅ Automatic message sent to courier successfully');
        } catch (error) {
            console.error('Failed to send automatic message to courier:', error);
            // Don't throw - we don't want to block the success page if messaging fails
        }
    };

    const getConfirmation = async (session_id: string) => {
        const data = await confirmSession({session_id});
        const success = data.data.status === 'success';

        setIsSuccess(success);

        // Send automatic message if payment was successful
        if (success) {
            await sendAutomaticMessage();
        }
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