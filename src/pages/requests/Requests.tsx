import {OfferCard} from "../../components/offerCard/OfferCard";
import {Button} from "../../components/button/Button";
import {getAllRequests, courierRequestAction} from "../../api/route";
import {SyntheticEvent, useEffect, useMemo, useState} from "react";
import {Tab, Tabs, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from "@mui/material";
import {Loading} from "../../components/loading/Loading";

export const Requests = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [tabValue, setTabValue] = useState('all');
    const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success' | 'error' | 'info' | 'warning'}>({open: false, message: '', severity: 'info'});
    const [confirmDialog, setConfirmDialog] = useState<{open: boolean, requestId: string | number | null, action: 'accept' | 'reject' | null}>({open: false, requestId: null, action: null});

    const handleChange = (event: SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };
    const [requests, setRequests] = useState([])

    const getRequests = async () => {
        setIsLoading(true)
        try {
            const data = await getAllRequests();
            setRequests(data.data.results);
        } catch (error) {
            console.error('Failed to fetch requests:', error);
            setSnackbar({open: true, message: 'Failed to load requests. Please try again.', severity: 'error'});
        } finally {
            setIsLoading(false)
        }
    }

    const requestsWithFilters = useMemo(() => {
        return {
            all: requests,
            completed: requests.filter((request: any) => request.status?.toLowerCase().trim() === 'completed'),
            pending: requests.filter((request: any) => request.status?.toLowerCase().trim() === 'pending'),
            in_process: requests.filter((request: any) => request.status?.toLowerCase().trim() === 'in_process'),
            rejected: requests.filter((request: any) => request.status?.toLowerCase().trim() === 'rejected'),
        }
    }, [requests])

    useEffect(() => {
        getRequests()
    }, [])

    const handleActionsOnRequest = async (id: string | number, type: 'accept' | 'reject') => {
        setIsLoading(true)
        try {
            const data = await courierRequestAction({request_id: id, action: type});
            if (!data.data.error) {
                const actionText = type === 'accept' ? 'accepted' : 'declined';
                setSnackbar({open: true, message: `Request ${actionText} successfully!`, severity: 'success'});
                await getRequests();
            } else {
                setSnackbar({open: true, message: data.data.error || `Failed to ${type} request`, severity: 'error'});
            }
        } catch (error: any) {
            console.error('Request action error:', error);
            const errorMessage = error.response?.data?.detail || error.response?.data?.error || `Failed to ${type} request. Please try again.`;
            setSnackbar({open: true, message: errorMessage, severity: 'error'});
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

    const handleSnackbarClose = () => {
        setSnackbar({...snackbar, open: false});
    }

    return (
        <>{isLoading ?
            <Loading/>
            :
            !!requests.length ?
                <div className="flex flex-col gap-3 w-full">
                    <Tabs value={tabValue} onChange={handleChange} centered>
                        <Tab label="All" value={'all'} classes={{textColorPrimary: 'text-[#008080]'}} sx={{ fontSize: '1.4rem' }}/>
                        <Tab label="Completed" value={'completed'} classes={{textColorPrimary: 'text-[#008080]'}} sx={{ fontSize: '1.4rem' }}/>
                        <Tab label="Pending" value={'pending'} classes={{textColorPrimary: 'text-[#008080]'}} sx={{ fontSize: '1.4rem' }}/>
                        <Tab label="In progress" value={'in_process'} classes={{textColorPrimary: 'text-[#008080]'}} sx={{ fontSize: '1.4rem' }}/>
                        <Tab label="Rejected" value={'rejected'} classes={{textColorPrimary: 'text-[#008080]'}} sx={{ fontSize: '1.4rem' }}/>
                    </Tabs>
                    <div className="flex flex-col gap-[6rem] w-full">
                        <h3 className="text-[2rem] font-medium">
                            My requests
                        </h3>
                        {/*@ts-ignore*/}
                        {!requestsWithFilters[tabValue].length ?
                            <h1 className="text-center text-[2rem]">You don't have requests with
                                status <b>{tabValue.split('_').join(' ').toUpperCase()}</b></h1>
                            :
                        <div className="grid grid-cols-3 gap-[5.7rem] justify-items-center">
                            {// @ts-ignore
                                requestsWithFilters[tabValue].map(request => {
                                    const isDisabled = request.status?.toLowerCase().trim() === 'completed' || request.status?.toLowerCase().trim() === 'rejected';
                                    return (
                                        <OfferCard key={request.id}
                                                   withRate={false}
                                                   onPrimaryClick={!isDisabled ? () => handleConfirmAction(request.id, 'reject') : undefined}
                                                   primaryButtonText={request.status?.toLowerCase().trim() === 'rejected' ? 'Declined' : 'Decline'}
                                                   onSecondaryClick={!isDisabled ? () => handleConfirmAction(request.id, 'accept') : undefined}
                                                   secondaryButtonText={request.status?.toLowerCase().trim() === 'completed' ? 'Accepted' : 'Accept'}
                                                   data={request.offer}
                                        />
                                    );
                                })}
                        </div>
                        }
                        {/*<div className="flex justify-end gap-[4rem]">*/}
                        {/*    <Button title={'How it works'} type={'secondary'} handleClick={() => {*/}
                        {/*    }}/>*/}
                        {/*    <Button title={'Find offers'} type={'primary'} handleClick={() => {*/}
                        {/*    }}/>*/}
                        {/*</div>*/}
                    </div>
                </div>
                :
                <h1>No Requests found</h1>
        }
        <Snackbar 
            open={snackbar.open} 
            autoHideDuration={6000} 
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                {snackbar.message}
            </Alert>
        </Snackbar>
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