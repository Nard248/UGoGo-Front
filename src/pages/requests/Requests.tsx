import {OfferCard} from "../../components/offerCard/OfferCard";
import {Button} from "../../components/button/Button";
import {getReceivedRequests, requestsAction} from "../../api/route";
import {SyntheticEvent, useEffect, useMemo, useState} from "react";
import {Tab, Tabs, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from "@mui/material";
import {Loading} from "../../components/loading/Loading";
import {EmptyState} from "../../components/emptyState/EmptyState";
import {useNotification} from "../../components/notification/NotificationProvider";
import {useNavigate} from "react-router-dom";
import {chatAPI} from "../../api/chat";
import WebSocketService from "../../services/websocket.service";

export const Requests = () => {
    const navigate = useNavigate();
    const { showSuccess, showError, showInfo } = useNotification();
    const [isLoading, setIsLoading] = useState(false);
    const [tabValue, setTabValue] = useState('all');
    const [confirmDialog, setConfirmDialog] = useState<{open: boolean, requestId: string | number | null, action: 'accept' | 'reject' | null}>({open: false, requestId: null, action: null});

    const handleChange = (event: SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };
    const [requests, setRequests] = useState<any[]>([])

    const getRequests = async () => {
        setIsLoading(true)
        try {
            const data = await getReceivedRequests();
            setRequests(data.data.results);
        } catch (error) {
            console.error('Failed to fetch requests:', error);
            showError('Failed to load requests. Please try again.');
        } finally {
            setIsLoading(false)
        }
    }

    const requestsWithFilters = useMemo(() => {
        const filters = {
            all: requests,
            completed: requests.filter((request: any) => request.status?.toLowerCase().trim() === 'completed'),
            pending: requests.filter((request: any) => request.status?.toLowerCase().trim() === 'pending'),
            in_process: requests.filter((request: any) => request.status?.toLowerCase().trim() === 'in_process'),
            rejected: requests.filter((request: any) => request.status?.toLowerCase().trim() === 'rejected'),
        };
        return filters;
    }, [requests])

    useEffect(() => {
        getRequests()
    }, [])

    const handleActionsOnRequest = async (id: string | number, type: 'accept' | 'reject') => {
        setIsLoading(true)
        try {
            // Find the request to get requester info
            const request = requests.find((r: any) => r.id === id);

            const data = await requestsAction({request_id: id, action: type});
            if (!data.data.error) {
                const message = type === 'accept'
                    ? '✅ Request accepted successfully! The sender has been notified.'
                    : '❌ Request declined. The sender has been notified.';
                showSuccess(message);

                // If accepted, send message and redirect to chat
                if (type === 'accept' && request) {
                    const requesterId = request.item?.user?.id || request.requester;
                    const toAirport = request.offer?.user_flight?.flight?.to_airport?.city?.city_name || 'your destination';

                    if (requesterId) {
                        try {
                            console.log('📤 Sending automatic message to requester:', requesterId);

                            // Create or get thread
                            const threadResponse = await chatAPI.ensureThread(requesterId);
                            console.log('✅ Thread ensured:', threadResponse.data);

                            // Build simple message
                            const autoMessage = `Hi I just accepted your request for my offer to ${toAirport}`;
                            console.log('📝 Message:', autoMessage);

                            // Connect to WebSocket with retry
                            console.log('🔌 Connecting to WebSocket...');
                            await WebSocketService.connect(requesterId.toString());

                            // Wait a bit for connection to stabilize
                            await new Promise(resolve => setTimeout(resolve, 500));

                            // Send message
                            console.log('📨 Sending message via WebSocket...');
                            await WebSocketService.sendMessage(requesterId.toString(), autoMessage);
                            console.log('✅ Message sent successfully!');

                            // Wait a bit before redirecting to ensure message is sent
                            await new Promise(resolve => setTimeout(resolve, 500));

                            // Redirect to chat
                            navigate('/messages', { state: { userId: requesterId } });
                        } catch (msgError) {
                            console.error('❌ Failed to send message:', msgError);
                            // Still redirect even if message fails
                            navigate('/messages', { state: { userId: requesterId } });
                        }
                    } else {
                        await getRequests();
                    }
                } else {
                    await getRequests();
                }
            } else {
                showError('Failed to process request. Please try again.');
            }
        } catch (error: any) {
            console.error('Request action error:', error);
            showError('Something went wrong. Please try again later.');
        } finally {
            setIsLoading(false)
        }
    }

    const handleConfirmAction = (id: string | number, action: 'accept' | 'reject') => {
        setConfirmDialog({open: true, requestId: id, action: action});
    }

    const handleConfirmDialogClose = (confirmed: boolean) => {
        if (confirmed && confirmDialog.requestId && confirmDialog.action) {
            handleActionsOnRequest(confirmDialog.requestId, confirmDialog.action);
        }
        setConfirmDialog({open: false, requestId: null, action: null});
    }

    const getEmptyStateForTab = () => {
        const emptyStates: Record<string, { title: string; description: string }> = {
            all: {
                title: "No requests received yet",
                description: "When senders request to use your offers, they'll appear here."
            },
            pending: {
                title: "No pending requests",
                description: "All your requests have been processed."
            },
            completed: {
                title: "No completed requests",
                description: "Completed delivery requests will appear here."
            },
            rejected: {
                title: "No rejected requests",
                description: "You haven't declined any requests."
            },
            in_process: {
                title: "No requests in process",
                description: "Active deliveries will appear here."
            }
        };
        return emptyStates[tabValue] || emptyStates.all;
    };

    return (
        <>
            {isLoading ? (
                <Loading/>
            ) : (
                <div className="flex flex-col gap-3 w-full px-[4rem] md:px-24">
                    {requests.length > 0 && (
                        <Tabs value={tabValue} onChange={handleChange} centered variant="scrollable" scrollButtons="auto">
                            <Tab label="All" value={'all'} classes={{textColorPrimary: 'text-[#008080]'}} sx={{ fontSize: '1.4rem' }}/>
                            <Tab label="Completed" value={'completed'} classes={{textColorPrimary: 'text-[#008080]'}} sx={{ fontSize: '1.4rem' }}/>
                            <Tab label="Pending" value={'pending'} classes={{textColorPrimary: 'text-[#008080]'}} sx={{ fontSize: '1.4rem' }}/>
                            <Tab label="In progress" value={'in_process'} classes={{textColorPrimary: 'text-[#008080]'}} sx={{ fontSize: '1.4rem' }}/>
                            <Tab label="Rejected" value={'rejected'} classes={{textColorPrimary: 'text-[#008080]'}} sx={{ fontSize: '1.4rem' }}/>
                        </Tabs>
                    )}

                    <div className="flex flex-col gap-[6rem] w-full">
                        <h3 className="text-[3.2rem] font-bold text-[#1B3A4B]">
                            Received Requests
                        </h3>

                        {requests.length === 0 ? (
                            <EmptyState
                                illustration="no-requests"
                                title="No requests yet"
                                description="When senders request your delivery services, they'll appear here."
                                primaryAction={{
                                    label: "Browse available items",
                                    onClick: () => navigate('/search-result')
                                }}
                            />
                        ) : (requestsWithFilters as any)[tabValue].length === 0 ? (
                            <EmptyState
                                illustration="no-results"
                                {...getEmptyStateForTab()}
                            />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2rem] md:gap-[3rem] lg:gap-[5.7rem] justify-items-center">
                                {/* @ts-ignore */}
                                {(requestsWithFilters as any)[tabValue].map((request: any) => {
                                    const status = request.status?.toLowerCase().trim();
                                    const isDisabled = status === 'completed' || status === 'rejected' || status === 'in_process';
                                    return (
                                        <OfferCard key={request.id}
                                                   withRate={false}
                                                   onPrimaryClick={!isDisabled ? () => handleConfirmAction(request.id, 'reject') : undefined}
                                                   primaryButtonText={status === 'rejected' ? 'Declined' : 'Decline'}
                                                   onSecondaryClick={!isDisabled ? () => handleConfirmAction(request.id, 'accept') : undefined}
                                                   secondaryButtonText={status === 'completed' || status === 'in_process' ? 'Accepted' : 'Accept'}
                                                   data={request.offer}
                                                   customUser={request.item?.user}
                                                   onCardClick={() => navigate(`/request/${request.id}`, { state: { request } })}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
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
    )
}