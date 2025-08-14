import {OfferCard} from "../../components/offerCard/OfferCard";
import {Button} from "../../components/button/Button";
import {getSentRequests} from "../../api/route";
import {SyntheticEvent, useEffect, useMemo, useState} from "react";
import {Tab, Tabs} from "@mui/material";
import {Loading} from "../../components/loading/Loading";
import { useNavigate } from "react-router-dom";
import {EmptyState} from "../../components/emptyState/EmptyState";
import {useNotification} from "../../components/notification/NotificationProvider";

export const SentRequests = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [tabValue, setTabValue] = useState('all');
    const navigate = useNavigate();
    const { showError } = useNotification();

    const handleChange = (event: SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };
    const [requests, setRequests] = useState([])

    const getRequests = async () => {
        setIsLoading(true)
        try {
            const data = await getSentRequests();
            setRequests(data.data.results);
        } catch (error) {
            console.error("Failed to fetch sent requests", error);
            showError('Failed to load sent requests. Please try again.');
            setRequests([]);
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

    return (
        <>
            {isLoading ? (
                <Loading/>
            ) : (
                <div className="flex flex-col gap-3 w-full">
                    {requests.length > 0 && (
                        <Tabs value={tabValue} onChange={handleChange} centered>
                            <Tab label="All" value={'all'} classes={{textColorPrimary: 'text-[#008080]'}}/>
                            <Tab label="Completed" value={'completed'} classes={{textColorPrimary: 'text-[#008080]'}}/>
                            <Tab label="Pending" value={'pending'} classes={{textColorPrimary: 'text-[#008080]'}}/>
                            <Tab label="In progress" value={'in_process'} classes={{textColorPrimary: 'text-[#008080]'}}/>
                            <Tab label="Rejected" value={'rejected'} classes={{textColorPrimary: 'text-[#008080]'}}/>
                        </Tabs>
                    )}
                    
                    <div className="flex flex-col gap-[6rem] w-full">
                        <h3 className="text-[2rem] font-medium">
                            Sent requests
                        </h3>
                        
                        {requests.length === 0 ? (
                            <EmptyState
                                illustration="no-requests"
                                title="You haven't sent any requests"
                                description="Find available couriers and send requests to ship your items safely."
                                primaryAction={{
                                    label: "Find couriers",
                                    onClick: () => navigate('/')
                                }}
                                secondaryAction={{
                                    label: "Post an item",
                                    onClick: () => navigate('/add-item')
                                }}
                            />
                        ) : (requestsWithFilters as any)[tabValue].length === 0 ? (
                            <EmptyState
                                illustration="no-results"
                                title={`No ${tabValue.replace('_', ' ')} requests`}
                                description={`You don't have any requests with ${tabValue.replace('_', ' ')} status.`}
                            />
                        ) : (
                            <>
                                <div className="grid grid-cols-3 gap-[5.7rem] justify-items-center">
                                    {/* @ts-ignore */}
                                    {(requestsWithFilters as any)[tabValue].map((request: any) => (
                                        <OfferCard key={request.id}
                                                   withRate={false}
                                                   data={request.offer}
                                        />
                                    ))}
                                </div>
                                <div className="flex justify-end gap-[4rem]">
                                    <Button title={'How it works'} type={'secondary'} handleClick={() => {
                                        navigate('/features');
                                    }}/>
                                    <Button title={'Browse items'} type={'primary'} handleClick={() => {
                                        navigate('/');
                                    }}/>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}