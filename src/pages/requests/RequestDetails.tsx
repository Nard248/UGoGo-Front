import { FC, useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { OfferDetails } from "../../components/offerDetails/OfferDetails";
import packageIcon from "./../../assets/icons/package.svg";
import { Button } from "../../components/button/Button";
import { requestsAction } from "../../api/route";
import { Avatar } from "../../components/avatar/Avatar";
import { useNotification } from "../../components/notification/NotificationProvider";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { chatAPI } from "../../api/chat";
import WebSocketService from "../../services/websocket.service";
import "../singleProductPage/SingleProductPage.scss";

export const RequestDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const [requestData, setRequestData] = useState<any>(location.state?.request || null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{open: boolean, action: 'accept' | 'reject' | null}>({
    open: false,
    action: null
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleString();
  };

  const handleConfirmAction = (action: 'accept' | 'reject') => {
    setConfirmDialog({open: true, action: action});
  };

  const sendAcceptanceMessage = async (requesterId: number, flight: any) => {
    try {
      console.log('📤 Attempting to send acceptance message to requester ID:', requesterId);

      // Create or get thread with requester
      const threadResponse = await chatAPI.ensureThread(requesterId);
      const thread = threadResponse.data;
      console.log('✅ Thread ensured:', thread);

      // Build flight details string
      const fromAirport = flight?.from_airport?.airport_name || 'N/A';
      const toAirport = flight?.to_airport?.airport_name || 'N/A';
      const departureDate = flight?.departure_datetime
        ? new Date(flight.departure_datetime).toLocaleDateString()
        : 'N/A';

      // Compose the message
      const message = `Hi! I've accepted your request for the flight from ${fromAirport} to ${toAirport} on ${departureDate}. Let's coordinate the details!`;
      console.log('📝 Message to send:', message);

      // Connect to WebSocket and send message
      console.log('🔌 Connecting to WebSocket for user:', requesterId);
      await WebSocketService.connect(requesterId.toString());

      console.log('📨 Sending message via WebSocket...');
      await WebSocketService.sendMessage(requesterId.toString(), message);

      console.log('✅ Acceptance message sent to requester successfully');
    } catch (error) {
      console.error('❌ Failed to send acceptance message:', error);
      // Don't throw - we don't want to block the acceptance if messaging fails
    }
  };

  const handleActionsOnRequest = async (action: 'accept' | 'reject') => {
    if (!id) return;

    setIsLoading(true);
    try {
      const data = await requestsAction({request_id: parseInt(id), action});
      if (!data.data.error) {
        const message = action === 'accept'
          ? '✅ Request accepted successfully! The sender has been notified.'
          : '❌ Request declined. The sender has been notified.';
        showSuccess(message);

        // If accepted, send message and redirect to chat
        if (action === 'accept' && requestData) {
          const requesterId = requestData.item?.user?.id || requestData.requester;
          const flight = requestData.offer?.user_flight?.flight;

          console.log('🔍 Requester ID:', requesterId);
          console.log('🔍 Item user:', requestData.item?.user);
          console.log('🔍 Direct requester field:', requestData.requester);

          if (requesterId) {
            try {
              await sendAcceptanceMessage(requesterId, flight);
              // Add a small delay to ensure message is sent before navigation
              await new Promise(resolve => setTimeout(resolve, 1000));
              // Redirect to chat with the requester
              navigate('/messages', { state: { userId: requesterId } });
            } catch (msgError) {
              console.error('Error in sendAcceptanceMessage:', msgError);
              // Still navigate even if message fails
              navigate('/messages', { state: { userId: requesterId } });
            }
          } else {
            console.error('❌ No requester ID found!');
            navigate('/requests');
          }
        } else {
          // If declined, go back to requests
          navigate('/requests');
        }
      } else {
        showError('Failed to process request. Please try again.');
      }
    } catch (error: any) {
      console.error('Request action error:', error);
      showError('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
      setConfirmDialog({open: false, action: null});
    }
  };

  const handleConfirmDialogClose = (confirmed: boolean) => {
    if (confirmed && confirmDialog.action) {
      handleActionsOnRequest(confirmDialog.action);
    } else {
      setConfirmDialog({open: false, action: null});
    }
  };

  if (!requestData) {
    return <div className="singleProductPage px-[1.6rem] md:px-16">Loading request details...</div>;
  }

  const { item, offer, status, payment } = requestData;
  const requester = item?.user;
  const flight = offer?.user_flight?.flight;
  const isDisabled = status?.toLowerCase().trim() === 'completed' || status?.toLowerCase().trim() === 'rejected' || status?.toLowerCase().trim() === 'in_process';

  return (
    <>
      <div className="singleProductPage">
        <div className="px-[1.6rem] md:px-16">
          <OfferDetails
            flightNumber={offer?.user_flight?.flight_number}
            fromCity={flight?.from_airport?.city?.city_name}
            toCity={flight?.to_airport?.city?.city_name}
          />
        </div>

        {/* Requester Information */}
        <div className="px-[1.6rem] md:px-16 mt-8">
          <div className="singleProductPage__productInfo">
            <div className="singleProductPage__productInfo__header postOffer__header">
              <h3 className="singleProductPage__productInfo__header__title singleProductPage__title">
                Request Sender Information
              </h3>
            </div>
            <div className="p-6 flex items-center gap-6">
              <Avatar
                firstName={requester?.first_name || requester?.full_name || "User"}
                lastName={requester?.last_name}
                size="medium"
              />
              <div className="flex flex-col gap-2">
                <h4 className="text-[1.8rem] font-semibold">
                  {requester?.first_name && requester?.last_name
                    ? `${requester.first_name} ${requester.last_name}`
                    : requester?.full_name || "Unknown User"}
                </h4>
                <p className="text-[1.4rem] text-gray-600">{requester?.email}</p>
                {requester?.phone_number && (
                  <p className="text-[1.4rem] text-gray-600">{requester.phone_number}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Item Details */}
        <div className="px-[1.6rem] md:px-16">
          <div className="singleProductPage__productInfo">
            <div className="singleProductPage__productInfo__header postOffer__header">
              <h3 className="singleProductPage__productInfo__header__title singleProductPage__title">
                Item Details
              </h3>
            </div>
            <div className="singleProductPage__productInfo__table">
              <div className="singleProductPage__productInfo__table__item">
                <div className="singleProductPage__productInfo__table__item__title">
                  <div className="singleProductPage__productInfo__table__item__title__icon">
                    <img src={packageIcon} alt="Package icon" />
                  </div>
                  Item Name
                </div>
                <div className="singleProductPage__productInfo__table__item__info">
                  {item?.name || "N/A"}
                </div>
              </div>

              {item?.description && (
                <div className="singleProductPage__productInfo__table__item">
                  <div className="singleProductPage__productInfo__table__item__title">
                    <div className="singleProductPage__productInfo__table__item__title__icon">
                      <img src={packageIcon} alt="Package icon" />
                    </div>
                    Description
                  </div>
                  <div className="singleProductPage__productInfo__table__item__info">
                    {item.description}
                  </div>
                </div>
              )}

              <div className="singleProductPage__productInfo__table__item">
                <div className="singleProductPage__productInfo__table__item__title">
                  <div className="singleProductPage__productInfo__table__item__title__icon">
                    <img src={packageIcon} alt="Package icon" />
                  </div>
                  Weight & Dimensions
                </div>
                <div className="singleProductPage__productInfo__table__item__info">
                  {item?.weight || "N/A"} kg - {item?.dimensions || "N/A"}
                </div>
              </div>

              <div className="singleProductPage__productInfo__table__item">
                <div className="singleProductPage__productInfo__table__item__title">
                  <div className="singleProductPage__productInfo__table__item__title__icon">
                    <img src={packageIcon} alt="Package icon" />
                  </div>
                  Pickup Contact
                </div>
                <div className="singleProductPage__productInfo__table__item__info">
                  {item?.pickup_name} {item?.pickup_surname} - {item?.pickup_phone}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Flight Details */}
        <div className="px-[1.6rem] md:px-16">
          <div className="singleProductPage__productInfo">
            <div className="singleProductPage__productInfo__header postOffer__header">
              <h3 className="singleProductPage__productInfo__header__title singleProductPage__title">
                Flight Details
              </h3>
            </div>
            <div className="singleProductPage__productInfo__table">
              <div className="singleProductPage__productInfo__table__item">
                <div className="singleProductPage__productInfo__table__item__title">
                  <div className="singleProductPage__productInfo__table__item__title__icon">
                    <img src={packageIcon} alt="Package icon" />
                  </div>
                  Available space
                </div>
                <div className="singleProductPage__productInfo__table__item__info">
                  {offer?.available_weight || "N/A"} kg / {offer?.available_space || "N/A"} m³
                </div>
              </div>

              <div className="singleProductPage__productInfo__table__item">
                <div className="singleProductPage__productInfo__table__item__title">
                  <div className="singleProductPage__productInfo__table__item__title__icon">
                    <img src={packageIcon} alt="Package icon" />
                  </div>
                  Departure date & time
                </div>
                <div className="singleProductPage__productInfo__table__item__info">
                  {formatDateTime(flight?.departure_datetime)}
                </div>
              </div>

              <div className="singleProductPage__productInfo__table__item">
                <div className="singleProductPage__productInfo__table__item__title">
                  <div className="singleProductPage__productInfo__table__item__title__icon">
                    <img src={packageIcon} alt="Package icon" />
                  </div>
                  Arrival date & time
                </div>
                <div className="singleProductPage__productInfo__table__item__info">
                  {formatDateTime(flight?.arrival_datetime)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[--primary-background] h-[55px]"></div>

        {/* Payment Status */}
        {payment && (
          <div className="px-[1.6rem] md:px-16">
            <div className="singleProductPage__productInfo">
              <div className="singleProductPage__productInfo__header postOffer__header">
                <h3 className="singleProductPage__productInfo__header__title singleProductPage__title">
                  Payment Status
                </h3>
              </div>
              <div className="p-6">
                <p className="text-[1.6rem]">
                  Status: <span className={`font-semibold ${payment.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {payment.status?.toUpperCase()}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!isDisabled && (
          <div className="px-[1.6rem] md:px-16 pb-16">
            <div className="flex justify-end gap-6 pt-9">
              <Button
                title="Decline"
                type="primary"
                outline={true}
                handleClick={() => handleConfirmAction('reject')}
                disabled={isLoading}
              />
              <Button
                title="Accept"
                type="primary"
                handleClick={() => handleConfirmAction('accept')}
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        {isDisabled && (
          <div className="px-[1.6rem] md:px-16 pb-16">
            <div className="flex justify-center pt-9">
              <p className="text-[1.8rem] font-semibold text-gray-600">
                Request Status: <span className={
                  status?.toLowerCase() === 'completed' || status?.toLowerCase() === 'in_process'
                    ? 'text-green-600'
                    : 'text-red-600'
                }>
                  {status?.toLowerCase() === 'in_process' ? 'ACCEPTED' : status?.toUpperCase()}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>

      <Dialog
        open={confirmDialog.open}
        onClose={() => handleConfirmDialogClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {confirmDialog.action === 'accept' ? 'Accept Request?' : 'Decline Request?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {confirmDialog.action === 'accept'
              ? 'Are you sure you want to accept this request? This will commit you to delivering the item.'
              : 'Are you sure you want to decline this request? This action cannot be undone.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button title="Cancel" type="secondary" handleClick={() => handleConfirmDialogClose(false)} />
          <Button
            title={confirmDialog.action === 'accept' ? 'Accept' : 'Decline'}
            type="primary"
            handleClick={() => handleConfirmDialogClose(true)}
          />
        </DialogActions>
      </Dialog>
    </>
  );
};
